/**
 * Serviço de Análise de Clientes
 * 
 * Este serviço fornece funções para analisar dados de clientes,
 * incluindo segmentação, estatísticas e insights.
 */

import { cache, CacheKey, CacheType } from './cache.service';
import { 
  getAllClients, 
  getUserById, 
  getAllClientSegments,
  getClientsBySegment,
  UserType,
  User,
  ClientSegment
} from './user-registry.service';

// Interface para estatísticas de clientes
export interface ClientStatistics {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  atRiskClients: number;
  averageTicket: number;
  averageFrequency: number; // em dias
}

// Interface para distribuição de idade
export interface AgeDistribution {
  under18: number;
  age18to24: number;
  age25to34: number;
  age35to44: number;
  age45to54: number;
  age55plus: number;
}

// Interface para distribuição de segmentos
export interface SegmentDistribution {
  segmentId: string;
  segmentName: string;
  clientCount: number;
  percentage: number;
}

// Interface para insights de cliente
export interface ClientInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'info';
  title: string;
  description: string;
  clientIds: string[];
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  actionTaken: boolean;
}

/**
 * Obtém estatísticas gerais de clientes
 * @returns Estatísticas de clientes
 */
export function getClientStatistics(): ClientStatistics {
  // Verificar se há dados em cache
  const cachedStats = cache.get<ClientStatistics>(CacheKey.CLIENT_STATISTICS);
  if (cachedStats) {
    return cachedStats;
  }

  // Obter todos os clientes
  const clients = getAllClients();
  
  // Calcular estatísticas
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  let totalTicket = 0;
  let totalFrequency = 0;
  let frequencyCount = 0;
  
  const activeClients = clients.filter(client => {
    const isActive = client.clientData?.isActive ?? false;
    
    // Contribuir para o cálculo do ticket médio
    if (client.clientData?.totalSpent && client.clientData.totalVisits > 0) {
      totalTicket += client.clientData.totalSpent;
    }
    
    // Contribuir para o cálculo da frequência média
    if (client.clientData?.lastVisit && client.clientData.totalVisits > 1) {
      const lastVisitDate = new Date(client.clientData.lastVisit);
      const daysSinceLastVisit = Math.floor((now.getTime() - lastVisitDate.getTime()) / (24 * 60 * 60 * 1000));
      const averageVisitInterval = daysSinceLastVisit / client.clientData.totalVisits;
      
      totalFrequency += averageVisitInterval;
      frequencyCount++;
    }
    
    return isActive;
  });
  
  const inactiveClients = clients.filter(client => !(client.clientData?.isActive ?? true));
  
  const atRiskClients = clients.filter(client => {
    if (!client.clientData?.lastVisit) return false;
    
    const lastVisitDate = new Date(client.clientData.lastVisit);
    return client.clientData?.isActive && 
           lastVisitDate < thirtyDaysAgo && 
           (client.clientData?.riskLevel === 'medium' || client.clientData?.riskLevel === 'high');
  });
  
  const statistics: ClientStatistics = {
    totalClients: clients.length,
    activeClients: activeClients.length,
    inactiveClients: inactiveClients.length,
    atRiskClients: atRiskClients.length,
    averageTicket: clients.length > 0 ? totalTicket / clients.length : 0,
    averageFrequency: frequencyCount > 0 ? totalFrequency / frequencyCount : 0
  };
  
  // Armazenar em cache
  cache.set(CacheKey.CLIENT_STATISTICS, statistics, {
    type: CacheType.MEMORY,
    ttl: 5 * 60 * 1000 // 5 minutos
  });
  
  return statistics;
}

/**
 * Obtém a distribuição de idade dos clientes
 * @returns Distribuição de idade
 */
export function getAgeDistribution(): AgeDistribution {
  const clients = getAllClients();
  
  const distribution: AgeDistribution = {
    under18: 0,
    age18to24: 0,
    age25to34: 0,
    age35to44: 0,
    age45to54: 0,
    age55plus: 0
  };
  
  const now = new Date();
  const currentYear = now.getFullYear();
  
  clients.forEach(client => {
    if (!client.birthDate) return;
    
    const birthYear = new Date(client.birthDate).getFullYear();
    const age = currentYear - birthYear;
    
    if (age < 18) {
      distribution.under18++;
    } else if (age >= 18 && age <= 24) {
      distribution.age18to24++;
    } else if (age >= 25 && age <= 34) {
      distribution.age25to34++;
    } else if (age >= 35 && age <= 44) {
      distribution.age35to44++;
    } else if (age >= 45 && age <= 54) {
      distribution.age45to54++;
    } else {
      distribution.age55plus++;
    }
  });
  
  return distribution;
}

/**
 * Obtém a distribuição de clientes por segmento
 * @returns Distribuição de segmentos
 */
export function getSegmentDistribution(): SegmentDistribution[] {
  const segments = getAllClientSegments();
  const totalClients = getAllClients().length;
  
  if (totalClients === 0) {
    return [];
  }
  
  return segments.map(segment => {
    const clientsInSegment = getClientsBySegment(segment.id);
    
    return {
      segmentId: segment.id,
      segmentName: segment.name,
      clientCount: clientsInSegment.length,
      percentage: (clientsInSegment.length / totalClients) * 100
    };
  }).sort((a, b) => b.clientCount - a.clientCount);
}

