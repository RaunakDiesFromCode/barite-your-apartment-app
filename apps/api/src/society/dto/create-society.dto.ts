import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSocietyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  address?: string;
}
