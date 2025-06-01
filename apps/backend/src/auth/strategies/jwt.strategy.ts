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

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'access_token' in req.cookies &&
      req.cookies.access_token.length > 0
    )
      return req.cookies.access_token;
    return null;
  }

  async validate(payload: AccessTokenPayload) {
    if (!(await this.authService.userExist(payload.Email)))
      throw new UnauthorizedException();
    return payload;
  }
}
