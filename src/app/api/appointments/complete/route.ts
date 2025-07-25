import { NextRequest, NextResponse } from 'next/server';
import { completeAppointment } from '@/lib/services/appointment.service';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, notes } = body;
    
    if (!id) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'ID do agendamento é obrigatório'
      }, { status: 400 });
    }
    
    const success = await completeAppointment(id);
    
    if (!success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Agendamento não encontrado ou erro ao concluir'
      }, { status: 404 });
    }
    
    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Agendamento concluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao concluir agendamento:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Erro ao concluir agendamento'
    }, { status: 500 });
  }
}
