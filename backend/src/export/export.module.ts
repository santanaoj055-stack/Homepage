import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Contact } from '../contact/contact.entity';
import { ExportController } from './export.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contact])],
  controllers: [ExportController],
})
export class ExportModule {}
