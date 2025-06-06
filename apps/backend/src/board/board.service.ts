import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoard.dto';
import { PrismaService } from 'src/prisma.service';
import slugify from 'slugify';
import { Board } from 'generated/prisma';
import { GetBoardDto } from './dto/getBoard.dto';

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

  async get(
    userId: number,
    collaborated: boolean = false,
  ): Promise<GetBoardDto[]> {
    const result = await this.db.board.findMany({
      where: {
        OR: [
          { OwnerId: userId },
          {
            BoardCollaborators: {
              some: {
                UserId: userId,
              },
            },
          },
        ],
      },
      include: {
        Owner: true,
        BoardCollaborators: {
          include: {
            Collaborator: true,
          },
        },
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    return result.flatMap((board) => {
      const isOwner = board.OwnerId === userId;
      const isCollaborator = board.BoardCollaborators.some(
        (c) => c.UserId === userId,
      );

      return {
        id: board.Id,
        title: board.Name,
        description: board.Description || undefined,
        slug: board.Slug,
        collaborated: !isOwner && isCollaborator,
      };
    });
  }
}
