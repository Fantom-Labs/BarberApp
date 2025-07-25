"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiPackage, 
  FiTrendingUp, 
  FiBarChart2, 
  FiMessageCircle, 
  FiCreditCard, 
  FiUsers
} from 'react-icons/fi';

export default function SalesPage() {
  // Dados de exemplo para vendas
  const salesData = [
    { month: 'Jan', value: 4200 },
    { month: 'Fev', value: 3800 },
    { month: 'Mar', value: 5100 },
    { month: 'Abr', value: 4800 },
    { month: 'Mai', value: 5300 },
    { month: 'Jun', value: 5800 },
  ];

  // Dados de exemplo para produtos mais vendidos
  const topProducts = [
    { id: 1, name: 'Pomada Modeladora', sales: 42, revenue: 1680 },
    { id: 2, name: 'Shampoo Anticaspa', sales: 38, revenue: 1140 },
    { id: 3, name: 'Óleo para Barba', sales: 35, revenue: 1050 },
    { id: 4, name: 'Pente Profissional', sales: 28, revenue: 560 },
    { id: 5, name: 'Kit Barbear', sales: 25, revenue: 1250 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendas</h1>
        
        <div className="flex space-x-2">
          <Link 
            href="/dashboard/orders/new"
            className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            <FiShoppingBag className="h-5 w-5" />
            <span>Novo Pedido</span>
          </Link>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendas do Mês</p>
              <p className="text-2xl font-semibold mt-1">R$ 5.800</p>
              <p className="text-xs text-green-500 mt-1">+8% em relação ao mês anterior</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiPackage className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos do Mês</p>
              <p className="text-2xl font-semibold mt-1">68</p>
              <p className="text-xs text-green-500 mt-1">+12% em relação ao mês anterior</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FiCreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Médio</p>
              <p className="text-2xl font-semibold mt-1">R$ 85,29</p>
              <p className="text-xs text-red-500 mt-1">-3% em relação ao mês anterior</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Novos Clientes</p>
              <p className="text-2xl font-semibold mt-1">15</p>
              <p className="text-xs text-green-500 mt-1">+5% em relação ao mês anterior</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ferramentas de Vendas */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Ferramentas de Vendas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Atendimento ao Cliente */}
        <Link 
          href="/dashboard/functions/sales/support"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiMessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Atendimento ao Cliente</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Chatbot integrado ao WhatsApp Business para atendimento automatizado
              </p>
            </div>
          </div>
        </Link>

        {/* Card de Produtos Mais Vendidos */}
        <Link 
          href="/dashboard/functions/top-products"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Produtos Mais Vendidos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Análise dos produtos com melhor desempenho de vendas
              </p>
            </div>
          </div>
        </Link>

        {/* Card de Relatórios de Vendas */}
        <Link 
          href="/dashboard/functions/reports?tab=sales"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FiBarChart2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Relatórios de Vendas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Relatórios detalhados sobre o desempenho de vendas
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Gráfico de Vendas Mensais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Vendas Mensais</h3>
        <div className="h-64">
          <div className="h-full flex items-end space-x-6">
            {salesData.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-sm"
                  style={{ height: `${(month.value / 6000) * 100}%` }}
                ></div>
                <p className="text-xs mt-2">{month.month}</p>
                <p className="text-xs font-medium">R$ {month.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Produtos Mais Vendidos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Produtos Mais Vendidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unidades Vendidas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receita</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.sales} un.</td>
                  <td className="px-4 py-3 whitespace-nowrap">R$ {product.revenue.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link 
                      href={`/dashboard/products/${product.id}`}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right">
          <Link 
            href="/dashboard/functions/top-products"
            className="text-primary hover:text-primary-dark transition-colors text-sm font-medium"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
