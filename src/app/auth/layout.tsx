import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ClientThemeProvider } from "@/components/ClientThemeProvider";

// Forçar renderização dinâmica para autenticação
export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {children}
        </div>
      </div>
    </ClientThemeProvider>
  );
}
