import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(dto: { userId: string; type: Notification['type']; message: string }) {
    const notification = this.notificationsRepository.create({
      user: { id: dto.userId } as any,
      type: dto.type,
      message: dto.message,
    });
    return this.notificationsRepository.save(notification);
  }

  async createForUser(userId: string, message: string) {
    return this.create({ userId, type: 'info', message });
  }

  async findByUser(userId: string) {
    return this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    await this.notificationsRepository.update(
      { id, user: { id: userId } },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true },
    );
  }

  async countUnread(userId: string) {
    return this.notificationsRepository.count({
      where: { user: { id: userId }, isRead: false },
    });
  }

  async delete(id: string, userId: string) {
    await this.notificationsRepository.delete({ id, user: { id: userId } });
  }
}
