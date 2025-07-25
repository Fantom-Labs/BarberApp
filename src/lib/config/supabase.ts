/**
 * Configuração do Supabase
 * 
 * Este arquivo configura o cliente Supabase para uso em toda a aplicação.
 * Ele verifica se as variáveis de ambiente necessárias estão definidas e
 * cria uma instância do cliente Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Variáveis de ambiente do Supabase não encontradas. Usando localStorage para armazenamento.'
    );
  }
}

// Criar cliente Supabase apenas se as variáveis de ambiente estiverem definidas
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Verifica se o Supabase está configurado e disponível
 */
export function isSupabaseAvailable(): boolean {
  return !!supabase;
}

/**
 * Inicializa o Supabase e configura listeners para eventos de autenticação
 */
export function initSupabase(): void {
  if (!supabase) return;

  // Configurar listeners para eventos de autenticação
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('Usuário autenticado:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('Usuário desconectado');
    }
  });
}

// Inicializar Supabase no lado do cliente
if (typeof window !== 'undefined') {
  initSupabase();
}
