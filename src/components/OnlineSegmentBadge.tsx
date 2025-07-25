"use client";

import React from 'react';

// Definição dos segmentos de atendimento online
export const onlineSegments = [
  { id: 'new_contact', name: 'Primeiro Contato', color: 'blue', percentage: 25 },
  { id: 'price_inquiry', name: 'Consulta de Preços', color: 'green', percentage: 30 },
  { id: 'appointment_request', name: 'Agendamento', color: 'purple', percentage: 20 },
  { id: 'product_inquiry', name: 'Produtos', color: 'amber', percentage: 15 },
  { id: 'complaint', name: 'Reclamação', color: 'red', percentage: 5 },
  { id: 'feedback', name: 'Feedback', color: 'teal', percentage: 5 }
];

interface OnlineSegmentBadgeProps {
  segment: string;
  className?: string;
  showPercentage?: boolean;
}

export default function OnlineSegmentBadge({ segment, className = '', showPercentage = false }: OnlineSegmentBadgeProps) {
  // Encontrar o segmento correspondente
  const segmentInfo = onlineSegments.find(s => s.id === segment) || 
                      onlineSegments.find(s => s.name.toLowerCase() === segment.toLowerCase());
  
  if (!segmentInfo) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${className}`}>
        {segment}
      </span>
    );
  }

  // Mapear cores para classes do Tailwind
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  const colorClass = colorMap[segmentInfo.color] || colorMap.gray;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {showPercentage && (
        <span className="mr-1 font-normal">{segmentInfo.percentage}%</span>
      )}
      {segmentInfo.name}
    </span>
  );
}
