"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiPhone, FiCalendar, FiClock, FiScissors, FiSend } from 'react-icons/fi';
import WhatsAppChatbot from '@/components/WhatsAppChatbot';

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

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

// Dados pré-cadastrados para respostas do chatbot
const predefinedResponses = {
  greeting: "Olá! Bem-vindo ao atendimento da BarberApp. Como posso ajudar você hoje?",
  hours: "Nosso horário de funcionamento é de segunda a sábado, das 9h às 20h.",
  location: "Estamos localizados na Av. Paulista, 1000, São Paulo - SP.",
  services: "Oferecemos corte de cabelo, barba, tratamentos capilares e muito mais. Gostaria de ver a lista completa de serviços?",
  prices: "Nossos preços variam de acordo com o serviço. Cortes a partir de R$50, barba a partir de R$35. Posso te enviar nossa tabela completa de preços.",
  booking: "Para agendar um horário, você pode usar nosso app ou site. Posso te ajudar com isso agora mesmo. Que serviço você gostaria de agendar?",
  products: "Temos uma linha completa de produtos para barba e cabelo. Você está procurando algo específico?",
  contact: "Você pode entrar em contato conosco pelo telefone (11) 99999-9999 ou pelo email contato@barberapp.com.",
  default: "Desculpe, não entendi sua pergunta. Poderia reformular ou escolher uma das opções abaixo?",
};

