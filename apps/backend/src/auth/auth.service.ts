import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly users: User[] = [
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

  async signIn(
    username: string,
    password: string,
    res: Response,
  ): Promise<any> {
    // TODO: Update validation logic
    const authorized = this.users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!authorized) {
      throw new UnauthorizedException();
    }

    // TODO: Return Valid JWT Access Token
    // TODO: Make it secure on PROD
    const access_token = '123';
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
    });
  }

  async verify(res: Response) {
    res.status(200);
  }
}
