"use client";

import React from 'react';
import { getClientStatistics } from '@/lib/client-analytics';
import { FiUsers, FiUserCheck, FiDollarSign, FiCalendar, FiAlertTriangle, FiUserX } from 'react-icons/fi';

export default function ClientStatisticsCard() {
  const stats = getClientStatistics();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium mb-3">Estatísticas de Clientes</h3>

      {/* Primeira linha de indicadores: Total de Clientes / Ticket Médio / Frequência Média */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mr-2 mt-0.5">
            <FiUsers className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total de</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Clientes</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.totalClients}</div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mr-2 mt-0.5">
            <FiDollarSign className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Ticket</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Médio</div>
            <div className="text-sm font-medium whitespace-nowrap">R$ {stats.averageValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 mr-2 mt-0.5">
            <FiCalendar className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Frequência</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Média</div>
            <div className="text-sm font-medium whitespace-nowrap">
              {stats.averageFrequency > 0 ? `${stats.averageFrequency} dias` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Segunda linha de indicadores: Clientes Ativos / Clientes Inativos / Clientes em Risco */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-0">
        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mr-2 mt-0.5">
            <FiUserCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Clientes</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Ativos</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.activeClients}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((stats.activeClients / stats.totalClients) * 100)}% do total
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400 mr-2 mt-0.5">
            <FiUserX className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Clientes</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Inativos</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.inactiveClients}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((stats.inactiveClients / stats.totalClients) * 100)}% do total
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="p-1.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mr-2 mt-0.5">
            <FiAlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Clientes</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">em Risco</div>
            <div className="text-sm font-medium whitespace-nowrap">{stats.atRiskClients}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((stats.atRiskClients / stats.totalClients) * 100)}% do total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
