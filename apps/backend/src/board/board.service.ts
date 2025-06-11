import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoard.dto';
import { PrismaService } from 'src/prisma.service';
import slugify from 'slugify';
import { Board, Prisma } from 'generated/prisma';
import { GetBoardDto } from './dto/getBoard.dto';
import { AddCollaboratorDto } from './dto/addCollaborator.dto';

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

  async update(
    id: number,
    UserId: number,
    payload: Pick<Board, 'Name' | 'Description'>,
  ) {
    await this.db.board.update({
      where: {
        Id: id,
        OwnerId: UserId,
      },
      data: {
        Name: payload.Name,
        Description: payload.Description,
      },
    });
  }

  async delete(id: number, UserId: number): Promise<void> {
    await this.db.board.delete({
      where: {
        Id: id,
        OwnerId: UserId,
      },
    });
  }

  async get(
    userId: number,
    // TODO: Use collaborated boolean
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async addCollaborator(boardId: number, dto: AddCollaboratorDto) {
    let collaboratorId: number | undefined = undefined;

    // Find Collaborator UserId
    try {
      collaboratorId = (
        await this.db.user.findFirstOrThrow({
          where: {
            Email: dto.email,
          },
        })
      ).UserId;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new NotFoundException();
      }
      throw e;
    }

    // Update Board with collaborator
    try {
      await this.db.board.update({
        where: {
          Id: boardId,
        },
        data: {
          BoardCollaborators: {
            create: {
              UserId: collaboratorId,
              Role: dto.role,
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new UnauthorizedException();
        if (e.code === 'P2002') throw new ConflictException();
      }
      throw e;
    }
  }
}
