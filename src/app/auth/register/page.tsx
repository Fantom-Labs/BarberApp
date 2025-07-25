"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isEmailUnique, isPhoneUnique, formatPhoneNumber, validateEmail } from "@/lib/validation-service";
import { PasswordStrength } from "@/components/PasswordStrength";
import { register } from "@/lib/auth-service";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userType, setUserType] = useState<"client" | "professional" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [validatingPhone, setValidatingPhone] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Obter o tipo de usuário da URL
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "client" || type === "professional") {
      setUserType(type);
    } else {
      // Se não houver tipo especificado, redirecionar para a página de login
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  // Validar email quando o usuário terminar de digitar
  const handleEmailBlur = async () => {
    if (!email) return;

    // Validar formato do email
    if (!validateEmail(email)) {
      setEmailError("Formato de email inválido");
      return;
    }

    setValidatingEmail(true);
    setEmailError(null);

    try {
      const isUnique = await isEmailUnique(email);
      if (!isUnique) {
        setEmailError("Este email já está em uso");
      }
    } catch (error) {
      console.error("Erro ao validar email:", error);
    } finally {
      setValidatingEmail(false);
    }
  };

  // Formatar e validar telefone quando o usuário digitar
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);

    // Formatar o telefone
    const formatted = formatPhoneNumber(value);
    setFormattedPhone(formatted);
  };

  // Validar telefone quando o usuário terminar de digitar
  const handlePhoneBlur = async () => {
    if (!phone) return;

    // Validar formato do telefone (deve ter pelo menos 10 dígitos)
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setPhoneError("Telefone deve ter pelo menos 10 dígitos");
      return;
    }

    setValidatingPhone(true);
    setPhoneError(null);

    try {
      const isUnique = await isPhoneUnique(phone);
      if (!isUnique) {
        setPhoneError("Este telefone já está em uso");
      }
    } catch (error) {
      console.error("Erro ao validar telefone:", error);
    } finally {
      setValidatingPhone(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar email e telefone novamente
    await Promise.all([handleEmailBlur(), handlePhoneBlur()]);

    // Verificar se há erros de validação
    if (emailError || phoneError) {
      setError("Por favor, corrija os erros de validação antes de continuar.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      if (!userType) {
        throw new Error("Tipo de usuário não selecionado");
      }

      // Registrar usuário usando o serviço de autenticação
      const result = await register({
        name,
        email,
        phone,
        birthDate,
        password,
        type: userType
      });

      // Armazenar token e informações do usuário no localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
        }
      } catch (storageError) {
        console.error('Error storing auth data:', storageError);
        // Continue with the registration process even if storage fails
      }

      // Mostrar mensagem de sucesso
      setSuccess(true);
      setEmailSent(true);

      // Exibir mensagem no console para confirmar o registro
      console.log("Usuário registrado com sucesso:", {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        type: result.user.type
      });

      // Salvar informações do usuário registrado para exibir na página de login
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('registeredUser', JSON.stringify({
            name: result.user.name,
            email: result.user.email,
            registeredAt: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('Erro ao salvar informações do usuário registrado:', error);
      }

      // Aguardar 2 segundos e redirecionar para o dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Falha ao registrar. Por favor, tente novamente.");
      } else {
        setError("Falha ao registrar. Por favor, tente novamente.");
      }
      console.error("Erro ao registrar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">
        {userType === "client" ? "Cadastro de Cliente" : "Cadastro de Profissional"}
      </h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded relative mb-4">
          <p>Cadastro realizado com sucesso!</p>
          {emailSent && <p>Um email de confirmação foi enviado para {email}.</p>}
          <p>Redirecionando para o dashboard...</p>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="João Silva"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              className={`input-field ${emailError ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="seu@email.com"
              required
            />
            {validatingEmail && (
              <p className="text-xs text-gray-500 mt-1">Verificando email...</p>
            )}
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="form-label">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              value={formattedPhone || phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              className={`input-field ${phoneError ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder="(11) 99999-9999"
              required
            />
            {validatingPhone && (
              <p className="text-xs text-gray-500 mt-1">Verificando telefone...</p>
            )}
            {phoneError && (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthDate" className="form-label">
              Data de Nascimento
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <PasswordStrength password={password} />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Finalizar Cadastro"}
          </button>
        </form>
      )}

      {!success && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{" "}
            <Link href="/auth/login" className="link">
              Entrar
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
