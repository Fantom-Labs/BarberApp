"use client";

import { useState, useEffect, useRef } from "react";
import { FiBell, FiX, FiCalendar, FiPackage, FiMessageSquare, FiInfo, FiCheck, FiAlertTriangle } from "react-icons/fi";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read?: boolean;
}

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo agendamento",
      message: "João Silva agendou um corte para amanhã às 14h",
      time: "2 min atrás",
      type: "success",
    },
    {
      id: "2",
      title: "Pedido confirmado",
      message: "Pedido #1234 foi confirmado e está sendo processado",
      time: "5 min atrás",
      type: "info",
    },
    {
      id: "3",
      title: "Mensagem recebida",
      message: "Nova mensagem de Maria Santos sobre horários",
      time: "10 min atrás",
      type: "warning",
    },
    {
      id: "4",
      title: "Sistema atualizado",
      message: "Nova versão do sistema foi instalada com sucesso",
      time: "1 hora atrás",
      type: "success",
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "appointment",
        title: "Lembrete de Agendamento",
        message: "Você tem um agendamento amanhã às 14:00 com o barbeiro Carlos.",
        time: "Há 5 minutos",
        read: false,
      },
      {
        id: "2",
        type: "order",
        title: "Pedido Enviado",
        message: "Seu pedido #1234 foi enviado e está a caminho.",
        time: "Há 2 horas",
        read: false,
      },
      {
        id: "3",
        type: "message",
        title: "Nova Mensagem",
        message: "João enviou uma mensagem sobre seu agendamento.",
        time: "Há 1 dia",
        read: true,
      },
      {
        id: "4",
        type: "system",
        title: "Atualização do Sistema",
        message: "Novos recursos foram adicionados à plataforma.",
        time: "Há 3 dias",
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );

    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);

    setNotifications(prev => prev.filter(notification => notification.id !== id));

    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheck className="h-4 w-4 text-green-600 dark:text-cakto-emerald" />;
      case 'warning':
        return <FiAlertTriangle className="h-4 w-4 text-yellow-600 dark:text-cakto-orange-warning" />;
      case 'error':
        return <FiX className="h-4 w-4 text-red-600 dark:text-red-500" />;
      case 'info':
        return <FiInfo className="h-4 w-4 text-blue-600 dark:text-cakto-teal" />;
      default:
        return <FiInfo className="h-4 w-4 text-blue-600 dark:text-cakto-teal" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors relative"
        aria-label="Notifications"
      >
        <FiBell className="h-5 w-5 text-gray-700 dark:text-dark-text-secondary" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-cakto-orange-warning text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">Notificações</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-dark-text-tertiary">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      notification.type === 'success' ? 'bg-green-100 dark:bg-cakto-emerald/20' :
                      notification.type === 'warning' ? 'bg-yellow-100 dark:bg-cakto-orange-warning/20' :
                      notification.type === 'error' ? 'bg-red-100 dark:bg-red-500/20' :
                      'bg-blue-100 dark:bg-cakto-teal/20'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-dark-border">
              <button
                onClick={clearAllNotifications}
                className="w-full text-sm text-cakto-green hover:text-cakto-teal transition-colors"
              >
                Limpar todas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
