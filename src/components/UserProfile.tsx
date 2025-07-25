"use client";

import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock } from "react-icons/fi";
import { StoredUser } from "@/lib/storage-service";
import { getCurrentUser } from "@/lib/auth-service";

export function UserProfile() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Usuário não encontrado. Por favor, faça login novamente.
        </p>
      </div>
    );
  }

  // Formatar data de nascimento
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch (error) {
      return dateString;
    }
  };

  // Formatar data e hora
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Não informado";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR") + " às " + date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Cabeçalho do perfil */}
      <div className="bg-primary/10 p-6 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.type === "client" ? "Cliente" : "Profissional"}
            </p>
          </div>
        </div>
      </div>

      {/* Informações do usuário */}
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2">
          Informações Pessoais
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FiMail className="mt-0.5 text-primary" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p>{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FiPhone className="mt-0.5 text-primary" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
              <p>{user.phone}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FiCalendar className="mt-0.5 text-primary" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Data de Nascimento</p>
              <p>{formatDate(user.birthDate)}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FiClock className="mt-0.5 text-primary" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Último Acesso</p>
              <p>{formatDateTime(user.lastLogin)}</p>
            </div>
          </div>
        </div>
        
        {/* Agendamentos */}
        {user.appointments && user.appointments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium border-b border-gray-200 dark:border-gray-700 pb-2">
              Próximos Agendamentos
            </h3>
            
            <div className="mt-3 space-y-3">
              {user.appointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{appointment.service}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        com {appointment.barber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {formatDateTime(appointment.date)}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                        : appointment.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Agendado' : 
                       appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
