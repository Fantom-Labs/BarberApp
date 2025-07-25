"use client";

import { useState } from "react";
import { FiShoppingBag, FiCalendar, FiFilter, FiBarChart2, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

export default function TopProductsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [category, setCategory] = useState<"all" | "hair" | "beard" | "skin" | "equipment">("all");
  
  // Dados de exemplo para produtos mais vendidos
  const topProducts = [
    {
      id: 1,
      name: "Pomada Modeladora Premium",
      image: "",
      category: "hair",
      price: 45,
      sales: 32,
      revenue: 1440,
      growth: 15
    },
    {
      id: 2,
      name: "Óleo para Barba",
      image: "",
      category: "beard",
      price: 35,
      sales: 28,
      revenue: 980,
      growth: 22
    },
    {
      id: 3,
      name: "Shampoo Anticaspa",
      image: "",
      category: "hair",
      price: 40,
      sales: 25,
      revenue: 1000,
      growth: 8
    },
    {
      id: 4,
      name: "Máquina de Corte Profissional",
      image: "",
      category: "equipment",
      price: 297.5,
      sales: 3,
      revenue: 892.5,
      growth: -5
    },
    {
      id: 5,
      name: "Pente de Madeira",
      image: "",
      category: "hair",
      price: 25,
      sales: 22,
      revenue: 550,
      growth: 10
    },
    {
      id: 6,
      name: "Loção Pós-Barba",
      image: "",
      category: "beard",
      price: 30,
      sales: 18,
      revenue: 540,
      growth: 5
    },
    {
      id: 7,
      name: "Creme Hidratante Facial",
      image: "",
      category: "skin",
      price: 50,
      sales: 15,
      revenue: 750,
      growth: 18
    },
    {
      id: 8,
      name: "Kit Barba Completo",
      image: "",
      category: "beard",
      price: 120,
      sales: 8,
      revenue: 960,
      growth: 25
    },
  ];
  
  // Filtrar produtos por categoria
  const filteredProducts = category === "all" 
    ? topProducts 
    : topProducts.filter(product => product.category === category);
  
  // Ordenar por vendas (do maior para o menor)
  const sortedProducts = [...filteredProducts].sort((a, b) => b.sales - a.sales);
  
  // Calcular totais
  const totalSales = sortedProducts.reduce((sum, product) => sum + product.sales, 0);
  const totalRevenue = sortedProducts.reduce((sum, product) => sum + product.revenue, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos Mais Vendidos</h1>
        
        <Link 
          href="/dashboard/products/new"
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiShoppingBag className="h-5 w-5" />
          <span>Novo Produto</span>
        </Link>
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
                onClick={() => setPeriod("week")}
                className={`px-3 py-1 rounded-md ${
                  period === "week"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Esta Semana
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-3 py-1 rounded-md ${
                  period === "month"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Este Mês
              </button>
              <button
                onClick={() => setPeriod("year")}
                className={`px-3 py-1 rounded-md ${
                  period === "year"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Este Ano
              </button>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FiShoppingBag className="mr-2 text-primary" />
              Categoria
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("all")}
                className={`px-3 py-1 rounded-md ${
                  category === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setCategory("hair")}
                className={`px-3 py-1 rounded-md ${
                  category === "hair"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Cabelo
              </button>
              <button
                onClick={() => setCategory("beard")}
                className={`px-3 py-1 rounded-md ${
                  category === "beard"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Barba
              </button>
              <button
                onClick={() => setCategory("skin")}
                className={`px-3 py-1 rounded-md ${
                  category === "skin"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Pele
              </button>
              <button
                onClick={() => setCategory("equipment")}
                className={`px-3 py-1 rounded-md ${
                  category === "equipment"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Equipamentos
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Vendas</p>
              <p className="text-2xl font-semibold mt-1">{totalSales} unidades</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-semibold mt-1">R$ {totalRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-semibold mt-1">
                {period === "week" ? "Esta Semana" : period === "month" ? "Abril/2023" : "2023"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráfico de Top 5 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiBarChart2 className="mr-2 text-primary" />
          Top 5 Produtos
        </h2>
        
        <div className="h-64">
          <div className="h-full flex items-end space-x-6">
            {sortedProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary rounded-t-sm"
                  style={{ height: `${(product.sales / sortedProducts[0].sales) * 100}%` }}
                ></div>
                <p className="text-xs mt-2 text-center">{product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name}</p>
                <p className="text-xs font-medium">{product.sales} un.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tabela de Produtos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Detalhamento de Vendas</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receita</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crescimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex-shrink-0 mr-3"></div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {product.category === "hair" ? "Cabelo" : 
                       product.category === "beard" ? "Barba" : 
                       product.category === "skin" ? "Pele" : "Equipamentos"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">R$ {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{product.sales}</td>
                  <td className="px-4 py-3 whitespace-nowrap">R$ {product.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <FiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <FiTrendingUp className="h-4 w-4 text-blue-500 mr-1 transform rotate-180" />
                      )}
                      <span className={product.growth > 0 ? "text-green-500" : "text-blue-500"}>
                        {product.growth > 0 ? "+" : ""}{product.growth}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
