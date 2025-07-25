"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiSend, FiPaperclip, FiMic, FiMoreVertical, FiArrowLeft, FiZap, FiUser } from 'react-icons/fi';
import { WhatsAppConversation } from './WhatsAppConversationList';

// Tipos para as mensagens
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'client' | 'bot';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface WhatsAppConversationProps {
  conversation: WhatsAppConversation;
  onBack: () => void;
  className?: string;
  isMobile?: boolean;
}

export default function WhatsAppConversationView({
  conversation,
  onBack,
  className = '',
  isMobile = false
}: WhatsAppConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAgentMode, setIsAgentMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar mensagens da conversa (simulado)
  useEffect(() => {
    // Simulação de mensagens para demonstração
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Olá, gostaria de agendar um corte de cabelo',
        sender: 'client',
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
      },
      {
        id: '2',
        text: 'Olá! Claro, temos horários disponíveis para amanhã. Qual horário seria melhor para você?',
        sender: 'bot',
        timestamp: new Date(Date.now() - 3540000), // 59 minutos atrás
        status: 'read'
      },
      {
        id: '3',
        text: 'Prefiro no final da tarde, por volta das 18h',
        sender: 'client',
        timestamp: new Date(Date.now() - 3480000), // 58 minutos atrás
      },
      {
        id: '4',
        text: 'Perfeito! Temos um horário disponível às 18h com o barbeiro Carlos. Posso confirmar esse horário para você?',
        sender: 'bot',
        timestamp: new Date(Date.now() - 3420000), // 57 minutos atrás
        status: 'read'
      },
      {
        id: '5',
        text: 'Sim, pode confirmar',
        sender: 'client',
        timestamp: new Date(Date.now() - 3360000), // 56 minutos atrás
      },
      {
        id: '6',
        text: 'Ótimo! Seu agendamento foi confirmado para amanhã às 18h com o barbeiro Carlos. Você receberá uma mensagem de lembrete algumas horas antes. Há mais alguma coisa em que eu possa ajudar?',
        sender: 'bot',
        timestamp: new Date(Date.now() - 3300000), // 55 minutos atrás
        status: 'read'
      },
      {
        id: '7',
        text: 'Não, obrigado!',
        sender: 'client',
        timestamp: new Date(Date.now() - 3240000), // 54 minutos atrás
      },
      {
        id: '8',
        text: 'Disponha! Estamos à disposição para qualquer dúvida. Tenha um ótimo dia!',
        sender: 'user',
        timestamp: new Date(Date.now() - 3180000), // 53 minutos atrás
        status: 'read'
      },
    ];
    
    setMessages(mockMessages);
  }, [conversation.id]);

  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensagem
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      text: inputText,
      sender: isAgentMode ? 'bot' : 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  // Alternar entre modo agente (IA) e manual
  const toggleAgentMode = () => {
    setIsAgentMode(!isAgentMode);
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Cabeçalho */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        {isMobile && (
          <button 
            onClick={onBack}
            className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
        )}
        
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
          {conversation.avatar ? (
            <Image
              src={conversation.avatar}
              alt={conversation.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-lg font-medium">
              {conversation.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h2 className="font-medium">{conversation.name}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {conversation.phone}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleAgentMode}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
              isAgentMode 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <span>Modo:</span>
            {isAgentMode ? (
              <>
                <FiZap className="h-3 w-3" />
                <span>Agente</span>
              </>
            ) : (
              <>
                <FiUser className="h-3 w-3" />
                <span>Manual</span>
              </>
            )}
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FiMoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender !== 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'client'
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                    : message.sender === 'bot'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                <p>{message.text}</p>
                <div className="flex justify-end items-center mt-1 space-x-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {message.sender !== 'client' && message.status && (
                    <span className="text-xs opacity-70">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input de mensagem */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <FiPaperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite uma mensagem"
          className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full mx-2 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        {inputText.trim() === '' ? (
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <FiMic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        ) : (
          <button
            onClick={sendMessage}
            className="p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            <FiSend className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
