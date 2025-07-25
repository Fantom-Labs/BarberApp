"use client";

import { useState } from "react";
import { FiBarChart2, FiCalendar, FiDollarSign, FiUsers, FiShoppingBag, FiDownload, FiFilter, FiAward } from "react-icons/fi";
import AgeDistributionChart from "@/components/AgeDistributionChart";
import SalesStatisticsCard from "@/components/SalesStatisticsCard";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState<"overview" | "sales" | "appointments" | "clients" | "products" | "barbers">("overview");

  // Dados de exemplo para o ranking de barbeiros
  const barbersData = [
    {
      id: 1,
      name: "Rafael",
      photo: "",
      rating: 9.5,
      metrics: {
        revenue: 2450,
        ticketAvg: 85,
        appointments: 38,
        newClients: 9
      }
    },
    {
      id: 2,
      name: "Carlos",
      photo: "",
      rating: 8.7,
      metrics: {
        revenue: 1980,
        ticketAvg: 95,
        appointments: 25,
        newClients: 5
      }
    },
    {
      id: 3,
      name: "Pedro",
      photo: "",
      rating: 8.2,
      metrics: {
        revenue: 1750,
        ticketAvg: 80,
        appointments: 22,
        newClients: 4
      }
    },
    {
      id: 4,
      name: "Marcos",
      photo: "",
      rating: 7.9,
      metrics: {
        revenue: 1520,
        ticketAvg: 76,
        appointments: 20,
        newClients: 3
      }
    },
    {
      id: 5,
      name: "João",
      photo: "",
      rating: 7.5,
      metrics: {
        revenue: 1350,
        ticketAvg: 75,
        appointments: 18,
        newClients: 2
      }
    },
  ];

  // Dados de exemplo para os gráficos
  const salesData = [
    { date: "01/04", value: 450 },
    { date: "02/04", value: 380 },
    { date: "03/04", value: 520 },
    { date: "04/04", value: 490 },
    { date: "05/04", value: 600 },
    { date: "06/04", value: 750 },
    { date: "07/04", value: 420 },
    { date: "08/04", value: 390 },
    { date: "09/04", value: 480 },
    { date: "10/04", value: 520 },
  ];

  const appointmentsData = [
    { date: "01/04", value: 8 },
    { date: "02/04", value: 6 },
    { date: "03/04", value: 9 },
    { date: "04/04", value: 7 },
    { date: "05/04", value: 10 },
    { date: "06/04", value: 12 },
    { date: "07/04", value: 7 },
    { date: "08/04", value: 6 },
    { date: "09/04", value: 8 },
    { date: "10/04", value: 9 },
  ];

  const clientsData = [
    { date: "01/04", value: 2 },
    { date: "02/04", value: 1 },
    { date: "03/04", value: 3 },
    { date: "04/04", value: 0 },
    { date: "05/04", value: 2 },
    { date: "06/04", value: 4 },
    { date: "07/04", value: 1 },
    { date: "08/04", value: 2 },
    { date: "09/04", value: 1 },
    { date: "10/04", value: 3 },
  ];

  const productsData = [
    { name: "Pomada Modeladora", sales: 12, revenue: 540 },
    { name: "Shampoo Anticaspa", sales: 8, revenue: 320 },
    { name: "Óleo para Barba", sales: 15, revenue: 525 },
    { name: "Máquina de Corte", sales: 2, revenue: 600 },
    { name: "Pente de Madeira", sales: 7, revenue: 175 },
  ];

  // Função para renderizar o gráfico de barras
  const renderBarChart = (data: { date: string; value: number }[]) => {
    const maxValue = Math.max(...data.map(item => item.value));

    return (
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-primary rounded-t-sm"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs mt-1 transform -rotate-45 origin-top-left">{item.date}</div>
          </div>
        ))}
      </div>
    );
  };

  // Função para renderizar o relatório com base no tipo selecionado
  const renderReport = () => {
    switch (reportType) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Principais Indicadores</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Faturamento */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Faturamento</h4>
                      <p className="text-2xl font-semibold mt-1">R$ 5.240</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <FiDollarSign className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="h-24">
                    {/* Mini gráfico de linha */}
                    <div className="relative h-full flex items-end">
                      {salesData.slice(-7).map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-sm"
                            style={{ height: `${(item.value / 750) * 100}%` }}
                          ></div>
                        </div>
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                        +15% este mês
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Médio */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Médio</h4>
                      <p className="text-2xl font-semibold mt-1">R$ 85,00</p>
                    </div>
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <FiDollarSign className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="h-24">
                    {/* Mini gráfico de linha */}
                    <div className="relative h-full flex items-end">
                      {[65, 70, 75, 72, 80, 82, 85].map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-green-500 rounded-sm"
                            style={{ height: `${(value / 85) * 100}%` }}
                          ></div>
                        </div>
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-green-600 dark:text-green-400 font-medium">
                        +5% este mês
                      </div>
                    </div>
                  </div>
                </div>

                {/* Atendimentos */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Atendimentos</h4>
                      <p className="text-2xl font-semibold mt-1">82</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                      <FiCalendar className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="h-24">
                    {/* Mini gráfico de linha */}
                    <div className="relative h-full flex items-end">
                      {appointmentsData.slice(-7).map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-purple-500 rounded-sm"
                            style={{ height: `${(item.value / 12) * 100}%` }}
                          ></div>
                        </div>
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-purple-600 dark:text-purple-400 font-medium">
                        +8% este mês
                      </div>
                    </div>
                  </div>
                </div>

                {/* Novos Clientes */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Novos Clientes</h4>
                      <p className="text-2xl font-semibold mt-1">19</p>
                    </div>
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      <FiUsers className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="h-24">
                    {/* Mini gráfico de linha */}
                    <div className="relative h-full flex items-end">
                      {clientsData.slice(-7).map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-orange-500 rounded-sm"
                            style={{ height: `${(item.value / 4) * 100}%` }}
                          ></div>
                        </div>
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-orange-600 dark:text-orange-400 font-medium">
                        +12% este mês
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Faturamento Mensal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Faturamento Mensal</h3>
              <div className="h-64">
                {renderBarChart(salesData)}
              </div>
            </div>

            {/* Gráfico de Agendamentos vs Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Agendamentos</h3>
                <div className="h-48">
                  {renderBarChart(appointmentsData)}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Novos Clientes</h3>
                <div className="h-48">
                  {renderBarChart(clientsData)}
                </div>
              </div>
            </div>
          </div>
        );

      case "sales":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4">Vendas por Dia</h3>
                {renderBarChart(salesData)}
              </div>

              {/* Gráfico de distribuição de idade dos clientes */}
              <AgeDistributionChart title="Perfil Etário dos Compradores" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Vendas</h3>
                <p className="text-2xl font-semibold mt-1">R$ 5.000,00</p>
                <p className="text-xs text-green-500 mt-1">+15% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Médio</h3>
                <p className="text-2xl font-semibold mt-1">R$ 85,00</p>
                <p className="text-xs text-green-500 mt-1">+5% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Transações</h3>
                <p className="text-2xl font-semibold mt-1">59</p>
                <p className="text-xs text-green-500 mt-1">+10% em relação ao período anterior</p>
              </div>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4">Agendamentos por Dia</h3>
                {renderBarChart(appointmentsData)}
              </div>

              {/* Gráfico de distribuição de idade dos clientes */}
              <AgeDistributionChart title="Faixa Etária dos Clientes Agendados" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Agendamentos</h3>
                <p className="text-2xl font-semibold mt-1">82</p>
                <p className="text-xs text-green-500 mt-1">+8% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Ocupação</h3>
                <p className="text-2xl font-semibold mt-1">78%</p>
                <p className="text-xs text-green-500 mt-1">+5% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Serviço Mais Popular</h3>
                <p className="text-2xl font-semibold mt-1">Corte + Barba</p>
                <p className="text-xs text-gray-500 mt-1">35 agendamentos</p>
              </div>
            </div>
          </div>
        );

      case "clients":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4">Novos Clientes por Dia</h3>
                {renderBarChart(clientsData)}
              </div>

              {/* Gráfico de distribuição de idade */}
              <AgeDistributionChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Clientes</h3>
                <p className="text-2xl font-semibold mt-1">245</p>
                <p className="text-xs text-green-500 mt-1">+12% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Novos Clientes</h3>
                <p className="text-2xl font-semibold mt-1">19</p>
                <p className="text-xs text-green-500 mt-1">+15% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Retorno</h3>
                <p className="text-2xl font-semibold mt-1">68%</p>
                <p className="text-xs text-green-500 mt-1">+3% em relação ao período anterior</p>
              </div>
            </div>
          </div>
        );

      case "products":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unidades Vendidas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {productsData.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{product.sales}</td>
                        <td className="px-4 py-3 whitespace-nowrap">R$ {product.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Produtos Vendidos</h3>
                <p className="text-2xl font-semibold mt-1">44</p>
                <p className="text-xs text-green-500 mt-1">+20% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Receita Total</h3>
                <p className="text-2xl font-semibold mt-1">R$ 2.160,00</p>
                <p className="text-xs text-green-500 mt-1">+18% em relação ao período anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Produto Mais Vendido</h3>
                <p className="text-2xl font-semibold mt-1">Óleo para Barba</p>
                <p className="text-xs text-gray-500 mt-1">15 unidades</p>
              </div>
            </div>
          </div>
        );

      case "barbers":
        return (
          <div className="space-y-6">
            {/* Ranking de Barbeiros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">Ranking de Barbeiros</h3>

              {/* Pódio */}
              <div className="flex justify-center items-end mb-10 mt-4">
                {/* Segundo Lugar */}
                <div className="flex flex-col items-center mx-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                      {/* Imagem do barbeiro */}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-gray-300 dark:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-bold">2</span>
                    </div>
                  </div>
                  <div className="h-32 w-24 bg-gray-300 dark:bg-gray-700 rounded-t-lg mt-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-medium">{barbersData[1].name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{barbersData[1].rating}</p>
                    </div>
                  </div>
                </div>

                {/* Primeiro Lugar */}
                <div className="flex flex-col items-center mx-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-yellow-400">
                      {/* Imagem do barbeiro */}
                    </div>
                    <div className="absolute -top-2 -right-1 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
                      <FiAward className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="h-40 w-28 bg-yellow-400 rounded-t-lg mt-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-bold text-white text-lg">{barbersData[0].name}</p>
                      <p className="text-white font-medium">{barbersData[0].rating}</p>
                    </div>
                  </div>
                </div>

                {/* Terceiro Lugar */}
                <div className="flex flex-col items-center mx-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-amber-700">
                      {/* Imagem do barbeiro */}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-amber-700 rounded-full w-7 h-7 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                  </div>
                  <div className="h-24 w-20 bg-amber-700 rounded-t-lg mt-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-medium text-white">{barbersData[2].name}</p>
                      <p className="text-sm text-amber-200">{barbersData[2].rating}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela de Desempenho */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posição</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Barbeiro</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avaliação</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faturamento</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket Médio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Atendimentos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Novos Clientes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {barbersData.map((barber, index) => (
                      <tr key={barber.id} className={index < 3 ? "bg-gray-50 dark:bg-gray-800" : ""}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {index === 0 && <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center mr-2"><span className="text-xs font-bold text-white">1</span></div>}
                            {index === 1 && <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2"><span className="text-xs font-bold">2</span></div>}
                            {index === 2 && <div className="w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center mr-2"><span className="text-xs font-bold text-white">3</span></div>}
                            {index > 2 && <span className="font-medium">{index + 1}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                            <span className="font-medium">{barber.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">{barber.rating}</td>
                        <td className="px-4 py-3 whitespace-nowrap">R$ {barber.metrics.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">R$ {barber.metrics.ticketAvg.toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{barber.metrics.appointments}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{barber.metrics.newClients}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráficos de Desempenho Individual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Faturamento por Barbeiro</h3>
                <div className="h-64">
                  <div className="h-full flex items-end space-x-4">
                    {barbersData.map((barber, index) => (
                      <div key={barber.id} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300 dark:bg-gray-600' : index === 2 ? 'bg-amber-700' : 'bg-blue-500'} rounded-t-sm`}
                          style={{ height: `${(barber.metrics.revenue / barbersData[0].metrics.revenue) * 100}%` }}
                        ></div>
                        <p className="text-xs mt-2">{barber.name}</p>
                        <p className="text-xs font-medium">R$ {barber.metrics.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Atendimentos por Barbeiro</h3>
                <div className="h-64">
                  <div className="h-full flex items-end space-x-4">
                    {barbersData.map((barber, index) => (
                      <div key={barber.id} className="flex-1 flex flex-col items-center">
                        <div
                          className={`w-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300 dark:bg-gray-600' : index === 2 ? 'bg-amber-700' : 'bg-green-500'} rounded-t-sm`}
                          style={{ height: `${(barber.metrics.appointments / barbersData[0].metrics.appointments) * 100}%` }}
                        ></div>
                        <p className="text-xs mt-2">{barber.name}</p>
                        <p className="text-xs font-medium">{barber.metrics.appointments}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <button className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors">
          <FiDownload className="h-5 w-5" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FiFilter className="mr-2 text-primary" />
              Filtros
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateRange("today")}
                className={`px-3 py-1 rounded-md ${
                  dateRange === "today"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setDateRange("week")}
                className={`px-3 py-1 rounded-md ${
                  dateRange === "week"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Esta Semana
              </button>
              <button
                onClick={() => setDateRange("month")}
                className={`px-3 py-1 rounded-md ${
                  dateRange === "month"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Este Mês
              </button>
              <button
                onClick={() => setDateRange("year")}
                className={`px-3 py-1 rounded-md ${
                  dateRange === "year"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Este Ano
              </button>
              <button
                onClick={() => setDateRange("custom")}
                className={`px-3 py-1 rounded-md ${
                  dateRange === "custom"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Personalizado
              </button>
            </div>
          </div>

          {dateRange === "custom" && (
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

      {/* Tipos de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <button
          onClick={() => setReportType("overview")}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            reportType === "overview"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <FiBarChart2 className="h-6 w-6" />
          <span className="font-medium">Visão Geral</span>
        </button>

        <button
          onClick={() => setReportType("sales")}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            reportType === "sales"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <FiDollarSign className="h-6 w-6" />
          <span className="font-medium">Vendas</span>
        </button>

        <button
          onClick={() => setReportType("appointments")}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            reportType === "appointments"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <FiCalendar className="h-6 w-6" />
          <span className="font-medium">Agendamentos</span>
        </button>

        <button
          onClick={() => setReportType("clients")}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            reportType === "clients"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <FiUsers className="h-6 w-6" />
          <span className="font-medium">Clientes</span>
        </button>

        <button
          onClick={() => setReportType("products")}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            reportType === "products"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <FiShoppingBag className="h-6 w-6" />
          <span className="font-medium">Produtos</span>
        </button>

        <button
          onClick={() => setReportType("barbers")}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            reportType === "barbers"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <FiAward className="h-6 w-6" />
          <span className="font-medium">Barbeiros</span>
        </button>
      </div>

      {/* Conteúdo do Relatório */}
      {renderReport()}
    </div>
  );
}
