"use client";

import React from 'react';
import { ClientInsight, getClientInteractions } from '@/lib/client-analytics';
import { StoredUser, getUserById } from '@/lib/storage-service';
import ClientSegmentBadge from './ClientSegmentBadge';
import ClientInteractionTimeline from './ClientInteractionTimeline';
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

interface ClientDetailCardProps {
  clientId: string;
  onClose?: () => void;
  className?: string;
}

export default function ClientDetailCard({ clientId, onClose, className = '' }: ClientDetailCardProps) {
  const client = getUserById(clientId) as StoredUser;
  const [insight, setInsight] = React.useState<ClientInsight | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // Importar dinamicamente para evitar problemas de SSR
    import('@/lib/client-analytics').then(({ generateClientInsights }) => {
      const clientInsight = generateClientInsights(clientId);
      setInsight(clientInsight);
      setLoading(false);
    });
  }, [clientId]);
  
  if (!client || loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!insight) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Detalhes do Cliente</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              &times;
            </button>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Não foi possível carregar os dados deste cliente.
        </p>
      </div>
    );
  }
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Função para calcular idade
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'N/A';
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
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
  
  // Obter interações do cliente
  const interactions = getClientInteractions(clientId);
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Detalhes do Cliente</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Informações Pessoais</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FiUser className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Nome</div>
                  <div className="font-medium">{client.name}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                  <div className="font-medium">{client.email}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Telefone</div>
                  <div className="font-medium">{client.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Data de Nascimento</div>
                  <div className="font-medium">
                    {client.birthDate ? formatDate(client.birthDate) : 'N/A'}
                    {client.birthDate && ` (${calculateAge(client.birthDate)} anos)`}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiClock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Cliente desde</div>
                  <div className="font-medium">{formatDate(client.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Análise de Comportamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <FiDollarSign className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Gasto</div>
                  <div className="font-medium">R$ {insight.totalSpent.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiTrendingUp className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Valor Vitalício Estimado</div>
                  <div className="font-medium">R$ {insight.lifetimeValue.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Última Visita</div>
                  <div className="font-medium">{insight.lastVisit ? formatDate(insight.lastVisit) : 'Nunca'}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiClock className="h-5 w-5 text-primary mr-2" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Frequência de Visitas</div>
                  <div className="font-medium">
                    {insight.visitFrequency > 0 ? `${insight.visitFrequency} dias` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Segmentos</div>
              <div className="flex flex-wrap gap-2">
                {insight.segments.map((segment) => (
                  <ClientSegmentBadge key={segment} segment={segment} />
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Serviços Preferidos</div>
              {insight.preferredServices.length > 0 ? (
                <ul className="list-disc list-inside">
                  {insight.preferredServices.map((service) => (
                    <li key={service.service} className="text-sm">
                      {service.service} ({service.count}x)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhum serviço registrado.
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Barbeiros Preferidos</div>
              {insight.preferredBarbers.length > 0 ? (
                <ul className="list-disc list-inside">
                  {insight.preferredBarbers.map((barber) => (
                    <li key={barber.barber} className="text-sm">
                      {barber.barber} ({barber.count}x)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhum barbeiro registrado.
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Risco de Perda</div>
              <div className={`font-medium ${getChurnRiskColor(insight.churnRisk)}`}>
                <FiAlertTriangle className="inline-block h-4 w-4 mr-1" />
                {insight.churnRisk === 'low' && 'Baixo'}
                {insight.churnRisk === 'medium' && 'Médio'}
                {insight.churnRisk === 'high' && 'Alto'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Próxima Visita Prevista</div>
              <div className="font-medium">{insight.nextVisitPrediction}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Abordagem Recomendada</h3>
        <p className="text-sm">{insight.recommendedApproach}</p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <ClientInteractionTimeline interactions={interactions} />
      </div>
    </div>
  );
}
