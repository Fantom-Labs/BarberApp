"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMessageCircle, FiCode, FiSettings, FiArrowLeft, FiRefreshCw, FiLoader, FiFilter } from 'react-icons/fi';
import WhatsAppConversationList, { WhatsAppConversation } from '@/components/WhatsAppConversationList';
import WhatsAppConversationView from '@/components/WhatsAppConversation';
import WhatsAppAuth from '@/components/WhatsAppAuth';
import OnlineSegmentCard from '@/components/OnlineSegmentCard';
import OnlineSegmentBadge from '@/components/OnlineSegmentBadge';
import { fetchWhatsAppConversations, fetchWhatsAppMessages, getWhatsAppAuthStatus, WhatsAppAuthStatus } from '@/lib/services/whatsapp.service';

export default function SupportPage() {
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<WhatsAppConversation | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<WhatsAppAuthStatus | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Verificar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Verificar se já está autenticado e carregar conversas
  useEffect(() => {
    const status = getWhatsAppAuthStatus();
    if (status.isAuthenticated) {
      setAuthStatus(status);
      loadConversations();
    }
  }, []);

  // Função para carregar as conversas do WhatsApp
  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWhatsAppConversations();
      setConversations(data);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
      setError('Não foi possível carregar as conversas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com o sucesso da autenticação
  const handleAuthSuccess = (status: WhatsAppAuthStatus) => {
    setAuthStatus(status);
    loadConversations();
  };

  // Função para selecionar uma conversa
  const handleSelectConversation = async (conversation: WhatsAppConversation) => {
    setIsLoading(true);

    try {
      // Atualizar a conversa para marcar como lida
      if (conversation.unreadCount > 0) {
        const updatedConversations = conversations.map(conv =>
          conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
        );
        setConversations(updatedConversations);
      }

      // Carregar mensagens da conversa se ainda não foram carregadas
      if (!conversation.messages) {
        const messages = await fetchWhatsAppMessages(conversation.id);
        const updatedConversation = {
          ...conversation,
          messages
        };

        // Atualizar a conversa na lista
        const updatedConversations = conversations.map(conv =>
          conv.id === conversation.id ? updatedConversation : conv
        );

        setConversations(updatedConversations);
        setSelectedConversation(updatedConversation);
      } else {
        setSelectedConversation(conversation);
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Não foi possível carregar as mensagens. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para voltar à lista de conversas (em dispositivos móveis)
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Função para lidar com a seleção de segmentos
  const handleSegmentSelect = (segmentId: string) => {
    if (selectedSegment === segmentId) {
      setSelectedSegment(null); // Desselecionar se clicar no mesmo segmento
    } else {
      setSelectedSegment(segmentId);

      // Filtrar conversas pelo segmento (simulação)
      // Em um ambiente real, isso seria feito com dados reais
      // ou enviando o filtro para a API
      setSelectedConversation(null);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard/functions/sales"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Atendimento ao Cliente</h1>
        </div>

        {authStatus?.isAuthenticated && (
          <button
            onClick={loadConversations}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FiLoader className="h-5 w-5 animate-spin" />
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <FiRefreshCw className="h-5 w-5" />
                <span>Atualizar Conversas</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Conecte-se ao WhatsApp Business da sua barbearia para acessar todas as conversas. Alterne entre o modo Agente (IA) e Manual para cada conversa.
        </p>
      </div>

      {/* Autenticação do WhatsApp */}
      {!authStatus?.isAuthenticated ? (
        <WhatsAppAuth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Coluna de Segmentação - Lado Esquerdo */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card de Segmentação */}
            <OnlineSegmentCard
              onSelectSegment={handleSegmentSelect}
              selectedSegment={selectedSegment}
            />

            {/* Informações de Uso */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-sm font-medium mb-3">Informações</h3>
              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p>As segmentações são geradas automaticamente pela IA com base no conteúdo das conversas.</p>
                <p>Use as segmentações para identificar padrões e melhorar o atendimento.</p>
                <p>Clique em uma segmentação para filtrar as conversas.</p>
              </div>
            </div>
          </div>

          {/* Coluna Principal - Conversas e Chat */}
          <div className="lg:col-span-2">
            <div className="flex flex-1 gap-4 h-[600px]">
              {/* Lista de conversas (oculta em dispositivos móveis quando uma conversa está selecionada) */}
              {(!isMobile || !selectedConversation) && (
                <div className={`${isMobile ? 'w-full' : 'w-80'}`}>
                  {selectedSegment && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <OnlineSegmentBadge segment={selectedSegment} className="mr-1" />
                      </div>
                      <button
                        onClick={() => setSelectedSegment(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  {isLoading && conversations.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center justify-center p-6 h-[600px]">
                      <FiLoader className="h-10 w-10 text-primary animate-spin mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Carregando conversas...</p>
                    </div>
                  ) : (
                    <WhatsAppConversationList
                      conversations={conversations}
                      selectedConversation={selectedConversation}
                      onSelectConversation={handleSelectConversation}
                      className="h-[calc(100%-40px)]"
                    />
                  )}
                </div>
              )}

              {/* Conversa selecionada */}
              {selectedConversation && (
                <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
                  <WhatsAppConversationView
                    conversation={selectedConversation}
                    onBack={handleBackToList}
                    className="h-full"
                    isMobile={isMobile}
                  />
                </div>
              )}

              {/* Mensagem quando nenhuma conversa está selecionada e não está em dispositivo móvel */}
              {!selectedConversation && !isMobile && (
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col items-center justify-center p-6 h-full">
                  {error ? (
                    <>
                      <FiMessageCircle className="h-16 w-16 text-red-400 mb-4" />
                      <h3 className="text-lg font-medium text-red-500 mb-2">Erro ao carregar conversas</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
                        {error}
                      </p>
                      <button
                        onClick={loadConversations}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Tentar novamente
                      </button>
                    </>
                  ) : conversations.length === 0 ? (
                    <>
                      <FiMessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Nenhuma conversa encontrada</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        Não há conversas disponíveis no momento. Aguarde até que um cliente entre em contato pelo WhatsApp.
                      </p>
                    </>
                  ) : (
                    <>
                      <FiMessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Nenhuma conversa selecionada</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        Selecione uma conversa da lista para iniciar o atendimento.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instruções de uso */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Como usar o atendimento via WhatsApp</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <FiMessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-2">1. Conecte ao WhatsApp</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Insira o número de telefone da sua barbearia e conecte-se ao WhatsApp Business para acessar as conversas.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
              <FiMessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-2">2. Acesse as conversas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecione uma conversa na lista para visualizar o histórico e enviar novas mensagens aos seus clientes.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <FiSettings className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-2">3. Escolha o modo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alterne entre o modo "Agente" (IA responde automaticamente) e "Manual" (você responde) para cada conversa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
