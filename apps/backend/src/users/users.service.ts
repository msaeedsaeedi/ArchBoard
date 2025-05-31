import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: {
        Email: email,
      },
    });
  }
}
