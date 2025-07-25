"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";

interface AvailabilityCalendarProps {
  onSelectDateTime?: (date: Date, time: string) => void;
  barberId?: string;
}

export function AvailabilityCalendar({ onSelectDateTime, barberId }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Mock data for available times
  const mockAvailableTimes: Record<string, string[]> = {
    // Format: "YYYY-MM-DD": ["HH:MM", "HH:MM", ...]
    "2025-04-10": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    "2025-04-11": ["09:00", "10:00", "11:00", "14:00", "15:00"],
    "2025-04-12": ["10:00", "11:00", "14:00"],
    "2025-04-15": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  };
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Check if a date has available times
  const hasAvailableTimes = (date: Date) => {
    const dateString = formatDate(date);
    return mockAvailableTimes[dateString] && mockAvailableTimes[dateString].length > 0;
  };
  
  // Check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    
    // Get available times for selected date
    const dateString = formatDate(date);
    setAvailableTimes(mockAvailableTimes[dateString] || []);
  };
  
  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate && onSelectDateTime) {
      onSelectDateTime(selectedDate, time);
    }
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Generate calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      const isSelected = selectedDate && formatDate(selectedDate) === dateString;
      const hasAvailable = hasAvailableTimes(date);
      const isPast = isPastDate(date);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={isPast || !hasAvailable}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-colors ${
            isSelected
              ? "bg-primary text-white"
              : isPast
              ? "text-gray-400 cursor-not-allowed"
              : hasAvailable
              ? "hover:bg-primary/10 text-gray-700 dark:text-gray-300"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {day}
          {hasAvailable && !isSelected && (
            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></span>
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        
        <h3 className="font-medium">
          {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Calendar grid */}
      <div>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 relative">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Available times */}
      {selectedDate && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">
            Horários disponíveis para {selectedDate.toLocaleDateString('pt-BR')}
          </h4>
          
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-2 px-3 rounded-md border text-sm flex items-center justify-center space-x-1 transition-colors ${
                    selectedTime === time
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary"
                  }`}
                >
                  <FiClock className="h-3 w-3" />
                  <span>{time}</span>
                </button>
              ))
            ) : (
              <p className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                Não há horários disponíveis para esta data.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
