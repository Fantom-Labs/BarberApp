/**
 * Serviço de logging
 *
 * Este serviço fornece funções para logging de eventos, erros e informações
 * em diferentes níveis de severidade. Ele suporta logging no console para
 * desenvolvimento e pode ser estendido para enviar logs para serviços externos.
 */

import { cache, CacheKey, CacheType } from './cache.service';

// Níveis de log
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Configuração do logger
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  appName: string;
}

// Configuração padrão
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  appName: 'barbershop-app',
};

// Chave para armazenamento em cache
const LOGGER_CONFIG_CACHE_KEY = 'logger_config';

// Obtém a configuração atual
function getLoggerConfig(): LoggerConfig {
  // Verificar se há dados em cache
  const cachedConfig = cache.get<LoggerConfig>(LOGGER_CONFIG_CACHE_KEY);
  if (cachedConfig) {
    return cachedConfig;
  }

  // Se não houver dados em cache, usar a configuração padrão
  return { ...defaultConfig };
}

/**
 * Configura o logger
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  // Obter configuração atual
  const currentConfig = getLoggerConfig();

  // Mesclar com as novas configurações
  const updatedConfig = { ...currentConfig, ...newConfig };

  // Armazenar em cache
  cache.set(LOGGER_CONFIG_CACHE_KEY, updatedConfig, { type: CacheType.MEMORY });
}

/**
 * Formata uma mensagem de log
 */
function formatLogMessage(level: LogLevel, message: string, context?: any): string {
  const config = getLoggerConfig();
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${config.appName}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

/**
 * Envia um log para o console
 */
function logToConsole(level: LogLevel, formattedMessage: string): void {
  const config = getLoggerConfig();
  if (!config.enableConsole) return;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage);
      break;
    case LogLevel.INFO:
      console.info(formattedMessage);
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage);
      break;
    case LogLevel.ERROR:
    case LogLevel.FATAL:
      console.error(formattedMessage);
      break;
  }
}

/**
 * Envia um log para um serviço remoto
 * (implementação de exemplo, seria substituída por um serviço real)
 */
async function logToRemote(level: LogLevel, message: string, context?: any): Promise<void> {
  const config = getLoggerConfig();
  if (!config.enableRemote) return;

  // Aqui seria implementada a lógica para enviar logs para um serviço externo
  // como Sentry, LogRocket, Datadog, etc.

  // Exemplo de implementação:
  try {
    // Simular envio para serviço remoto
    if (typeof window !== 'undefined') {
      // No cliente, poderia usar fetch
      console.log(`[REMOTE LOG] ${message}`);
    } else {
      // No servidor, poderia usar um SDK específico
      console.log(`[REMOTE LOG] ${message}`);
    }
  } catch (error) {
    console.error('Erro ao enviar log para serviço remoto:', error);
  }
}

/**
 * Registra uma mensagem de log
 */
export async function log(level: LogLevel, message: string, context?: any): Promise<void> {
  // Obter configuração atual
  const config = getLoggerConfig();

  // Verificar nível mínimo de log
  const levels = Object.values(LogLevel);
  const minLevelIndex = levels.indexOf(config.minLevel);
  const currentLevelIndex = levels.indexOf(level);

  if (currentLevelIndex < minLevelIndex) {
    return;
  }

  // Formatar mensagem
  const formattedMessage = formatLogMessage(level, message, context);

  // Enviar para console
  logToConsole(level, formattedMessage);

  // Enviar para serviço remoto
  if (config.enableRemote) {
    await logToRemote(level, message, context);
  }
}

/**
 * Registra uma mensagem de debug
 */
export function debug(message: string, context?: any): void {
  log(LogLevel.DEBUG, message, context);
}

/**
 * Registra uma mensagem de informação
 */
export function info(message: string, context?: any): void {
  log(LogLevel.INFO, message, context);
}

/**
 * Registra uma mensagem de aviso
 */
export function warn(message: string, context?: any): void {
  log(LogLevel.WARN, message, context);
}

/**
 * Registra uma mensagem de erro
 */
export function error(message: string, error?: any, context?: any): void {
  const errorContext = error ? {
    ...context,
    error: error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      : error
  } : context;

  log(LogLevel.ERROR, message, errorContext);
}

/**
 * Registra uma mensagem de erro fatal
 */
export function fatal(message: string, error?: any, context?: any): void {
  const errorContext = error ? {
    ...context,
    error: error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      : error
  } : context;

  log(LogLevel.FATAL, message, errorContext);
}

// Exportar logger como objeto
export const logger = {
  debug,
  info,
  warn,
  error,
  fatal,
  log,
  configure: configureLogger,
};
