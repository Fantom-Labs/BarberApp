"use client";

import { useState } from "react";
import { FiPlus, FiSearch, FiVideo, FiUsers, FiClock, FiStar, FiPlay, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  // Dados de exemplo
  const courses = [
    { 
      id: 1, 
      title: "Técnicas Avançadas de Corte Masculino", 
      description: "Aprenda as técnicas mais modernas de corte masculino com os melhores profissionais.", 
      instructor: "Carlos Mendes",
      duration: "8 horas",
      lessons: 12,
      students: 45,
      rating: 4.8,
      price: 199.90,
      image: "https://placehold.co/400x225/orange/white?text=Curso+de+Corte"
    },
    { 
      id: 2, 
      title: "Barba Perfeita: Do Básico ao Avançado", 
      description: "Um guia completo para cuidar e modelar barbas de todos os tipos e estilos.", 
      instructor: "Roberto Alves",
      duration: "6 horas",
      lessons: 8,
      students: 32,
      rating: 4.6,
      price: 149.90,
      image: "https://placehold.co/400x225/orange/white?text=Curso+de+Barba"
    },
    { 
      id: 3, 
      title: "Gestão de Barbearia: Como Aumentar seus Lucros", 
      description: "Aprenda a gerenciar sua barbearia de forma eficiente e aumentar sua rentabilidade.", 
      instructor: "Amanda Silva",
      duration: "10 horas",
      lessons: 15,
      students: 28,
      rating: 4.9,
      price: 249.90,
      image: "https://placehold.co/400x225/orange/white?text=Gestão"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cursos e Video-aulas</h1>
        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
          <FiPlus />
          <span>Novo Curso</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar cursos..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex space-x-2">
            <select className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary">
              <option value="all">Todas Categorias</option>
              <option value="haircut">Corte de Cabelo</option>
              <option value="beard">Barba</option>
              <option value="business">Gestão</option>
            </select>
            
            <select className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary">
              <option value="newest">Mais Recentes</option>
              <option value="popular">Mais Populares</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de Cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-bold text-lg">{course.title}</h3>
                <p className="text-white/80 text-sm">Por {course.instructor}</p>
              </div>
            </div>
            
            <div className="p-4 flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <FiVideo className="text-primary" />
                  <span className="text-sm">{course.lessons} aulas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-primary" />
                  <span className="text-sm">{course.students} alunos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-primary" />
                  <span className="text-sm">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiStar className="text-yellow-500" />
                  <span className="text-sm">{course.rating} ({Math.floor(course.students * 0.7)} avaliações)</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary text-lg">R$ {course.price.toFixed(2)}</span>
                <button className="bg-primary hover:bg-primary-dark text-white font-medium py-1.5 px-3 rounded transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Seção de Estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Estatísticas dos Cursos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Cursos Publicados</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-primary">105</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Alunos Inscritos</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-primary">35</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Aulas Disponíveis</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-primary">R$ 5.980</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Receita Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
