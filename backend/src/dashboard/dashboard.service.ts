import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Contact } from '../contact/contact.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private aiService: AiService,
  ) {}

  async getStats() {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { isActive: true } });
    const totalContacts = await this.contactRepository.count();
    const unreadContacts = await this.contactRepository.count({ where: { isRead: false } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :today', { today })
      .getCount();

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalContacts,
      unreadContacts,
      readContacts: totalContacts - unreadContacts,
      newUsersToday,
      uptime: '99.9%',
      activeProjects: 12,
      growth: '+12.5%',
      timestamp: new Date().toISOString(),
    };
  }

  async getAiInsights() {
    const stats = await this.getStats();
    const text = await this.aiService.getInsights(stats);
    return { text, stats };
  }
}
