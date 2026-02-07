import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Controller('societies/:societyId/notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  create(@Param('societyId') societyId: string, @Body() dto: CreateNoticeDto) {
    return this.noticeService.createNotice(societyId, dto);
  }

  @Get()
  list(@Param('societyId') societyId: string) {
    return this.noticeService.listNotices(societyId);
  }

  @Patch(':noticeId')
  update(
    @Param('societyId') societyId: string,
    @Param('noticeId') noticeId: string,
    @Body() dto: UpdateNoticeDto,
  ) {
    return this.noticeService.updateNotice(noticeId, societyId, dto);
  }

  @Delete(':noticeId')
  remove(
    @Param('societyId') societyId: string,
    @Param('noticeId') noticeId: string,
  ) {
    return this.noticeService.deleteNotice(noticeId, societyId);
  }
}
