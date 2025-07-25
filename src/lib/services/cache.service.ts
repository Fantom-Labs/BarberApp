/**
 * Serviço de cache avançado
 *
 * Este serviço fornece funcionalidades de cache para melhorar o desempenho
 * da aplicação, reduzindo chamadas desnecessárias ao banco de dados.
 */

import { logger } from './logger.service';

// Tipos de cache
export enum CacheType {
  MEMORY = 'memory',
  SESSION = 'session',
  LOCAL = 'local',
}

// Interface para itens de cache
interface CacheItem<T> {
  value: T;
  expiry: number | null; // Timestamp de expiração (null = não expira)
  createdAt: number;
}

// Configuração do cache
interface CacheConfig {
  defaultType: CacheType;
  defaultTTL: number | null; // Tempo de vida em milissegundos (null = não expira)
  maxSize: number; // Número máximo de itens no cache de memória
  cleanupInterval: number; // Intervalo para limpeza de itens expirados (ms)
}

// Configuração padrão
const defaultConfig: CacheConfig = {
  defaultType: CacheType.MEMORY,
  defaultTTL: 30 * 60 * 1000, // 30 minutos
  maxSize: 500, // Aumentado para armazenar mais itens
  cleanupInterval: 10 * 60 * 1000, // 10 minutos
};

// Cache em memória
const memoryCache = new Map<string, CacheItem<any>>();

// ID do intervalo de limpeza
let cleanupIntervalId: NodeJS.Timeout | null = null;

// Configuração atual
let config: CacheConfig = { ...defaultConfig };

/**
 * Configura o serviço de cache
 */
export function configureCache(newConfig: Partial<CacheConfig>): void {
  config = { ...config, ...newConfig };

  // Reiniciar intervalo de limpeza se necessário
  if (cleanupIntervalId) {
    clearInterval(cleanupIntervalId);
    startCleanupInterval();
  }
}

/**
 * Inicia o intervalo de limpeza de itens expirados
 */
function startCleanupInterval(): void {
  if (typeof window === 'undefined') return;

  cleanupIntervalId = setInterval(() => {
    cleanupExpiredItems();
  }, config.cleanupInterval);
}

/**
 * Limpa itens expirados do cache
 */
export function cleanupExpiredItems(): void {
  const now = Date.now();

  // Limpar cache de memória
  for (const [key, item] of memoryCache.entries()) {
    if (item.expiry !== null && item.expiry < now) {
      memoryCache.delete(key);
      logger.debug(`Cache: Item expirado removido (memória): ${key}`);
    }
  }

  // Limpar sessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const sessionKeys = Object.keys(sessionStorage);
      for (const key of sessionKeys) {
        if (key.startsWith('cache_')) {
          const item = JSON.parse(sessionStorage.getItem(key) || '');
          if (item.expiry !== null && item.expiry < now) {
            sessionStorage.removeItem(key);
            logger.debug(`Cache: Item expirado removido (sessão): ${key}`);
          }
        }
      }
    } catch (error) {
      logger.error('Erro ao limpar cache de sessão', error);
    }
  }

  // Limpar localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localKeys = Object.keys(localStorage);
      for (const key of localKeys) {
        if (key.startsWith('cache_')) {
          const item = JSON.parse(localStorage.getItem(key) || '');
          if (item.expiry !== null && item.expiry < now) {
            localStorage.removeItem(key);
            logger.debug(`Cache: Item expirado removido (local): ${key}`);
          }
        }
      }
    } catch (error) {
      logger.error('Erro ao limpar cache local', error);
    }
  }
}

/**
 * Limita o tamanho do cache de memória
 */
function enforceCacheLimit(): void {
  if (memoryCache.size <= config.maxSize) return;

  // Ordenar itens por data de criação (mais antigos primeiro)
  const sortedItems = Array.from(memoryCache.entries())
    .sort((a, b) => a[1].createdAt - b[1].createdAt);

  // Remover itens mais antigos até atingir o limite
  const itemsToRemove = sortedItems.slice(0, memoryCache.size - config.maxSize);
  for (const [key] of itemsToRemove) {
    memoryCache.delete(key);
    logger.debug(`Cache: Item removido por limite de tamanho: ${key}`);
  }
}

/**
 * Armazena um valor no cache
 */
export function set<T>(
  key: string,
  value: T,
  options: {
    type?: CacheType;
    ttl?: number | null;
  } = {}
): void {
  const type = options.type || config.defaultType;
  const ttl = options.ttl !== undefined ? options.ttl : config.defaultTTL;
  const now = Date.now();

  const cacheItem: CacheItem<T> = {
    value,
    expiry: ttl === null ? null : now + ttl,
    createdAt: now,
  };

  try {
    switch (type) {
      case CacheType.MEMORY:
        memoryCache.set(key, cacheItem);
        enforceCacheLimit();
        break;

      case CacheType.SESSION:
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        }
        break;

      case CacheType.LOCAL:
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        }
        break;
    }

    logger.debug(`Cache: Item armazenado (${type}): ${key}`);
  } catch (error) {
    logger.error(`Erro ao armazenar item no cache (${type}): ${key}`, error);

    // Fallback para cache de memória
    if (type !== CacheType.MEMORY) {
      memoryCache.set(key, cacheItem);
      enforceCacheLimit();
      logger.debug(`Cache: Fallback para memória: ${key}`);
    }
  }
}

