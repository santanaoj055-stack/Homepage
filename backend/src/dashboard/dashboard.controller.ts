import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Req() req) {
    return this.dashboardService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('insights')
  async getInsights(@Req() req) {
    return this.dashboardService.getAiInsights();
  }
}
