'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome, FiCalendar, FiUsers, FiShoppingBag,
  FiVideo, FiBarChart2, FiSettings, FiMenu,
  FiX, FiSun, FiMoon, FiLogOut, FiMessageCircle, FiPlus
} from 'react-icons/fi';
import { useTheme } from 'next-themes';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Verificar se estamos no cliente para evitar erros de hidratação
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Atendimento', href: '/dashboard/support', icon: FiMessageCircle },
    { name: 'Agenda', href: '/dashboard/appointments', icon: FiCalendar },
    { name: '+ Adicionar Produto', href: '/dashboard/products', icon: FiPlus },
    { name: 'Clientes', href: '/dashboard/clients', icon: FiUsers },
    { name: 'Produtos', href: '/dashboard/products', icon: FiShoppingBag },
    { name: 'Cursos', href: '/dashboard/courses', icon: FiVideo },
    { name: 'Relatórios', href: '/dashboard/reports', icon: FiBarChart2 },
    { name: 'Configurações', href: '/dashboard/settings', icon: FiSettings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar para desktop */}
      <aside
        className={`fixed inset-y-0 z-50 flex flex-col bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobile ? 'left-0 transform' : ''} ${
          isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-8 w-8"
            />
            {isSidebarOpen && (
              <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
                BarberApp
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        {/* Botão Adicionar Produto */}
        {isSidebarOpen && (
          <div className="px-4 py-2">
            <Link href="/dashboard/products">
              <a className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg space-x-2 transition-colors">
                <FiPlus />
                <span>+ Adicionar Produto</span>
              </a>
            </Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-2 py-3 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                  <item.icon className={`h-5 w-5 ${!isSidebarOpen ? 'mx-auto' : 'mr-3'}`} />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <Link
              href="/login"
              className="flex items-center p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <FiLogOut size={20} />
              {isSidebarOpen && <span className="ml-2">Sair</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}

      {/* Conteúdo principal */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Barra superior */}
        <header className="sticky top-0 z-30 bg-white dark:bg-dark-surface shadow-sm h-16 flex items-center px-4 md:px-6">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 mr-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              <FiMenu size={20} />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
            {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
          </h1>
        </header>

        {/* Conteúdo da página */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
