import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ApiConfigService } from 'src/config/apiConfig.service';
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
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const oAuthId = profile.id;
    const FullName = profile.displayName;

    const email = profile.emails?.[0]?.value ?? '';
    const photoUrl = profile.photos?.[0]?.value ?? '';

    const user = await this.authService.validateOAuthUser(email, oAuthId);
    if (!user) {
      const newUser = await this.authService.signup(
        'google',
        email,
        FullName,
        photoUrl,
        oAuthId,
      );
      return done(null, newUser);
    }

    done(null, user);
  }
}
