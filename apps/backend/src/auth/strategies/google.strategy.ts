import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { User } from 'generated/prisma';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private apiConfigService: ApiConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: apiConfigService.GOOGLE.CLIENT_ID,
      clientSecret: apiConfigService.GOOGLE.CLIENT_SECRET,
      callbackURL: apiConfigService.GOOGLE.CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id: oAuthId, displayName: FullName, emails, photos } = profile;

    const email = emails[0].value;
    const photoUrl = photos[0].value;

    const user = await this.authService.validateOAuthUser(email, oAuthId);
    if (!user) {
      return await this.authService.signup(
        'google',
        email,
        FullName,
        photoUrl,
        oAuthId,
      );
    }

    done(null, user);
  }
}
