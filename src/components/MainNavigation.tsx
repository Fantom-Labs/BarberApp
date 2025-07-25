"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCalendar, FiShoppingBag, FiVideo, FiMenu, FiHome, FiBarChart2, FiSettings, FiPieChart } from "react-icons/fi";
import { memo, useCallback } from "react";
import React from "react";

interface MainNavigationProps {
  className?: string;
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const NavLink = memo(({ href, active, children, icon }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 h-full border-b-2 transition-colors ${
        active
          ? "border-primary text-primary"
          : "border-transparent hover:bg-gray-300 dark:hover:bg-gray-700"
      }`}
      prefetch={false}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
});

NavLink.displayName = "NavLink";

export const MainNavigation = memo(function MainNavigation({ className = "" }: MainNavigationProps) {
  // Menu desativado
  return null;
});

MainNavigation.displayName = "MainNavigation";
