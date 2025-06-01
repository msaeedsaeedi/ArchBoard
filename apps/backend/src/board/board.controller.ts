import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Response,
} from '@nestjs/common';
import { Response as EResponse } from 'express';
import { BoardService } from './board.service';
import { CreateBoardDto, CreateBoardResponseDto } from './dto/createBoard.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'generated/prisma';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

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
        if (error.code === 'P2002') response.status(HttpStatus.CONFLICT);
      throw error;
    }
  }
}
