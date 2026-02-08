import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SocietyService } from './society.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('societies')
@UseGuards(JwtAuthGuard) // 🔒 all society routes need auth
export class SocietyController {
  constructor(private readonly societyService: SocietyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() dto: CreateSocietyDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.societyService.createSociety(req.user.id, dto);
  }

  @Get()
  async list(@Req() req: Request & { user: { id: string } }) {
    return this.societyService.getSocietiesForUser(req.user.id);
  }
}
