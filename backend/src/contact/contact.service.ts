import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(dto);
    return this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async markAsRead(id: string): Promise<Contact> {
    await this.contactRepository.update(id, { isRead: true });
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }
}
