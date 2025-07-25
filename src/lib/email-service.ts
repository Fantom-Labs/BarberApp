/**
 * Serviço para envio de emails
 * 
 * Este é um serviço simulado. Em um ambiente real, você usaria
 * um serviço como SendGrid, Mailgun, AWS SES, etc.
 */

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Envia um email (simulado)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log('Enviando email para:', options.to);
  console.log('Assunto:', options.subject);
  console.log('Conteúdo:', options.body);
  
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simula sucesso (em um ambiente real, retornaria true/false baseado na resposta do serviço)
  return true;
}

/**
 * Envia um email de boas-vindas para um novo usuário
 */
export async function sendWelcomeEmail(name: string, email: string, userType: string): Promise<boolean> {
  const subject = 'Bem-vindo ao Barbershop App!';
  
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B00;">Bem-vindo ao Barbershop App!</h2>
      <p>Olá, <strong>${name}</strong>!</p>
      <p>Seu cadastro como <strong>${userType}</strong> foi realizado com sucesso.</p>
      <p>Agora você pode aproveitar todos os recursos da nossa plataforma:</p>
      <ul>
        ${userType === 'Cliente' ? `
          <li>Agende horários com seus barbeiros favoritos</li>
          <li>Compre produtos exclusivos</li>
          <li>Acesse cursos e vídeo-aulas</li>
        ` : `
          <li>Gerencie sua agenda de atendimentos</li>
          <li>Cadastre seus serviços e produtos</li>
          <li>Crie cursos e vídeo-aulas</li>
        `}
      </ul>
      <p>Se tiver qualquer dúvida, entre em contato conosco.</p>
      <p>Atenciosamente,<br>Equipe Barbershop App</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject,
    body
  });
}
