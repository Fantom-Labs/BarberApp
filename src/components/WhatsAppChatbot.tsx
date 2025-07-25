"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { sendWhatsAppTextMessage } from '@/lib/services/whatsapp.service';

// Tipos para o chatbot
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
  action: () => void;
}

interface WhatsAppChatbotProps {
  initialMessage?: string;
  whatsappNumber: string;
  predefinedResponses: Record<string, string>;
  initialQuickReplies?: QuickReply[];
  onSendToWhatsApp?: (messages: Message[]) => void;
  className?: string;
}

// Função para gerar ID único
const generateId = () => Math.random().toString(36).substring(2, 11);

export default function WhatsAppChatbot({
  initialMessage = "Olá! Como posso ajudar você hoje?",
  whatsappNumber,
  predefinedResponses,
  initialQuickReplies = [],
  onSendToWhatsApp,
  className = ""
}: WhatsAppChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(initialQuickReplies);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar o chat com uma mensagem de boas-vindas
  useEffect(() => {
    if (initialMessage) {
      const welcomeMessage: Message = {
        id: generateId(),
        text: initialMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    }
    
    if (initialQuickReplies.length > 0) {
      setQuickReplies(initialQuickReplies);
    }
  }, [initialMessage, initialQuickReplies]);

  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Função para enviar mensagem
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: generateId(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular resposta do bot após um pequeno delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Atualizar respostas rápidas com base na conversa
      updateQuickReplies(inputText);
    }, 1000);
  };

  // Função para lidar com respostas rápidas
  const handleQuickReply = (text: string) => {
    setInputText(text);
    sendMessage();
  };

  // Função para gerar resposta do bot com base no input do usuário
  const generateBotResponse = (input: string): Message => {
    const lowerInput = input.toLowerCase();
    let responseText = predefinedResponses.default || "Desculpe, não entendi sua pergunta.";

    // Verificar correspondências de palavras-chave nas respostas predefinidas
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (key === 'default') continue;
      
      // Palavras-chave comuns para cada tipo de resposta
      const keywords: Record<string, string[]> = {
        greeting: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
        hours: ['horário', 'funcionamento', 'aberto', 'fechado'],
        location: ['endereço', 'localização', 'onde', 'lugar'],
        services: ['serviço', 'corte', 'barba', 'oferecem', 'fazem'],
        prices: ['preço', 'valor', 'custo', 'quanto', 'custa'],
        booking: ['agendar', 'marcar', 'horário', 'reservar'],
        products: ['produto', 'comprar', 'venda', 'item'],
        contact: ['contato', 'telefone', 'email', 'falar']
      };
      
      // Verificar se o input contém alguma das palavras-chave para esta resposta
      if (keywords[key] && keywords[key].some(keyword => lowerInput.includes(keyword))) {
        responseText = response;
        break;
      }
    }

    return {
      id: generateId(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
    };
  };

  // Atualizar respostas rápidas com base na conversa
  const updateQuickReplies = (input: string) => {
    // Implementação específica para cada caso de uso
    // Esta função deve ser personalizada de acordo com as necessidades do negócio
  };

  // Função para continuar a conversa no WhatsApp
  const continueOnWhatsApp = () => {
    // Preparar o texto da conversa para enviar para o WhatsApp
    const conversationText = messages
      .map(msg => `${msg.sender === 'user' ? 'Eu' : 'Atendente'}: ${msg.text}`)
      .join('\n');
    
    // Criar a URL do WhatsApp com a conversa
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Continuando nossa conversa do chat:\n\n${conversationText}\n\nPreciso de mais ajuda.`
    )}`;
    
    // Chamar o callback se fornecido
    if (onSendToWhatsApp) {
      onSendToWhatsApp(messages);
    }
    
    // Abrir o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Cabeçalho do chat */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
          <FiMessageCircle size={20} />
        </div>
        <div className="ml-3">
          <h2 className="font-medium">Assistente BarberApp</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
        </div>
        <button 
          onClick={continueOnWhatsApp}
          className="ml-auto bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
        >
          Continuar no WhatsApp
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Respostas rápidas */}
      {quickReplies.length > 0 && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply.id}
              onClick={reply.action}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm px-3 py-1 rounded-full transition-colors"
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}

      {/* Input de mensagem */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={sendMessage}
          disabled={inputText.trim() === ''}
          className="ml-2 bg-primary hover:bg-primary-dark text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
