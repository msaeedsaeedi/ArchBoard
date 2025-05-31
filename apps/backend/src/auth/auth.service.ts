import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { Response } from 'express';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { Environment } from 'src/config/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private apiConfigService: ApiConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.Password === pass) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, userId: string, response: Response) {
    const payload = { email: email, UserId: userId };
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      secure:
        this.apiConfigService.ENVIRONMENT === Environment.Production
          ? true
          : false,
    });
  }

  async googleLogin(user: User, response: Response) {
    await this.login(user.Email, user.UserId.toString(), response);
    response.redirect(this.apiConfigService.AUTH_CALLBACK);
  }
}
