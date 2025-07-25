import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/services/auth.service';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    await logout();
    
    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao processar logout:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Erro ao processar logout'
    }, { status: 500 });
  }
}
