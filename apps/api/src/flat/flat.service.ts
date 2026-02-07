import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlatDto } from './dto/create-flat.dto';

@Injectable()
export class FlatService {
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

  async createFlat(buildingId: string, dto: CreateFlatDto) {
    const user = await this.getDevUser();

    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
      include: { society: true },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId: user.id,
          societyId: building.societyId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this society');
    }

    return this.prisma.flat.create({
      data: {
        number: dto.number,
        buildingId,
      },
    });
  }

  async listFlats(buildingId: string) {
    const user = await this.getDevUser();

    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId: user.id,
          societyId: building.societyId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this society');
    }

    return this.prisma.flat.findMany({
      where: { buildingId },
    });
  }
}
