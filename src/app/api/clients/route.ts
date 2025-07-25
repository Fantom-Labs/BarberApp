import { NextRequest } from 'next/server';
import {
  getAllClients,
  getClientById,
  getClientInteractions,
  addClientInteraction,
  updateClientData,
  deactivateClient
} from '@/lib/services/client.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';
import { User, ClientInteraction, ClientInteractionType } from '@/lib/types';

type ClientResponse = {
  client: User;
  interactions?: ClientInteraction[];
};

type CreateInteractionData = {
  clientId: string;
  type: ClientInteractionType;
  description: string;
};

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute<ClientResponse | User | User[]>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const interactions = searchParams.get('interactions') === 'true';

    if (id) {
      const client = await getClientById(id);
      if (!client) {
        throw new ApiError('Cliente não encontrado', 404);
      }

      if (interactions) {
        const clientInteractions = await getClientInteractions(id);
        return {
          success: true,
          data: {
            client,
            interactions: clientInteractions
          }
        };
      }

      return {
        success: true,
        data: client
      };
    }

    const clients = await getAllClients();
    return {
      success: true,
      data: clients
    };
  }, request);
}

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute<ClientInteraction>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();

    // Validar dados da interação
    const interactionData = ApiHandlerService.validate<CreateInteractionData>(data, {
      clientId: { required: true },
      type: { required: true },
      description: { required: true }
    });

    // Validar o tipo da interação
    if (!['message', 'appointment', 'purchase', 'course', 'website_visit'].includes(interactionData.type)) {
      throw new ApiError('Tipo de interação inválido');
    }

    const interaction = await addClientInteraction({
      clientId: interactionData.clientId,
      type: interactionData.type,
      description: interactionData.description,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    });

    if (!interaction) {
      throw new ApiError('Não foi possível registrar a interação');
    }

    return {
      success: true,
      data: interaction
    };
  }, request);
}

export async function PUT(request: NextRequest) {
  return ApiHandlerService.execute<User>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      throw new ApiError('ID do cliente é obrigatório');
    }

    const client = await updateClientData(id, updateData);
    if (!client) {
      throw new ApiError('Cliente não encontrado');
    }

    return {
      success: true,
      data: client
    };
  }, request);
}

export async function DELETE(request: NextRequest) {
  return ApiHandlerService.execute<{ id: string }>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError('ID do cliente é obrigatório');
    }

    const success = await deactivateClient(id);
    if (!success) {
      throw new ApiError('Não foi possível desativar o cliente');
    }

    return {
      success: true,
      data: { id }
    };
  }, request);
}
