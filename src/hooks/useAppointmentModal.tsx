"use client";

import { useState } from "react";

// Dados de exemplo para clientes
const defaultClients = [
  { id: 1, name: "João Silva", phone: "(11) 98765-4321", email: "joao@email.com" },
  { id: 2, name: "Maria Oliveira", phone: "(11) 91234-5678", email: "maria@email.com" },
  { id: 3, name: "Pedro Santos", phone: "(11) 99876-5432", email: "pedro@email.com" },
  { id: 4, name: "Ana Costa", phone: "(11) 95678-1234", email: "ana@email.com" },
  { id: 5, name: "Lucas Mendes", phone: "(11) 92345-6789", email: "lucas@email.com" },
];

// Dados de exemplo para serviços
const defaultServices = [
  { id: 1, name: "Corte de Cabelo", duration: 30, price: 50 },
  { id: 2, name: "Barba", duration: 20, price: 30 },
  { id: 3, name: "Corte + Barba", duration: 45, price: 70 },
  { id: 4, name: "Coloração", duration: 90, price: 120 },
  { id: 5, name: "Hidratação", duration: 40, price: 60 },
];

// Dados de exemplo para barbeiros
const defaultBarbers = [
  { id: 1, name: "Rafael Silva" },
  { id: 2, name: "Carlos Oliveira" },
  { id: 3, name: "Pedro Santos" },
  { id: 4, name: "Marcos Souza" },
];

// Função para verificar conflitos de horário
const checkTimeConflict = (appointments: any[], barber: string, date: string, time: string, duration: number) => {
  // Converter o horário do novo agendamento para minutos desde o início do dia
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = hours * 60 + minutes;
  const endTime = startTime + duration;

  // Verificar se há algum agendamento existente que se sobreponha
  return appointments.some((appointment: any) => {
    if (appointment.barber !== barber || appointment.date !== date) {
      return false; // Não há conflito se for outro barbeiro ou outra data
    }

    // Converter o horário do agendamento existente para minutos
    const [appHours, appMinutes] = appointment.time.split(':').map(Number);
    const appStartTime = appHours * 60 + appMinutes;
    const appEndTime = appStartTime + appointment.duration;

    // Verificar se há sobreposição
    return (startTime < appEndTime && endTime > appStartTime);
  });
};

export default function useAppointmentModal(
  appointments: any[] = [],
  onAppointmentCreated: (appointment: any) => void,
  customClients = defaultClients,
  customServices = defaultServices,
  customBarbers = defaultBarbers
) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    try {
      // Verificar se há conflito de horário
      const hasConflict = checkTimeConflict(
        appointments,
        appointmentData.barber,
        appointmentData.date,
        appointmentData.time,
        appointmentData.duration
      );

      if (hasConflict) {
        alert(`Horário indisponível! O barbeiro ${appointmentData.barber} já possui um agendamento neste horário.`);
        return;
      }

      // Criar um novo objeto de agendamento com ID
      const newAppointment = {
        id: appointments.length + 1,
        ...appointmentData,
        status: "confirmado"
      };

      // Se for um novo cliente, adicioná-lo à lista de clientes
      if (appointmentData.isNewClient) {
        const newClient = {
          id: customClients.length + 1,
          name: appointmentData.client,
          phone: appointmentData.clientPhone,
          email: appointmentData.clientEmail || ""
        };

        // Em uma aplicação real, aqui você salvaria o novo cliente no banco de dados
        customClients.push(newClient);
      }

      // Chamar a função de callback
      onAppointmentCreated(newAppointment);

      // Mostrar mensagem de sucesso
      const clientMessage = appointmentData.isNewClient ? `novo cliente ${appointmentData.client}` : appointmentData.client;
      alert(`Agendamento confirmado com ${appointmentData.barber} para ${clientMessage} às ${appointmentData.time}`);

      // Fechar o modal
      closeModal();

    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Ocorreu um erro ao salvar o agendamento. Por favor, tente novamente.');
    }
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleSaveAppointment,
    clients: customClients,
    services: customServices,
    barbers: customBarbers
  };
}
