import { NextRequest } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/services/appointment.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');
    const duration = searchParams.get('duration');

    // Validar parâmetros obrigatórios
    if (!barberId) {
      throw new ApiError('ID do barbeiro é obrigatório');
    }
    if (!date) {
      throw new ApiError('Data é obrigatória');
    }
    if (!duration) {
      throw new ApiError('Duração do serviço é obrigatória');
    }

    const timeSlots = await getAvailableTimeSlots(
      date,
      barberId
    );

    return {
      success: true,
      data: timeSlots
    };
  }, request);
}
