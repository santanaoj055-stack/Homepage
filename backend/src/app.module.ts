import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { AiModule } from './ai/ai.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExportModule } from './export/export.module';
import { NotificationsModule } from './notifications/notifications.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig()),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    UsersModule,
    AuthModule,
    ContactModule,
    AiModule,
    DashboardModule,
    ExportModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
