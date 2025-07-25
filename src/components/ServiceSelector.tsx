"use client";

import { useState, useEffect } from "react";
import { FiScissors, FiClock, FiDollarSign, FiInfo, FiPlus, FiMinus } from "react-icons/fi";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image?: string;
  category: string;
}

interface ServiceSelectorProps {
  onSelect?: (services: Service[]) => void;
}

export function ServiceSelector({ onSelect }: ServiceSelectorProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Mock data for services
  const services: Service[] = [
    {
      id: "1",
      name: "Corte de Cabelo",
      description: "Corte moderno com tesoura e máquina, inclui lavagem e finalização.",
      duration: "30 min",
      price: 50,
      category: "cabelo",
      image: "https://placehold.co/300x200/orange/white?text=Corte"
    },
    {
      id: "2",
      name: "Barba",
      description: "Modelagem completa de barba com toalha quente, óleo e finalização.",
      duration: "20 min",
      price: 35,
      category: "barba",
      image: "https://placehold.co/300x200/orange/white?text=Barba"
    },
    {
      id: "3",
      name: "Corte + Barba",
      description: "Combinação de corte de cabelo e modelagem de barba com desconto especial.",
      duration: "45 min",
      price: 75,
      category: "combo",
      image: "https://placehold.co/300x200/orange/white?text=Combo"
    },
    {
      id: "4",
      name: "Tratamento Capilar",
      description: "Tratamento para fortalecer e hidratar os fios, ideal para cabelos danificados.",
      duration: "40 min",
      price: 60,
      category: "tratamento",
      image: "https://placehold.co/300x200/orange/white?text=Tratamento"
    },
    {
      id: "5",
      name: "Coloração",
      description: "Aplicação de tintura profissional com técnicas modernas.",
      duration: "60 min",
      price: 90,
      category: "tratamento",
      image: "https://placehold.co/300x200/orange/white?text=Coloracao"
    },
    {
      id: "6",
      name: "Hidratação Facial",
      description: "Limpeza e hidratação facial com produtos premium.",
      duration: "25 min",
      price: 45,
      category: "tratamento",
      image: "https://placehold.co/300x200/orange/white?text=Facial"
    },
  ];

  // Categories
  const categories = [
    { id: "all", name: "Todos" },
    { id: "cabelo", name: "Cabelo" },
    { id: "barba", name: "Barba" },
    { id: "combo", name: "Combos" },
    { id: "tratamento", name: "Tratamentos" },
  ];

  // Filter services by category
  const filteredServices = activeCategory === "all"
    ? services
    : services.filter(service => service.category === activeCategory);

  // Toggle service selection
  const toggleService = (service: Service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);

      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  // Check if a service is selected
  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(service => service.id === serviceId);
  };

  // Calculate total price and duration
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  // Notify parent component when selection changes
  useEffect(() => {
    if (onSelect && typeof window !== 'undefined') {
      onSelect(selectedServices);
    }
  }, [selectedServices, onSelect]);

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className={`border rounded-lg overflow-hidden transition-colors ${
              isServiceSelected(service.id)
                ? "border-primary bg-primary/5"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {service.image && (
              <div className="h-40 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{service.name}</h3>
                <button
                  onClick={() => toggleService(service)}
                  className={`p-2 rounded-full ${
                    isServiceSelected(service.id)
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {isServiceSelected(service.id) ? (
                    <FiMinus className="h-4 w-4" />
                  ) : (
                    <FiPlus className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FiClock className="mr-1 h-4 w-4" />
                  {service.duration}
                </div>
                <div className="flex items-center text-sm font-medium text-primary">
                  <FiDollarSign className="mr-1 h-4 w-4" />
                  {service.price.toFixed(2)}
                </div>
              </div>

              <div className="mt-2">
                {showDetails === service.id ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {service.description}
                    <button
                      onClick={() => setShowDetails(null)}
                      className="block mt-1 text-primary hover:text-primary-dark text-xs"
                    >
                      Mostrar menos
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDetails(service.id)}
                    className="flex items-center text-xs text-primary hover:text-primary-dark"
                  >
                    <FiInfo className="mr-1 h-3 w-3" />
                    Ver detalhes
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected services summary */}
      {selectedServices.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mt-4">
          <h3 className="font-medium mb-2">Serviços Selecionados</h3>
          <div className="space-y-2">
            {selectedServices.map(service => (
              <div key={service.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <FiScissors className="mr-2 text-primary" />
                  <span>{service.name}</span>
                </div>
                <span className="font-medium">R$ {service.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
