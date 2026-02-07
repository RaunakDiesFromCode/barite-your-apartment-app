import { Module } from '@nestjs/common';
import { FlatService } from './flat.service';
import { FlatController, MyFlatsController } from './flat.controller';

@Module({
  controllers: [FlatController, MyFlatsController],
  providers: [FlatService],
})
export class FlatModule {}
