import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto, AgentDto, GenerateDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() dto: ChatDto) {
    const text = await this.aiService.chat(dto.message);
    return { text };
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body() dto: GenerateDto, @Req() req) {
    const text = await this.aiService.generate(dto.prompt, dto.type);
    return { text };
  }

  @UseGuards(JwtAuthGuard)
  @Post('agent')
  async agent(@Body() dto: AgentDto, @Req() req) {
    const user = req.user;
    const result = await this.aiService.agent(dto.message, {
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    });
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('insights')
  async insights(@Req() req) {
    return { text: 'Configura las estadísticas en el backend' };
  }
}
