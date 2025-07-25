"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { login } from "@/lib/auth-service";
import dynamic from 'next/dynamic';

// Importar a versão simplificada como fallback
const LoginPageSimple = dynamic(() => import('./page-simple'), {
  ssr: false,
});

export default function LoginPage() {
  const [hasError, setHasError] = useState(false);

  // Detectar erros de renderização
  useEffect(() => {
    try {
      // Verificar se estamos no navegador
      if (typeof window !== 'undefined') {
        // Tentar acessar localStorage como teste
        window.localStorage.getItem('test');
      }
    } catch (error) {
      console.error('Error detected, falling back to simple login:', error);
      setHasError(true);
    }
  }, []);

  // Se houver erro, mostrar a versão simplificada
  if (hasError) {
    return <LoginPageSimple />;
  }
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para controlar o modal de seleção de tipo de usuário
  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Tenta fazer login usando o serviço de autenticação
      const result = await login({ email, password });

      if (result) {
        // Armazena o token e informações do usuário no localStorage
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
          }

          // Redirect to dashboard
          router.push("/dashboard");
        } catch (storageError) {
          console.error('Error storing auth data:', storageError);
          // Continue with redirect even if storage fails
          router.push("/dashboard");
        }
      } else {
        setError("Email ou senha incorretos. Por favor, verifique suas credenciais.");
      }
    } catch (err) {
      setError("Falha ao fazer login. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-sm link">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setIsUserTypeModalOpen(true)}
            className="link"
            type="button"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Modal de seleção de tipo de usuário */}
      <Modal
        isOpen={isUserTypeModalOpen}
        onClose={() => setIsUserTypeModalOpen(false)}
        title="Selecione o tipo de conta"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Escolha o tipo de conta que você deseja criar:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setIsUserTypeModalOpen(false); // Fechar o modal primeiro
                // Usar window.location para garantir navegação completa
                window.location.href = "/auth/register?type=client";
              }}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="font-medium">Cliente</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                Agende serviços e compre produtos
              </span>
            </button>

            <button
              onClick={() => {
                setIsUserTypeModalOpen(false); // Fechar o modal primeiro
                // Usar window.location para garantir navegação completa
                window.location.href = "/auth/register?type=professional";
              }}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="font-medium">Profissional</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                Ofereça serviços e venda produtos
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
