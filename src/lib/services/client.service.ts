/**
 * Serviço de clientes
 *
 * Este serviço gerencia todas as operações relacionadas a clientes,
 * incluindo atualização de dados e interações.
 */

import { User, ClientInteraction } from '../types';
import { get, update, getAll } from './database.service';
import { cache } from './cache.service';
import { logger } from './logger.service';

// Cache TTL em segundos
const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutos
  MEDIUM: 15 * 60, // 15 minutos
  LONG: 60 * 60, // 1 hora
};

/**
 * Obtém todos os clientes
 */
export async function getAllClients(): Promise<User[]> {
  const cacheKey = 'all_clients';

  // Tentar obter do cache primeiro
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData as User[];

  const users = await getAll<'users'>('users');
  const clients = users.filter((user: any) => user.type === 'client');

  cache.set(cacheKey, clients, { ttl: CACHE_TTL.SHORT });
  return clients as unknown as User[];
}

/**
 * Obtém um cliente pelo ID
 */
export async function getClientById(id: string): Promise<User | null> {
  const cacheKey = `client_${id}`;

  // Tentar obter do cache primeiro
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData as User;

  const user = await get<'users'>('users', id);
  if (!user || (user as any).type !== 'client') return null;

  cache.set(cacheKey, user, { ttl: CACHE_TTL.MEDIUM });
  return user as unknown as User;
}

/**
 * Obtém as interações de um cliente
 */
export async function getClientInteractions(clientId: string): Promise<ClientInteraction[]> {
  const cacheKey = `client_interactions_${clientId}`;

  // Tentar obter do cache primeiro
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData as ClientInteraction[];

  const interactions = await getAll<'client_interactions'>('client_interactions');
  const filtered = interactions.filter((interaction: any) => interaction.client_id === clientId);

  cache.set(cacheKey, filtered, { ttl: CACHE_TTL.SHORT });
  return filtered as unknown as ClientInteraction[];
}

/**
 * Adiciona uma nova interação com o cliente
 */
export async function addClientInteraction(interaction: Omit<ClientInteraction, 'id'>): Promise<ClientInteraction> {
  const newInteraction: ClientInteraction = {
    id: `interaction-${Date.now()}`,
    ...interaction,
    date: new Date().toISOString()
  };

  // Invalidar cache de interações
  cache.remove(`client_interactions_${interaction.clientId}`);

  return newInteraction;
}

/**
 * Atualiza os dados do cliente
 */
export async function updateClientData(id: string, data: Partial<User>): Promise<User | null> {
  const user = await getClientById(id);
  if (!user) return null;

  const updatedUser = await update<'users'>('users', id, {
    ...data,
    updated_at: new Date().toISOString()
  } as any);

  if (updatedUser) {
    // Invalidar caches
    cache.remove(`client_${id}`);
    cache.remove('all_clients');
  }

  return updatedUser as unknown as User;
}

/**
 * Desativa um cliente
 */
export async function deactivateClient(id: string): Promise<boolean> {
  const user = await getClientById(id);
  if (!user) return false;

  const updatedUser = await update<'users'>('users', id, {
    is_active: false,
    updated_at: new Date().toISOString()
  } as any);

  if (updatedUser) {
    // Invalidar caches
    cache.remove(`client_${id}`);
    cache.remove('all_clients');
    return true;
  }

  return false;
}

/**
 * Gera insights sobre um cliente específico
 */
