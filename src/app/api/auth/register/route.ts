import { NextRequest } from 'next/server';
import { register } from '@/lib/services/auth.service';
import { ApiHandlerService } from '@/lib/services/api-handler.service';
import { RegisterData } from '@/lib/types';

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    const data = await req.json();

    // Validar dados do registro
    const registerData = ApiHandlerService.validate<RegisterData>(data, {
      name: { required: true },
      email: { required: true },
      password: { required: true },
      phone: { required: true },
      birthDate: { required: true },
      type: { required: true }
    });

    // Realizar registro
    try {
      const user = await register(registerData);
      if (!user) {
        return {
          success: false,
          error: 'Não foi possível completar o registro',
          status: 400
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao registrar usuário',
        status: 400
      };
    }
  }, request);
}
