/**
 * Serviço de armazenamento persistente
 *
 * Este serviço utiliza localStorage para armazenar dados no navegador
 * e também utiliza o sistema de cache centralizado para acesso rápido.
 */

import { cache, CacheKey, CacheType } from './services/cache.service';

// Tipos de dados
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "client" | "professional";
  birthDate?: string;
  createdAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
  appointments?: AppointmentSummary[];
}

export interface UserPreferences {
  theme?: "light" | "dark";
  language?: "pt-BR" | "en" | "es";
  notifications?: boolean;
  emailNotifications?: boolean;
}

export interface AppointmentSummary {
  id: string;
  date: string;
  service: string;
  barber: string;
  status: "scheduled" | "completed" | "cancelled";
}

// Chaves de armazenamento
const STORAGE_KEYS = {
  USERS: "barbershop_users",
  CURRENT_USER: "barbershop_current_user",
  AUTH_TOKEN: "authToken",
};

// Variáveis locais para compatibilidade com código existente
// Estas variáveis serão gradualmente substituídas pelo sistema de cache centralizado
let usersCache: StoredUser[] | null = null;
let currentUserCache: StoredUser | null = null;

/**
 * Inicializa o serviço de armazenamento
 */
export function initStorage(): void {
  try {
    if (typeof window === "undefined") return;

    // Verificar se os dados já estão no cache centralizado
    const cachedUsers = cache.get<StoredUser[]>(CacheKey.USERS);
    if (cachedUsers) {
      usersCache = cachedUsers;
      return;
    }

    // Carregar usuários do localStorage
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (storedUsers) {
      usersCache = JSON.parse(storedUsers);
      // Armazenar no cache centralizado
      cache.set(CacheKey.USERS, usersCache, { type: CacheType.MEMORY });
    } else {
      usersCache = [];
      // Adicionar usuários pré-cadastrados com diferentes idades
      const sampleUsers: StoredUser[] = [
        {
          id: "user-lucas-gomes",
          name: "Lucas Gomes",
          email: "lucas.gomes@example.com",
          phone: "11999887766",
          type: "client",
          birthDate: "1990-01-15", // 30-35 anos
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: "dark",
            language: "pt-BR",
            notifications: true,
            emailNotifications: true,
          },
          appointments: [
            {
              id: "apt-001",
              date: "2025-04-15T14:00:00Z",
              service: "Corte de Cabelo",
              barber: "Carlos Silva",
              status: "scheduled",
            }
          ]
        },
        {
          id: "user-joao-silva",
          name: "João Silva",
          email: "joao.silva@example.com",
          phone: "11988776655",
          type: "client",
          birthDate: "1985-05-20", // 35-40 anos
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            theme: "light",
            language: "pt-BR",
            notifications: true,
            emailNotifications: false,
          }
        },
        {
          id: "user-pedro-santos",
          name: "Pedro Santos",
          email: "pedro.santos@example.com",
          phone: "11977665544",
          type: "client",
          birthDate: "1978-11-10", // 40-45 anos
          createdAt: new Date().toISOString()
        },
        {
          id: "user-maria-oliveira",
          name: "Maria Oliveira",
          email: "maria.oliveira@example.com",
          phone: "11966554433",
          type: "client",
          birthDate: "1995-03-25", // 25-30 anos
          createdAt: new Date().toISOString()
        },
        {
          id: "user-ana-costa",
          name: "Ana Costa",
          email: "ana.costa@example.com",
          phone: "11955443322",
          type: "client",
          birthDate: "2000-07-12", // 20-25 anos
          createdAt: new Date().toISOString()
        },
        {
          id: "user-carlos-mendes",
          name: "Carlos Mendes",
          email: "carlos.mendes@example.com",
          phone: "11944332211",
          type: "client",
          birthDate: "1970-09-30", // 50-55 anos
          createdAt: new Date().toISOString()
        },
        {
          id: "user-julia-ferreira",
          name: "Júlia Ferreira",
          email: "julia.ferreira@example.com",
          phone: "11933221100",
          type: "client",
          birthDate: "2005-12-05", // 15-20 anos
          createdAt: new Date().toISOString()
        },
        {
          id: "user-roberto-almeida",
          name: "Roberto Almeida",
          email: "roberto.almeida@example.com",
          phone: "11922110099",
          type: "client",
          birthDate: "1965-04-18", // 55-60 anos
          createdAt: new Date().toISOString()
        },
        {
          id: "user-rafael-barber",
          name: "Rafael Silva",
          email: "rafael.silva@example.com",
          phone: "11911009988",
          type: "professional",
          birthDate: "1988-08-22", // Profissional
          createdAt: new Date().toISOString()
        },
        {
          id: "user-carlos-barber",
          name: "Carlos Oliveira",
          email: "carlos.oliveira@example.com",
          phone: "11900998877",
          type: "professional",
          birthDate: "1982-02-14", // Profissional
          createdAt: new Date().toISOString()
        }
      ];

      // Adicionar todos os usuários de exemplo
      usersCache.push(...sampleUsers);
      saveUsers();
    }

    // Carregar usuário atual do localStorage
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedCurrentUser) {
      currentUserCache = JSON.parse(storedCurrentUser);
    }
  } catch (error) {
    console.error("Erro ao inicializar o armazenamento:", error);
    usersCache = [];
  }
}

