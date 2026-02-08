import { IsString, Length } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Length(10, 10)
  phone!: string;
}
