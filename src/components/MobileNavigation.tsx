"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCalendar, FiShoppingBag, FiVideo, FiMenu, FiX, FiHome, FiMessageCircle, FiBarChart2, FiSettings } from "react-icons/fi";
import { FunctionsMenu } from "./FunctionsMenu";

export function MobileNavigation() {
  const pathname = usePathname();
  const [functionsMenuOpen, setFunctionsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/dashboard";
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 md:hidden">
        <div className="flex justify-around items-center h-16">
          <MobileNavLink
            href="/dashboard"
            active={isActive("/dashboard") || pathname === "/dashboard"}
            icon={<FiHome className="h-5 w-5" />}
            label="Home"
          />
          <MobileNavLink
            href="/dashboard/support"
            active={isActive("/dashboard/support")}
            icon={<FiMessageCircle className="h-5 w-5" />}
            label="Atendimento"
          />
          <MobileNavLink
            href="/dashboard/agenda"
            active={isActive("/dashboard/agenda")}
            icon={<FiCalendar className="h-5 w-5" />}
            label="Agenda"
          />
          <MobileNavLink
            href="/dashboard/functions"
            active={isActive("/dashboard/functions")}
            icon={<FiMenu className="h-5 w-5" />}
            label="Funções"
          />
          <MobileNavLink
            href="/dashboard/functions/reports"
            active={isActive("/dashboard/functions/reports")}
            icon={<FiBarChart2 className="h-5 w-5" />}
            label="Relatórios"
          />
        </div>
      </div>

      {/* Functions Menu Modal for Mobile */}
      {functionsMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium text-lg">Funções</h3>
              <button
                onClick={() => setFunctionsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <FunctionsMenu onClose={() => setFunctionsMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

interface MobileNavLinkProps {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

function MobileNavLink({ href, active, icon, label }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-2 w-full ${
        active ? "text-primary" : "text-gray-600 dark:text-gray-400"
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
