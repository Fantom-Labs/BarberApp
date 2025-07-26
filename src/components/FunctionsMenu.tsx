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
    <div className={`bg-white dark:bg-dark-bg-primary border-r border-gray-200 dark:border-dark-border h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cakto-green rounded-lg flex items-center justify-center">
            <FiScissors className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">BarberApp</h2>
            <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              router.pathname === item.href || router.pathname.startsWith(item.href + "/")
                ? "bg-cakto-green text-white"
                : "text-gray-700 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-secondary transition-colors"
        >
          <FiLogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
