import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { Environment } from 'src/config/types';

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: '123',
  },
  {
    id: 2,
    username: 'maria',
    password: 'guess',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private apiConfigService: ApiConfigService,
  ) {}

  async signIn(
    username: string,
    password: string,
    res: Response,
  ): Promise<any> {
    // TODO: Update validation logic
    const authorized = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!authorized) {
      throw new UnauthorizedException();
    }

    const payload = { sub: username };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.apiConfigService.JWT_EXPIRESIN,
      secret: this.apiConfigService.JWT_SECRET,
    });
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure:
        this.apiConfigService.ENVIRONMENT === Environment.Production
          ? true
          : false,
    });
  }
}
