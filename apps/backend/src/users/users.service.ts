import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      userId: '1',
      provider: 'local',
      email: 'john@gmail.com',
      FullName: 'John Abhram',
      password: 'changeme',
    },
    {
      userId: '2',
      provider: 'local',
      email: 'maria@gmail.com',
      FullName: 'Maria Gold',
      password: 'guess',
    },
  ];

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
