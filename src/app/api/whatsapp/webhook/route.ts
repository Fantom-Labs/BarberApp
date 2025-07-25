import { NextRequest, NextResponse } from 'next/server';
import { processIncomingMessage } from '@/lib/services/whatsapp.service';

/**
 * Endpoint para verificação do webhook do WhatsApp
 *
 * O WhatsApp Business API envia uma solicitação GET para verificar o webhook
 * com um token de verificação que deve ser confirmado.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Token de verificação definido no painel do WhatsApp Business
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'barberapp_webhook_token';

  // Verificar se o token é válido
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verificado com sucesso');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('Falha na verificação do webhook');
    return new NextResponse('Verification failed', { status: 403 });
  }
}

/**
 * Endpoint para receber mensagens do WhatsApp
 *
 * O WhatsApp Business API envia uma solicitação POST com as mensagens recebidas
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se o corpo da requisição é válido
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Erro ao analisar o corpo da requisição:', parseError);
      return new NextResponse('Invalid JSON', { status: 400 });
    }

    // Verificar se é uma mensagem do WhatsApp
    if (!body || body.object !== 'whatsapp_business_account') {
      return new NextResponse('Not a WhatsApp message', { status: 400 });
    }

    // Verificar se há entradas para processar
    if (!body.entry || !Array.isArray(body.entry) || body.entry.length === 0) {
      return new NextResponse('No entries to process', { status: 200 });
    }

    // Processar cada entrada recebida
    const processingPromises = [];

    for (const entry of body.entry) {
      if (!entry.changes || !Array.isArray(entry.changes)) continue;

      for (const change of entry.changes) {
        if (change.field !== 'messages' || !change.value) continue;

        const value = change.value;

        // Verificar se há mensagens para processar
        if (!value.messages || !Array.isArray(value.messages) || value.messages.length === 0) continue;
        if (!value.contacts || !Array.isArray(value.contacts)) continue;

        // Processar cada mensagem recebida de forma assíncrona
        for (const message of value.messages) {
          const contact = value.contacts.find((c: any) => c.wa_id === message.from);

          if (contact) {
            // Adicionar à lista de promessas para processamento paralelo
            processingPromises.push(
              processIncomingMessage(message, contact)
                .catch(err => console.error(`Erro ao processar mensagem ${message.id}:`, err))
            );
          }
        }
      }
    }

    // Processar todas as mensagens em paralelo, mas não esperar pela conclusão
    // Isso permite que o webhook retorne rapidamente
    if (processingPromises.length > 0) {
      // Executar em background sem bloquear a resposta
      Promise.all(processingPromises)
        .catch(err => console.error('Erro ao processar mensagens em lote:', err));
    }

    // Retornar sucesso imediatamente
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Erro ao processar webhook do WhatsApp:', error);
    // Mesmo com erro, retornar 200 para o WhatsApp não reenviar a mensagem
    return new NextResponse('Processed with errors', { status: 200 });
  }
}