/**
 * Gera insights baseados nos dados dos clientes
 * @returns Lista de insights
 */
export function generateClientInsights(): ClientInsight[] {
  // Verificar se há dados em cache
  const cachedInsights = cache.get<ClientInsight[]>(CacheKey.CLIENT_INSIGHTS);
  if (cachedInsights) {
    return cachedInsights;
  }
  
  const clients = getAllClients();
  const insights: ClientInsight[] = [];
  const now = new Date();
  
  // Insight 1: Clientes inativos há mais de 60 dias
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const inactiveClients = clients.filter(client => {
    if (!client.clientData?.lastVisit) return false;
    
    const lastVisitDate = new Date(client.clientData.lastVisit);
    return client.clientData.isActive && lastVisitDate < sixtyDaysAgo;
  });
  
  if (inactiveClients.length > 0) {
    insights.push({
      id: 'insight-inactive-clients',
      type: 'risk',
      title: 'Clientes inativos',
      description: `${inactiveClients.length} clientes não visitam a barbearia há mais de 60 dias.`,
      clientIds: inactiveClients.map(client => client.id),
      createdAt: now,
      priority: 'high',
      actionTaken: false
    });
  }
  
  // Insight 2: Clientes com alto valor
  const highValueClients = clients.filter(client => 
    client.clientData?.totalSpent && client.clientData.totalSpent > 500
  );
  
  if (highValueClients.length > 0) {
    insights.push({
      id: 'insight-high-value-clients',
      type: 'opportunity',
      title: 'Clientes de alto valor',
      description: `${highValueClients.length} clientes gastaram mais de R$ 500 na barbearia.`,
      clientIds: highValueClients.map(client => client.id),
      createdAt: now,
      priority: 'medium',
      actionTaken: false
    });
  }
  
  // Insight 3: Novos clientes nos últimos 30 dias
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const newClients = clients.filter(client => 
    client.createdAt > thirtyDaysAgo
  );
  
  if (newClients.length > 0) {
    insights.push({
      id: 'insight-new-clients',
      type: 'info',
      title: 'Novos clientes',
      description: `${newClients.length} novos clientes nos últimos 30 dias.`,
      clientIds: newClients.map(client => client.id),
      createdAt: now,
      priority: 'low',
      actionTaken: false
    });
  }
  
  // Armazenar em cache
  cache.set(CacheKey.CLIENT_INSIGHTS, insights, {
    type: CacheType.MEMORY,
    ttl: 30 * 60 * 1000 // 30 minutos
  });
  
  return insights;
}

/**
 * Obtém recomendações personalizadas para um cliente específico
 * @param clientId ID do cliente
 * @returns Lista de recomendações
 */
export function getClientRecommendations(clientId: string): string[] {
  const client = getUserById(clientId);
  
  if (!client || client.type !== UserType.CLIENT || !client.clientData) {
    return [];
  }
  
  const recommendations: string[] = [];
  
  // Recomendação 1: Serviços populares que o cliente ainda não experimentou
  const popularServices = ['Corte Masculino', 'Barba', 'Tratamento Capilar', 'Coloração'];
  const unusedServices = popularServices.filter(service => 
    !client.clientData?.favoriteServices.includes(service)
  );
  
  if (unusedServices.length > 0) {
    recommendations.push(`Experimente ${unusedServices[0]}, um dos nossos serviços mais populares.`);
  }
  
  // Recomendação 2: Pacotes para clientes frequentes
  if (client.clientData.totalVisits >= 5) {
    recommendations.push('Conheça nosso pacote de fidelidade com 10% de desconto em todos os serviços.');
  }
  
  // Recomendação 3: Produtos relacionados aos serviços favoritos
  if (client.clientData.favoriteServices.includes('Barba')) {
    recommendations.push('Experimente nosso óleo para barba premium para manter sua barba sempre impecável.');
  }
  
  if (client.clientData.favoriteServices.includes('Tratamento Capilar')) {
    recommendations.push('Conheça nossa linha de produtos para tratamento capilar para usar em casa.');
  }
  
  return recommendations;
}

/**
 * Marca um insight como tratado
 * @param insightId ID do insight
 * @returns true se o insight foi marcado como tratado, false caso contrário
 */
export function markInsightAsActioned(insightId: string): boolean {
  const insights = cache.get<ClientInsight[]>(CacheKey.CLIENT_INSIGHTS);
  
  if (!insights) {
    return false;
  }
  
  const insightIndex = insights.findIndex(insight => insight.id === insightId);
  
  if (insightIndex === -1) {
    return false;
  }
  
  insights[insightIndex].actionTaken = true;
  
  // Atualizar o cache
  cache.set(CacheKey.CLIENT_INSIGHTS, insights, {
    type: CacheType.MEMORY,
    ttl: 30 * 60 * 1000 // 30 minutos
  });
  
  return true;
}
