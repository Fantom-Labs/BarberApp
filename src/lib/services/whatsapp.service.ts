/**
 * Serviço de integração com WhatsApp Business API
 *
 * Este serviço fornece funções para interagir com a API do WhatsApp Business,
 * permitindo enviar mensagens, templates e gerenciar conversas.
 */

import { cache, CacheKey, CacheType } from './cache.service';

// Tipos para a API do WhatsApp
export interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'location';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    caption?: string;
    mime_type: string;
    sha256: string;
  };
  status?: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppContact {
  wa_id: string;
  profile: {
    name: string;
  };
}

export interface WhatsAppConversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar?: string;
  messages?: WhatsAppMessage[];
}

export interface WhatsAppAuthStatus {
  isAuthenticated: boolean;
  phoneNumber?: string;
  businessName?: string;
  error?: string;
  expiresAt?: Date;
}

export interface WhatsAppTemplate {
  name: string;
  language: {
    code: string;
  };
  components?: Array<{
    type: 'header' | 'body' | 'button';
    parameters: Array<{
      type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
      text?: string;
      currency?: {
        code: string;
        amount: number;
      };
      date_time?: {
        fallback_value: string;
      };
      image?: {
        link: string;
      };
    }>;
  }>;
}

// Configurações da API do WhatsApp
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || '';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

// Função auxiliar para obter o status de autenticação do cache
function getCachedAuthStatus(): WhatsAppAuthStatus {
  return cache.get<WhatsAppAuthStatus>(CacheKey.WHATSAPP_AUTH) || {
    isAuthenticated: false
  };
}

/**
 * Autentica o número de telefone da barbearia na API do WhatsApp Business
 * @param phoneNumber Número de telefone no formato internacional (ex: 5511999999999)
 * @param businessName Nome da barbearia
 * @returns Promise com o status da autenticação
 */
export async function authenticateWhatsApp(phoneNumber: string, businessName: string): Promise<WhatsAppAuthStatus> {
  try {
    // Em um ambiente real, esta seria uma chamada à API do WhatsApp Business para autenticação
    // Aqui estamos simulando o comportamento para fins de demonstração
    console.log(`Autenticando ${businessName} com o número ${phoneNumber}`);

    // Simular um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Verificar se o número está no formato correto
    if (!phoneNumber.match(/^[0-9]{10,15}$/)) {
      return {
        isAuthenticated: false,
        error: 'Número de telefone inválido. Use apenas números, incluindo código do país e DDD.'
      };
    }

    // Simular autenticação bem-sucedida
    const authStatus: WhatsAppAuthStatus = {
      isAuthenticated: true,
      phoneNumber,
      businessName,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expira em 24 horas
    };

    // Armazenar o status de autenticação no cache centralizado
    cache.set(CacheKey.WHATSAPP_AUTH, authStatus, { type: CacheType.MEMORY });

    return authStatus;

    // Implementação real com a API do WhatsApp Business:
    /*
    const response = await fetch(`${WHATSAPP_API_URL}/accounts/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        business_name: businessName
      })
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const authStatus: WhatsAppAuthStatus = {
      isAuthenticated: true,
      phoneNumber,
      businessName,
      expiresAt: new Date(data.expires_at)
    };

    currentAuthStatus = authStatus;
    return authStatus;
    */
  } catch (error) {
    console.error('Erro ao autenticar no WhatsApp:', error);
    return {
      isAuthenticated: false,
      error: 'Falha na autenticação. Tente novamente mais tarde.'
    };
  }
}

/**
 * Verifica o status atual da autenticação
 * @returns Status da autenticação
 */
export function getWhatsAppAuthStatus(): WhatsAppAuthStatus {
  // Obter o status de autenticação do cache
  const authStatus = getCachedAuthStatus();

  // Verificar se a autenticação expirou
  if (authStatus.isAuthenticated && authStatus.expiresAt && authStatus.expiresAt < new Date()) {
    const expiredStatus = { isAuthenticated: false, error: 'Sessão expirada. Faça login novamente.' };
    cache.set(CacheKey.WHATSAPP_AUTH, expiredStatus, { type: CacheType.MEMORY });
    return expiredStatus;
  }

  return authStatus;
}

/**
 * Busca todas as conversas do WhatsApp
 * @returns Promise com a lista de conversas
 */
