import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class ChatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;
}

export class AgentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;
}

export class GenerateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  prompt: string;

  @IsOptional()
  @IsString()
  type?: 'report' | 'description' | 'insight';
}
