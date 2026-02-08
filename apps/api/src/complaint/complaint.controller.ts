import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller()
@UseGuards(JwtAuthGuard)
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  // 1️⃣ Create complaint (resident)
  @Post('flats/:flatId/complaints')
  create(
    @Req() req: Request & { user: { id: string } },
    @Param('flatId') flatId: string,
    @Body() dto: CreateComplaintDto,
  ) {
    return this.complaintService.createComplaint(req.user.id, flatId, dto);
  }

  // 2️⃣ My complaints (resident)
  @Get('me/complaints')
  myComplaints(@Req() req: Request & { user: { id: string } }) {
    return this.complaintService.getMyComplaints(req.user.id);
  }

  // 3️⃣ Society complaints (admin)
  @Get('societies/:societyId/complaints')
  societyComplaints(
    @Req() req: Request & { user: { id: string } },
    @Param('societyId') societyId: string,
  ) {
    return this.complaintService.getSocietyComplaints(req.user.id, societyId);
  }

  // 4️⃣ Update status (admin)
  @Patch('complaints/:id/status')
  updateStatus(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
  ) {
    return this.complaintService.updateStatus(req.user.id, id, dto);
  }
}
