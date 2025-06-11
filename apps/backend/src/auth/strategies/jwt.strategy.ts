import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from '../types/accessTokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private apiConfigService: ApiConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.JWT_SECRET,
    });
  }

  private static extractJWT(this: void, req: Request): string | null {
    const cookies = req.cookies as Record<string, string> | undefined;

    const token = cookies?.access_token;
    return token && token.length > 0 ? token : null;
  }

  async validate(payload: AccessTokenPayload) {
    if (!(await this.authService.userExist(payload.Email)))
      throw new UnauthorizedException();
    return payload;
  }
}
