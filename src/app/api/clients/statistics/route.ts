import { NextRequest, NextResponse } from 'next/server';
import { getClientStatistics } from '@/lib/services/client.service';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const statistics = getClientStatistics();
    
    return NextResponse.json<ApiResponse<typeof statistics>>({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de clientes:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Erro ao buscar estatísticas de clientes'
    }, { status: 500 });
  }
}
