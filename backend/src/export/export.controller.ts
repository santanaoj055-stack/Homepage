import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';
import { User } from '../users/user.entity';
import { Contact } from '../contact/contact.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('export')
export class ExportController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async exportUsers(@Res() res: Response) {
    const users = await this.usersRepository.find();
    const csv = ['name,email,role,isActive,createdAt']
      .concat(users.map(u =>
        `"${u.name}","${u.email}","${u.role}",${u.isActive},${u.createdAt}`
      ))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contacts')
  async exportContacts(@Res() res: Response) {
    const contacts = await this.contactRepository.find({ order: { createdAt: 'DESC' } });
    const csv = ['name,email,message,isRead,createdAt']
      .concat(contacts.map(c =>
        `"${c.name}","${c.email}","${c.message.replace(/"/g, '""')}",${c.isRead},${c.createdAt}`
      ))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  }
}
