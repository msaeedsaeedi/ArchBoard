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
  Post,
  Req,
  Response,
} from '@nestjs/common';
import { Response as EResponse } from 'express';
import { BoardService } from './board.service';
import { CreateBoardDto, CreateBoardResponseDto } from './dto/createBoard.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'generated/prisma';
import { GetBoardDto } from './dto/getBoard.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  async getBoards(@Req() request): Promise<GetBoardDto[]> {
    return await this.boardService.get(request.user.UserId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBoard(
    @Req() request,
    @Body() createBoardDto: CreateBoardDto,
    @Response({ passthrough: true }) response: EResponse,
  ): Promise<CreateBoardResponseDto> {
    try {
      const slug = await this.boardService.create(
        createBoardDto,
        Number.parseInt(request.user.UserId),
      );

      return plainToInstance(CreateBoardResponseDto, { slug });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        if (error.code === 'P2002') throw new ConflictException();
      throw error;
    }
  }

  @Delete(':id')
  async deleteBoard(@Param('id') id: number) {
    try {
      await this.boardService.delete(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025' || e.code === 'P2016') {
          return new NotFoundException();
        }
      }
    }
  }
}
