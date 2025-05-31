import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private apiConfigService: ApiConfigService) {
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
    const { id, displayName, emails, photos } = profile;

    const user: User = {
      provider: 'google',
      userId: id,
      email: emails[0].value,
      FullName: displayName,
      picture_url: photos[0].value,
    };

    done(null, user);
  }
}
