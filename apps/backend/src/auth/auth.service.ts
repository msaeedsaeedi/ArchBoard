import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
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

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, userId: string, response: Response) {
    const payload = { email: email, UserId: userId };
    console.log("Signing JWT For: ",payload);
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      secure:
        this.apiConfigService.ENVIRONMENT === Environment.Production
          ? true
          : false,
    });
  }

  async googleLogin(user: User, response: Response) {
    await this.login(user.email, user.userId, response);
    response.redirect(this.apiConfigService.AUTH_CALLBACK);
  }
}
