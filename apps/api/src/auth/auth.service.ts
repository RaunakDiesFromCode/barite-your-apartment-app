import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async requestOtp(phone: string) {
    // DEV ONLY
    const otp = '123456';

    // store/update OTP
    await this.prisma.otp.upsert({
      where: { phone },
      update: {
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      create: {
        phone,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return { success: true };
  }

  async verifyOtp(phone: string, otp: string) {
    const record = await this.prisma.otp.findUnique({ where: { phone } });

    if (!record || record.code !== otp || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // create user if not exists
    const user = await this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });

    // issue JWT
    const token = this.jwt.sign({
      sub: user.id,
      phone: user.phone,
    });

    return { token };
  }
}
