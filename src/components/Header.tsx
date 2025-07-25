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
        <ThemeToggle />
      </div>
    </header>
  );
});
