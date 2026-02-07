import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';

@Injectable()
export class BuildingService {
  constructor(private prisma: PrismaService) {}

  // DEV ONLY: mocked user
  private async getDevUser() {
    return this.prisma.user.upsert({
      where: { phone: '9999999999' },
      update: {},
      create: {
        phone: '9999999999',
        name: 'Dev Admin',
      },
    });
  }

  async createBuilding(societyId: string, dto: CreateBuildingDto) {
    const user = await this.getDevUser();

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId: user.id,
          societyId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this society');
    }

    return this.prisma.building.create({
      data: {
        name: dto.name,
        societyId,
      },
    });
  }

  async listBuildings(societyId: string) {
    const user = await this.getDevUser();

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId: user.id,
          societyId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this society');
    }

    return this.prisma.building.findMany({
      where: { societyId },
    });
  }
}
