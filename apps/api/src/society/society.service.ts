import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocietyDto } from './dto/create-society.dto';
import { JoinSocietyDto } from './dto/join-society.dto';
import { MembershipRole } from '@prisma/client';

@Injectable()
export class SocietyService {
  constructor(private prisma: PrismaService) {}

  private generateJoinCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createSociety(userId: string, dto: CreateSocietyDto) {
    return this.prisma.$transaction(async (tx) => {
      const society = await tx.society.create({
        data: {
          name: dto.name,
          address: dto.address,
          joinCode: this.generateJoinCode(),
        },
      });

      await tx.membership.create({
        data: {
          userId,
          societyId: society.id,
          role: MembershipRole.ADMIN,
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

  async joinSociety(userId: string, dto: JoinSocietyDto) {
    // 1. Find society by join code
    const society = await this.prisma.society.findUnique({
      where: { joinCode: dto.joinCode },
    });

    if (!society) {
      throw new NotFoundException('Invalid society code');
    }

    // 2. Prevent joining as ADMIN
    if (dto.role === MembershipRole.ADMIN) {
      throw new ForbiddenException('Cannot join as admin');
    }

    // 3. Create membership
    try {
      const membership = await this.prisma.membership.create({
        data: {
          userId,
          societyId: society.id,
          role: dto.role,
        },
      });

      return {
        id: membership.id,
        role: membership.role,
        society,
      };
    } catch {
      throw new ForbiddenException('Already a member of this society');
    }
  }
}
