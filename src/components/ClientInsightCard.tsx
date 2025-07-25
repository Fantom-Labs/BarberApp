"use client";

import React from 'react';
import { ClientInsight } from '@/lib/client-analytics';
import { StoredUser, getUserById } from '@/lib/storage-service';
import ClientSegmentBadge from './ClientSegmentBadge';
import { FiCalendar, FiClock, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiUser } from 'react-icons/fi';

interface ClientInsightCardProps {
  insight: ClientInsight;
  onClick?: () => void;
  className?: string;
}

export default function ClientInsightCard({ insight, onClick, className = '' }: ClientInsightCardProps) {
  const client = getUserById(insight.clientId) as StoredUser;

  if (!client) {
    return null;
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para obter cor baseada no risco de perda
  const getChurnRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'text-green-500 dark:text-green-400';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'high':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Função para obter texto baseado no risco de perda
  const getChurnRiskText = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'Baixo';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base">{client.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{client.email}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className={`flex items-start ${getChurnRiskColor(insight.churnRisk)}`}>
            <FiAlertTriangle className="h-3.5 w-3.5 mr-1 mt-0.5" />
            <span className="text-xs font-medium">Risco: {getChurnRiskText(insight.churnRisk)}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Cliente desde {formatDate(client.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-start">
          <FiDollarSign className="h-4 w-4 text-primary mr-2 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Gasto</div>
            <div className="text-sm font-medium">R$ {insight.totalSpent.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-start">
          <FiTrendingUp className="h-4 w-4 text-primary mr-2 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Valor Vitalício</div>
            <div className="text-sm font-medium">R$ {insight.lifetimeValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-start">
          <FiCalendar className="h-4 w-4 text-primary mr-2 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Última Visita</div>
            <div className="text-sm font-medium">{insight.lastVisit ? formatDate(insight.lastVisit) : 'Nunca'}</div>
          </div>
        </div>

        <div className="flex items-start">
          <FiClock className="h-4 w-4 text-primary mr-2 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Próxima Visita</div>
            <div className="text-sm font-medium">{insight.nextVisitPrediction}</div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Segmentos</div>
        <div className="flex flex-wrap gap-1.5">
          {insight.segments.map((segment) => (
            <ClientSegmentBadge key={segment} segment={segment} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Abordagem Recomendada</div>
        <p className="text-xs">{insight.recommendedApproach}</p>
      </div>
    </div>
  );
}
