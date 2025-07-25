"use client";

import { useState } from "react";
import { FiDollarSign, FiCalendar, FiDownload, FiFilter, FiUsers } from "react-icons/fi";

export default function CommissionsPage() {
  const [period, setPeriod] = useState<"current" | "previous" | "custom">("current");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Dados de exemplo para comissões
  const commissions = [
    {
      id: 1,
      barber: "Rafael Silva",
      photo: "",
      revenue: 2450,
      services: 38,
      products: 12,
      commissionRate: 30,
      commissionValue: 735,
      status: "pending"
    },
    {
      id: 2,
      barber: "Carlos Oliveira",
      photo: "",
      revenue: 1980,
      services: 25,
      products: 8,
      commissionRate: 30,
      commissionValue: 594,
      status: "pending"
    },
    {
      id: 3,
      barber: "Pedro Santos",
      photo: "",
      revenue: 1750,
      services: 22,
      products: 5,
      commissionRate: 30,
      commissionValue: 525,
      status: "pending"
    },
    {
      id: 4,
      barber: "Marcos Souza",
      photo: "",
      revenue: 1520,
      services: 20,
      products: 4,
      commissionRate: 30,
      commissionValue: 456,
      status: "pending"
    },
    {
      id: 5,
      barber: "João Pereira",
      photo: "",
      revenue: 1350,
      services: 18,
      products: 3,
      commissionRate: 30,
      commissionValue: 405,
      status: "pending"
    },
  ];
  
  // Histórico de comissões
  const commissionHistory = [
    {
      period: "Março/2023",
      totalRevenue: 9500,
      totalCommission: 2850,
      status: "paid",
      date: "05/04/2023"
    },
    {
      period: "Fevereiro/2023",
      totalRevenue: 8200,
      totalCommission: 2460,
      status: "paid",
      date: "05/03/2023"
    },
    {
      period: "Janeiro/2023",
      totalRevenue: 7800,
      totalCommission: 2340,
      status: "paid",
      date: "05/02/2023"
    }
  ];
  
  const totalRevenue = commissions.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = commissions.reduce((sum, item) => sum + item.commissionValue, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comissões</h1>
        
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors">
            <FiDownload className="h-5 w-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FiFilter className="mr-2 text-primary" />
              Período
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPeriod("current")}
                className={`px-3 py-1 rounded-md ${
                  period === "current"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Mês Atual
              </button>
              <button
                onClick={() => setPeriod("previous")}
                className={`px-3 py-1 rounded-md ${
                  period === "previous"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Mês Anterior
              </button>
              <button
                onClick={() => setPeriod("custom")}
                className={`px-3 py-1 rounded-md ${
                  period === "custom"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Personalizado
              </button>
            </div>
          </div>
          
          {period === "custom" && (
            <div className="flex space-x-2">
              <div>
                <label className="block text-sm font-medium mb-1">De</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Até</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Faturamento Total</p>
              <p className="text-2xl font-semibold mt-1">R$ {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comissões a Pagar</p>
              <p className="text-2xl font-semibold mt-1">R$ {totalCommission.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Período</p>
              <p className="text-2xl font-semibold mt-1">Abril/2023</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de Comissões */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Comissões por Profissional</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profissional</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faturamento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serviços</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produtos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Taxa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comissão</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {commissions.map((commission) => (
                <tr key={commission.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 mr-3"></div>
                      <div>
                        <p className="font-medium">{commission.barber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">R$ {commission.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{commission.services}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{commission.products}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{commission.commissionRate}%</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">R$ {commission.commissionValue.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                      Pendente
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Histórico de Comissões */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Histórico de Comissões</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Período</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faturamento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comissões</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {commissionHistory.map((history, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">{history.period}</td>
                  <td className="px-4 py-3 whitespace-nowrap">R$ {history.totalRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">R$ {history.totalCommission.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                      Pago
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{history.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
