import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlatDto {
  @IsString()
  @IsNotEmpty()
  number!: string; // e.g. "A-101", "1203"
}
