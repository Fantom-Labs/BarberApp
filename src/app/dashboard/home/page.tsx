"use client";

import { FiCalendar, FiShoppingBag, FiVideo, FiUsers, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

export default function HomePage() {
  // Dados de exemplo
  const stats = [
    { title: "Agendamentos Hoje", value: "8", icon: <FiCalendar className="h-6 w-6 text-blue-500" /> },
    { title: "Vendas do Mês", value: "R$ 5.240", icon: <FiDollarSign className="h-6 w-6 text-green-500" /> },
    { title: "Novos Clientes", value: "12", icon: <FiUsers className="h-6 w-6 text-purple-500" /> },
    { title: "Cursos Ativos", value: "5", icon: <FiVideo className="h-6 w-6 text-red-500" /> },
  ];

  const quickAccess = [
    { title: "Novo Agendamento", icon: <FiCalendar className="h-6 w-6" />, href: "/dashboard/agenda/new" },
    { title: "Adicionar Produto", icon: <FiShoppingBag className="h-6 w-6" />, href: "/dashboard/products/new" },
    { title: "Novo Curso", icon: <FiVideo className="h-6 w-6" />, href: "/dashboard/courses/new" },
    { title: "Ver Relatórios", icon: <FiTrendingUp className="h-6 w-6" />, href: "/dashboard/functions/reports" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bem-vindo à sua Barbearia</h1>

      {/* Banner Principal */}
      {/* Removido conforme solicitado */}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acesso Rápido */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                <FiCalendar className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Novo agendamento confirmado</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: João Silva • Serviço: Corte + Barba</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Há {item} hora{item > 1 ? 's' : ''} atrás</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary-dark font-medium">
            Ver todas as atividades
          </button>
        </div>
      </div>
    </div>
  );
}
