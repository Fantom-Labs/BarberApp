"use client";

import { useState } from "react";
import { FiInfo, FiX } from "react-icons/fi";

export function LoginInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Informações de Login
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <p>
                Para facilitar o acesso, você pode usar as seguintes credenciais:
              </p>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 text-blue-600 dark:text-blue-300 hover:underline font-medium"
              >
                {isOpen ? "Ocultar detalhes" : "Mostrar detalhes"}
              </button>
              
              {isOpen && (
                <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800">
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium">Usuário pré-cadastrado:</p>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          <span className="font-medium">Email:</span>
                          <div className="mt-1 select-all bg-blue-50 dark:bg-blue-900/30 p-1 rounded text-xs">
                            lucas.gomes@example.com
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          <span className="font-medium">Senha:</span>
                          <div className="mt-1 select-all bg-blue-50 dark:bg-blue-900/30 p-1 rounded text-xs">
                            senha123
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Este usuário já possui dados cadastrados e agendamentos.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
                  >
                    <FiX className="mr-1 h-3 w-3" />
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
