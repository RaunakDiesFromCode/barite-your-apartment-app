import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocietyDto } from './dto/create-society.dto';

function generateJoinCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class SocietyService {
  constructor(private prisma: PrismaService) {}

  async createSociety(userId: string, dto: CreateSocietyDto) {
    return this.prisma.$transaction(async (tx) => {
      const society = await tx.society.create({
        data: {
          name: dto.name,
          address: dto.address,
          joinCode: generateJoinCode(),
        },
      });

      await tx.membership.create({
        data: {
          userId,
          societyId: society.id,
          role: 'ADMIN',
        },
      });

      return society;
    });
  }

  async getSocietiesForUser(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: {
        userId,
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
