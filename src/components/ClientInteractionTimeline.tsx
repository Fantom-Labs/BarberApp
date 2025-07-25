"use client";

import React from 'react';
import { ClientInteraction } from '@/lib/client-analytics';
import { FiCalendar, FiShoppingBag, FiVideo, FiGlobe, FiMessageSquare, FiClock } from 'react-icons/fi';

interface ClientInteractionTimelineProps {
  interactions: ClientInteraction[];
  className?: string;
}

export default function ClientInteractionTimeline({ interactions, className = '' }: ClientInteractionTimelineProps) {
  // Ordenar interações por data (mais recente primeiro)
  const sortedInteractions = [...interactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Função para obter ícone baseado no tipo de interação
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <FiCalendar className="h-5 w-5" />;
      case 'purchase':
        return <FiShoppingBag className="h-5 w-5" />;
      case 'course':
        return <FiVideo className="h-5 w-5" />;
      case 'website_visit':
        return <FiGlobe className="h-5 w-5" />;
      case 'message':
        return <FiMessageSquare className="h-5 w-5" />;
      default:
        return <FiClock className="h-5 w-5" />;
    }
  };
  
  // Função para obter cor baseada no tipo de interação
  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'purchase':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'course':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'website_visit':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'message':
        return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  
  // Função para obter título baseado no tipo de interação
  const getInteractionTitle = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'Agendamento';
      case 'purchase':
        return 'Compra';
      case 'course':
        return 'Curso';
      case 'website_visit':
        return 'Visita ao Site';
      case 'message':
        return 'Mensagem';
      default:
        return 'Interação';
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Histórico de Interações</h3>
      
      {sortedInteractions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Nenhuma interação registrada.
        </p>
      ) : (
        <div className="relative">
          {/* Linha vertical */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Interações */}
          <div className="space-y-6">
            {sortedInteractions.map((interaction) => (
              <div key={interaction.id} className="relative flex items-start">
                {/* Ícone */}
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${getInteractionColor(interaction.type)}`}>
                  {getInteractionIcon(interaction.type)}
                </div>
                
                {/* Conteúdo */}
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{getInteractionTitle(interaction.type)}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(interaction.date)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{interaction.details}</p>
                  {interaction.value && (
                    <p className="text-sm font-medium mt-1">
                      Valor: R$ {interaction.value.toFixed(2)}
                    </p>
                  )}
                  {interaction.source && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Via: {interaction.source}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
