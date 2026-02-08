import { IsEnum, IsString } from 'class-validator';
import { MembershipRole } from '@prisma/client';

export class JoinSocietyDto {
  @IsString()
  joinCode!: string;

  @IsEnum(MembershipRole)
  role!: MembershipRole;
}
