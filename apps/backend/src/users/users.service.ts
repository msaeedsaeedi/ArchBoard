import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { hashPassword } from 'src/auth/utils/hash-password';
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

  async create(
    provider: string,
    email: string,
    fullName: string,
    photoUrl?: string,
    oAuthId?: string,
    password?: string,
  ): Promise<User> {
    if (password) password = await hashPassword(password);

    return this.db.user.create({
      data: {
        Provider: provider,
        Email: email,
        FullName: fullName,
        PictureUrl: photoUrl,
        OAuthId: oAuthId,
        Password: password,
      },
    });
  }
}
