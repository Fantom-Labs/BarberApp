"use client";

import React, { useState } from "react";
import { FiCalendar, FiClock, FiUser, FiPlus, FiChevronDown, FiTrendingUp, FiUsers, FiBarChart2 } from "react-icons/fi";
import AppointmentModal from "@/components/AppointmentModal";
import useAppointmentModal from "@/hooks/useAppointmentModal";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const events = [
  {
    title: 'Corte com João',
    start: new Date(2025, 6, 21, 9, 0),
    end: new Date(2025, 6, 21, 10, 0),
  },
  {
    title: 'Barba com Maria',
    start: new Date(2025, 6, 22, 11, 0),
    end: new Date(2025, 6, 22, 11, 30),
  },
  {
    title: 'Coloração com Ana',
    start: new Date(2025, 6, 23, 13, 30),
    end: new Date(2025, 6, 23, 15, 0),
  },
  {
    title: 'Corte com Lucas',
    start: new Date(2025, 6, 24, 15, 30),
    end: new Date(2025, 6, 24, 16, 0),
  },
];

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Dados de exemplo para barbeiros
  const barbers = [
    { id: 1, name: "Rafael Silva", appointments: 8, nextAvailable: "14:30" },
    { id: 2, name: "Carlos Oliveira", appointments: 6, nextAvailable: "15:00" },
    { id: 3, name: "Pedro Santos", appointments: 5, nextAvailable: "16:30" },
    { id: 4, name: "Marcos Souza", appointments: 4, nextAvailable: "13:45" },
  ];

  // Dados de exemplo para agendamentos
  const appointments = [
    { id: 1, client: "João Silva", service: "Corte de Cabelo", time: "09:00", duration: 30, barber: "Rafael Silva", date: new Date().toISOString().split('T')[0], status: "confirmado" },
    { id: 2, client: "Maria Oliveira", service: "Barba", time: "10:00", duration: 20, barber: "Carlos Oliveira", date: new Date().toISOString().split('T')[0], status: "confirmado" },
    { id: 3, client: "Pedro Santos", service: "Corte + Barba", time: "11:00", duration: 45, barber: "Pedro Santos", date: new Date().toISOString().split('T')[0], status: "confirmado" },
    { id: 4, client: "Ana Costa", service: "Coloração", time: "13:30", duration: 90, barber: "Rafael Silva", date: new Date().toISOString().split('T')[0], status: "confirmado" },
    { id: 5, client: "Lucas Mendes", service: "Corte de Cabelo", time: "15:30", duration: 30, barber: "Marcos Souza", date: new Date().toISOString().split('T')[0], status: "confirmado" },
  ];

  // Função para lidar com a criação de um novo agendamento
  const handleAppointmentCreated = (newAppointment: any) => {
    // Adicionar o novo agendamento à lista global
    appointments.push(newAppointment);

    // Filtrar para mostrar apenas a agenda do barbeiro selecionado
    setTimeout(() => {
      setSelectedBarber(newAppointment.barber);
    }, 100);
  };

  // Usar o hook personalizado para gerenciar o modal de agendamento
  const {
    isModalOpen,
    openModal,
    closeModal,
    handleSaveAppointment,
    clients,
    services,
    barbers: modalBarbers
  } = useAppointmentModal(appointments, handleAppointmentCreated);

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const stats = [
    {
      title: 'Total de Agendamentos',
      value: appointments.length,
      icon: <FiCalendar className="w-6 h-6 text-blue-600" />,
      badge: '+5% esta semana',
      badgeColor: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Clientes Atendidos',
      value: 5, // valor mockado
      icon: <FiUsers className="w-6 h-6 text-green-600" />,
      badge: '+2 novos',
      badgeColor: 'bg-green-100 text-green-600',
    },
    {
      title: 'Tempo Total',
      value: '3h 35min',
      icon: <FiClock className="w-6 h-6 text-purple-600" />,
      badge: '-10min',
      badgeColor: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Grid de cards estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col gap-3 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {stat.icon}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.badgeColor}`}>{stat.badge}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <button
          onClick={openModal}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-5 rounded-md transition-colors flex items-center space-x-2 text-base shadow-md"
        >
          <FiPlus className="h-5 w-5" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Controles de Calendário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          culture="pt-BR"
        />
      </div>

      {/* Estatísticas do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FiCalendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Agendamentos</p>
              <p className="text-xl font-semibold">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Total</p>
              <p className="text-xl font-semibold">3h 35min</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FiUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clientes Atendidos</p>
              <p className="text-xl font-semibold">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Novo Agendamento - Componente Reutilizável */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveAppointment}
        barbers={modalBarbers}
        services={services}
        clients={clients}
      />
    </div>
  );
}
