"use client";

import { FiHome, FiEdit, FiMapPin, FiPhone, FiMail, FiClock, FiImage, FiSave } from "react-icons/fi";
import { useState } from "react";

export default function MyBarbershopPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Barbearia Exemplo",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    phone: "(11) 99999-9999",
    email: "contato@barbearia.com",
    description: "Barbearia especializada em cortes modernos e tradicionais, com ambiente agradável e profissionais qualificados.",
    openingHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "09:00", close: "17:00" },
      sunday: { open: "", close: "" }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (day: string, type: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day as keyof typeof prev.openingHours],
          [type]: value
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar os dados
    setIsEditing(false);
    alert("Dados salvos com sucesso!");
  };

  const weekDays = [
    { key: "monday", label: "Segunda-feira" },
    { key: "tuesday", label: "Terça-feira" },
    { key: "wednesday", label: "Quarta-feira" },
    { key: "thursday", label: "Quinta-feira" },
    { key: "friday", label: "Sexta-feira" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minha Barbearia</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
        >
          {isEditing ? (
            <>
              <FiSave className="h-5 w-5" />
              <span>Salvar</span>
            </>
          ) : (
            <>
              <FiEdit className="h-5 w-5" />
              <span>Editar</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiHome className="mr-2 text-primary" />
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Barbearia</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
            </div>
          </div>
        </div>
        
        {/* Horário de Funcionamento */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiClock className="mr-2 text-primary" />
            Horário de Funcionamento
          </h2>
          
          <div className="space-y-3">
            {weekDays.map(day => (
              <div key={day.key} className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">{day.label}</div>
                <div>
                  <input
                    type="time"
                    value={formData.openingHours[day.key as keyof typeof formData.openingHours].open}
                    onChange={(e) => handleTimeChange(day.key, 'open', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={formData.openingHours[day.key as keyof typeof formData.openingHours].close}
                    onChange={(e) => handleTimeChange(day.key, 'close', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Imagens */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiImage className="mr-2 text-primary" />
            Imagens
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <FiImage className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Logo</p>
                {isEditing && (
                  <button type="button" className="mt-2 text-primary text-sm">Alterar</button>
                )}
              </div>
            </div>
            
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <FiImage className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Fachada</p>
                {isEditing && (
                  <button type="button" className="mt-2 text-primary text-sm">Alterar</button>
                )}
              </div>
            </div>
            
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <FiImage className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Interior</p>
                {isEditing && (
                  <button type="button" className="mt-2 text-primary text-sm">Alterar</button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
            >
              Salvar Alterações
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
