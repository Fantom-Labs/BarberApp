/**
 * Serviço de criptografia
 * 
 * Este serviço fornece funções para hash e verificação de senhas
 * usando bcrypt para segurança.
 */

import bcrypt from 'bcryptjs';

// Número de rounds para o salt do bcrypt (maior = mais seguro, mas mais lento)
const SALT_ROUNDS = 10;

/**
 * Gera um hash seguro para uma senha
 * 
 * @param password Senha em texto puro
 * @returns Hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Gerar um salt aleatório
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    
    // Gerar o hash da senha com o salt
    const hash = await bcrypt.hash(password, salt);
    
    return hash;
  } catch (error) {
    console.error('Erro ao gerar hash da senha:', error);
    throw new Error('Falha ao processar senha');
  }
}

/**
 * Verifica se uma senha corresponde a um hash
 * 
 * @param password Senha em texto puro
 * @param hash Hash armazenado
 * @returns true se a senha corresponder ao hash, false caso contrário
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
}

/**
 * Gera um token aleatório para recuperação de senha ou confirmação de email
 * 
 * @param length Comprimento do token (padrão: 32 caracteres)
 * @returns Token aleatório
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}
