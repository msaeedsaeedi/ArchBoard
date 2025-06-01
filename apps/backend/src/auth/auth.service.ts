import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { Response } from 'express';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { Environment } from 'src/config/types';
import * as bcrypt from 'bcrypt';

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
    if (user == null || user.Password === null) return null;

    const isMatch = await bcrypt.compare(pass, user.Password);
    if (!isMatch) return null;

    const { Password, ...result } = user;
    return result;
  }

  async validateOAuthUser(
    email: string,
    OAuthId: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.OAuthId === OAuthId) {
      const { Password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, userId: string, response: Response) {
    const payload = { email: email, UserId: userId };
    response.cookie('access_token', this.jwtService.sign(payload), {
      httpOnly: true,
      secure: this.apiConfigService.ENVIRONMENT === Environment.Production,
    });
  }

  async signup(
    provider: string,
    email: string,
    fullName: string,
    photoUrl?: string,
    oAuthId?: string,
    password?: string,
  ): Promise<User> {
    return await this.usersService.create(
      provider,
      email,
      fullName,
      photoUrl,
      oAuthId,
      password,
    );
  }
}
