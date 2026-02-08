import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { MembershipRole } from '@prisma/client';

@Injectable()
export class ComplaintService {
  constructor(private prisma: PrismaService) {}

  // 1️⃣ Create complaint (member only, flat-scoped)
  async createComplaint(
    userId: string,
    flatId: string,
    dto: CreateComplaintDto,
  ) {
    const flatMembership = await this.prisma.flatMembership.findFirst({
      where: {
        flatId,
        membership: {
          userId,
        },
      },
    });

    if (!flatMembership) {
      throw new ForbiddenException('You are not assigned to this flat');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.complaint.create({
      data: {
        title: dto.title,
        description: dto.description,
        flatId,
        membershipId: flatMembership.membershipId,
      },
    });
  }

  // 2️⃣ List my complaints (resident view)
  // eslint-disable-next-line @typescript-eslint/require-await
  async getMyComplaints(userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.complaint.findMany({
      where: {
        membership: {
          userId,
        },
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 3️⃣ List all complaints in a society (admin only)
  async getSocietyComplaints(userId: string, societyId: string) {
    const adminMembership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId,
          societyId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.complaint.findMany({
      where: {
        flat: {
          building: {
            societyId,
          },
        },
      },
      include: {
        membership: {
          include: {
            user: true,
          },
        },
        flat: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 4️⃣ Update complaint status (admin only)
  async updateStatus(
    userId: string,
    complaintId: string,
    dto: UpdateComplaintStatusDto,
  ) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        flat: {
          include: {
            building: true,
          },
        },
      },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const adminMembership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId,
          societyId: complaint.flat.building.societyId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: dto.status,
      },
    });
  }
}
