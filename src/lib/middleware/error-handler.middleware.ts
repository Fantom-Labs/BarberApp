/**
 * Middleware de tratamento de erros
 *
 * Este middleware fornece tratamento de erros centralizado para todas as rotas da API,
 * garantindo consistência nas respostas de erro e logging apropriado.
 */

import { NextResponse } from 'next/server';
import { logger } from '../services/logger.service';
import { ApiError } from '../services/api-handler.service';

export interface ErrorResponse {
  success: false;
  error: string;
  status: number;
  timestamp: string;
  path?: string;
  code?: string;
}

export class ErrorMiddleware {
  /**
   * Trata erros da API de forma padronizada
   */
  static handle(error: unknown, path?: string): NextResponse<ErrorResponse> {
    // Log do erro
    logger.error('API Error:', {
      error,
      path,
      timestamp: new Date().toISOString()
    });

    // Determinar o tipo de erro e status code apropriado
    let status = 500;
    let message = 'Erro interno do servidor';
    let code: string | undefined;

    if (error instanceof ApiError) {
      status = error.status;
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;

      // Identificar tipos específicos de erro
      if (error.name === 'ValidationError') {
        status = 400;
        code = 'VALIDATION_ERROR';
      } else if (error.name === 'UnauthorizedError') {
        status = 401;
        code = 'UNAUTHORIZED';
      } else if (error.name === 'ForbiddenError') {
        status = 403;
        code = 'FORBIDDEN';
      } else if (error.name === 'NotFoundError') {
        status = 404;
        code = 'NOT_FOUND';
      }
    }

    // Construir resposta de erro padronizada
    const errorResponse: ErrorResponse = {
      success: false,
      error: message,
      status,
      timestamp: new Date().toISOString(),
      path,
      code
    };

    // Retornar resposta com status code apropriado
    return NextResponse.json(errorResponse, { status });
  }

  /**
   * Trata erros de validação específicos
   */
  static handleValidationError(errors: Record<string, string[]>, path?: string): NextResponse<ErrorResponse> {
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'Erro de validação',
      status: 400,
      timestamp: new Date().toISOString(),
      path,
      code: 'VALIDATION_ERROR'
    };

    return NextResponse.json({
      ...errorResponse,
      errors
    }, { status: 400 });
  }

  /**
   * Trata erros de autenticação
   */
  static handleAuthError(message: string = 'Não autorizado', path?: string): NextResponse<ErrorResponse> {
    const errorResponse: ErrorResponse = {
      success: false,
      error: message,
      status: 401,
      timestamp: new Date().toISOString(),
      path,
      code: 'UNAUTHORIZED'
    };

    return NextResponse.json(errorResponse, { status: 401 });
  }

  /**
   * Trata erros de permissão
   */
  static handleForbiddenError(message: string = 'Acesso negado', path?: string): NextResponse<ErrorResponse> {
    const errorResponse: ErrorResponse = {
      success: false,
      error: message,
      status: 403,
      timestamp: new Date().toISOString(),
      path,
      code: 'FORBIDDEN'
    };

    return NextResponse.json(errorResponse, { status: 403 });
  }
}
