import { NextRequest, NextResponse } from 'next/server';
import { 
  generateClientInsight, 
  generateAllClientInsights, 
  getClientsAtRisk, 
  getClientsForFollowUp,
  getClientsBySegment
} from '@/lib/services/client.service';
import { ApiResponse, ClientInsight, User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const segment = searchParams.get('segment');
    const filter = searchParams.get('filter');
    
    if (clientId) {
      // Buscar insights de um cliente específico
      const insight = await generateClientInsight(clientId);
      
      if (!insight) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Cliente não encontrado ou sem dados suficientes'
        }, { status: 404 });
      }
      
      return NextResponse.json<ApiResponse<ClientInsight>>({
        success: true,
        data: insight
      });
    } else if (segment) {
      // Buscar clientes por segmento
      const clients = await getClientsBySegment(segment);
      
      return NextResponse.json<ApiResponse<User[]>>({
        success: true,
        data: clients
      });
    } else if (filter) {
      // Aplicar filtros específicos
      let clients: User[] = [];
      
      switch (filter) {
        case 'at-risk':
          clients = await getClientsAtRisk();
          break;
        case 'follow-up':
          clients = await getClientsForFollowUp();
          break;
        default:
          return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: 'Filtro inválido'
          }, { status: 400 });
      }
      
      return NextResponse.json<ApiResponse<User[]>>({
        success: true,
        data: clients
      });
    } else {
      // Buscar insights de todos os clientes
      const insights = await generateAllClientInsights();
      
      return NextResponse.json<ApiResponse<ClientInsight[]>>({
        success: true,
        data: insights
      });
    }
  } catch (error) {
    console.error('Erro ao buscar insights de clientes:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Erro ao buscar insights de clientes'
    }, { status: 500 });
  }
}