/**
 * Salva os usuários no localStorage
 */
function saveUsers(): void {
  try {
    if (typeof window === "undefined" || !usersCache) return;

    // Converter para string JSON e salvar no localStorage
    const usersJson = JSON.stringify(usersCache);
    localStorage.setItem(STORAGE_KEYS.USERS, usersJson);

    // Verificar se os dados foram salvos corretamente
    const savedData = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!savedData) {
      console.error("Falha ao salvar usuários: dados não encontrados após salvar");
    } else {
      console.log(`Usuários salvos com sucesso. Total de usuários: ${usersCache.length}`);
    }
  } catch (error) {
    console.error("Erro ao salvar usuários:", error);
  }
}

/**
 * Salva o usuário atual no localStorage
 */
function saveCurrentUser(): void {
  try {
    if (typeof window === "undefined" || !currentUserCache) return;

    // Converter para string JSON e salvar no localStorage
    const userJson = JSON.stringify(currentUserCache);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userJson);

    // Atualizar o cache centralizado
    cache.set(CacheKey.CURRENT_USER, currentUserCache, { type: CacheType.MEMORY });

    // Verificar se os dados foram salvos corretamente
    const savedData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!savedData) {
      console.error("Falha ao salvar usuário atual: dados não encontrados após salvar");
    }
  } catch (error) {
    console.error("Erro ao salvar usuário atual:", error);
  }
}

/**
 * Obtém todos os usuários
 */
export function getAllUsers(): StoredUser[] {
  // Verificar se os dados estão no cache centralizado
  const cachedUsers = cache.get<StoredUser[]>(CacheKey.USERS);
  if (cachedUsers) {
    return cachedUsers;
  }

  // Se não estiver no cache, inicializar o armazenamento
  if (!usersCache) {
    initStorage();
  }

  // Armazenar no cache centralizado para futuras consultas
  if (usersCache) {
    cache.set(CacheKey.USERS, usersCache, { type: CacheType.MEMORY });
  }

  return usersCache || [];
}

/**
 * Obtém um usuário pelo ID
 */
export function getUserById(id: string): StoredUser | null {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
}

/**
 * Obtém um usuário pelo email
 */
export function getUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Adiciona ou atualiza um usuário
 */
export function saveUser(user: StoredUser): void {
  if (!usersCache) {
    initStorage();
  }

  if (!usersCache) {
    usersCache = [];
  }

  const index = usersCache.findIndex(u => u.id === user.id);

  if (index >= 0) {
    // Atualizar usuário existente
    usersCache[index] = { ...usersCache[index], ...user };
  } else {
    // Adicionar novo usuário
    usersCache.push(user);
  }

  saveUsers();
}

/**
 * Define o usuário atual
 */
export function setCurrentUser(user: StoredUser): void {
  currentUserCache = user;
  saveCurrentUser();

  // Atualizar a data do último login
  user.lastLogin = new Date().toISOString();
  saveUser(user);

  // Salvar o token de autenticação
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `token-${user.id}-${Date.now()}`);
    }
  } catch (error) {
    console.error("Erro ao salvar token de autenticação:", error);
  }
}

/**
 * Obtém o usuário atual
 */
export function getCurrentUser(): StoredUser | null {
  // Verificar se os dados estão no cache centralizado
  const cachedUser = cache.get<StoredUser>(CacheKey.CURRENT_USER);
  if (cachedUser) {
    currentUserCache = cachedUser;
    return cachedUser;
  }

  // Se não estiver no cache, buscar do localStorage
  if (!currentUserCache) {
    try {
      if (typeof window !== "undefined") {
        const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (storedCurrentUser) {
          currentUserCache = JSON.parse(storedCurrentUser);
          // Armazenar no cache centralizado
          cache.set(CacheKey.CURRENT_USER, currentUserCache, { type: CacheType.MEMORY });
        }
      }
    } catch (error) {
      console.error("Erro ao obter usuário atual:", error);
    }
  }

  return currentUserCache;
}

/**
 * Limpa o usuário atual (logout)
 */
export function clearCurrentUser(): void {
  currentUserCache = null;

  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  } catch (error) {
    console.error("Erro ao limpar usuário atual:", error);
  }
}

/**
 * Verifica se um email já está em uso
 */
export function isEmailInUse(email: string, excludeUserId?: string): boolean {
  const users = getAllUsers();
  return users.some(user =>
    user.email.toLowerCase() === email.toLowerCase() &&
    (!excludeUserId || user.id !== excludeUserId)
  );
}

/**
 * Verifica se um telefone já está em uso
 */
export function isPhoneInUse(phone: string, excludeUserId?: string): boolean {
  const users = getAllUsers();
  const normalizedPhone = phone.replace(/\D/g, '');

  return users.some(user => {
    const userNormalizedPhone = user.phone.replace(/\D/g, '');
    return userNormalizedPhone === normalizedPhone &&
           (!excludeUserId || user.id !== excludeUserId);
  });
}

// Inicializar o serviço quando este módulo for importado
if (typeof window !== "undefined") {
  initStorage();
}
