import { Module } from '@nestjs/common';
import { FlatService } from './flat.service';
import { FlatController } from './flat.controller';

@Module({
  controllers: [FlatController],
  providers: [FlatService],
})
export class FlatModule {}
