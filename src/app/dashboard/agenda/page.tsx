"use client";

import React, { useState } from "react";
import { FiCalendar, FiClock, FiUser, FiPlus, FiChevronDown } from "react-icons/fi";
import AppointmentModal from "@/components/AppointmentModal";
import useAppointmentModal from "@/hooks/useAppointmentModal";
import {
  CalendarProvider,
  CalendarDate,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
  CalendarDatePagination,
  CalendarHeader,
  CalendarBody,
  CalendarItem,
} from "@/components/ui/calendar";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

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

  // Adaptar appointments para features do calendário
  const features = appointments.map((appointment) => ({
    id: appointment.id.toString(),
    name: appointment.client + ' - ' + appointment.service,
    startAt: new Date(appointment.date + 'T' + appointment.time),
    endAt: new Date(appointment.date + 'T' + appointment.time),
    status: { id: appointment.status, name: appointment.status, color: '#10B981' },
  }));

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6 relative">
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-medium">{formatDate(currentDate)}</h2>
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1 rounded-md ${
                view === "day"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1 rounded-md ${
                view === "week"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1 rounded-md ${
                view === "month"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Mês
            </button>
          </div>
        </div>

        {/* Filtros Simplificados */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex space-x-2 w-full">
            {/* Seletor de Barbeiro */}
            <div className="relative w-full sm:w-64">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span>{selectedBarber || "Todos os Barbeiros"}</span>
                <FiChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {showFilters && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSelectedBarber(null);
                        setShowFilters(false);
                      }}
                    >
                      Geral
                    </li>
                    {barbers.map(barber => (
                      <li
                        key={barber.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setSelectedBarber(barber.name);
                          setShowFilters(false);
                        }}
                      >
                        {barber.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agenda Geral com Resumo de Barbeiros (visível quando não há filtro) */}
        {!selectedBarber && view === "day" && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Agenda Geral</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {barbers.map(barber => (
                <div
                  key={barber.id}
                  className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{barber.name}</h4>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {barber.appointments} agendamentos
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Próximo horário:</span>
                      <span className="font-medium">{barber.nextAvailable}</span>
                    </div>

                    <button
                      onClick={() => setSelectedBarber(barber.name)}
                      className="w-full mt-2 text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Ver agenda completa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visualização de Agenda Filtrada */}
        <div className="overflow-x-auto">
          {view === "day" && (
            <div className="space-y-2">
              {/* Título da agenda filtrada */}
              {selectedBarber && (
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Agenda: {selectedBarber}</h3>
                  <button
                    onClick={() => setSelectedBarber(null)}
                    className="text-sm text-primary hover:text-primary-dark font-medium"
                  >
                    Voltar para agenda geral
                  </button>
                </div>
              )}

              {/* Lista de agendamentos */}
              {appointments
                .filter((appointment: any) => !selectedBarber || appointment.barber === selectedBarber)
                .map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                  <div className="flex-grow ml-4 border-l border-gray-300 dark:border-gray-600 pl-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{appointment.client}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{appointment.duration} min</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.service}</p>
                  </div>
                </div>
              ))}

              {/* Mensagem quando não há agendamentos */}
              {selectedBarber && appointments.filter((appointment: any) => appointment.barber === selectedBarber).length === 0 && (
                <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                  Nenhum agendamento encontrado para {selectedBarber}.
                </div>
              )}
            </div>
          )}

          {view === "week" && (
            <div className="w-full">
              <CalendarProvider locale="pt-BR" startDay={0}>
                <CalendarDate>
                  <CalendarDatePicker>
                    <CalendarMonthPicker />
                    <CalendarYearPicker start={2020} end={2030} />
                  </CalendarDatePicker>
                  <CalendarDatePagination />
                </CalendarDate>
                <CalendarHeader />
                {/* Para semana, renderize apenas os dias da semana atual */}
                <CalendarBody features={features.filter(f => {
                  const today = new Date();
                  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                  return f.startAt >= startOfWeek && f.startAt <= endOfWeek;
                })}>
                  {({ feature }) => <CalendarItem key={feature.id} feature={feature} />}
                </CalendarBody>
              </CalendarProvider>
            </div>
          )}

          {view === "month" && (
            <div className="w-full">
              <CalendarProvider locale="pt-BR" startDay={0}>
                <CalendarDate>
                  <CalendarDatePicker>
                    <CalendarMonthPicker />
                    <CalendarYearPicker start={2020} end={2030} />
                  </CalendarDatePicker>
                  <CalendarDatePagination />
                </CalendarDate>
                <CalendarHeader />
                <CalendarBody features={features}>
                  {({ feature }) => <CalendarItem key={feature.id} feature={feature} />}
                </CalendarBody>
              </CalendarProvider>
            </div>
          )}
        </div>
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
