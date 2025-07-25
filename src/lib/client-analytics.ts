/**
 * Sistema de análise de clientes e CRM
 *
 * Este módulo fornece funções para análise de comportamento de clientes,
 * segmentação, e recomendações para abordagem personalizada.
 */

import { StoredUser, AppointmentSummary, getAllUsers } from './storage-service';
import { sampleOrders, Order } from './orders';

// Tipos de dados para análise de clientes

export interface ClientInteraction {
  id: string;
  clientId: string;
  type: 'appointment' | 'purchase' | 'course' | 'website_visit' | 'message';
  date: string;
  value?: number;
  details: string;
  source?: string;
}

export interface ClientSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    minVisits?: number;
    maxVisits?: number;
    minSpending?: number;
    maxSpending?: number;
    lastVisitDays?: number;
    preferredServices?: string[];
    ageRange?: [number, number];
  };
  color: string;
}

export interface ClientInsight {
  clientId: string;
  visitFrequency: number; // média de dias entre visitas
  lastVisit: string;
  totalSpent: number;
  preferredServices: Array<{service: string, count: number}>;
  preferredBarbers: Array<{barber: string, count: number}>;
  purchaseHistory: {
    count: number;
    averageValue: number;
    lastPurchase: string;
  };
  segments: string[];
  recommendedApproach: string;
  nextVisitPrediction: string;
  churnRisk: 'low' | 'medium' | 'high';
  lifetimeValue: number;
}

// Dados de exemplo para interações
const sampleInteractions: ClientInteraction[] = [
  {
    id: 'int-001',
    clientId: 'user-lucas-gomes',
    type: 'appointment',
    date: '2025-04-15T14:00:00Z',
    value: 50,
    details: 'Corte de Cabelo',
    source: 'app'
  },
  {
    id: 'int-002',
    clientId: 'user-lucas-gomes',
    type: 'appointment',
    date: '2025-03-15T10:00:00Z',
    value: 85,
    details: 'Corte + Barba',
    source: 'app'
  },
  {
    id: 'int-003',
    clientId: 'user-lucas-gomes',
    type: 'purchase',
    date: '2025-03-20T16:30:00Z',
    value: 45.90,
    details: 'Pomada Modeladora',
    source: 'loja'
  },
  {
    id: 'int-004',
    clientId: 'user-joao-silva',
    type: 'appointment',
    date: '2025-04-10T11:00:00Z',
    value: 35,
    details: 'Barba',
    source: 'app'
  },
  {
    id: 'int-005',
    clientId: 'user-joao-silva',
    type: 'appointment',
    date: '2025-03-10T11:00:00Z',
    value: 35,
    details: 'Barba',
    source: 'app'
  },
  {
    id: 'int-006',
    clientId: 'user-joao-silva',
    type: 'appointment',
    date: '2025-02-10T11:00:00Z',
    value: 35,
    details: 'Barba',
    source: 'app'
  },
  {
    id: 'int-007',
    clientId: 'user-pedro-santos',
    type: 'appointment',
    date: '2025-04-05T15:30:00Z',
    value: 50,
    details: 'Corte de Cabelo',
    source: 'app'
  },
  {
    id: 'int-008',
    clientId: 'user-pedro-santos',
    type: 'purchase',
    date: '2025-04-05T16:00:00Z',
    value: 120,
    details: 'Kit Barba Completo',
    source: 'loja'
  },
  {
    id: 'int-009',
    clientId: 'user-maria-oliveira',
    type: 'appointment',
    date: '2025-04-12T09:00:00Z',
    value: 120,
    details: 'Coloração',
    source: 'telefone'
  },
  {
    id: 'int-010',
    clientId: 'user-ana-costa',
    type: 'course',
    date: '2025-03-25T00:00:00Z',
    value: 199,
    details: 'Curso de Cuidados com o Cabelo',
    source: 'site'
  },
  {
    id: 'int-011',
    clientId: 'user-carlos-mendes',
    type: 'appointment',
    date: '2025-04-08T17:00:00Z',
    value: 85,
    details: 'Corte + Barba',
    source: 'app'
  },
  {
    id: 'int-012',
    clientId: 'user-carlos-mendes',
    type: 'appointment',
    date: '2025-03-08T17:00:00Z',
    value: 85,
    details: 'Corte + Barba',
    source: 'app'
  },
  {
    id: 'int-013',
    clientId: 'user-carlos-mendes',
    type: 'appointment',
    date: '2025-02-08T17:00:00Z',
    value: 85,
    details: 'Corte + Barba',
    source: 'app'
  },
  {
    id: 'int-014',
    clientId: 'user-carlos-mendes',
    type: 'appointment',
    date: '2025-01-08T17:00:00Z',
    value: 85,
    details: 'Corte + Barba',
    source: 'app'
  },
  {
    id: 'int-015',
    clientId: 'user-roberto-almeida',
    type: 'appointment',
    date: '2025-03-30T10:00:00Z',
    value: 50,
    details: 'Corte de Cabelo',
    source: 'telefone'
  },
  {
    id: 'int-016',
    clientId: 'user-julia-ferreira',
    type: 'website_visit',
    date: '2025-04-02T14:20:00Z',
    details: 'Visitou página de serviços',
    source: 'site'
  }
];

