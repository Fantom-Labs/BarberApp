import { NextRequest } from 'next/server';
import { login } from '@/lib/services/auth.service';
import { ApiHandlerService } from '@/lib/services/api-handler.service';
import { LoginCredentials } from '@/lib/types';

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    const data = await req.json();

    // Validar dados do login
    const credentials = ApiHandlerService.validate<LoginCredentials>(data, {
      email: { required: true },
      password: { required: true }
    });

    // Realizar login
    const user = await login(credentials.email, credentials.password);
    if (!user) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
        status: 401
      };
    }

    return {
      success: true,
      data: user
    };
  }, request);
}
