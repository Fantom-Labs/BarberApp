"use client";

import React, { useState } from "react";
import { FiX, FiSearch, FiCheck } from "react-icons/fi";

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Barber {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
  barbers: Barber[];
  services: Service[];
  clients: Client[];
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  barbers,
  services,
  clients
}: AppointmentModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClientMode, setNewClientMode] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [appointmentData, setAppointmentData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    duration: 30,
    service: services[0]?.name || "Corte de Cabelo",
    barber: "",
    notes: ""
  });

  // Filtrar clientes com base na busca
  const filteredClients = searchQuery
    ? clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
      )
    : [];

  // Função para alternar para o modo de novo cliente
  const toggleNewClientMode = () => {
    setNewClientMode(!newClientMode);
    if (!newClientMode) {
      // Preencher o nome do novo cliente com o texto da busca se existir
      setNewClientData({
        ...newClientData,
        name: searchQuery
      });
    }
  };

  // Função para lidar com a mudança nos campos do novo cliente
  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com a seleção de cliente
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setSearchQuery("");
  };

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Se o serviço for alterado, atualizar a duração automaticamente
    if (name === "service") {
      const selectedService = services.find(service => service.name === value);
      if (selectedService) {
        setAppointmentData(prev => ({
          ...prev,
          [name]: value,
          duration: selectedService.duration
        }));
        return;
      }
    }

    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar o agendamento
  const handleSaveAppointment = () => {
    // Verificar se todos os campos obrigatórios estão preenchidos
    if (newClientMode) {
      // Validação para novo cliente
      if (!newClientData.name || !newClientData.phone || !appointmentData.barber || !appointmentData.date || !appointmentData.time) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    } else {
      // Validação para cliente existente
      if (!selectedClient || !appointmentData.barber || !appointmentData.date || !appointmentData.time) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    }

    // Criar um novo objeto de agendamento
    const newAppointment = {
      client: newClientMode ? newClientData.name : selectedClient!.name,
      clientPhone: newClientMode ? newClientData.phone : selectedClient!.phone,
      clientEmail: newClientMode ? newClientData.email : selectedClient?.email || "",
      isNewClient: newClientMode,
      service: appointmentData.service,
      time: appointmentData.time,
      duration: appointmentData.duration,
      barber: appointmentData.barber,
      notes: appointmentData.notes,
      date: appointmentData.date,
      status: "confirmado"
    };

    // Chamar a função onSave passada como prop
    onSave(newAppointment);

    // Resetar o formulário
    setSelectedClient(null);
    setNewClientMode(false);
    setNewClientData({
      name: "",
      phone: "",
      email: ""
    });
    setAppointmentData({
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      duration: 30,
      service: services[0]?.name || "Corte de Cabelo",
      barber: "",
      notes: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-medium">Novo Agendamento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-12 gap-3">
            {/* Coluna 1: Cliente e Serviço */}
            <div className="col-span-6">
              {/* Busca de Cliente ou Novo Cliente */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium">Cliente</label>
                  <button
                    onClick={toggleNewClientMode}
                    type="button"
                    className="text-xs text-primary hover:text-primary-dark"
                  >
                    {newClientMode ? "Buscar cliente existente" : "Novo cliente"}
                  </button>
                </div>

                {/* Modo de cliente existente */}
                {!newClientMode && (
                  selectedClient ? (
                    <div className="flex justify-between items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded">
                      <div className="truncate">
                        <p className="font-medium text-sm">{selectedClient.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedClient.phone}</p>
                      </div>
                      <button
                        onClick={() => setSelectedClient(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-1"
                      >
                        <FiX className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Nome ou telefone"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-7 pr-2 py-1.5 text-sm w-full border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                      </div>

                      {searchQuery && filteredClients.length > 0 && (
                        <ul className="absolute mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded shadow-md max-h-32 overflow-y-auto z-10 w-[calc(50%-1.5rem)] max-w-[16rem]">
                          {filteredClients.map(client => (
                            <li
                              key={client.id}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                              onClick={() => handleSelectClient(client)}
                            >
                              <p className="font-medium text-sm">{client.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{client.phone}</p>
                            </li>
                          ))}
                        </ul>
                      )}

                      {searchQuery && filteredClients.length === 0 && (
                        <div className="mt-1 flex justify-between items-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Nenhum cliente encontrado</p>
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* Modo de novo cliente */}
                {newClientMode && (
                  <div className="space-y-2">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nome completo"
                        value={newClientData.name}
                        onChange={handleNewClientChange}
                        className="py-1.5 px-2 text-sm w-full border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="WhatsApp"
                        value={newClientData.phone}
                        onChange={handleNewClientChange}
                        className="py-1.5 px-2 text-sm w-full border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email (opcional)"
                        value={newClientData.email}
                        onChange={handleNewClientChange}
                        className="py-1.5 px-2 text-sm w-full border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Serviço */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Serviço</label>
                <select
                  name="service"
                  value={appointmentData.service}
                  onChange={handleInputChange}
                  className="w-full py-1.5 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {services.map(service => (
                    <option key={service.id} value={service.name}>{service.name}</option>
                  ))}
                </select>
              </div>

              {/* Duração */}
              <div>
                <label className="block text-xs font-medium mb-1">Duração (min)</label>
                <input
                  type="number"
                  name="duration"
                  value={appointmentData.duration}
                  onChange={handleInputChange}
                  min="15"
                  step="5"
                  className="w-full py-1.5 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Coluna 2: Data, Hora e Barbeiro */}
            <div className="col-span-6">
              {/* Data e Hora - Lado a lado */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Data</label>
                  <input
                    type="date"
                    name="date"
                    value={appointmentData.date}
                    onChange={handleInputChange}
                    className="w-full py-1.5 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Hora</label>
                  <input
                    type="time"
                    name="time"
                    value={appointmentData.time}
                    onChange={handleInputChange}
                    className="w-full py-1.5 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Barbeiro */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1">Barbeiro</label>
                <select
                  name="barber"
                  value={appointmentData.barber}
                  onChange={handleInputChange}
                  className="w-full py-1.5 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Selecione</option>
                  {barbers.map(barber => (
                    <option key={barber.id} value={barber.name}>{barber.name}</option>
                  ))}
                </select>
              </div>

              {/* Observações - Campo menor */}
              <div>
                <label className="block text-xs font-medium mb-1">Observações</label>
                <textarea
                  name="notes"
                  value={appointmentData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Opcional"
                  className="w-full py-1.5 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Botões de Ação - Mais compactos */}
          <div className="flex justify-end space-x-2 mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAppointment}
              disabled={!selectedClient || !appointmentData.barber}
              className="px-3 py-1.5 text-sm bg-primary hover:bg-primary-dark text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <FiCheck className="mr-1.5 h-3.5 w-3.5" />
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
