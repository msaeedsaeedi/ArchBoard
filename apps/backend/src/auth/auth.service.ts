import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';

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

  async signIn(username: string, password: string): Promise<any> {
    // TODO: Update validation logic
    const authorized = this.users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!authorized) {
      throw new UnauthorizedException();
    }

    // TODO: Return Valid JWT Access Token 
    return {
      access_token: '123',
    };
  }
}
