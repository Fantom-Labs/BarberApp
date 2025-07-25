"use client";

import { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

interface LoginSuccessMessageProps {
  userName?: string;
}

export function LoginSuccessMessage({ userName }: LoginSuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(userName || "");

  useEffect(() => {
    // Verificar se há um usuário recém-registrado
    try {
      if (typeof window !== "undefined") {
        const registeredUser = sessionStorage.getItem("registeredUser");
        if (registeredUser) {
          const userData = JSON.parse(registeredUser);
          setName(userData.name || "");
          setIsVisible(true);
          
          // Limpar a informação após exibir
          setTimeout(() => {
            sessionStorage.removeItem("registeredUser");
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar usuário registrado:", error);
    }
  }, [userName]);

  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-fadeIn">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiCheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
            Cadastro realizado com sucesso!
          </h3>
          <div className="mt-2 text-sm text-green-700 dark:text-green-400">
            <p>
              {name ? `Bem-vindo(a), ${name}!` : "Seu cadastro foi concluído com sucesso."} 
              Você já pode fazer login com suas credenciais.
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="mt-2 text-xs text-green-600 dark:text-green-400 hover:underline"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
