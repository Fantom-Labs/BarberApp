/// <reference types="react" />
import type { JSX } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  FiLogOut,
  FiScissors,
  FiMenu,
  FiMessageCircle
} from "react-icons/fi";
import { logout } from "@/lib/auth-service";
import AppointmentModal from "@/components/AppointmentModal";
import useAppointmentModal from "@/hooks/useAppointmentModal";
import { useTheme } from "next-themes";
import type { Appointment } from "@/lib/types/appointment";

interface FunctionsMenuProps {
  onClose?: () => void;
  className?: string;
}

export function FunctionsMenu({ onClose, className = "" }: FunctionsMenuProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dados de exemplo para agendamentos
  const appointments: Appointment[] = [];

  // Função para lidar com a criação de um novo agendamento
  const handleAppointmentCreated = (newAppointment: any) => {
    // Aqui você poderia adicionar o agendamento a uma lista ou enviar para uma API
    console.log("Novo agendamento criado:", newAppointment);
    // Redirecionar para a página de agenda
    router.push("/dashboard/agenda");
    // Fechar o menu de funções se estiver aberto
    if (onClose) onClose();
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
      // setIsDarkMode(document.documentElement.classList.contains("dark")); // This line is removed
    }
  }, []);

  // Função para alternar o tema
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Função para fazer logout
  const handleLogout = useCallback(() => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    logout().then(() => {
      router.push('/auth/login');
    }).catch(error => {
      console.error('Erro ao fazer logout:', error);
      setIsLoggingOut(false);
    });
  }, [isLoggingOut, router]);

  type MenuItem = {
    name: string;
    icon: JSX.Element;
    href?: string;
    onClick?: () => void;
  };
  const menuItems: MenuItem[] = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <FiHome className="h-5 w-5" />,
    },
    {
      name: "Agenda",
      href: "/dashboard/agenda",
      icon: <FiCalendar className="h-5 w-5" />,
    },
    {
      name: "Chat",
      href: "/dashboard/support",
      icon: <FiMessageCircle className="h-5 w-5" />,
    },
    {
      name: "Gestão",
      href: "/dashboard/functions/management",
      icon: <FiPieChart className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      href: "/dashboard/functions/clients",
      icon: <FiUsers className="h-5 w-5" />,
    },
    {
      name: "Marketing",
      href: "/dashboard/functions/sales",
      icon: <FiTrendingUp className="h-5 w-5" />,
    },
    {
      name: "Produtos",
      href: "/dashboard/products",
      icon: <FiShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Minha Barbearia",
      href: "/dashboard/functions/my-barbershop",
      icon: <FiHome className="h-5 w-5" />,
    },
    {
      name: "Funções",
      href: "/dashboard/functions",
      icon: <FiMenu className="h-5 w-5" />,
    },
    // Removido o item Configurações
  ];

  return (
    <div className={`py-2 bg-white dark:bg-dark-surface rounded-md shadow-lg ${className}`}>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {menuItems.map((item) => (
          item.onClick ? (
            <button
              key={item.name}
              onClick={item.onClick}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors text-left"
            >
              <span className="text-primary">{item.icon}</span>
              <span className="text-gray-700 dark:text-dark-text">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              href={item.href!}
              onClick={onClose}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors text-left w-full"
            >
              <span className="text-primary">{item.icon}</span>
              <span className="text-gray-700 dark:text-dark-text">{item.name}</span>
            </Link>
          )
        ))}

        {/* Tema */}
        {/* Removido botão de tema claro/escuro */}

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors text-left disabled:opacity-50"
        >
          <span className="text-primary">
            <FiLogOut className="h-5 w-5" />
          </span>
          <span className="text-gray-700 dark:text-dark-text">
            {isLoggingOut ? "Saindo..." : "Sair"}
          </span>
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
