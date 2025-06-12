import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { BoardService } from './board.service';
import { CreateBoardDto, CreateBoardResponseDto } from './dto/createBoard.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma, User } from 'generated/prisma';
import { GetBoardDto } from './dto/getBoard.dto';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { AddCollaboratorDto } from './dto/addCollaborator.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  async getBoards(@Req() request: Request): Promise<GetBoardDto[]> {
    const user = request.user as User;
    return await this.boardService.get(user.UserId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Req() request: Request,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<CreateBoardResponseDto> {
    const user = request.user as User;
    try {
      const slug = await this.boardService.create(createBoardDto, user.UserId);

      return plainToInstance(CreateBoardResponseDto, { slug });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === 'P2002') throw new ConflictException();
      throw error;
    }
  }

  @Delete(':id')
  async deleteBoard(@Req() request: Request, @Param('id') id: string) {
    const user = request.user as User;
    try {
      await this.boardService.delete(Number.parseInt(id), user.UserId);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025' || e.code === 'P2016') {
          throw new NotFoundException();
        }
      }
      throw e;
    }
  }

  @Patch(':id')
  async updateBoard(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const user = request.user as User;
    try {
      await this.boardService.update(Number.parseInt(id), user.UserId, {
        Name: updateBoardDto.title,
        Description: updateBoardDto.description,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025' || e.code === 'P2016') {
          throw new NotFoundException();
        }
      }
      throw e;
    }
  }

  @Post(':id/collaborators')
  async addCollaborators(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() addcollaboratorDto: AddCollaboratorDto,
  ) {
    const user = request.user as User;
    await this.boardService.addCollaborator(
      Number.parseInt(id),
      user.UserId,
      addcollaboratorDto,
    );
  }
}
