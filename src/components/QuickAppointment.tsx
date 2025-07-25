"use client";

import { useState } from "react";
import { FiCalendar, FiClock, FiUser, FiScissors, FiCheck } from "react-icons/fi";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
}

interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  specialties: string[];
}

export function QuickAppointment() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock data
  const services: Service[] = [
    { id: "1", name: "Corte de Cabelo", duration: "30 min", price: 50 },
    { id: "2", name: "Barba", duration: "20 min", price: 35 },
    { id: "3", name: "Corte + Barba", duration: "45 min", price: 75 },
    { id: "4", name: "Tratamento Capilar", duration: "40 min", price: 60 },
  ];

  const barbers: Barber[] = [
    {
      id: "1",
      name: "Carlos Silva",
      avatar: "https://placehold.co/100x100/orange/white?text=CS",
      rating: 4.8,
      specialties: ["Corte Moderno", "Barba"],
    },
    {
      id: "2",
      name: "Roberto Oliveira",
      avatar: "https://placehold.co/100x100/orange/white?text=RO",
      rating: 4.7,
      specialties: ["Degradê", "Tratamentos"],
    },
    {
      id: "3",
      name: "André Santos",
      avatar: "https://placehold.co/100x100/orange/white?text=AS",
      rating: 4.9,
      specialties: ["Barba Estilizada", "Corte Clássico"],
    },
  ];

  // Handle date and time selection
  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setStep(1);
        setSelectedService(null);
        setSelectedBarber(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Selecione o serviço</h3>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                  className={`p-4 border rounded-lg text-left transition-colors hover:border-primary ${
                    selectedService?.id === service.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FiScissors className="text-primary" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {service.duration}
                    </span>
                  </div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-primary font-medium mt-1">
                    R$ {service.price.toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Selecione o profissional</h3>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Voltar
              </button>
            </div>
            <div className="space-y-3">
              {barbers.map((barber) => (
                <button
                  key={barber.id}
                  onClick={() => {
                    setSelectedBarber(barber);
                    setStep(3);
                  }}
                  className={`w-full p-3 border rounded-lg flex items-center space-x-3 transition-colors hover:border-primary ${
                    selectedBarber?.id === barber.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium">{barber.name}</h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(barber.rating)
                                ? "text-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {barber.rating}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {barber.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Selecione data e horário</h3>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Voltar
              </button>
            </div>
            <AvailabilityCalendar
              onSelectDateTime={handleDateTimeSelect}
              barberId={selectedBarber?.id}
            />
            {selectedDate && selectedTime && (
              <div className="mt-4">
                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Confirmar agendamento</h3>
              <button
                onClick={() => setStep(3)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Voltar
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <FiScissors className="mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Serviço</p>
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-primary font-medium">
                    R$ {selectedService?.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiUser className="mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Profissional</p>
                  <p className="font-medium">{selectedBarber?.name}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiCalendar className="mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data</p>
                  <p className="font-medium">
                    {selectedDate?.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiClock className="mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Horário</p>
                  <p className="font-medium">{selectedTime}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-medium">Agendamento Confirmado!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Seu agendamento foi realizado com sucesso.
        </p>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-w-xs mx-auto text-left">
          <p className="font-medium">{selectedService?.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedBarber?.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedDate?.toLocaleDateString("pt-BR")} às {selectedTime}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">Agendar Serviço</h2>
      {renderStepContent()}
    </div>
  );
}
