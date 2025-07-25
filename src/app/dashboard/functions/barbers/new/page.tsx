"use client";

import { useState } from "react";
import { FiUser, FiPhone, FiMail, FiCalendar, FiImage, FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function NewBarberPage() {
  type FormData = {
    name: string;
    phone: string;
    email: string;
    birthdate: string;
    specialties: string[];
    bio: string;
    workDays: { [key: string]: boolean };
    workHours: { [key: string]: string };
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    birthdate: "",
    specialties: [],
    bio: "",
    workDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    workHours: {
      start: "09:00",
      end: "18:00"
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const specialtiesList = [
    "Corte Masculino",
    "Barba",
    "Coloração",
    "Corte Feminino",
    "Tratamentos Capilares",
    "Penteados",
    "Sobrancelha"
  ];
  
  const weekDays = [
    { key: "monday", label: "Segunda" },
    { key: "tuesday", label: "Terça" },
    { key: "wednesday", label: "Quarta" },
    { key: "thursday", label: "Quinta" },
    { key: "friday", label: "Sexta" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => {
      const specialties = [...prev.specialties] as string[];
      
      if (specialties.includes(specialty)) {
        return {
          ...prev,
          specialties: specialties.filter(s => s !== specialty)
        };
      } else {
        return {
          ...prev,
          specialties: [...specialties, specialty]
        };
      }
    });
  };
  
  const handleWorkDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workDays: {
        ...prev.workDays,
        [day]: !prev.workDays[day as keyof typeof prev.workDays]
      }
    }));
  };
  
  const handleWorkHoursChange = (type: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [type]: value
      }
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio para API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulação de sucesso
    setSuccess(true);
    setIsSubmitting(false);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/functions" className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Adicionar Barbeiro</h1>
      </div>
      
      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-3">
              <FiSave className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Barbeiro Adicionado!</h2>
          <p className="text-green-700 dark:text-green-400 mb-4">
            O novo profissional foi adicionado com sucesso à sua equipe.
          </p>
          <div className="flex justify-center space-x-3">
            <Link
              href="/dashboard/functions"
              className="bg-white text-green-600 border border-green-300 hover:bg-green-50 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Voltar para Funções
            </Link>
            <Link
              href="/dashboard/functions/barbers/new"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Adicionar Outro Barbeiro
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiUser className="mr-2 text-primary" />
                Informações Pessoais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Biografia</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4 flex items-center">
                <FiImage className="mr-2 text-primary" />
                Foto
              </h2>
              
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <FiUser className="h-10 w-10 mx-auto text-gray-400" />
                    <button type="button" className="mt-2 text-primary text-sm">Adicionar Foto</button>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-primary" />
                Disponibilidade
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dias de Trabalho</label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => handleWorkDayChange(day.key)}
                      className={`px-3 py-1 rounded-md ${
                        formData.workDays[day.key as keyof typeof formData.workDays]
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Horário de Início</label>
                  <input
                    type="time"
                    value={formData.workHours.start}
                    onChange={(e) => handleWorkHoursChange('start', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Horário de Término</label>
                  <input
                    type="time"
                    value={formData.workHours.end}
                    onChange={(e) => handleWorkHoursChange('end', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">Especialidades</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtiesList.map(specialty => (
                  <div key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      id={specialty}
                      checked={(formData.specialties as string[]).includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={specialty} className="ml-2 text-sm">
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end">
              <Link
                href="/dashboard/functions"
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-md mr-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md disabled:opacity-70"
              >
                {isSubmitting ? "Salvando..." : "Salvar Barbeiro"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
