"use client";

import { useState, useEffect } from "react";
import { FiCalendar, FiClock, FiFilter, FiPlus, FiChevronDown, FiCheck, FiX } from "react-icons/fi";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

export default function AppointmentsPage() {
  // Dados de exemplo
  const appointments = [
    { id: 1, client: "João Silva", service: "Corte de Cabelo", date: "10/04/2025", time: "14:00", status: "confirmado" },
    { id: 2, client: "Maria Oliveira", service: "Barba", date: "10/04/2025", time: "15:30", status: "pendente" },
    { id: 3, client: "Pedro Santos", service: "Corte + Barba", date: "11/04/2025", time: "10:00", status: "confirmado" },
    { id: 4, client: "Ana Costa", service: "Corte de Cabelo", date: "12/04/2025", time: "11:30", status: "cancelado" },
    { id: 5, client: "Carlos Mendes", service: "Barba", date: "12/04/2025", time: "16:00", status: "confirmado" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
          <FiPlus />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Filtros e Calendário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-500" />
            <span className="font-medium">Abril 2025</span>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FiFilter />
              <span>Filtrar</span>
            </button>
            
            <select className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
        </div>
        
        {/* Calendário Simplificado */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const hasAppointments = [10, 11, 12].includes(day);
            return (
              <button
                key={day}
                className={`text-center py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  hasAppointments ? "font-bold text-primary" : ""
                }`}
              >
                {day}
                {hasAppointments && (
                  <div className="h-1 w-1 bg-primary rounded-full mx-auto mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Lista de Agendamentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold">Agendamentos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Serviço</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horário</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-4 py-3 whitespace-nowrap">{appointment.client}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{appointment.service}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{appointment.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiClock className="mr-1 text-gray-500" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "confirmado" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      appointment.status === "pendente" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
                    <button className="text-red-500 hover:text-red-700">Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando 5 de 5 agendamentos
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50" disabled>
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
