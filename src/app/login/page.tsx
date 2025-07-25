'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth-service';
import { getCurrentUser } from '@/lib/storage-service';
import { LoginInfo } from '@/components/LoginInfo';
import { LoginSuccessMessage } from '@/components/LoginSuccessMessage';

export default function LoginDirectPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          // Se o usuário já estiver logado, redirecionar para o dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao verificar usuário logado:', error);
      }
    };

    checkLoggedInUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificar login especial para Lucas Gomes
      if (email.toLowerCase() === 'lucas.gomes@example.com') {
        console.log('Login especial para Lucas Gomes');
        const result = await login({ email, password });

        if (result) {
          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          setError('Senha incorreta. A senha para Lucas Gomes é "senha123"');
        }
      } else {
        // Login normal
        const result = await login({ email, password });

        if (result) {
          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          setError('Email ou senha incorretos. Por favor, verifique suas credenciais.');
        }
      }
    } catch (err) {
      setError('Falha ao fazer login. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <LoginSuccessMessage />

        <LoginInfo />

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                Esqueceu a senha?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link href="/auth/register" className="text-primary hover:text-primary-dark">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
