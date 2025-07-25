/**
 * Serviço de banco de dados
 *
 * Este serviço fornece uma camada de abstração para operações de banco de dados,
 * permitindo alternar facilmente entre localStorage e Supabase.
 */

import { cache } from './cache.service';
import { logger } from './logger.service';
// import { supabase } from '../config/supabase';
import { TableName } from '../types/database';
import type { Database } from '../types/database.types';

// Cache TTL em segundos
const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutos
  MEDIUM: 60 * 30, // 30 minutos
  LONG: 60 * 60 * 24, // 24 horas
};

/**
 * Cria um novo registro na tabela especificada
 */
export async function create<T extends keyof Database['public']['Tables']>(
  table: T,
  data: Database['public']['Tables'][T]['Insert']
): Promise<Database['public']['Tables'][T]['Row']> {
  throw new Error('Not implemented: create');
}

/**
 * Obtém um registro pelo ID na tabela especificada
 */
export async function get<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string
): Promise<Database['public']['Tables'][T]['Row'] | null> {
  throw new Error('Not implemented: get');
}

/**
 * Obtém todos os registros ativos de uma tabela
 */
export async function getAll<T extends keyof Database['public']['Tables']>(
  table: T
): Promise<Database['public']['Tables'][T]['Row'][]> {
  throw new Error('Not implemented: getAll');
}

/**
 * Atualiza um registro existente na tabela especificada
 */
export async function update<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string,
  data: Database['public']['Tables'][T]['Update']
): Promise<Database['public']['Tables'][T]['Row']> {
  throw new Error('Not implemented: update');
}

/**
 * Remove (soft delete) um registro na tabela especificada
 */
export async function remove<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string
): Promise<void> {
  throw new Error('Not implemented: remove');
}
