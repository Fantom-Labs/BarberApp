"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiDownload,
  FiUserPlus,
  FiRefreshCw
} from 'react-icons/fi';
import {
  generateAllClientInsights,
  ClientInsight,
  clientSegments
} from '@/lib/client-analytics';
import { StoredUser, getAllUsers } from '@/lib/storage-service';
import ClientInsightCard from '@/components/ClientInsightCard';
import ClientDetailCard from '@/components/ClientDetailCard';
import ClientStatisticsCard from '@/components/ClientStatisticsCard';
import ClientSegmentBadge from '@/components/ClientSegmentBadge';
import SegmentDropdown from '@/components/SegmentDropdown';

export default function ClientsPage() {
  const [clients, setClients] = useState<StoredUser[]>([]);
  const [insights, setInsights] = useState<ClientInsight[]>([]);
  const [filteredInsights, setFilteredInsights] = useState<ClientInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isSegmentDropdownOpen, setIsSegmentDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'all'>('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const segmentButtonRef = useRef<HTMLButtonElement>(null!) as React.RefObject<HTMLButtonElement>;

  useEffect(() => {
    // Carregar clientes e insights
    const loadData = async () => {
      setLoading(true);

      try {
        // Carregar clientes
        const allUsers = getAllUsers();
        const clientUsers = allUsers.filter(user => user.type === 'client');
        setClients(clientUsers);

        // Carregar insights
        const allInsights = generateAllClientInsights();
        setInsights(allInsights);
        setFilteredInsights(allInsights);
      } catch (error) {
        console.error('Erro ao carregar dados de clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar insights com base no termo de busca e segmento selecionado
  useEffect(() => {
    let filtered = [...insights];

    // Filtrar por segmento
    if (selectedSegment) {
      filtered = filtered.filter(insight =>
        insight.segments.includes(selectedSegment)
      );
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(insight => {
        const client = clients.find(c => c.id === insight.clientId);
        if (!client) return false;

        return (
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.includes(term)
        );
      });
    }

    setFilteredInsights(filtered);
  }, [insights, searchTerm, selectedSegment, viewMode, clients]);

  // Função para lidar com a seleção de um cliente
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  // Função para lidar com a seleção de um segmento
  const handleSegmentSelect = (segmentName: string) => {
    setSelectedSegment(segmentName);
    setIsSegmentDropdownOpen(false);
  };

  // Função para limpar o segmento selecionado
  const handleClearSegment = () => {
    setSelectedSegment(null);
    setIsSegmentDropdownOpen(false);
  };

  // Função para fechar o detalhe do cliente
  const handleCloseDetail = () => {
    setSelectedClientId(null);
  };



  // Função para exportar dados de clientes
  const handleExportData = () => {
    // Implementação futura: exportar dados para CSV/Excel
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  // Função para adicionar novo cliente
  const handleAddClient = () => {
    // Implementação futura: modal para adicionar cliente
    alert('Funcionalidade de adicionar cliente será implementada em breve!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">CRM de Clientes</h1>

        <div className="flex space-x-2">
          <button
            onClick={handleExportData}
            className="flex items-center bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md transition-colors text-sm"
          >
            <FiDownload className="h-4 w-4 mr-1.5" />
            <span>Exportar</span>
          </button>

          <button
            onClick={handleAddClient}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors text-sm"
          >
            <FiUserPlus className="h-4 w-4 mr-1.5" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cliente por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-2 py-1 rounded-md flex items-center text-xs ${
                viewMode === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FiUsers className="h-3 w-3" />
              <span className="ml-1">Todos</span>
            </button>

            <div className="relative">
              <button
                ref={segmentButtonRef}
                onClick={() => setIsSegmentDropdownOpen(!isSegmentDropdownOpen)}
                className="px-2 py-1 rounded-md flex items-center text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <FiFilter className="h-3 w-3" />
                <span className="ml-1">Segmentos</span>
              </button>

              <SegmentDropdown
                segments={clientSegments}
                onSelect={handleSegmentSelect}
                isOpen={isSegmentDropdownOpen}
                onClose={() => setIsSegmentDropdownOpen(false)}
                triggerRef={segmentButtonRef}
              />
            </div>

            {selectedSegment && (
              <div className="flex items-center space-x-1">
                <ClientSegmentBadge segment={selectedSegment} className="text-xs font-light" showPercentage={true} />
                <button
                  onClick={handleClearSegment}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna de Estatísticas e Segmentos */}
        <div className="lg:col-span-1 space-y-4">
          {/* Card de Estatísticas */}
          <ClientStatisticsCard />

          {/* Card de Segmentos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium mb-3">Segmentos de Clientes</h3>
            <div className="space-y-1">
              {clientSegments.map((segment) => (
                <button
                  key={segment.id}
                  onClick={() => handleSegmentSelect(segment.name)}
                  className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-750 py-1.5 px-2 rounded-md transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center flex-1 min-w-0">
                      <ClientSegmentBadge segment={segment.name} className="mr-1.5" showPercentage={true} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-1">
                      {insights.filter(i => i.segments.includes(segment.name)).length} clientes
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Clientes ou Detalhes do Cliente Selecionado */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          {selectedClientId ? (
            <ClientDetailCard
              clientId={selectedClientId}
              onClose={handleCloseDetail}
            />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">
                  Todos os Clientes
                  {selectedSegment && ` - ${selectedSegment}`}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredInsights.length} {filteredInsights.length === 1 ? 'cliente' : 'clientes'}
                </span>
              </div>

              {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-center items-center h-48">
                  <div className="flex items-center space-x-2">
                    <FiRefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm">Carregando dados de clientes...</span>
                  </div>
                </div>
              ) : filteredInsights.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-center items-center h-48">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum cliente encontrado com os filtros atuais.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredInsights.map((insight) => (
                    <ClientInsightCard
                      key={insight.clientId}
                      insight={insight}
                      onClick={() => handleClientSelect(insight.clientId)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