// Função para gerar ID único
const generateId = () => Math.random().toString(36).substring(2, 11);

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999'); // Número do WhatsApp da barbearia

  // Inicializar o chat com uma mensagem de boas-vindas
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateId(),
      text: predefinedResponses.greeting,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);

    // Definir respostas rápidas iniciais
    setQuickReplies([
      { id: 'hours', text: 'Horário de funcionamento', action: () => handleQuickReply('Qual o horário de funcionamento?') },
      { id: 'services', text: 'Serviços oferecidos', action: () => handleQuickReply('Quais serviços vocês oferecem?') },
      { id: 'booking', text: 'Agendar horário', action: () => handleQuickReply('Quero agendar um horário') },
      { id: 'prices', text: 'Preços', action: () => handleQuickReply('Quais são os preços?') },
    ]);
  }, []);

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
    let responseText = '';

    // Lógica simples de correspondência de palavras-chave
    if (lowerInput.includes('olá') || lowerInput.includes('oi') || lowerInput.includes('bom dia') || lowerInput.includes('boa tarde')) {
      responseText = predefinedResponses.greeting;
    } else if (lowerInput.includes('horário') || lowerInput.includes('funcionamento') || lowerInput.includes('aberto')) {
      responseText = predefinedResponses.hours;
    } else if (lowerInput.includes('endereço') || lowerInput.includes('localização') || lowerInput.includes('onde')) {
      responseText = predefinedResponses.location;
    } else if (lowerInput.includes('serviço') || lowerInput.includes('corte') || lowerInput.includes('barba')) {
      responseText = predefinedResponses.services;
    } else if (lowerInput.includes('preço') || lowerInput.includes('valor') || lowerInput.includes('custo')) {
      responseText = predefinedResponses.prices;
    } else if (lowerInput.includes('agendar') || lowerInput.includes('marcar') || lowerInput.includes('horário')) {
      responseText = predefinedResponses.booking;
    } else if (lowerInput.includes('produto') || lowerInput.includes('comprar')) {
      responseText = predefinedResponses.products;
    } else if (lowerInput.includes('contato') || lowerInput.includes('telefone') || lowerInput.includes('email')) {
      responseText = predefinedResponses.contact;
    } else {
      responseText = predefinedResponses.default;
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
    const lowerInput = input.toLowerCase();

    // Lógica para atualizar as respostas rápidas com base no contexto da conversa
    if (lowerInput.includes('agendar') || lowerInput.includes('marcar')) {
      setQuickReplies([
        { id: 'haircut', text: 'Corte de cabelo', action: () => handleQuickReply('Quero agendar um corte de cabelo') },
        { id: 'beard', text: 'Barba', action: () => handleQuickReply('Quero agendar um serviço de barba') },
        { id: 'combo', text: 'Corte + Barba', action: () => handleQuickReply('Quero agendar corte e barba') },
        { id: 'back', text: 'Voltar ao menu principal', action: () => resetQuickReplies() },
      ]);
    } else if (lowerInput.includes('serviço') || lowerInput.includes('oferecem')) {
      setQuickReplies([
        { id: 'prices', text: 'Ver preços', action: () => handleQuickReply('Quais são os preços?') },
        { id: 'booking', text: 'Agendar agora', action: () => handleQuickReply('Quero agendar um horário') },
        { id: 'special', text: 'Serviços especiais', action: () => handleQuickReply('Vocês têm serviços especiais?') },
        { id: 'back', text: 'Voltar ao menu principal', action: () => resetQuickReplies() },
      ]);
    } else if (lowerInput.includes('preço') || lowerInput.includes('valor')) {
      setQuickReplies([
        { id: 'booking', text: 'Agendar agora', action: () => handleQuickReply('Quero agendar um horário') },
        { id: 'promo', text: 'Promoções', action: () => handleQuickReply('Vocês têm alguma promoção?') },
        { id: 'back', text: 'Voltar ao menu principal', action: () => resetQuickReplies() },
      ]);
    }
  };

  // Resetar para as respostas rápidas iniciais
  const resetQuickReplies = () => {
    setQuickReplies([
      { id: 'hours', text: 'Horário de funcionamento', action: () => handleQuickReply('Qual o horário de funcionamento?') },
      { id: 'services', text: 'Serviços oferecidos', action: () => handleQuickReply('Quais serviços vocês oferecem?') },
      { id: 'booking', text: 'Agendar horário', action: () => handleQuickReply('Quero agendar um horário') },
      { id: 'prices', text: 'Preços', action: () => handleQuickReply('Quais são os preços?') },
    ]);

    // Adicionar mensagem do bot
    const botMessage: Message = {
      id: generateId(),
      text: "Como posso ajudar você?",
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
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

    // Abrir o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h1 className="text-xl font-semibold mb-2 flex items-center">
          <FiMessageCircle className="mr-2 text-primary" /> Atendimento ao Cliente
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Converse com nosso assistente virtual ou continue o atendimento pelo WhatsApp.
        </p>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Área principal do chat */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
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
              <FiPhone className="mr-1" /> Continuar no WhatsApp
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

        {/* Painel lateral com informações */}
        <div className="hidden md:block w-64 space-y-4">
          {/* Card de informações de contato */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <FiPhone className="mr-2 text-primary" /> Contato Direto
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <FiPhone className="mr-2 text-gray-500" /> (11) 99999-9999
              </p>
              <p className="flex items-center">
                <FiMessageCircle className="mr-2 text-gray-500" /> contato@barberapp.com
              </p>
            </div>
          </div>

          {/* Card de horário de funcionamento */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <FiClock className="mr-2 text-primary" /> Horário de Funcionamento
            </h3>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span>Segunda a Sexta:</span>
                <span>9h às 20h</span>
              </p>
              <p className="flex justify-between">
                <span>Sábado:</span>
                <span>9h às 18h</span>
              </p>
              <p className="flex justify-between">
                <span>Domingo:</span>
                <span>Fechado</span>
              </p>
            </div>
          </div>

          {/* Card de serviços populares */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <FiScissors className="mr-2 text-primary" /> Serviços Populares
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Corte Masculino</span>
                <span className="font-medium">R$ 50</span>
              </p>
              <p className="flex justify-between">
                <span>Barba</span>
                <span className="font-medium">R$ 35</span>
              </p>
              <p className="flex justify-between">
                <span>Corte + Barba</span>
                <span className="font-medium">R$ 75</span>
              </p>
              <p className="flex justify-between">
                <span>Tratamento Capilar</span>
                <span className="font-medium">R$ 90</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
