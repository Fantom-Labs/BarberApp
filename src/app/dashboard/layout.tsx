"use client";

import { Header } from "@/components/Header";
import { MainNavigation } from "@/components/MainNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { FunctionsMenu } from "@/components/FunctionsMenu";
import { SplashScreen } from "@/components/SplashScreen";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile } from "@/components/UserProfile";
import { FiScissors } from "react-icons/fi";

// Forçar renderização dinâmica para o dashboard
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ClientThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary">
        {/* Header Fixo */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg-secondary shadow-sm border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-500 dark:text-dark-text-tertiary hover:text-gray-700 dark:hover:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cakto-green rounded-lg flex items-center justify-center">
                  <FiScissors className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">BarberApp</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationsPanel />
              <ThemeToggle />
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Conteúdo com padding-top para compensar o header fixo */}
        <div className="pt-14 flex-1 flex overflow-hidden scrollbar-hide">
          {/* Menu de Funções Fixo na Lateral Esquerda - Apenas Desktop */}
          <div className="hidden md:block w-64 border-r border-gray-200 dark:border-dark-border overflow-y-auto scrollbar-hide">
            <FunctionsMenu className="h-full rounded-none shadow-none" />
          </div>
          <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4 scrollbar-hide">
            {children}
          </main>
        </div>

        {/* Navegação mobile */}
        <MobileNavigation />
      </div>
    </ClientThemeProvider>
  );
}
