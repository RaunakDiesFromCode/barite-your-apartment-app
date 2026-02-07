import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';

@Controller()
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post('flats/:flatId/complaints')
  create(@Param('flatId') flatId: string, @Body() dto: CreateComplaintDto) {
    return this.complaintService.createComplaint(flatId, dto);
  }

  @Get('me/complaints')
  myComplaints() {
    return this.complaintService.getMyComplaints();
  }

  @Get('societies/:societyId/complaints')
  societyComplaints(@Param('societyId') societyId: string) {
    return this.complaintService.getSocietyComplaints(societyId);
  }

  @Patch('complaints/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateComplaintStatusDto) {
    return this.complaintService.updateStatus(id, dto);
  }
}
