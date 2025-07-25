"use client";

import Link from "next/link";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiShoppingBag,
  FiVideo,
  FiPieChart,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiSun,
  FiMoon,
  FiLogOut
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-service";
import AppointmentModal from "@/components/AppointmentModal";
import useAppointmentModal from "@/hooks/useAppointmentModal";
import type { Appointment } from "@/lib/types/appointment";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

export default function FunctionsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dados de exemplo para agendamentos
  const appointments: Appointment[] = [];

  // Função para lidar com a criação de um novo agendamento
  const handleAppointmentCreated = (newAppointment: any) => {
    // Aqui você poderia adicionar o agendamento a uma lista ou enviar para uma API
    console.log("Novo agendamento criado:", newAppointment);
    // Redirecionar para a página de agenda
    router.push("/dashboard/agenda");
  };

  // Usar o hook personalizado para gerenciar o modal de agendamento
  const {
    isModalOpen,
    openModal,
    closeModal,
    handleSaveAppointment,
    clients,
    services,
    barbers
  } = useAppointmentModal(appointments, handleAppointmentCreated);

  // Verificar o tema atual ao carregar o componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, []);

  // Função para alternar o tema
  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
      setIsDarkMode(!isDarkMode);

      // Salvar preferência no localStorage
      localStorage.setItem("theme", isDarkMode ? "light" : "dark");
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    logout().then(() => {
      router.push('/auth/login');
    }).catch(error => {
      console.error('Erro ao fazer logout:', error);
      setIsLoggingOut(false);
    });
  };

  // Lista de funções
  const functionItems = [
    {
      name: "Minha Barbearia",
      description: "Gerencie as informações da sua barbearia",
      href: "/dashboard/functions/my-barbershop",
      icon: <FiHome className="h-6 w-6" />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      name: "Novo Agendamento",
      description: "Crie um novo agendamento para um cliente",
      icon: <FiCalendar className="h-6 w-6" />,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      onClick: openModal
    },
    {
      name: "Clientes",
      description: "Gerencie e analise o comportamento dos seus clientes",
      href: "/dashboard/functions/clients",
      icon: <FiUsers className="h-6 w-6" />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      name: "Adicionar Barbeiro",
      description: "Cadastre um novo profissional na equipe",
      href: "/dashboard/functions/barbers/new",
      icon: <FiUsers className="h-6 w-6" />,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    {
      name: "Adicionar Produtos",
      description: "Cadastre novos produtos para venda",
      href: "/dashboard/products/new",
      icon: <FiShoppingBag className="h-6 w-6" />,
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
    },
    {
      name: "Adicionar Cursos",
      description: "Crie novos cursos para a plataforma",
      href: "/dashboard/courses/new",
      icon: <FiVideo className="h-6 w-6" />,
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    },
    {
      name: "Gestão",
      description: "Gerencie todos os aspectos do seu negócio",
      href: "/dashboard/functions/management",
      icon: <FiPieChart className="h-6 w-6" />,
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
    },
    {
      name: "Marketing",
      description: "Ferramentas para promover seu negócio",
      href: "/dashboard/functions/marketing",
      icon: <FiTrendingUp className="h-6 w-6" />,
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
    },
    {
      name: "Vendas",
      description: "Acompanhe e gerencie suas vendas",
      href: "/dashboard/functions/sales",
      icon: <FiDollarSign className="h-6 w-6" />,
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
    },
    {
      name: "Configurações",
      description: "Personalize as configurações do sistema",
      href: "/dashboard/functions/settings",
      icon: <FiSettings className="h-6 w-6" />,
      color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Funções</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {functionItems.map((item, index) => (
          item.onClick ? (
            <button
              key={index}
              onClick={item.onClick}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-left w-full"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          ) : (
            <Link
              key={index}
              href={item.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                </div>
              </div>
            </Link>
          )
        ))}
      </div>

      {/* Tema e Logout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <button
          onClick={toggleTheme}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              {isDarkMode ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{isDarkMode ? "Tema Claro" : "Tema Escuro"}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isDarkMode ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-left disabled:opacity-70"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <FiLogOut className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{isLoggingOut ? "Saindo..." : "Sair"}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isLoggingOut ? "Finalizando sua sessão" : "Encerrar sua sessão no sistema"}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Modal de Novo Agendamento - Componente Reutilizável */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveAppointment}
        barbers={barbers}
        services={services}
        clients={clients}
      />
    </div>
  );
}
