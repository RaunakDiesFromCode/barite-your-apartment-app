import { FlatService } from './flat.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('buildings/:buildingId/flats')
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  create(@Param('buildingId') buildingId: string, @Body() dto: CreateFlatDto) {
    return this.flatService.createFlat(buildingId, dto);
  }

  @Get()
  list(@Param('buildingId') buildingId: string) {
    return this.flatService.listFlats(buildingId);
  }
}

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MyFlatsController {
  constructor(private readonly flatService: FlatService) {}

  @Get('flats')
  myFlats(@Req() req: Request & { user: { id: string } }) {
    console.log('GUARDED /me/flats HIT');
    return this.flatService.getMyFlats(req.user.id);
  }
}