/**
 * Obtém um valor do cache
 */
export function get<T>(key: string, type?: CacheType): T | null {
  const cacheType = type || config.defaultType;
  const now = Date.now();

  try {
    let cacheItem: CacheItem<T> | null = null;

    switch (cacheType) {
      case CacheType.MEMORY:
        cacheItem = memoryCache.get(key) as CacheItem<T> || null;
        break;

      case CacheType.SESSION:
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const item = sessionStorage.getItem(`cache_${key}`);
          cacheItem = item ? JSON.parse(item) : null;
        }
        break;

      case CacheType.LOCAL:
        if (typeof window !== 'undefined' && window.localStorage) {
          const item = localStorage.getItem(`cache_${key}`);
          cacheItem = item ? JSON.parse(item) : null;
        }
        break;
    }

    // Verificar se o item existe e não expirou
    if (cacheItem && (cacheItem.expiry === null || cacheItem.expiry > now)) {
      logger.debug(`Cache: Hit (${cacheType}): ${key}`);
      return cacheItem.value;
    }

    // Se o item expirou, removê-lo
    if (cacheItem && cacheItem.expiry !== null && cacheItem.expiry <= now) {
      remove(key, cacheType);
      logger.debug(`Cache: Miss (expirado): ${key}`);
    } else {
      logger.debug(`Cache: Miss (não encontrado): ${key}`);
    }

    return null;
  } catch (error) {
    logger.error(`Erro ao obter item do cache (${cacheType}): ${key}`, error);
    return null;
  }
}

/**
 * Remove um valor do cache
 */
export function remove(key: string, type?: CacheType): void {
  const cacheType = type || config.defaultType;

  try {
    switch (cacheType) {
      case CacheType.MEMORY:
        memoryCache.delete(key);
        break;

      case CacheType.SESSION:
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem(`cache_${key}`);
        }
        break;

      case CacheType.LOCAL:
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(`cache_${key}`);
        }
        break;
    }

    logger.debug(`Cache: Item removido (${cacheType}): ${key}`);
  } catch (error) {
    logger.error(`Erro ao remover item do cache (${cacheType}): ${key}`, error);
  }
}

/**
 * Limpa todo o cache
 */
export function clear(type?: CacheType): void {
  try {
    if (!type || type === CacheType.MEMORY) {
      memoryCache.clear();
      logger.debug('Cache: Cache de memória limpo');
    }

    if (typeof window !== 'undefined') {
      if (!type || type === CacheType.SESSION) {
        // Limpar apenas itens de cache no sessionStorage
        const sessionKeys = Object.keys(sessionStorage);
        for (const key of sessionKeys) {
          if (key.startsWith('cache_')) {
            sessionStorage.removeItem(key);
          }
        }
        logger.debug('Cache: Cache de sessão limpo');
      }

      if (!type || type === CacheType.LOCAL) {
        // Limpar apenas itens de cache no localStorage
        const localKeys = Object.keys(localStorage);
        for (const key of localKeys) {
          if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
          }
        }
        logger.debug('Cache: Cache local limpo');
      }
    }
  } catch (error) {
    logger.error('Erro ao limpar cache', error);
  }
}

/**
 * Verifica se um valor existe no cache
 */
export function has(key: string, type?: CacheType): boolean {
  return get(key, type) !== null;
}

/**
 * Obtém um valor do cache ou executa uma função para obtê-lo
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    type?: CacheType;
    ttl?: number | null;
  } = {}
): Promise<T> {
  // Tentar obter do cache
  const cachedValue = get<T>(key, options.type);
  if (cachedValue !== null) {
    return cachedValue;
  }

  // Se não estiver no cache, executar a função
  try {
    const value = await fetcher();

    // Armazenar no cache
    set(key, value, options);

    return value;
  } catch (error) {
    logger.error(`Erro ao buscar valor para cache: ${key}`, error);
    throw error;
  }
}

// Iniciar intervalo de limpeza
if (typeof window !== 'undefined') {
  startCleanupInterval();
}

// Chaves de cache padronizadas
export enum CacheKey {
  USERS = 'users',
  CURRENT_USER = 'current_user',
  APPOINTMENTS = 'appointments',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  SERVICES = 'services',
  CLIENT_INSIGHTS = 'client_insights',
  CLIENT_STATISTICS = 'client_statistics',
  WHATSAPP_AUTH = 'whatsapp_auth',
  WHATSAPP_CONVERSATIONS = 'whatsapp_conversations'
}

// Exportar como objeto
export const cache = {
  set,
  get,
  remove,
  clear,
  has,
  getOrSet,
  configure: configureCache,
  cleanup: cleanupExpiredItems,
};
