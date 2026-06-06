import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Req() req, @Body() body: { message: string }) {
    return this.notificationsService.createForUser(req.user.id, body.message);
  }

  @Get()
  findAll(@Req() req) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get('unread/count')
  countUnread(@Req() req) {
    return this.notificationsService.countUnread(req.user.id).then(c => ({ count: c }));
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.notificationsService.delete(id, req.user.id);
  }
}
