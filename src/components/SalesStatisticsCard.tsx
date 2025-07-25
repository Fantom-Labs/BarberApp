"use client";

import React from 'react';
import { FiDollarSign, FiShoppingBag, FiCreditCard, FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi';

// Função para obter estatísticas de vendas (simulada)
const getSalesStatistics = () => {
  // Em um ambiente real, isso viria de uma API ou serviço
  return {
    totalSales: 5240,
    averageTicket: 85.00,
    transactionCount: 59,
    monthlyGrowth: 15,
    topSellingProduct: 'Óleo para Barba',
    topSellingProductCount: 15,
    newCustomers: 19,
    appointmentCount: 82
  };
};

export default function SalesStatisticsCard() {
  const stats = getSalesStatistics();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium mb-3">Estatísticas de Vendas</h3>

      {/* Primeira linha de indicadores: Total de Vendas / Ticket Médio / Transações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-2 mt-0.5">
            <FiDollarSign className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total de</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Vendas</div>
            <div className="text-sm font-medium whitespace-nowrap">R$ {stats.totalSales.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-2 mt-0.5">
            <FiCreditCard className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Ticket</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Médio</div>
            <div className="text-sm font-medium whitespace-nowrap">R$ {stats.averageTicket.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 mr-2 mt-0.5">
            <FiShoppingBag className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total de</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Transações</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.transactionCount}</div>
          </div>
        </div>
      </div>

      {/* Segunda linha de indicadores: Crescimento / Produto Mais Vendido / Novos Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-0">
        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-2 mt-0.5">
            <FiTrendingUp className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Crescimento</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Mensal</div>
            <div className="text-sm font-medium whitespace-nowrap">+{stats.monthlyGrowth}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              em relação ao mês anterior
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mr-2 mt-0.5">
            <FiShoppingBag className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Produto</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Mais Vendido</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.topSellingProduct}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stats.topSellingProductCount} unidades
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mr-2 mt-0.5">
            <FiUsers className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Novos</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Clientes</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.newCustomers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              este mês
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
