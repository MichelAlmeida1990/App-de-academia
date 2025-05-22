// src/services/EmailService.js

// Função para enviar email usando EmailJS (serviço gratuito)
// Requer cadastro em https://www.emailjs.com/ (plano gratuito permite 200 emails/mês)

const EmailService = {
  // Configurações do EmailJS
  config: {
    serviceId: 'YOUR_SERVICE_ID', // Substitua pelo seu Service ID do EmailJS
    templateId: 'YOUR_TEMPLATE_ID', // Substitua pelo seu Template ID do EmailJS
    userId: 'YOUR_USER_ID', // Substitua pelo seu User ID do EmailJS
    accessToken: 'YOUR_ACCESS_TOKEN', // Opcional, para maior segurança
  },

  // Inicializar o serviço EmailJS
  init() {
    // Carrega o script do EmailJS dinamicamente
    if (!window.emailjs) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        window.emailjs.init(this.config.userId);
      };
    } else if (window.emailjs) {
      window.emailjs.init(this.config.userId);
    }
  },

  // Enviar email de recuperação de senha
  async sendPasswordResetEmail(email, resetLink) {
    try {
      if (!window.emailjs) {
        this.init();
        // Aguardar carregamento do script
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const templateParams = {
        to_email: email,
        reset_link: resetLink,
        // Outros parâmetros conforme definido no seu template
        app_name: 'App de Academia',
        support_email: 'suporte@appdeacademia.com',
      };

      // Verifica se o EmailJS está disponível
      if (!window.emailjs) {
        console.error('EmailJS não está carregado');
        
        // Fallback: simular envio para desenvolvimento
        console.log('SIMULAÇÃO DE EMAIL:');
        console.log('Para:', email);
        console.log('Assunto: Recuperação de Senha');
        console.log('Link de recuperação:', resetLink);
        
        return {
          success: true,
          simulated: true,
          message: 'Email simulado (EmailJS não carregado)'
        };
      }

      // Envia o email usando EmailJS
      const response = await window.emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams,
        this.config.userId
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
      // Simples verificação se o EmailJS está carregado
      if (!window.emailjs) {
        return {
          available: false,
          message: 'Serviço EmailJS não carregado'
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
