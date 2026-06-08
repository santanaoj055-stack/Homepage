import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class AiService implements OnModuleInit {
  private model: GenerativeModel;
  private agentModel: GenerativeModel;
  private genAI: GoogleGenerativeAI;

  onModuleInit() {
    const apiKey = process.env.GEMINI_API_KEY || 'demo-key';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.agentModel = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async chat(message: string, history: { role: string; text: string }[] = []): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return this.demoChatResponse(message);
    }

    try {
      const chat = this.model.startChat({
        history: history.map(h => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        })),
        systemInstruction: {
          role: 'system',
          parts: [{
            text: `Eres Nova, un asistente de soporte para "Homepage", una plataforma enterprise.
Homepage ofrece: Cloud Infrastructure, Data Analytics, Enterprise Security, Team Collaboration.
Planes: Starter ($49/mes, 5 users), Professional ($149/mes, 25 users), Enterprise (custom).
Sé útil, profesional y responde en español.`,
          }],
        },
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      if (err.message?.includes('429')) {
        return this.demoChatResponse(message);
      }
      return `⚠️ Error al conectar con IA: ${err.message}`;
    }
  }

  async generate(prompt: string, type?: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return this.demoGenerateResponse(prompt, type);
    }

    const typeHint = type ? `Genera un ${type} sobre: ` : '';
    try {
      const result = await this.model.generateContent(`${typeHint}${prompt}`);
      return result.response.text();
    } catch (err) {
      if (err.message?.includes('429')) {
        return this.demoGenerateResponse(prompt, type);
      }
      return `⚠️ Error: ${err.message}`;
    }
  }

  async agent(message: string, userContext: { name: string; email: string; role: string }): Promise<{ text: string; action?: string }> {
    const role = userContext.role;
    if (!process.env.GEMINI_API_KEY) {
      return this.demoAgentResponse(message, role);
    }

    const prompt = `Contexto del usuario: ${JSON.stringify(userContext)}

Tú eres Nova, un agente que puede realizar acciones en nombre del usuario.
Basado en el mensaje del usuario, decide si necesitas ejecutar una acción.
Respondes en español.

Reglas:
- Si el usuario pide crear/eliminar/actualizar usuarios, responde con una acción.
- Si el usuario pide enviar un mensaje de contacto, responde con una acción.
- Si el usuario hace una pregunta general, responde sin acción.

Formato de respuesta (JSON):
{ "text": "tu respuesta", "action": null | { "type": "create_user" | "delete_user" | "update_user" | "contact_message", "params": { ... } } }

Mensaje: ${message}`;

    try {
      const result = await this.agentModel.generateContent(prompt);
      const text = result.response.text();
      try {
        const parsed = JSON.parse(text);
        return { text: parsed.text, action: parsed.action || undefined };
      } catch {
        return { text };
      }
    } catch (err) {
      if (err.message?.includes('429')) {
        return this.demoAgentResponse(message, role);
      }
      return { text: `⚠️ Error: ${err.message}` };
    }
  }

  async getInsights(stats: Record<string, any>): Promise<string> {
    const prompt = `Eres un analista de negocios. Basado en estas estadísticas del sistema, genera 3 insights accionables y recomendaciones. Responde en español.

Estadísticas: ${JSON.stringify(stats)}`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch {
      return this.demoInsightsResponse(stats);
    }
  }

  private demoChatResponse(message: string): string {
    const q = message.toLowerCase();
    if (q.includes('precio') || q.includes('costo') || q.includes('plan') || q.includes('pricing')) {
      return 'Tenemos 3 planes:\n- Starter: $49/mes (5 usuarios, 10GB)\n- Professional: $149/mes (25 usuarios, 100GB)\n- Enterprise: Precio personalizado (usuarios y almacenamiento ilimitados)\n\n¿Te gustaría más detalles de algún plan?';
    }
    if (q.includes('hola') || q.includes('buenos días') || q.includes('buenas')) {
      return '¡Hola! 👋 Soy Nova, el asistente virtual de Homepage. Puedo ayudarte con:\n- Información sobre planes y precios\n- Características de la plataforma\n- Cómo funciona Homepage\n- Soporte técnico general\n\n¿En qué puedo ayudarte hoy?';
    }
    if (q.includes('seguridad') || q.includes('security') || q.includes('protecci')) {
      return 'Homepage cuenta con:\n- Certificación SOC 2 Tipo II\n- Cumplimiento GDPR\n- Cifrado de extremo a extremo (AES-256)\n- Autenticación SSO\n- Detección avanzada de amenazas\n- 99.99% uptime con failover automático\n\nLa seguridad es nuestra prioridad número uno.';
    }
    if (q.includes('qué puedo hacer') || q.includes('que puedo hacer') || q.includes('funciona') || q.includes('caracter') || q.includes('features') || q.includes('para qué')) {
      return 'Homepage es una plataforma empresarial todo-en-uno. Puedes:\n\n📊 Dashboard - Ver estadísticas en tiempo real y análisis con IA\n🤖 Nova - Asistente conversacional que crea usuarios, envía mensajes, genera reportes y más\n📝 Nova Generator - Genera reportes, insights y descripciones automáticamente\n👥 Users - Gestionar usuarios con roles y permisos\n📬 Contact - Formulario de contacto y gestión de mensajes\n🔔 Notifications - Sistema de notificaciones en tiempo real\n\n¿Sobre qué funcionalidad te gustaría saber más?';
    }
    if (q.includes('dashboard') || q.includes('panel')) {
      return 'El Dashboard te muestra:\n- Usuarios totales y nuevos registros del día\n- Uptime del sistema\n- Proyectos activos\n- Mensajes de contacto pendientes\n- Insights generados por IA basados en tus datos\n- Tabla de actividad reciente\n\nTodo en una vista centralizada.';
    }
    if (q.includes('registro') || q.includes('register') || q.includes('crear cuenta') || q.includes('empezar')) {
      return 'Registrarse es muy sencillo:\n1. Haz clic en "Get started" o ve a /register\n2. Ingresa tu nombre, email y contraseña\n3. ¡Listo! Accede al dashboard inmediatamente\n\nEl trial gratis dura 14 días sin necesidad de tarjeta de crédito.';
    }
    if (q.includes('contacto') || q.includes('soporte') || q.includes('ayuda') || q.includes('support')) {
      return 'Puedes contactarnos de varias formas:\n- 📝 Formulario de contacto en la página /contact\n- 🤖 AI Agent en el dashboard para crear mensajes\n- 📧 Email soporte@homepage.com\n\nPara clientes Enterprise: 24/7 con gestor dedicado.';
    }
    return `Homepage es una plataforma empresarial todo-en-uno con las siguientes capacidades:\n\n` +
      `📊 Dashboard - Estadísticas en tiempo real, insights con IA, actividad reciente\n` +
      `🤖 Nova - Crea usuarios, envía mensajes, genera reportes, estadísticas, notificaciones\n` +
      `📝 Nova Generator - Genera reportes, insights y descripciones automáticas\n` +
      `👥 User Management - CRUD completo con roles (admin/user), CSV export\n` +
      `📬 Contact - Formulario público + panel de administración con lectura\n` +
      `🔔 Notifications - Campanita con badge, panel de notificaciones, marcar leídas\n` +
      `🔐 Auth - JWT, registro/login, recuperación de contraseña, roles\n` +
      `🌙 Dark Mode - Toggle persistido en localStorage\n` +
      `🛡️ Seguridad - Helmet, rate limiting, CORS, cifrado, SOC 2, GDPR\n\n` +
      `¿Quieres saber más sobre alguna de estas funcionalidades?`;
  }

  private demoGenerateResponse(prompt: string, type?: string): string {
    if (type === 'report') {
      return `## Reporte: ${prompt}\n\n### Métricas\n- Usuarios activos: 156\n- Proyectos en curso: 23\n- Tasa de éxito: 94.2%\n- Crecimiento mensual: +12.5%\n\n### Recomendaciones\n1. Aumentar capacidad de servidores\n2. Optimizar onboarding\n3. Expandir equipo de soporte`;
    }
    if (type === 'insight') {
      return `Insight: El 73% de los nuevos registros provienen de referidos existentes. Se recomienda implementar un programa de referidos con incentivos para acelerar el crecimiento.`;
    }
    return `Resultado para: ${prompt}\n\nAnálisis completado. Los datos indican una tendencia positiva con oportunidades de mejora en retención de usuarios.`;
  }

  private demoInsightsResponse(stats: Record<string, any>): string {
    const users = stats.totalUsers || 0;
    const contacts = stats.totalContacts || 0;
    return `📊 Resumen del sistema\n\n` +
      `Usuarios: ${users} registrados\n` +
      `Contactos: ${contacts} mensajes\n` +
      `Estado: Sistema operativo normal\n\n` +
      `### Recomendaciones\n` +
      `1. Engagement — Los usuarios activos se benefician de contenido personalizado en el dashboard\n` +
      `2. Soporte — Revisar mensajes de contacto pendientes para mejorar tiempo de respuesta\n` +
      `3. Crecimiento — Cuantos más usuarios tengas, más precisos serán los insights con IA`;
  }

  private demoAgentResponse(message: string, userRole?: string): { text: string; action?: any } {
    const q = message.toLowerCase();
    if (q.includes('crear usuario') || q.includes('create user') || (q.includes('nuevo') && q.includes('usuari'))) {
      if (userRole !== 'admin') {
        return { text: '❌ Solo los administradores pueden crear usuarios. Contacta a un admin si necesitas un nuevo usuario.' };
      }
      return {
        text: 'Claro, voy a crear un nuevo usuario. ¿Puedes proporcionarme el nombre, email y contraseña?',
        action: { type: 'create_user', params: {} },
      };
    }
    if (q.includes('enviar mensaje') || q.includes('contacto')) {
      return {
        text: 'Voy a enviar un mensaje de contacto. ¿Cuál es el mensaje que deseas enviar?',
        action: { type: 'contact_message', params: {} },
      };
    }
    if (q.includes('estadísticas') || q.includes('stats') || q.includes('dashboard')) {
      return {
        text: 'Voy a consultar las estadísticas del dashboard para ti.',
        action: { type: 'get_stats', params: {} },
      };
    }
    if ((q.includes('actualizar') || q.includes('cambiar') || q.includes('editar')) && (q.includes('perfil') || q.includes('profile') || q.includes('nombre') || q.includes('email'))) {
      return {
        text: 'Voy a actualizar tu perfil. ¿Qué datos deseas cambiar?',
        action: { type: 'update_profile', params: {} },
      };
    }
    if (q.includes('cambiar contraseña') || q.includes('change password') || q.includes('nueva contraseña')) {
      return {
        text: 'Voy a ayudarte a cambiar tu contraseña. Ingresa tu contraseña actual y la nueva.',
        action: { type: 'change_password', params: {} },
      };
    }
    if (q.includes('notificación') || q.includes('notificacion') || q.includes('aviso') || q.includes('notification')) {
      return {
        text: 'Voy a crear una notificación para ti. ¿Cuál es el mensaje?',
        action: { type: 'send_notification', params: {} },
      };
    }
    if (q.includes('reporte') || q.includes('report') || q.includes('generar') || q.includes('generate')) {
      return {
        text: 'Voy a generar un reporte. ¿Qué tipo de reporte deseas? (report/insight/description)',
        action: { type: 'generate_report', params: {} },
      };
    }
    return {
      text: this.demoChatResponse(message),
    };
  }
}