// Segmentos de clientes pré-definidos
export const clientSegments: ClientSegment[] = [
  {
    id: 'segment-1',
    name: 'Cliente Fiel',
    description: 'Clientes que visitam regularmente (pelo menos uma vez por mês)',
    criteria: {
      minVisits: 4,
      lastVisitDays: 45
    },
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  {
    id: 'segment-2',
    name: 'Alto Valor',
    description: 'Clientes que gastam acima da média',
    criteria: {
      minSpending: 200
    },
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  },
  {
    id: 'segment-3',
    name: 'Em Risco',
    description: 'Clientes que não visitam há mais de 60 dias',
    criteria: {
      lastVisitDays: 60
    },
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  {
    id: 'segment-4',
    name: 'Novo Cliente',
    description: 'Clientes com menos de 3 visitas',
    criteria: {
      maxVisits: 2
    },
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  {
    id: 'segment-5',
    name: 'Jovem Adulto',
    description: 'Clientes entre 18 e 25 anos',
    criteria: {
      ageRange: [18, 25]
    },
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  },
  {
    id: 'segment-6',
    name: 'Potencial Upgrade',
    description: 'Clientes que podem ser incentivados a experimentar serviços premium',
    criteria: {
      minVisits: 2,
      maxSpending: 150
    },
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  },
  {
    id: 'segment-7',
    name: 'Cliente Inativo',
    description: 'Clientes que não visitam há mais de 90 dias',
    criteria: {
      lastVisitDays: 90
    },
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
];

// Abordagens recomendadas para diferentes segmentos
const approachStrategies = {
  'Cliente Fiel': 'Ofereça um programa de fidelidade com descontos exclusivos. Agradeça pela lealdade e peça feedback para melhorias.',
  'Alto Valor': 'Ofereça experiências VIP e acesso antecipado a novos serviços. Considere um atendimento personalizado.',
  'Em Risco': 'Envie uma mensagem perguntando como está e ofereça um desconto especial para retorno. Mencione novidades da barbearia.',
  'Novo Cliente': 'Dê boas-vindas e explique todos os serviços disponíveis. Ofereça um pequeno desconto na próxima visita.',
  'Jovem Adulto': 'Comunique-se de forma descontraída e ofereça tendências modernas. Destaque a presença nas redes sociais.',
  'Potencial Upgrade': 'Sugira experimentar serviços premium com um desconto especial na primeira experiência.',
  'Cliente Inativo': 'Envie uma oferta especial de "Estamos com saudades" com desconto significativo. Mencione as novidades e mudanças positivas desde a última visita.'
};

/**
 * Obtém todas as interações de um cliente
 */
export function getClientInteractions(clientId: string): ClientInteraction[] {
  return sampleInteractions.filter(interaction => interaction.clientId === clientId);
}

/**
 * Obtém todas as interações de todos os clientes
 */
export function getAllInteractions(): ClientInteraction[] {
  return sampleInteractions;
}

/**
 * Calcula a idade a partir da data de nascimento
 */
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calcula o número de dias desde uma data
 */
function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determina os segmentos de um cliente
 * Permite que um cliente pertença a múltiplos segmentos simultaneamente
 */
function determineClientSegments(client: StoredUser, interactions: ClientInteraction[]): string[] {
  const segments: string[] = [];

  // Calcular métricas para segmentação
  const visits = interactions.filter(i => i.type === 'appointment').length;
  const totalSpent = interactions.reduce((sum, i) => sum + (i.value || 0), 0);

  // Ordenar interações por data (mais recente primeiro)
  const sortedInteractions = [...interactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastVisitInteraction = sortedInteractions.find(i => i.type === 'appointment');
  const lastVisitDays = lastVisitInteraction ? daysSince(lastVisitInteraction.date) : 999;

  // Verificar cada segmento independentemente
  // Um cliente pode pertencer a múltiplos segmentos
  for (const segment of clientSegments) {
    let matches = true;

    // Verificar critérios específicos para cada segmento
    switch(segment.name) {
      case 'Cliente Fiel':
        // Cliente fiel deve ter visitas regulares
        if (visits < 4 || lastVisitDays > 45) {
          matches = false;
        }
        break;

      case 'Alto Valor':
        // Cliente de alto valor gasta acima da média
        if (totalSpent < 200) {
          matches = false;
        }
        break;

      case 'Em Risco':
        // Cliente em risco não visita entre 60-90 dias
        if (lastVisitDays < 60 || lastVisitDays >= 90) {
          matches = false;
        }
        break;

      case 'Cliente Inativo':
        // Cliente inativo não visita há mais de 90 dias
        if (lastVisitDays < 90) {
          matches = false;
        }
        break;

      case 'Novo Cliente':
        // Novo cliente tem poucas visitas
        if (visits > 2) {
          matches = false;
        }
        break;

      case 'Jovem Adulto':
        // Jovem adulto está na faixa etária específica
        if (!client.birthDate) {
          matches = false;
        } else {
          const age = calculateAge(client.birthDate);
          if (age < 18 || age > 25) {
            matches = false;
          }
        }
        break;

      case 'Potencial Upgrade':
        // Potencial upgrade tem visitas regulares mas gasto moderado
        if (visits < 2 || totalSpent > 150) {
          matches = false;
        }
        break;

      default:
        // Para outros segmentos, usar a lógica genérica baseada em critérios
        if (segment.criteria.minVisits !== undefined && visits < segment.criteria.minVisits) {
          matches = false;
        }

        if (segment.criteria.maxVisits !== undefined && visits > segment.criteria.maxVisits) {
          matches = false;
        }

        if (segment.criteria.minSpending !== undefined && totalSpent < segment.criteria.minSpending) {
          matches = false;
        }

        if (segment.criteria.maxSpending !== undefined && totalSpent > segment.criteria.maxSpending) {
          matches = false;
        }

        if (segment.criteria.lastVisitDays !== undefined && lastVisitDays < segment.criteria.lastVisitDays) {
          matches = false;
        }

        if (segment.criteria.ageRange !== undefined && client.birthDate) {
          const age = calculateAge(client.birthDate);
          if (age < segment.criteria.ageRange[0] || age > segment.criteria.ageRange[1]) {
            matches = false;
          }
        }
        break;
    }

    if (matches) {
      segments.push(segment.name);
    }
  }

  return segments;
}

/**
 * Calcula a frequência média de visitas em dias
 */
function calculateVisitFrequency(interactions: ClientInteraction[]): number {
  const appointments = interactions
    .filter(i => i.type === 'appointment')
    .map(i => new Date(i.date).getTime())
    .sort((a, b) => a - b);

  if (appointments.length <= 1) {
    return 0; // Não há dados suficientes
  }

  let totalDays = 0;
  for (let i = 1; i < appointments.length; i++) {
    const daysDiff = (appointments[i] - appointments[i-1]) / (1000 * 60 * 60 * 24);
    totalDays += daysDiff;
  }

  return Math.round(totalDays / (appointments.length - 1));
}

/**
 * Determina o risco de perda do cliente
 */
function determineChurnRisk(interactions: ClientInteraction[], visitFrequency: number): 'low' | 'medium' | 'high' {
  if (interactions.length === 0) return 'high';

  // Ordenar interações por data (mais recente primeiro)
  const sortedInteractions = [...interactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastInteraction = sortedInteractions[0];
  const daysSinceLastInteraction = daysSince(lastInteraction.date);

  if (visitFrequency === 0) {
    // Não temos dados suficientes para calcular a frequência
    return interactions.length <= 1 ? 'medium' : 'low';
  }

  // Se o cliente não visita há mais de 2x sua frequência média
  if (daysSinceLastInteraction > visitFrequency * 2) {
    return 'high';
  }

  // Se o cliente não visita há mais de 1.5x sua frequência média
  if (daysSinceLastInteraction > visitFrequency * 1.5) {
    return 'medium';
  }

  return 'low';
}

/**
 * Calcula o valor vitalício estimado do cliente
 */
function calculateLifetimeValue(interactions: ClientInteraction[]): number {
  const totalSpent = interactions.reduce((sum, i) => sum + (i.value || 0), 0);
  const monthsSinceFirstInteraction = interactions.length > 0
    ? daysSince(interactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date) / 30
    : 0;

  if (monthsSinceFirstInteraction <= 0) return 0;

  // Valor médio mensal x 24 meses (2 anos de projeção)
  const monthlyValue = totalSpent / monthsSinceFirstInteraction;
  return Math.round(monthlyValue * 24);
}

/**
 * Gera insights para um cliente específico
 */
export function generateClientInsights(clientId: string): ClientInsight | null {
  const client = getAllUsers().find(user => user.id === clientId);
  if (!client) return null;

  const interactions = getClientInteractions(clientId);
  if (interactions.length === 0) {
    // Cliente sem interações - criar insight básico
    return {
      clientId,
      visitFrequency: 0,
      lastVisit: '',
      totalSpent: 0,
      preferredServices: [],
      preferredBarbers: [],
      purchaseHistory: {
        count: 0,
        averageValue: 0,
        lastPurchase: ''
      },
      segments: ['Novo Cliente'],
      recommendedApproach: approachStrategies['Novo Cliente'],
      nextVisitPrediction: 'Indeterminado - sem histórico de visitas',
      churnRisk: 'medium',
      lifetimeValue: 0
    };
  }

  // Calcular métricas básicas
  const visitFrequency = calculateVisitFrequency(interactions);
  const appointmentInteractions = interactions.filter(i => i.type === 'appointment');
  const purchaseInteractions = interactions.filter(i => i.type === 'purchase');

  // Ordenar interações por data (mais recente primeiro)
  const sortedInteractions = [...interactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastVisitInteraction = appointmentInteractions.length > 0
    ? [...appointmentInteractions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const lastPurchaseInteraction = purchaseInteractions.length > 0
    ? [...purchaseInteractions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  // Calcular serviços preferidos
  const serviceCount: Record<string, number> = {};
  const barberCount: Record<string, number> = {};

  for (const interaction of appointmentInteractions) {
    // Contar serviços
    serviceCount[interaction.details] = (serviceCount[interaction.details] || 0) + 1;

    // Extrair e contar barbeiros (assumindo que o barbeiro está no final do detalhe do agendamento)
    if (client.appointments && client.appointments.length > 0) {
      const appointment = client.appointments.find(a => a.date === interaction.date);
      if (appointment && appointment.barber) {
        barberCount[appointment.barber] = (barberCount[appointment.barber] || 0) + 1;
      }
    }
  }

  // Converter contagens em arrays ordenados
  const preferredServices = Object.entries(serviceCount)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  const preferredBarbers = Object.entries(barberCount)
    .map(([barber, count]) => ({ barber, count }))
    .sort((a, b) => b.count - a.count);

  // Calcular total gasto
  const totalSpent = interactions.reduce((sum, i) => sum + (i.value || 0), 0);

  // Determinar segmentos do cliente
  const segments = determineClientSegments(client, interactions);

  // Determinar abordagem recomendada baseada no segmento principal
  const primarySegment = segments.length > 0 ? segments[0] : 'Novo Cliente';
  const recommendedApproach = approachStrategies[primarySegment as keyof typeof approachStrategies] ||
    'Aborde de forma amigável e pergunte sobre suas necessidades.';

  // Calcular risco de perda
  const churnRisk = determineChurnRisk(interactions, visitFrequency);

  // Calcular valor vitalício estimado
  const lifetimeValue = calculateLifetimeValue(interactions);

  // Prever próxima visita
  let nextVisitPrediction = 'Indeterminado';
  if (lastVisitInteraction && visitFrequency > 0) {
    const lastVisitDate = new Date(lastVisitInteraction.date);
    const predictedNextVisit = new Date(lastVisitDate);
    predictedNextVisit.setDate(lastVisitDate.getDate() + visitFrequency);

    nextVisitPrediction = predictedNextVisit.toLocaleDateString('pt-BR');
  }

  return {
    clientId,
    visitFrequency,
    lastVisit: lastVisitInteraction ? lastVisitInteraction.date : '',
    totalSpent,
    preferredServices,
    preferredBarbers,
    purchaseHistory: {
      count: purchaseInteractions.length,
      averageValue: purchaseInteractions.length > 0
        ? Math.round(purchaseInteractions.reduce((sum, i) => sum + (i.value || 0), 0) / purchaseInteractions.length)
        : 0,
      lastPurchase: lastPurchaseInteraction ? lastPurchaseInteraction.date : ''
    },
    segments,
    recommendedApproach,
    nextVisitPrediction,
    churnRisk,
    lifetimeValue
  };
}

/**
 * Gera insights para todos os clientes
 */
export function generateAllClientInsights(): ClientInsight[] {
  const clients = getAllUsers().filter(user => user.type === 'client');
  return clients.map(client => generateClientInsights(client.id)).filter(Boolean) as ClientInsight[];
}

/**
 * Obtém clientes por segmento
 */
export function getClientsBySegment(segmentName: string): ClientInsight[] {
  const allInsights = generateAllClientInsights();
  return allInsights.filter(insight => insight.segments.includes(segmentName));
}

/**
 * Obtém clientes em risco de abandono
 */
export function getClientsAtRisk(): ClientInsight[] {
  const allInsights = generateAllClientInsights();
  return allInsights.filter(insight => insight.churnRisk === 'high');
}

/**
 * Obtém clientes que estão próximos da data prevista para retorno
 */
export function getClientsForFollowUp(): ClientInsight[] {
  const allInsights = generateAllClientInsights();
  const today = new Date();

  return allInsights.filter(insight => {
    if (!insight.nextVisitPrediction || insight.nextVisitPrediction === 'Indeterminado') {
      return false;
    }

    const [day, month, year] = insight.nextVisitPrediction.split('/').map(Number);
    const predictedDate = new Date(year, month - 1, day);

    // Clientes cuja data prevista está entre hoje e 7 dias no futuro
    const diffDays = Math.floor((predictedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });
}

/**
 * Obtém os melhores clientes por valor gasto
 */
export function getTopClients(limit: number = 5): ClientInsight[] {
  const allInsights = generateAllClientInsights();
  return [...allInsights].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
}

/**
 * Obtém estatísticas gerais de clientes
 */
export function getClientStatistics() {
  // Usar dados reais se disponíveis, caso contrário usar dados simulados
  const allInsights = generateAllClientInsights();

  // Se temos dados reais suficientes, use-os
  if (allInsights.length > 10) {
    // Total de clientes
    const totalClients = allInsights.length;

    // Clientes ativos (visitaram nos últimos 60 dias)
    const activeClients = allInsights.filter(insight => {
      if (!insight.lastVisit) return false;
      return daysSince(insight.lastVisit) <= 60;
    }).length;

    // Clientes inativos (não visitam há mais de 90 dias)
    const inactiveClients = allInsights.filter(insight => {
      if (!insight.lastVisit) return true; // Sem visitas = inativo
      return daysSince(insight.lastVisit) > 90;
    }).length;

    // Valor médio por cliente
    const totalValue = allInsights.reduce((sum, insight) => sum + insight.totalSpent, 0);
    const averageValue = totalClients > 0 ? Math.round(totalValue / totalClients) : 0;

    // Frequência média de visitas
    const totalFrequency = allInsights.reduce((sum, insight) => sum + insight.visitFrequency, 0);
    const averageFrequency = totalClients > 0 ? Math.round(totalFrequency / totalClients) : 0;

    // Clientes em risco
    const atRiskClients = allInsights.filter(insight => insight.churnRisk === 'high').length;

    // Distribuição por segmentos
    const segmentDistribution: Record<string, number> = {};
    for (const insight of allInsights) {
      for (const segment of insight.segments) {
        segmentDistribution[segment] = (segmentDistribution[segment] || 0) + 1;
      }
    }

    return {
      totalClients,
      activeClients,
      inactiveClients,
      averageValue,
      averageFrequency,
      atRiskClients,
      segmentDistribution
    };
  }

  // Caso contrário, use dados simulados para demonstração
  return {
    totalClients: 187,
    activeClients: 124,
    inactiveClients: 42,
    averageValue: 185.50,
    averageFrequency: 28,
    atRiskClients: 21,
    segmentDistribution: {
      'Cliente Fiel': 68,
      'Alto Valor': 35,
      'Em Risco': 21,
      'Cliente Inativo': 42,
      'Novo Cliente': 32,
      'Jovem Adulto': 45,
      'Potencial Upgrade': 29
    }
  };
}
