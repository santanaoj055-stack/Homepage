import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    await this.notificationsService.create({
      userId: user.id,
      type: 'success',
      message: 'Welcome to Homepage! Your account has been created.',
    });
    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'If that email exists, a reset link has been sent.' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.update(user.id, { resetToken, resetTokenExpires } as any);

    console.log(`\n🔐 Password reset token for ${email}: ${resetToken}\n`);

    return { message: 'If that email exists, a reset link has been sent.', resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.usersService.update(user.id, {
      password: newPassword,
      resetToken: null,
      resetTokenExpires: null,
    } as any);

    await this.notificationsService.create({
      userId: user.id,
      type: 'info',
      message: 'Your password has been changed successfully.',
    });

    return { message: 'Password reset successfully.' };
  }

  async updateProfile(id: string, dto: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) {
    if (dto.currentPassword && dto.newPassword) {
      const user = await this.usersService.findOne(id);
      const current = await this.usersService.findByEmailWithPassword(user.email);
      if (!current) throw new UnauthorizedException('User not found');
      const isMatch = await bcrypt.compare(dto.currentPassword, current.password);
      if (!isMatch) throw new UnauthorizedException('Current password is incorrect');
      await this.usersService.update(id, { password: dto.newPassword } as any);
      await this.notificationsService.create({
        userId: id, type: 'info', message: 'Your password was changed.',
      });
    }

    if (dto.name || dto.email) {
      await this.usersService.update(id, { name: dto.name, email: dto.email } as any);
    }

    return this.usersService.findOne(id);
  }

  private generateToken(user: { id: string; email: string; name: string; role?: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role || 'user' };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role || 'user' },
    };
  }
}
