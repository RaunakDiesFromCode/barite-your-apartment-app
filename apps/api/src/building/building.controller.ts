import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';

@Controller('societies/:societyId/buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post()
  create(
    @Param('societyId') societyId: string,
    @Body() dto: CreateBuildingDto,
  ) {
    return this.buildingService.createBuilding(societyId, dto);
  }

  @Get()
  list(@Param('societyId') societyId: string) {
    return this.buildingService.listBuildings(societyId);
  }
}
