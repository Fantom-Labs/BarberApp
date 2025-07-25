/**
 * Serviço de Configuração
 * 
 * Este serviço gerencia as configurações globais do aplicativo,
 * permitindo centralizar valores de configuração e facilitar a manutenção.
 */

import { cache, CacheKey, CacheType } from './cache.service';

// Chave para armazenamento local
const STORAGE_KEY = 'barbershop_config';

// Interface para configurações
export interface AppConfig {
  // Configurações gerais
  appName: string;
  version: string;
  
  // Configurações de UI
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  timeFormat: string;
  currencyFormat: string;
  
  // Configurações de negócio
  businessHours: {
    [key: string]: { start: string; end: string }[];
  };
  defaultAppointmentDuration: number;
  minAdvanceBookingTime: number; // em horas
  maxAdvanceBookingDays: number;
  
  // Configurações de cache
  cacheTTL: {
    appointments: number;
    clients: number;
    services: number;
    barbers: number;
    statistics: number;
  };
  
  // Configurações de API
  apiUrl: string;
  apiTimeout: number;
  
  // Configurações de notificações
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
  reminderTime: number; // em horas
  
  // Configurações de segurança
  sessionTimeout: number; // em minutos
  maxLoginAttempts: number;
  
  // Configurações de recursos
  enableOnlineBooking: boolean;
  enableClientPortal: boolean;
  enableBarberPortal: boolean;
  enableReports: boolean;
  enableInventory: boolean;
  
  // Configurações de integração
  enableWhatsAppIntegration: boolean;
  enableGoogleCalendarIntegration: boolean;
  enableInstagramIntegration: boolean;
}

// Configuração padrão
const defaultConfig: AppConfig = {
  // Configurações gerais
  appName: 'BarberApp',
  version: '1.0.0',
  
  // Configurações de UI
  theme: 'system',
  language: 'pt-BR',
  dateFormat: 'dd/MM/yyyy',
  timeFormat: 'HH:mm',
  currencyFormat: 'BRL',
  
  // Configurações de negócio
  businessHours: {
    monday: [{ start: '09:00', end: '18:00' }],
    tuesday: [{ start: '09:00', end: '18:00' }],
    wednesday: [{ start: '09:00', end: '18:00' }],
    thursday: [{ start: '09:00', end: '18:00' }],
    friday: [{ start: '09:00', end: '18:00' }],
    saturday: [{ start: '09:00', end: '15:00' }],
    sunday: []
  },
  defaultAppointmentDuration: 30,
  minAdvanceBookingTime: 1,
  maxAdvanceBookingDays: 30,
  
  // Configurações de cache
  cacheTTL: {
    appointments: 5 * 60 * 1000, // 5 minutos
    clients: 10 * 60 * 1000, // 10 minutos
    services: 30 * 60 * 1000, // 30 minutos
    barbers: 15 * 60 * 1000, // 15 minutos
    statistics: 15 * 60 * 1000 // 15 minutos
  },
  
  // Configurações de API
  apiUrl: '/api',
  apiTimeout: 30000, // 30 segundos
  
  // Configurações de notificações
  enableEmailNotifications: true,
  enableSmsNotifications: true,
  enablePushNotifications: false,
  reminderTime: 24, // 24 horas antes
  
  // Configurações de segurança
  sessionTimeout: 60, // 60 minutos
  maxLoginAttempts: 5,
  
  // Configurações de recursos
  enableOnlineBooking: true,
  enableClientPortal: true,
  enableBarberPortal: true,
  enableReports: true,
  enableInventory: false,
  
  // Configurações de integração
  enableWhatsAppIntegration: true,
  enableGoogleCalendarIntegration: false,
  enableInstagramIntegration: false
};

/**
 * Obtém todas as configurações
 * @returns Configurações do aplicativo
 */
export function getConfig(): AppConfig {
  // Verificar se há dados em cache
  const cachedConfig = cache.get<AppConfig>('app_config');
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    if (typeof window === 'undefined') return defaultConfig;

    // Buscar do localStorage
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    const config = storedConfig ? JSON.parse(storedConfig) : defaultConfig;

    // Armazenar em cache
    cache.set('app_config', config, { type: CacheType.MEMORY });

    return config;
  } catch (error) {
    console.error('Erro ao obter configurações:', error);
    return defaultConfig;
  }
}

/**
 * Obtém uma configuração específica
 * @param key Caminho da configuração (ex: 'theme', 'businessHours.monday')
 * @returns Valor da configuração
 */
export function getConfigValue<T>(key: string): T {
  const config = getConfig();
  
  // Suportar caminhos aninhados (ex: 'businessHours.monday')
  const parts = key.split('.');
  let value: any = config;
  
  for (const part of parts) {
    if (value === undefined || value === null) {
      return undefined as unknown as T;
    }
    value = value[part];
  }
  
  return value as T;
}

/**
 * Atualiza as configurações
 * @param configUpdates Atualizações parciais das configurações
 * @returns Configurações atualizadas
 */
export function updateConfig(configUpdates: Partial<AppConfig>): AppConfig {
  try {
    if (typeof window === 'undefined') return defaultConfig;

    // Obter configurações atuais
    const currentConfig = getConfig();
    
    // Mesclar com as atualizações
    const updatedConfig = {
      ...currentConfig,
      ...configUpdates
    };
    
    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
    
    // Atualizar o cache
    cache.set('app_config', updatedConfig, { type: CacheType.MEMORY });
    
    return updatedConfig;
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return getConfig();
  }
}

/**
 * Reseta as configurações para os valores padrão
 * @returns Configurações padrão
 */
export function resetConfig(): AppConfig {
  try {
    if (typeof window === 'undefined') return defaultConfig;

    // Salvar configurações padrão no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
    
    // Atualizar o cache
    cache.set('app_config', defaultConfig, { type: CacheType.MEMORY });
    
    return defaultConfig;
  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
    return defaultConfig;
  }
}

/**
 * Inicializa o serviço de configuração
 */
export function initConfigService(): void {
  try {
    if (typeof window === 'undefined') return;

    // Verificar se já existem configurações
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    if (!storedConfig) {
      // Salvar configurações padrão
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
    }
  } catch (error) {
    console.error('Erro ao inicializar o serviço de configuração:', error);
  }
}

// Inicializar o serviço quando importado
if (typeof window !== 'undefined') {
  initConfigService();
}
