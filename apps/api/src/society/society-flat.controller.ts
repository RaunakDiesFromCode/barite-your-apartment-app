import { Body, Controller, Param, Post } from '@nestjs/common';
import { FlatService } from '../flat/flat.service';
import { AssignFlatDto } from '../flat/dto/assign-flat.dto';

@Controller('societies/:societyId/flats')
export class SocietyFlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post(':flatId/assign')
  assignFlat(
    @Param('societyId') societyId: string,
    @Param('flatId') flatId: string,
    @Body() dto: AssignFlatDto,
  ) {
    return this.flatService.assignFlatToMember(societyId, flatId, dto);
  }
}