export async function fetchWhatsAppConversations(): Promise<WhatsAppConversation[]> {
  try {
    // Verificar se está autenticado
    const authStatus = getWhatsAppAuthStatus();
    if (!authStatus.isAuthenticated) {
      throw new Error('Não autenticado. Faça login primeiro.');
    }

    // Verificar se há dados em cache
    const cachedConversations = cache.get<WhatsAppConversation[]>(CacheKey.WHATSAPP_CONVERSATIONS);
    if (cachedConversations) {
      console.log('Usando conversas em cache');
      return cachedConversations;
    }

    // Em um ambiente real, esta seria uma chamada à API do WhatsApp Business
    // Aqui estamos simulando o comportamento para fins de demonstração
    console.log(`Buscando conversas para ${authStatus.phoneNumber}`);

    // Simular um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dados de exemplo para demonstração
    const mockConversations: WhatsAppConversation[] = [
      {
        id: '1',
        name: 'João Silva',
        phone: '5511987654321',
        lastMessage: 'Olá, gostaria de agendar um corte de cabelo',
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
        unreadCount: 2
      },
      {
        id: '2',
        name: 'Maria Oliveira',
        phone: '5511976543210',
        lastMessage: 'Obrigada pelo atendimento!',
        timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
        unreadCount: 0
      },
      {
        id: '3',
        name: 'Carlos Pereira',
        phone: '5511965432109',
        lastMessage: 'Qual o horário de funcionamento?',
        timestamp: new Date(Date.now() - 86400000), // 1 dia atrás
        unreadCount: 1
      },
      {
        id: '4',
        name: 'Ana Souza',
        phone: '5511954321098',
        lastMessage: 'Vocês têm disponível para amanhã?',
        timestamp: new Date(Date.now() - 172800000), // 2 dias atrás
        unreadCount: 0
      },
      {
        id: '5',
        name: 'Pedro Santos',
        phone: '5511943210987',
        lastMessage: 'Quanto custa o corte + barba?',
        timestamp: new Date(Date.now() - 259200000), // 3 dias atrás
        unreadCount: 0
      }
    ];

    // Armazenar as conversas em cache
    cache.set(CacheKey.WHATSAPP_CONVERSATIONS, mockConversations, {
      type: CacheType.MEMORY,
      ttl: 5 * 60 * 1000 // 5 minutos
    });

    return mockConversations;

    // Implementação real com a API do WhatsApp Business:
    /*
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/conversations`, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Converter os dados da API para o formato da nossa interface
    const conversations: WhatsAppConversation[] = data.data.map(conv => ({
      id: conv.id,
      name: conv.contact.profile.name || `Cliente ${conv.contact.wa_id.substring(conv.contact.wa_id.length - 4)}`,
      phone: conv.contact.wa_id,
      lastMessage: conv.last_message.text?.body || 'Mensagem não textual',
      timestamp: new Date(conv.last_message.timestamp),
      unreadCount: conv.unread_count || 0
    }));

    return conversations;
    */
  } catch (error) {
    console.error('Erro ao buscar conversas do WhatsApp:', error);
    throw error;
  }
}

/**
 * Busca as mensagens de uma conversa específica
 * @param conversationId ID da conversa
 * @returns Promise com a lista de mensagens
 */
export async function fetchWhatsAppMessages(conversationId: string): Promise<WhatsAppMessage[]> {
  try {
    // Verificar se está autenticado
    const authStatus = getWhatsAppAuthStatus();
    if (!authStatus.isAuthenticated) {
      throw new Error('Não autenticado. Faça login primeiro.');
    }

    // Em um ambiente real, esta seria uma chamada à API do WhatsApp Business
    // Aqui estamos simulando o comportamento para fins de demonstração
    console.log(`Buscando mensagens para a conversa ${conversationId}`);

    // Simular um pequeno delay para parecer uma chamada de API real
    await new Promise(resolve => setTimeout(resolve, 800));

    // Dados de exemplo para demonstração
    const mockMessages: any[] = [
      {
        id: '1',
        from: '5511987654321',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text',
        text: { body: 'Olá, gostaria de agendar um corte de cabelo' }
      },
      {
        id: '2',
        from: authStatus.phoneNumber || '',
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        type: 'text',
        text: { body: 'Olá! Claro, temos horários disponíveis para amanhã. Qual horário seria melhor para você?' },
        status: 'read'
      },
      {
        id: '3',
        from: '5511987654321',
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        type: 'text',
        text: { body: 'Prefiro no final da tarde, por volta das 18h' }
      },
      {
        id: '4',
        from: authStatus.phoneNumber || '',
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        type: 'text',
        text: { body: 'Perfeito! Temos um horário disponível às 18h com o barbeiro Carlos. Posso confirmar esse horário para você?' },
        status: 'read'
      },
      {
        id: '5',
        from: '5511987654321',
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        type: 'text',
        text: { body: 'Sim, pode confirmar' }
      },
      {
        id: '6',
        from: authStatus.phoneNumber || '',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        type: 'text',
        text: { body: 'Ótimo! Seu agendamento foi confirmado para amanhã às 18h com o barbeiro Carlos. Você receberá uma mensagem de lembrete algumas horas antes. Há mais alguma coisa em que eu possa ajudar?' },
        status: 'read'
      }
    ];

    return mockMessages;

    // Implementação real com a API do WhatsApp Business:
    /*
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/conversations/${conversationId}/messages`, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
    */
  } catch (error) {
    console.error('Erro ao buscar mensagens do WhatsApp:', error);
    throw error;
  }
}

