import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocietyModule } from './society/society.module';
import { BuildingModule } from './building/building.module';
import { FlatModule } from './flat/flat.module';
import { ComplaintModule } from './complaint/complaint.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SocietyModule,
    BuildingModule,
    FlatModule,
    ComplaintModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
