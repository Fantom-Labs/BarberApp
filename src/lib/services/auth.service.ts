/**
 * Serviço de autenticação unificado
 */

import { RegisterData } from '../types';
import { create, get, update } from './database.service';
import { hashPassword, verifyPassword } from './crypto.service';
import { User } from '../types';

export class AuthService {
  async registerUser(data: RegisterData): Promise<User> {
    const hashedPassword = await hashPassword(data.password);
    const { password, ...userData } = data;
    const user = await create('users', {
      ...userData,
      password_hash: hashedPassword,
      isActive: true,
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        emailNotifications: true
      }
    } as any);
    return user as unknown as User;
  }

  async verifyLocalPassword(email: string, password: string): Promise<boolean> {
    const users = await get('users', email);
    if (!users) return false;
    return verifyPassword(password, (users as any).password_hash);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await get('users', email);
    return user as unknown as User;
  }

  async updateUser(id: string, data: Partial<User & { password?: string }>): Promise<User> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    const updated = await update('users', id, data as any);
    return updated as unknown as User;
  }
}

// Funções de conveniência para compatibilidade
export async function login(email: string, password: string): Promise<User | null> {
  const authService = new AuthService();
  const isValid = await authService.verifyLocalPassword(email, password);
  if (isValid) {
    return await authService.getUserByEmail(email);
  }
  return null;
}

export async function logout(): Promise<void> {
  // Implementação básica de logout
  // Em uma aplicação real, você limparia tokens, sessões, etc.
  console.log('Logout realizado');
}

export async function register(data: RegisterData): Promise<User> {
  const authService = new AuthService();
  return await authService.registerUser(data);
}
