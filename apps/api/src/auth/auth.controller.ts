import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  // 1️⃣ Request OTP
  @Post('request-otp')
  requestOtp(@Body() body: { phone: string }) {
    return this.authService.requestOtp(body.phone);
  }

  // 2️⃣ Verify OTP
  @Post('verify-otp')
  verifyOtp(@Body() body: { phone: string; code: string }) {
    return this.authService.verifyOtp(body.phone, body.code);
  }

  // 3️⃣ Get current user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request & { user: { id: string } }) {
    return this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        memberships: {
          include: {
            society: true,
            flats: {
              include: {
                flat: true,
              },
            },
          },
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile')
  async updateProfile(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: dto.name,
        onboardingComplete: true,
      },
    });
  }
}
