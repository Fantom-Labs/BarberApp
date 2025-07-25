import { NextRequest } from 'next/server';
import {
  authenticateWhatsApp,
  getWhatsAppAuthStatus,
  fetchWhatsAppConversations,
  fetchWhatsAppMessages,
  WhatsAppAuthStatus,
  WhatsAppConversation,
  WhatsAppMessage
} from '@/lib/services/whatsapp.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';

type WhatsAppAction = 'status' | 'conversations' | 'messages';
type WhatsAppAuthData = {
  phoneNumber: string;
  businessName: string;
};

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute<WhatsAppAuthStatus | WhatsAppConversation[] | WhatsAppMessage[]>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') as WhatsAppAction;
    const conversationId = searchParams.get('conversationId');

    switch (action) {
      case 'status':
        return {
          success: true,
          data: getWhatsAppAuthStatus()
        };

      case 'conversations':
        return {
          success: true,
          data: await fetchWhatsAppConversations()
        };

      case 'messages':
        if (!conversationId) {
          throw new ApiError('ID da conversa é obrigatório');
        }
        return {
          success: true,
          data: await fetchWhatsAppMessages(conversationId)
        };

      default:
        throw new ApiError('Ação inválida');
    }
  }, request);
}

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute<WhatsAppAuthStatus>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();

    // Validar dados de autenticação do WhatsApp
    const authData = ApiHandlerService.validate<WhatsAppAuthData>(data, {
      phoneNumber: { required: true },
      businessName: { required: true }
    });

    const status = await authenticateWhatsApp(
      authData.phoneNumber,
      authData.businessName
    );

    if (!status.isAuthenticated) {
      throw new ApiError(status.error || 'Falha na autenticação do WhatsApp');
    }

    return {
      success: true,
      data: status
    };
  }, request);
}
