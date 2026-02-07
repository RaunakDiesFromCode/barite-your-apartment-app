import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { MembershipRole } from '@prisma/client';

@Injectable()
export class NoticeService {
  constructor(private prisma: PrismaService) {}

  // DEV ONLY
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

  // Admin check helper
  private async ensureAdmin(userId: string, societyId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId,
          societyId,
        },
      },
    });

    if (!membership || membership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException('Admins only');
    }
  }

  // 1️⃣ Create notice (admin only)
  async createNotice(societyId: string, dto: CreateNoticeDto) {
    const user = await this.getDevUser();
    await this.ensureAdmin(user.id, societyId);

    return this.prisma.notice.create({
      data: {
        title: dto.title,
        content: dto.content,
        societyId,
      },
    });
  }

  // 2️⃣ List notices (all members)
  async listNotices(societyId: string) {
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

    return this.prisma.notice.findMany({
      where: { societyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3️⃣ Update notice (admin only)
  async updateNotice(
    noticeId: string,
    societyId: string,
    dto: UpdateNoticeDto,
  ) {
    const user = await this.getDevUser();
    await this.ensureAdmin(user.id, societyId);

    const notice = await this.prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!notice || notice.societyId !== societyId) {
      throw new NotFoundException('Notice not found');
    }

    return this.prisma.notice.update({
      where: { id: noticeId },
      data: dto,
    });
  }

  // 4️⃣ Delete notice (admin only)
  async deleteNotice(noticeId: string, societyId: string) {
    const user = await this.getDevUser();
    await this.ensureAdmin(user.id, societyId);

    const notice = await this.prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!notice || notice.societyId !== societyId) {
      throw new NotFoundException('Notice not found');
    }

    await this.prisma.notice.delete({
      where: { id: noticeId },
    });

    return { success: true };
  }
}
