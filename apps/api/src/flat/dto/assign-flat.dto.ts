import { IsEnum, IsString } from 'class-validator';
import { MembershipRole } from '@prisma/client';

export class AssignFlatDto {
  @IsString()
  membershipId!: string;

  @IsEnum(MembershipRole)
  role!: MembershipRole; // OWNER / TENANT
}