export async function generateClientInsight(clientId: string): Promise<any> {
  try {
    const client = await getClientById(clientId);
    const interactions = await getClientInteractions(clientId);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Análise básica de interações
    const totalInteractions = interactions.length;
    const recentInteractions = interactions.filter(
      interaction => new Date(interaction.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      clientId,
      totalInteractions,
      recentInteractions,
      engagementLevel: recentInteractions > 5 ? 'Alto' : recentInteractions > 2 ? 'Médio' : 'Baixo',
      lastInteraction: interactions.length > 0 ? interactions[interactions.length - 1].date : null
    };
  } catch (error) {
    logger.error('Erro ao gerar insight do cliente:', error);
    throw error;
  }
}

/**
 * Obtém o segmento de um cliente baseado em suas características
 */
export async function getClientSegment(clientId: string): Promise<string> {
  try {
    const client = await getClientById(clientId);
    const interactions = await getClientInteractions(clientId);
    
    if (!client) {
      return 'Desconhecido';
    }

    const totalInteractions = interactions.length;
    const recentInteractions = interactions.filter(
      interaction => new Date(interaction.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    if (totalInteractions > 10 && recentInteractions > 5) {
      return 'Cliente Fiel';
    } else if (totalInteractions > 5 && recentInteractions > 2) {
      return 'Cliente Regular';
    } else if (totalInteractions > 0) {
      return 'Cliente Ocasional';
    } else {
      return 'Cliente Novo';
    }
  } catch (error) {
    logger.error('Erro ao obter segmento do cliente:', error);
    return 'Desconhecido';
  }
}

/**
 * Obtém clientes por segmento
 */
export async function getClientsBySegment(segment: string): Promise<User[]> {
  try {
    const clients = await getAllClients();
    const segmentClients: User[] = [];
    
    for (const client of clients) {
      const clientSegment = await getClientSegment(client.id);
      if (clientSegment === segment) {
        segmentClients.push(client);
      }
    }
    
    return segmentClients;
  } catch (error) {
    logger.error('Erro ao obter clientes por segmento:', error);
    return [];
  }
}

/**
 * Obtém clientes em risco (sem interações recentes)
 */
export async function getClientsAtRisk(): Promise<User[]> {
  try {
    const clients = await getAllClients();
    const atRiskClients: User[] = [];
    
    for (const client of clients) {
      const interactions = await getClientInteractions(client.id);
      const recentInteractions = interactions.filter(
        interaction => new Date(interaction.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      );
      
      if (recentInteractions.length === 0) {
        atRiskClients.push(client);
      }
    }
    
    return atRiskClients;
  } catch (error) {
    logger.error('Erro ao obter clientes em risco:', error);
    return [];
  }
}

/**
 * Obtém clientes para follow-up
 */
export async function getClientsForFollowUp(): Promise<User[]> {
  try {
    const clients = await getAllClients();
    const followUpClients: User[] = [];
    
    for (const client of clients) {
      const interactions = await getClientInteractions(client.id);
      const recentInteractions = interactions.filter(
        interaction => new Date(interaction.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      if (recentInteractions.length > 0) {
        followUpClients.push(client);
      }
    }
    
    return followUpClients;
  } catch (error) {
    logger.error('Erro ao obter clientes para follow-up:', error);
    return [];
  }
}

/**
 * Gera insights para todos os clientes
 */
export async function generateAllClientInsights(): Promise<any[]> {
  try {
    const clients = await getAllClients();
    const insights = [];
    
    for (const client of clients) {
      const insight = await generateClientInsight(client.id);
      insights.push(insight);
    }
    
    return insights;
  } catch (error) {
    logger.error('Erro ao gerar insights para todos os clientes:', error);
    return [];
  }
}

/**
 * Obtém estatísticas dos clientes
 */
export async function getClientStatistics(): Promise<any> {
  try {
    const clients = await getAllClients();
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.isActive).length;
    
    const segments = {
      new: 0,
      regular: 0,
      vip: 0,
      inactive: 0
    };
    
    for (const client of clients) {
      const segment = await getClientSegment(client.id);
      if (segment === 'Cliente Novo') segments.new++;
      else if (segment === 'Cliente Regular') segments.regular++;
      else if (segment === 'Cliente Fiel') segments.vip++;
      else segments.inactive++;
    }
    
    return {
      totalClients,
      activeClients,
      inactiveClients: totalClients - activeClients,
      segments
    };
  } catch (error) {
    logger.error('Erro ao obter estatísticas dos clientes:', error);
    return {
      totalClients: 0,
      activeClients: 0,
      inactiveClients: 0,
      segments: { new: 0, regular: 0, vip: 0, inactive: 0 }
    };
  }
}
