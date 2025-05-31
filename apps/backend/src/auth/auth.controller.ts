import {
  Controller,
  Request,
  Post,
  UseGuards,
  Response,
  HttpStatus,
  HttpCode,
  Body,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Response as EResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req,
    @Response({ passthrough: true }) response: EResponse,
  ) {
    return this.authService.login(req.user, response);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  Verify() {
    // Placeholder route for verification
    // Cookie Verification is Handled by Auth Guard
  }
}
