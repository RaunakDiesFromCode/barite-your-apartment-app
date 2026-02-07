import { Body, Controller, Get, Post } from '@nestjs/common';
import { SocietyService } from './society.service';
import { CreateSocietyDto } from './dto/create-society.dto';

@Controller('societies')
export class SocietyController {
  constructor(private readonly societyService: SocietyService) {}

  @Post()
  async create(@Body() dto: CreateSocietyDto) {
    return this.societyService.createSociety(dto);
  }

  @Get()
  async list() {
    return this.societyService.getSocietiesForUser();
  }
}
