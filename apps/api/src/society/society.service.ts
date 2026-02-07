import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipRole } from '@prisma/client';
import { CreateSocietyDto } from './dto/create-society.dto';

@Injectable()
export class SocietyService {
  constructor(private prisma: PrismaService) {}

  // DEV ONLY: temporary user creation until auth is wired
  async createSociety(dto: CreateSocietyDto) {
    const user = await this.prisma.user.upsert({
      where: { phone: '9999999999' },
      update: {},
      create: {
        phone: '9999999999',
        name: 'Dev Admin',
      },
    });

    return this.prisma.$transaction(async (tx) => {
      const society = await tx.society.create({
        data: {
          name: dto.name,
          address: dto.address,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          societyId: society.id,
          role: MembershipRole.ADMIN,
        },
      });

      return society;
    });
  }

  async getSocietiesForUser() {
    // DEV ONLY: same mocked user logic
    const user = await this.prisma.user.upsert({
      where: { phone: '9999999999' },
      update: {},
      create: {
        phone: '9999999999',
        name: 'Dev Admin',
      },
    });

    const memberships = await this.prisma.membership.findMany({
      where: {
        userId: user.id,
      },
      include: {
        society: true,
      },
    });

    return memberships.map((m) => ({
      role: m.role,
      society: m.society,
    }));
  }
}
