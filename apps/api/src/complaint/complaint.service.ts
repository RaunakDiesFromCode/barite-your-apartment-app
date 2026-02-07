import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { ComplaintStatus, MembershipRole } from '@prisma/client';

@Injectable()
export class ComplaintService {
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

  // 1️⃣ Create complaint (member only, flat-scoped)
  async createComplaint(flatId: string, dto: CreateComplaintDto) {
    const user = await this.getDevUser();

    const flatMembership = await this.prisma.flatMembership.findFirst({
      where: {
        flatId,
        membership: {
          userId: user.id,
        },
      },
      include: {
        membership: true,
      },
    });

    if (!flatMembership) {
      throw new ForbiddenException('You are not assigned to this flat');
    }

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
  async getMyComplaints() {
    const user = await this.getDevUser();

    return this.prisma.complaint.findMany({
      where: {
        membership: {
          userId: user.id,
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
  async getSocietyComplaints(societyId: string) {
    const user = await this.getDevUser();

    const adminMembership = await this.prisma.membership.findUnique({
      where: {
        userId_societyId: {
          userId: user.id,
          societyId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== MembershipRole.ADMIN) {
      throw new ForbiddenException('Admins only');
    }

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
  async updateStatus(complaintId: string, dto: UpdateComplaintStatusDto) {
    const user = await this.getDevUser();

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
          userId: user.id,
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
