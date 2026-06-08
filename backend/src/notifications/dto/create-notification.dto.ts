import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message: string;
}
