"use client";

import { memo } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { NotificationsPanel } from "./NotificationsPanel";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

// Usando memo para evitar re-renderizações desnecessárias
export const Header = memo(function Header({ title }: HeaderProps) {
  return (
    <header className="bg-gray-700 dark:bg-gray-900 border-b border-gray-600 dark:border-gray-800 h-16 flex items-center px-4 justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <Logo showText={false} />
      </div>

      <div className="flex items-center space-x-4">
        <NotificationsPanel />
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 relative"
          title="Carrinho"
        >
          <FiShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
});
