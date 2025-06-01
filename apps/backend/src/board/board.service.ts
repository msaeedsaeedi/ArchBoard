import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoard.dto';
import { PrismaService } from 'src/prisma.service';
import slugify from 'slugify';

@Injectable()
export class BoardService {
  constructor(private db: PrismaService) {}

  async create(payload: CreateBoardDto, userId: number): Promise<string> {
    const slug = slugify(payload.title);
    await this.db.board.create({
      data: {
        Name: payload.title,
        Slug: slug,
        Description: payload.description,
        Owner: {
          connect: {
            UserId: userId,
          },
        },
      },
    });
    return slug;
  }
}
