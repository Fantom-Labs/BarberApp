"use client";

import React from 'react';
import OnlineSegmentBadge, { onlineSegments } from './OnlineSegmentBadge';

interface OnlineSegmentCardProps {
  className?: string;
  onSelectSegment?: (segment: string) => void;
  selectedSegment?: string | null;
}

export default function OnlineSegmentCard({ 
  className = '', 
  onSelectSegment,
  selectedSegment
}: OnlineSegmentCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-sm font-medium mb-3">Segmentação de Atendimento</h3>
      
      <div className="space-y-1">
        {onlineSegments.map((segment) => (
          <button
            key={segment.id}
            onClick={() => onSelectSegment && onSelectSegment(segment.id)}
            className={`w-full text-left hover:bg-gray-50 dark:hover:bg-gray-750 py-1.5 px-2 rounded-md transition-colors ${
              selectedSegment === segment.id ? 'bg-gray-50 dark:bg-gray-750' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-1 min-w-0">
                <OnlineSegmentBadge segment={segment.id} className="mr-1.5" showPercentage={true} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-1">
                {Math.round(segment.percentage * 0.8)} conversas
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Segmentação baseada em análise de IA das conversas com clientes.
        </p>
      </div>
    </div>
  );
}
