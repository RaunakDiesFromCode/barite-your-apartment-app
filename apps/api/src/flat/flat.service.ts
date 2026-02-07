import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlatDto } from './dto/create-flat.dto';
import { MembershipRole } from '@prisma/client';
import { AssignFlatDto } from './dto/assign-flat.dto';

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

  async assignFlatToMember(
    societyId: string,
    flatId: string,
    dto: AssignFlatDto,
  ) {
    const user = await this.getDevUser();

    // requester must be ADMIN
    const adminMembership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId: user.id,
          societyId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException('Only admins can assign flats');
    }

    const flat = await this.prisma.flat.findUnique({
      where: { id: flatId },
      include: {
        building: true,
      },
    });

    if (!flat || flat.building.societyId !== societyId) {
      throw new ForbiddenException('Flat does not belong to this society');
    }

    // ✅ NEW: validate target membership
    const targetMembership = await this.prisma.membership.findUnique({
      where: { id: dto.membershipId },
    });

    if (!targetMembership || targetMembership.societyId !== societyId) {
      throw new ForbiddenException(
        'Membership does not belong to this society',
      );
    }

    return this.prisma.flatMembership.create({
      data: {
        flatId,
        membershipId: targetMembership.id,
      },
    });
  }

  async getMyFlats() {
    const user = await this.getDevUser();

    const memberships = await this.prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        flats: {
          include: {
            flat: {
              include: {
                building: {
                  include: {
                    society: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return memberships.flatMap((m) =>
      m.flats.map((fm) => ({
        role: m.role,
        flat: fm.flat,
        society: fm.flat.building.society,
      })),
    );
  }
}
