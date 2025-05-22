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
    emailjs.init(this.config.publicKey);
  },

  // Enviar email de recuperação de senha
  async sendPasswordResetEmail(email, resetLink) {
    try {
      // Inicializa o EmailJS
      this.init();

      const templateParams = {
        to_email: email,
        reset_link: resetLink,
        // Outros parâmetros conforme definido no seu template
        app_name: 'App de Academia',
        support_email: 'suporte@appdeacademia.com',
      };

      // Envia o email usando EmailJS
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );

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
      // Verificação simples se temos as configurações necessárias
      if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey) {
        return {
          available: false,
          message: 'Configurações do EmailJS incompletas'
        };
      }
      
      return {
        available: true,
        message: 'Serviço EmailJS disponível'
      };
    } catch (error) {
      return {
        available: false,
        error: error.message,
        message: 'Erro ao verificar serviço de email'
      };
    }
  }
};

export default EmailService;
