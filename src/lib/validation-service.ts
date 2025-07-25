/**
 * Serviço para validação de dados
 *
 * Este serviço utiliza o armazenamento persistente para validar dados.
 */

import { isEmailInUse, isPhoneInUse } from "./storage-service";

/**
 * Verifica se um email já está em uso
 */
export async function isEmailUnique(email: string): Promise<boolean> {
  console.log('Verificando se o email é único:', email);

  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Verifica se o email já existe no armazenamento
  return !isEmailInUse(email);
}

/**
 * Verifica se um número de telefone já está em uso
 */
export async function isPhoneUnique(phone: string): Promise<boolean> {
  console.log('Verificando se o telefone é único:', phone);

  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Verifica se o telefone já existe no armazenamento
  return !isPhoneInUse(phone);
}

/**
 * Formata um número de telefone para o formato (XX) XXXXX-XXXX
 */
export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');

  // Aplica a formatação
  if (numbers.length === 11) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  } else if (numbers.length === 10) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
  }

  // Se não tiver o formato esperado, retorna o original
  return phone;
}

/**
 * Valida um email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
