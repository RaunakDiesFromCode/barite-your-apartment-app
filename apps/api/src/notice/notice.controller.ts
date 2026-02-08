import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('societies/:societyId/notices')
@UseGuards(JwtAuthGuard)
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 1️⃣ Create notice (admin only)
  @Post()
  create(
    @Req() req: Request & { user: { id: string } },
    @Param('societyId') societyId: string,
    @Body() dto: CreateNoticeDto,
  ) {
    return this.noticeService.createNotice(req.user.id, societyId, dto);
  }

  // 2️⃣ List notices (all members)
  @Get()
  list(
    @Req() req: Request & { user: { id: string } },
    @Param('societyId') societyId: string,
  ) {
    return this.noticeService.listNotices(req.user.id, societyId);
  }

  // 3️⃣ Update notice (admin only)
  @Patch(':noticeId')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('societyId') societyId: string,
    @Param('noticeId') noticeId: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    return this.noticeService.updateNotice(
      req.user.id,
      noticeId,
      societyId,
      dto,
    );
  }

  // 4️⃣ Delete notice (admin only)
  @Delete(':noticeId')
  remove(
    @Req() req: Request & { user: { id: string } },
    @Param('societyId') societyId: string,
    @Param('noticeId') noticeId: string,
  ) {
    return this.noticeService.deleteNotice(req.user.id, noticeId, societyId);
  }
}
