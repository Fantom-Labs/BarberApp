"use client";

import React from 'react';
import Image from 'next/image';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';

// Tipos para as conversas do WhatsApp
export interface WhatsAppConversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar?: string;
  messages?: any[];
}

interface WhatsAppConversationListProps {
  conversations: WhatsAppConversation[];
  selectedConversation: WhatsAppConversation | null;
  onSelectConversation: (conversation: WhatsAppConversation) => void;
  className?: string;
}

export default function WhatsAppConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  className = ''
}: WhatsAppConversationListProps) {
  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Cabeçalho */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="font-medium">Conversas</h2>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <FiMoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Barra de pesquisa */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar ou começar uma nova conversa"
            className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Lista de conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhuma conversa encontrada</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Escaneie o QR code do WhatsApp de um cliente para iniciar
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                    {conversation.avatar ? (
                      <Image
                        src={conversation.avatar}
                        alt={conversation.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-medium">
                        {conversation.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Contador de mensagens não lidas */}
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>

                {/* Informações da conversa */}
                <div className="ml-3 flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {formatTimestamp(conversation.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Função para formatar o timestamp
function formatTimestamp(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Se for hoje, mostrar apenas a hora
  if (date >= today) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Se for ontem, mostrar "Ontem"
  if (date >= yesterday && date < today) {
    return 'Ontem';
  }

  // Caso contrário, mostrar a data
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
}
