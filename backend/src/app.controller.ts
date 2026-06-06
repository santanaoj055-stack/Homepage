import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'Homepage API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        auth: {
          register: { method: 'POST', path: '/auth/register', auth: false },
          login: { method: 'POST', path: '/auth/login', auth: false },
          forgotPassword: { method: 'POST', path: '/auth/forgot-password', auth: false },
          resetPassword: { method: 'POST', path: '/auth/reset-password', auth: false },
          profile: { method: 'GET', path: '/auth/profile', auth: true },
          updateProfile: { method: 'PATCH', path: '/auth/profile', auth: true },
        },
        users: {
          list: { method: 'GET', path: '/users', auth: true },
          create: { method: 'POST', path: '/users', auth: false },
          get: { method: 'GET', path: '/users/:id', auth: true },
          update: { method: 'PATCH', path: '/users/:id', auth: true },
          delete: { method: 'DELETE', path: '/users/:id', auth: true },
        },
        contact: {
          create: { method: 'POST', path: '/contact', auth: false },
          list: { method: 'GET', path: '/contact', auth: true },
          markRead: { method: 'PATCH', path: '/contact/:id/read', auth: true },
        },
        ai: {
          chat: { method: 'POST', path: '/ai/chat', auth: false },
          generate: { method: 'POST', path: '/ai/generate', auth: true },
          agent: { method: 'POST', path: '/ai/agent', auth: true },
          insights: { method: 'GET', path: '/ai/insights', auth: true },
        },
        dashboard: {
          stats: { method: 'GET', path: '/dashboard/stats', auth: true },
          insights: { method: 'GET', path: '/dashboard/insights', auth: true },
        },
        export: {
          users: { method: 'GET', path: '/export/users', auth: true },
          contacts: { method: 'GET', path: '/export/contacts', auth: true },
        },
        notifications: {
          list: { method: 'GET', path: '/notifications', auth: true },
          unreadCount: { method: 'GET', path: '/notifications/unread/count', auth: true },
          markRead: { method: 'PATCH', path: '/notifications/:id/read', auth: true },
          markAllRead: { method: 'PATCH', path: '/notifications/read-all', auth: true },
          delete: { method: 'DELETE', path: '/notifications/:id', auth: true },
        },
      },
    };
  }
}