/**
 * Envia uma mensagem de texto para um número do WhatsApp
 * @param to Número de telefone do destinatário no formato internacional (ex: 5511999999999)
 * @param message Texto da mensagem
 * @returns Promise com o resultado da API
 */
/**
 * Envia uma mensagem de texto via WhatsApp
 * @param to Número de telefone do destinatário
 * @param message Mensagem a ser enviada
 * @returns Resposta da API do WhatsApp
 */
export async function sendWhatsAppTextMessage(to: string, message: string) {
  // Validar parâmetros
  if (!to || !message) {
    console.error('Parâmetros inválidos para envio de mensagem');
    throw new Error('Parâmetros inválidos');
  }

  // Verificar cache para evitar envios duplicados
  const cacheKey = `whatsapp_sent_${to}_${message.substring(0, 20)}`;
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    console.log(`Usando resposta em cache para ${to}`);
    return cachedResponse;
  }

  try {
    // Em um ambiente real, esta seria uma chamada à API do WhatsApp Business
    // Aqui estamos simulando o comportamento para fins de demonstração
    console.log(`Enviando mensagem para ${to}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);

    // Simular um pequeno atraso para evitar sobrecarga
    await new Promise(resolve => setTimeout(resolve, 50));

    // Simulação de resposta da API
    const response = {
      messaging_product: 'whatsapp',
      contacts: [{ wa_id: to, input: to }],
      messages: [{ id: `wamid.${Math.random().toString(36).substring(2, 11)}` }]
    };

    // Armazenar em cache para evitar envios duplicados
    cache.set(cacheKey, response, {
      type: CacheType.MEMORY,
      ttl: 5 * 60 * 1000 // 5 minutos
    });

    return response;

    // Implementação real com a API do WhatsApp Business:
    /*
    const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0';
    const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!WHATSAPP_PHONE_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error('Configuração do WhatsApp não encontrada');
    }

    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: message }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData = await response.json();

    // Armazenar em cache para evitar envios duplicados
    cache.set(cacheKey, responseData, {
      type: CacheType.MEMORY,
      ttl: 5 * 60 * 1000 // 5 minutos
    });

    return responseData;
    */
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
}

/**
 * Envia um template de mensagem para um número do WhatsApp
 * @param to Número de telefone do destinatário
 * @param template Objeto do template a ser enviado
 * @returns Promise com o resultado da API
 */
export async function sendWhatsAppTemplate(to: string, template: WhatsAppTemplate) {
  try {
    // Simulação para fins de demonstração
    console.log(`Enviando template ${template.name} para ${to}`);

    return {
      messaging_product: 'whatsapp',
      contacts: [{ wa_id: to, input: to }],
      messages: [{ id: `wamid.${Math.random().toString(36).substring(2, 11)}` }]
    };

    // Implementação real:
    /*
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'template',
        template
      })
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Erro ao enviar template WhatsApp:', error);
    throw error;
  }
}

/**
 * Envia uma mensagem de confirmação de agendamento
 * @param to Número de telefone do cliente
 * @param name Nome do cliente
 * @param service Serviço agendado
 * @param date Data do agendamento
 * @param time Horário do agendamento
 * @returns Promise com o resultado da API
 */
export async function sendAppointmentConfirmation(
  to: string,
  name: string,
  service: string,
  date: string,
  time: string
) {
  const template: WhatsAppTemplate = {
    name: 'appointment_confirmation',
    language: { code: 'pt_BR' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: name },
          { type: 'text', text: service },
          { type: 'text', text: date },
          { type: 'text', text: time }
        ]
      }
    ]
  };

  return sendWhatsAppTemplate(to, template);
}

/**
 * Envia um lembrete de agendamento
 * @param to Número de telefone do cliente
 * @param name Nome do cliente
 * @param service Serviço agendado
 * @param date Data do agendamento
 * @param time Horário do agendamento
 * @returns Promise com o resultado da API
 */
export async function sendAppointmentReminder(
  to: string,
  name: string,
  service: string,
  date: string,
  time: string
) {
  const template: WhatsAppTemplate = {
    name: 'appointment_reminder',
    language: { code: 'pt_BR' },
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: name },
          { type: 'text', text: service },
          { type: 'text', text: date },
          { type: 'text', text: time }
        ]
      }
    ]
  };

  return sendWhatsAppTemplate(to, template);
}

/**
 * Processa uma mensagem recebida do webhook do WhatsApp
 * @param message Mensagem recebida
 * @param contact Informações do contato
 * @returns Resposta automática ou null
 */
/**
 * Processa uma mensagem recebida do WhatsApp e envia uma resposta automática se necessário
 * @param message Mensagem recebida
 * @param contact Informações do contato
 * @returns Resposta enviada ou null
 */
export async function processIncomingMessage(message: WhatsAppMessage, contact: WhatsAppContact) {
  try {
    // Verificar se a mensagem é válida
    if (!message || !contact) {
      console.warn('Mensagem ou contato inválido');
      return null;
    }

    // Verificar se é uma mensagem de texto
    if (message.type !== 'text' || !message.text || !message.text.body) {
      console.log(`Mensagem não textual recebida de ${contact.wa_id}`);
      return null;
    }

    // Processar o texto da mensagem
    const text = message.text.body.toLowerCase().trim();
    if (!text) {
      return null;
    }

    // Obter o nome do contato ou usar um valor padrão
    const contactName = contact.profile?.name || 'Cliente';
    let response: string | null = null;

    // Cache de respostas para evitar processamento repetitivo
    const cacheKey = `whatsapp_response_${text.substring(0, 20)}`;
    const cachedResponse = cache.get<string>(cacheKey);

    if (cachedResponse) {
      response = cachedResponse.replace('{name}', contactName);
    } else {
      // Lógica de resposta automática
      if (text.includes('olá') || text.includes('oi') || text.includes('bom dia') || text.includes('boa tarde')) {
        response = `Olá ${contactName}! Como posso ajudar você hoje?`;
      } else if (text.includes('horário') || text.includes('funcionamento')) {
        response = 'Nosso horário de funcionamento é de segunda a sábado, das 9h às 20h.';
      } else if (text.includes('agendar') || text.includes('marcar')) {
        response = 'Para agendar um horário, por favor informe qual serviço você deseja e qual o melhor dia e horário para você.';
      } else if (text.includes('preço') || text.includes('valor')) {
        response = 'Nossos preços variam de acordo com o serviço. Cortes a partir de R$50, barba a partir de R$35. Posso te enviar nossa tabela completa de preços.';
      }

      // Armazenar em cache para futuras consultas
      if (response) {
        const templateResponse = response.replace(contactName, '{name}');
        cache.set(cacheKey, templateResponse, {
          type: CacheType.MEMORY,
          ttl: 24 * 60 * 60 * 1000 // 24 horas
        });
      }
    }

    // Enviar resposta se houver
    if (response) {
      try {
        await sendWhatsAppTextMessage(contact.wa_id, response);
        console.log(`Resposta enviada para ${contact.wa_id}: ${response.substring(0, 50)}...`);
      } catch (sendError) {
        console.error('Erro ao enviar resposta:', sendError);
        // Continuar mesmo com erro de envio
      }
    }

    return response;
  } catch (error) {
    console.error('Erro ao processar mensagem recebida:', error);
    // Não propagar o erro para evitar falha no webhook
    return null;
  }
}

/**
 * Configura um webhook para receber mensagens do WhatsApp
 * @param url URL do webhook
 * @returns Promise com o resultado da configuração
 */
export async function setupWhatsAppWebhook(url: string) {
  try {
    console.log(`Configurando webhook do WhatsApp para ${url}`);

    // Simulação para fins de demonstração
    return { success: true };

    // Implementação real:
    /*
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/subscribed_apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        webhooks: {
          url,
          verify_token: process.env.WHATSAPP_VERIFY_TOKEN
        }
      })
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
    */
  } catch (error) {
    console.error('Erro ao configurar webhook do WhatsApp:', error);
    throw error;
  }
}
