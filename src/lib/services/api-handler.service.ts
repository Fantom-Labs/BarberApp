/**
 * Serviço de manipulação de API base
 *
 * Este serviço fornece uma implementação base para manipuladores de API,
 * reduzindo a duplicação de código e padronizando o tratamento de erros.
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger.service';
import { ApiResponse } from '../types';

export type ApiHandler<T = any> = (
  request: NextRequest,
  params?: Record<string, any>
) => Promise<ApiResponse<T>>;

export class ApiHandlerService {
  /**
   * Executa um handler de API com tratamento de erros padronizado
   */
  static async execute<T>(
    handler: ApiHandler<T>,
    request: NextRequest,
    params?: Record<string, any>
  ): Promise<NextResponse> {
    try {
      // Registrar início da requisição
      const startTime = performance.now();
      const method = request.method;
      const url = request.url;

      logger.info(`API Request iniciada: ${method} ${url}`);

      // Executar o handler
      const result = await handler(request, params);

      // Registrar fim da requisição
      const duration = Math.round(performance.now() - startTime);
      logger.info(`API Request completada: ${method} ${url} (${duration}ms)`);

      // Retornar resposta padronizada
      return NextResponse.json(result, {
        status: result.error ? (result.status || 400) : 200
      });
    } catch (error) {
      // Registrar erro
      logger.error('Erro na API:', error);

      // Retornar erro padronizado
      const status = error instanceof ApiError ? error.status : 500;
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        status
      }, { status });
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static async requireAuth(request: NextRequest): Promise<void> {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      throw new ApiError('Não autorizado', 401);
    }

    // Implementar verificação de token aqui
    // Por enquanto apenas verifica se existe um token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new ApiError('Token inválido', 401);
    }
  }

  /**
   * Valida os dados da requisição
   */
  static validate<T>(data: any, schema: Record<string, any>): T {
    const errors: string[] = [];

    // Validar campos obrigatórios
    Object.entries(schema).forEach(([key, config]) => {
      if (config.required && !data[key]) {
        errors.push(`Campo ${key} é obrigatório`);
      }
    });

    if (errors.length > 0) {
      throw new ApiError(errors.join(', '), 400);
    }

    return data as T;
  }
}

/**
 * Classe de erro personalizada para API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
