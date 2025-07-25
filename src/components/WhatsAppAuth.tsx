"use client";

import React, { useState, useEffect } from 'react';
import { FiPhone, FiShield, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { authenticateWhatsApp, getWhatsAppAuthStatus, WhatsAppAuthStatus } from '@/lib/services/whatsapp.service';

interface WhatsAppAuthProps {
  onAuthSuccess: (status: WhatsAppAuthStatus) => void;
  className?: string;
}

export default function WhatsAppAuth({ onAuthSuccess, className = '' }: WhatsAppAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<WhatsAppAuthStatus | null>(null);

  // Verificar se já está autenticado
  useEffect(() => {
    const status = getWhatsAppAuthStatus();
    if (status.isAuthenticated) {
      setAuthStatus(status);
      onAuthSuccess(status);
    }
  }, [onAuthSuccess]);

  // Função para formatar o número de telefone enquanto o usuário digita
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remover todos os caracteres não numéricos
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  // Função para autenticar
  const handleAuthenticate = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Validar os campos
      if (!phoneNumber) {
        setError('O número de telefone é obrigatório');
        setIsLoading(false);
        return;
      }

      if (!businessName) {
        setError('O nome da barbearia é obrigatório');
        setIsLoading(false);
        return;
      }

      // Autenticar com o WhatsApp
      const status = await authenticateWhatsApp(phoneNumber, businessName);
      
      if (status.isAuthenticated) {
        setAuthStatus(status);
        onAuthSuccess(status);
      } else {
        setError(status.error || 'Falha na autenticação');
      }
    } catch (err) {
      setError('Ocorreu um erro ao autenticar. Tente novamente.');
      console.error('Erro na autenticação:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para desconectar
  const handleDisconnect = () => {
    // Em um ambiente real, aqui chamaríamos uma função para desconectar da API
    setAuthStatus(null);
    setPhoneNumber('');
    setBusinessName('');
    // Recarregar a página para limpar o estado
    window.location.reload();
  };

  // Se já estiver autenticado, mostrar informações da conexão
  if (authStatus?.isAuthenticated) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-4">
            <FiCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">WhatsApp Conectado</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conectado como {authStatus.businessName} ({authStatus.phoneNumber})
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {authStatus.expiresAt && (
              <p>Sessão válida até {authStatus.expiresAt.toLocaleString()}</p>
            )}
          </div>
          <button
            onClick={handleDisconnect}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Desconectar
          </button>
        </div>
      </div>
    );
  }

  // Formulário de autenticação
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Conectar ao WhatsApp Business</h2>
      
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md flex items-start">
            <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Número do WhatsApp Business
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Ex: 5511999999999"
              className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Inclua o código do país e DDD sem espaços ou caracteres especiais.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome da Barbearia
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiShield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Ex: Barbearia Silva"
              className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-none rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <button
          onClick={handleAuthenticate}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin h-5 w-5 mr-2" />
              Conectando...
            </>
          ) : (
            <>
              <FiCheck className="h-5 w-5 mr-2" />
              Conectar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
