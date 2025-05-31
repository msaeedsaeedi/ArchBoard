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

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { username: user.username, sub: user.userId };
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      secure:
        this.apiConfigService.ENVIRONMENT === Environment.Production
          ? true
          : false,
    });
  }
}
