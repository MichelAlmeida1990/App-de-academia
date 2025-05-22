// src/services/EmailService.js
import emailjs from '@emailjs/browser';

const EmailService = {
  // Configurações do EmailJS
  config: {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
  },

  // Inicializar o serviço EmailJS
  init() {
    if (!this.config.publicKey) {
      console.error('EmailJS: Chave pública não encontrada');
      return false;
    }
    
    try {
      emailjs.init(this.config.publicKey);
      console.log('EmailJS inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar EmailJS:', error);
      return false;
    }
  },

  // Enviar email de recuperação de senha
  async sendPasswordResetEmail(email, resetLink) {
    try {
      // Verificar se temos todas as configurações necessárias
      if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey) {
        console.error('EmailJS: Configurações incompletas', {
          serviceId: !!this.config.serviceId,
          templateId: !!this.config.templateId,
          publicKey: !!this.config.publicKey
        });
        throw new Error('Configurações de email incompletas');
      }

      // Inicializa o EmailJS
      this.init();

      console.log('Preparando para enviar email para:', email);
      console.log('Com link de recuperação:', resetLink);

      const templateParams = {
        to_email: email,
        reset_link: resetLink,
        app_name: 'App de Academia',
        support_email: 'suporte@appdeacademia.com',
      };

      // Envia o email usando EmailJS
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );

      console.log('Email enviado com sucesso:', response);
      return {
        success: true,
        message: 'Email enviado com sucesso',
        response
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      
      // Fallback para desenvolvimento
      console.log('SIMULAÇÃO DE EMAIL (após falha):');
      console.log('Para:', email);
      console.log('Assunto: Recuperação de Senha');
      console.log('Link de recuperação:', resetLink);
      console.log('Erro detalhado:', error);
      
      return {
        success: false,
        simulated: true,
        error: error.message || 'Erro ao enviar email',
        message: 'Email simulado após falha no envio real'
      };
    }
  },

  // Verificar status do serviço
  async checkServiceStatus() {
    try {
      // Verificação detalhada das configurações
      const configStatus = {
        serviceId: {
          exists: !!this.config.serviceId,
          value: this.config.serviceId ? this.config.serviceId.substring(0, 4) + '...' : null
        },
        templateId: {
          exists: !!this.config.templateId,
          value: this.config.templateId ? this.config.templateId.substring(0, 4) + '...' : null
        },
        publicKey: {
          exists: !!this.config.publicKey,
          value: this.config.publicKey ? this.config.publicKey.substring(0, 4) + '...' : null
        }
      };
      
      console.log('Status das configurações EmailJS:', configStatus);
      
      if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey) {
        return {
          available: false,
          message: 'Configurações do EmailJS incompletas',
          details: configStatus
        };
      }
      
      // Tenta inicializar para verificar se a configuração está correta
      const initialized = this.init();
      
      return {
        available: initialized,
        message: initialized ? 'Serviço EmailJS disponível' : 'Falha ao inicializar EmailJS',
        details: configStatus
      };
    } catch (error) {
      console.error('Erro ao verificar serviço EmailJS:', error);
      return {
        available: false,
        error: error.message,
        message: 'Erro ao verificar serviço de email'
      };
    }
  },
  
  // Método de teste para verificar se o EmailJS está funcionando
  async testEmailService() {
    try {
      // Verifica o status do serviço
      const status = await this.checkServiceStatus();
      console.log('Status do serviço EmailJS:', status);
      
      if (!status.available) {
        throw new Error('Serviço EmailJS não disponível: ' + status.message);
      }
      
      // Tenta enviar um email de teste
      const testEmail = 'test@example.com'; // Email de teste
      const testLink = 'https://example.com/reset-test';
      
      const result = await this.sendPasswordResetEmail(testEmail, testLink);
      
      return {
        success: result.success,
        message: 'Teste de EmailJS concluído',
        details: result
      };
    } catch (error) {
      console.error('Falha no teste de EmailJS:', error);
      return {
        success: false,
        message: 'Falha no teste de EmailJS',
        error: error.message
      };
    }
  }
};

export default EmailService;
