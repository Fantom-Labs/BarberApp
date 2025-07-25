"use client";

import { useState } from "react";
import { FiTrendingUp, FiCalendar, FiDollarSign, FiUsers, FiEdit, FiCheck, FiX } from "react-icons/fi";
import Link from "next/link";

export default function GoalsPage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [editingGoal, setEditingGoal] = useState<number | null>(null);
  
  // Dados de exemplo para metas
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      name: "Faturamento", 
      icon: <FiDollarSign className="h-5 w-5" />,
      current: 5240, 
      target: 8000, 
      unit: "R$",
      progress: 65.5,
      color: "blue"
    },
    { 
      id: 2, 
      name: "Novos Clientes", 
      icon: <FiUsers className="h-5 w-5" />,
      current: 19, 
      target: 25, 
      unit: "",
      progress: 76,
      color: "green"
    },
    { 
      id: 3, 
      name: "Agendamentos", 
      icon: <FiCalendar className="h-5 w-5" />,
      current: 82, 
      target: 100, 
      unit: "",
      progress: 82,
      color: "blue"
    },
    { 
      id: 4, 
      name: "Ticket Médio", 
      icon: <FiDollarSign className="h-5 w-5" />,
      current: 85, 
      target: 95, 
      unit: "R$",
      progress: 89.5,
      color: "green"
    },
  ]);
  
  const [editForm, setEditForm] = useState({
    target: 0
  });
  
  const handleEditStart = (goal: any) => {
    setEditingGoal(goal.id);
    setEditForm({
      target: goal.target
    });
  };
  
  const handleEditCancel = () => {
    setEditingGoal(null);
  };
  
  const handleEditSave = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { 
            ...goal, 
            target: editForm.target,
            progress: (goal.current / editForm.target) * 100
          } 
        : goal
    ));
    setEditingGoal(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Metas</h1>
        
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              period === "month" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriod("quarter")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              period === "quarter" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Trimestre
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              period === "year" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Ano
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${goal.color}-100 dark:bg-${goal.color}-900/30 text-${goal.color}-600 dark:text-${goal.color}-400 mr-3`}>
                  {goal.icon}
                </div>
                <div>
                  <h3 className="font-medium">{goal.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {period === "month" ? "Meta mensal" : period === "quarter" ? "Meta trimestral" : "Meta anual"}
                  </p>
                </div>
              </div>
              
              {editingGoal === goal.id ? (
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleEditSave(goal.id)}
                    className="p-1 text-green-500 hover:text-green-600"
                  >
                    <FiCheck className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleEditCancel}
                    className="p-1 text-gray-500 hover:text-gray-600"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleEditStart(goal)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{goal.progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`bg-${goal.color}-500 h-2.5 rounded-full`}
                  style={{ width: `${Math.min(100, goal.progress)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Atual</p>
                <p className="text-lg font-semibold">{goal.unit}{goal.current.toLocaleString()}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Meta</p>
                {editingGoal === goal.id ? (
                  <input
                    type="number"
                    value={editForm.target}
                    onChange={(e) => setEditForm({ ...editForm, target: parseInt(e.target.value) })}
                    className="w-24 p-1 text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-lg font-semibold">{goal.unit}{goal.target.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Histórico de Metas</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Período</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faturamento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Novos Clientes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Agendamentos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">Março/2023</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">R$ 7.850</span>
                    <span className="text-green-500 text-xs">98%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">23</span>
                    <span className="text-green-500 text-xs">92%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">95</span>
                    <span className="text-green-500 text-xs">95%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">R$ 82,50</span>
                    <span className="text-green-500 text-xs">94%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">Fevereiro/2023</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">R$ 6.950</span>
                    <span className="text-green-500 text-xs">87%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">18</span>
                    <span className="text-yellow-500 text-xs">72%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">88</span>
                    <span className="text-green-500 text-xs">88%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">R$ 79,00</span>
                    <span className="text-green-500 text-xs">90%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap">Janeiro/2023</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">R$ 6.200</span>
                    <span className="text-yellow-500 text-xs">77%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">15</span>
                    <span className="text-yellow-500 text-xs">60%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">75</span>
                    <span className="text-yellow-500 text-xs">75%</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">R$ 76,50</span>
                    <span className="text-green-500 text-xs">87%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
