import { Module } from '@nestjs/common';
import { SocietyService } from './society.service';
import { SocietyController } from './society.controller';
import { SocietyFlatController } from './society-flat.controller';
import { FlatService } from 'src/flat/flat.service';

@Module({
  controllers: [SocietyController, SocietyFlatController],
  providers: [SocietyService, FlatService],
})
export class SocietyModule {}
