import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FlatService } from './flat.service';
import { CreateFlatDto } from './dto/create-flat.dto';

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
export class MyFlatsController {
  constructor(private readonly flatService: FlatService) {}

  @Get('flats')
  myFlats() {
    return this.flatService.getMyFlats();
  }
}
