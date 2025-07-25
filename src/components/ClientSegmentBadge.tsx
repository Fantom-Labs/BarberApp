"use client";

import React from 'react';
import { clientSegments, getClientStatistics } from '@/lib/client-analytics';

interface ClientSegmentBadgeProps {
  segment: string;
  className?: string;
  showPercentage?: boolean;
}

export default function ClientSegmentBadge({ segment, className = '', showPercentage = false }: ClientSegmentBadgeProps) {
  // Encontrar a definição do segmento
  const segmentDef = clientSegments.find(s => s.name === segment);

  // Cor padrão caso o segmento não seja encontrado
  const colorClass = segmentDef?.color || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  // Calcular a porcentagem se necessário
  let percentageText = '';
  if (showPercentage) {
    const stats = getClientStatistics();
    const segmentCount = stats.segmentDistribution[segment] || 0;
    const totalClients = stats.totalClients;
    const percentage = totalClients > 0 ? Math.round((segmentCount / totalClients) * 100) : 0;
    percentageText = `${percentage}% `;
  }

  return (
    <span className={`px-1.5 py-0.5 text-xs rounded-full font-light flex items-center whitespace-nowrap ${colorClass} ${className}`}>
      {showPercentage && (
        <span className="font-normal mr-1">{percentageText}</span>
      )}
      <span className="truncate">{segment}</span>
    </span>
  );
}
