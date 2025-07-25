/**
 * Serviço de Cadastro Interno de Usuários
 * 
 * Este serviço centraliza todas as operações relacionadas ao cadastro de usuários,
 * incluindo clientes, funcionários e administradores. Ele fornece uma camada de
 * abstração sobre o armazenamento de dados, permitindo que o front-end não precise
 * se preocupar com os detalhes de implementação do armazenamento.
 */

import { cache, CacheKey, CacheType } from './cache.service';

// Tipos de usuário
export enum UserType {
  CLIENT = 'client',
  BARBER = 'barber',
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist'
}

// Interface para endereço
export interface UserAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Interface para preferências do usuário
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

// Interface para segmentação de cliente
export interface ClientSegment {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para dados de cliente
export interface ClientData {
  segments: string[];
  lastVisit?: Date;
  totalVisits: number;
  totalSpent: number;
  averageTicket: number;
  favoriteServices: string[];
  favoriteBarbers: string[];
  notes?: string;
  isActive: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
}

// Interface para dados de barbeiro
export interface BarberData {
  specialties: string[];
  schedule: {
    monday: { start: string; end: string }[];
    tuesday: { start: string; end: string }[];
    wednesday: { start: string; end: string }[];
    thursday: { start: string; end: string }[];
    friday: { start: string; end: string }[];
    saturday: { start: string; end: string }[];
    sunday: { start: string; end: string }[];
  };
  commission: number;
  rating: number;
  totalClients: number;
  totalServices: number;
}

// Interface para usuário
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: UserAddress;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  preferences: UserPreferences;
  clientData?: ClientData;
  barberData?: BarberData;
  isActive: boolean;
}

// Chaves para armazenamento local
const STORAGE_KEYS = {
  USERS: 'barbershop_users',
  CLIENT_SEGMENTS: 'barbershop_client_segments'
};

/**
 * Obtém todos os usuários
 * @returns Lista de usuários
 */
export function getAllUsers(): User[] {
  // Verificar se há dados em cache
  const cachedUsers = cache.get<User[]>(CacheKey.USERS);
  if (cachedUsers) {
    return cachedUsers;
  }

  // Se não houver dados em cache, buscar do localStorage
  try {
    if (typeof window === 'undefined') return [];

    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Armazenar em cache para futuras consultas
    if (users.length > 0) {
      cache.set(CacheKey.USERS, users, { type: CacheType.MEMORY });
    }

    return users;
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    return [];
  }
}

/**
 * Obtém um usuário pelo ID
 * @param userId ID do usuário
 * @returns Usuário encontrado ou null
 */
export function getUserById(userId: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.id === userId) || null;
}

/**
 * Obtém usuários por tipo
 * @param type Tipo de usuário
 * @returns Lista de usuários do tipo especificado
 */
export function getUsersByType(type: UserType): User[] {
  const users = getAllUsers();
  return users.filter(user => user.type === type);
}

/**
 * Obtém todos os clientes
 * @returns Lista de clientes
 */
export function getAllClients(): User[] {
  return getUsersByType(UserType.CLIENT);
}

/**
 * Obtém todos os barbeiros
 * @returns Lista de barbeiros
 */
export function getAllBarbers(): User[] {
  return getUsersByType(UserType.BARBER);
}

/**
 * Cria um novo usuário
 * @param userData Dados do usuário
 * @returns Usuário criado
 */
export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const users = getAllUsers();

  // Verificar se já existe um usuário com o mesmo email
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error(`Já existe um usuário com o email ${userData.email}`);
  }

  // Criar novo usuário
  const now = new Date();
  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    isActive: true
  };

  // Adicionar à lista de usuários
  users.push(newUser);

  // Salvar no localStorage
  saveUsers(users);

  return newUser;
}

/**
 * Atualiza um usuário existente
 * @param userId ID do usuário
 * @param userData Dados atualizados do usuário
 * @returns Usuário atualizado
 */
export function updateUser(userId: string, userData: Partial<User>): User {
  const users = getAllUsers();

  // Encontrar o usuário
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new Error(`Usuário com ID ${userId} não encontrado`);
  }

  // Atualizar dados do usuário
  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date()
  };

  // Substituir na lista
  users[userIndex] = updatedUser;

  // Salvar no localStorage
  saveUsers(users);

  return updatedUser;
}

/**
 * Desativa um usuário
 * @param userId ID do usuário
 * @returns Usuário desativado
 */
export function deactivateUser(userId: string): User {
  return updateUser(userId, { isActive: false });
}

/**
 * Ativa um usuário
 * @param userId ID do usuário
 * @returns Usuário ativado
 */
export function activateUser(userId: string): User {
  return updateUser(userId, { isActive: true });
}

/**
 * Exclui um usuário
 * @param userId ID do usuário
 * @returns true se o usuário foi excluído, false caso contrário
 */
export function deleteUser(userId: string): boolean {
  const users = getAllUsers();

  // Encontrar o usuário
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return false;
  }

  // Remover da lista
  users.splice(userIndex, 1);

  // Salvar no localStorage
  saveUsers(users);

  return true;
}

/**
 * Obtém todos os segmentos de cliente
 * @returns Lista de segmentos de cliente
 */
export function getAllClientSegments(): ClientSegment[] {
  try {
    if (typeof window === 'undefined') return [];

    const segmentsJson = localStorage.getItem(STORAGE_KEYS.CLIENT_SEGMENTS);
    return segmentsJson ? JSON.parse(segmentsJson) : [];
  } catch (error) {
    console.error('Erro ao obter segmentos de cliente:', error);
    return [];
  }
}

/**
 * Cria um novo segmento de cliente
 * @param segmentData Dados do segmento
 * @returns Segmento criado
 */
export function createClientSegment(name: string, description?: string): ClientSegment {
  const segments = getAllClientSegments();

  // Verificar se já existe um segmento com o mesmo nome
  const existingSegment = segments.find(segment => segment.name === name);
  if (existingSegment) {
    throw new Error(`Já existe um segmento com o nome ${name}`);
  }

  // Criar novo segmento
  const now = new Date();
  const newSegment: ClientSegment = {
    id: crypto.randomUUID(),
    name,
    description,
    createdAt: now,
    updatedAt: now
  };

  // Adicionar à lista de segmentos
  segments.push(newSegment);

  // Salvar no localStorage
  saveClientSegments(segments);

  return newSegment;
}

/**
 * Atualiza um segmento de cliente
 * @param segmentId ID do segmento
 * @param segmentData Dados atualizados do segmento
 * @returns Segmento atualizado
 */
export function updateClientSegment(segmentId: string, segmentData: Partial<ClientSegment>): ClientSegment {
  const segments = getAllClientSegments();

  // Encontrar o segmento
  const segmentIndex = segments.findIndex(segment => segment.id === segmentId);
  if (segmentIndex === -1) {
    throw new Error(`Segmento com ID ${segmentId} não encontrado`);
  }

  // Atualizar dados do segmento
  const updatedSegment: ClientSegment = {
    ...segments[segmentIndex],
    ...segmentData,
    updatedAt: new Date()
  };

  // Substituir na lista
  segments[segmentIndex] = updatedSegment;

  // Salvar no localStorage
  saveClientSegments(segments);

  return updatedSegment;
}

/**
 * Exclui um segmento de cliente
 * @param segmentId ID do segmento
 * @returns true se o segmento foi excluído, false caso contrário
 */
export function deleteClientSegment(segmentId: string): boolean {
  const segments = getAllClientSegments();

  // Encontrar o segmento
  const segmentIndex = segments.findIndex(segment => segment.id === segmentId);
  if (segmentIndex === -1) {
    return false;
  }

  // Remover da lista
  segments.splice(segmentIndex, 1);

  // Salvar no localStorage
  saveClientSegments(segments);

  // Remover o segmento de todos os clientes que o possuem
  const users = getAllUsers();
  let updated = false;

  for (const user of users) {
    if (user.type === UserType.CLIENT && user.clientData?.segments.includes(segmentId)) {
      user.clientData.segments = user.clientData.segments.filter(id => id !== segmentId);
      user.updatedAt = new Date();
      updated = true;
    }
  }

  if (updated) {
    saveUsers(users);
  }

  return true;
}

/**
 * Adiciona um cliente a um segmento
 * @param clientId ID do cliente
 * @param segmentId ID do segmento
 * @returns Cliente atualizado
 */
export function addClientToSegment(clientId: string, segmentId: string): User {
  const user = getUserById(clientId);
  if (!user) {
    throw new Error(`Cliente com ID ${clientId} não encontrado`);
  }

  if (user.type !== UserType.CLIENT) {
    throw new Error(`Usuário com ID ${clientId} não é um cliente`);
  }

  const segment = getAllClientSegments().find(s => s.id === segmentId);
  if (!segment) {
    throw new Error(`Segmento com ID ${segmentId} não encontrado`);
  }

  // Inicializar clientData se não existir
  if (!user.clientData) {
    user.clientData = {
      segments: [],
      totalVisits: 0,
      totalSpent: 0,
      averageTicket: 0,
      favoriteServices: [],
      favoriteBarbers: [],
      isActive: true
    };
  }

  // Adicionar segmento se ainda não estiver na lista
  if (!user.clientData.segments.includes(segmentId)) {
    user.clientData.segments.push(segmentId);
    user.updatedAt = new Date();
    updateUser(clientId, user);
  }

  return user;
}

/**
 * Remove um cliente de um segmento
 * @param clientId ID do cliente
 * @param segmentId ID do segmento
 * @returns Cliente atualizado
 */
export function removeClientFromSegment(clientId: string, segmentId: string): User {
  const user = getUserById(clientId);
  if (!user) {
    throw new Error(`Cliente com ID ${clientId} não encontrado`);
  }

  if (user.type !== UserType.CLIENT) {
    throw new Error(`Usuário com ID ${clientId} não é um cliente`);
  }

  if (!user.clientData) {
    return user;
  }

  // Remover segmento se estiver na lista
  if (user.clientData.segments.includes(segmentId)) {
    user.clientData.segments = user.clientData.segments.filter(id => id !== segmentId);
    user.updatedAt = new Date();
    updateUser(clientId, user);
  }

  return user;
}

/**
 * Obtém clientes por segmento
 * @param segmentId ID do segmento
 * @returns Lista de clientes no segmento
 */
export function getClientsBySegment(segmentId: string): User[] {
  const clients = getAllClients();
  return clients.filter(client => 
    client.clientData?.segments.includes(segmentId)
  );
}

/**
 * Salva a lista de usuários no localStorage
 * @param users Lista de usuários
 */
function saveUsers(users: User[]): void {
  try {
    if (typeof window === 'undefined') return;

    // Converter para string JSON e salvar no localStorage
    const usersJson = JSON.stringify(users);
    localStorage.setItem(STORAGE_KEYS.USERS, usersJson);

    // Atualizar o cache
    cache.set(CacheKey.USERS, users, { type: CacheType.MEMORY });
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
}

/**
 * Salva a lista de segmentos de cliente no localStorage
 * @param segments Lista de segmentos
 */
function saveClientSegments(segments: ClientSegment[]): void {
  try {
    if (typeof window === 'undefined') return;

    // Converter para string JSON e salvar no localStorage
    const segmentsJson = JSON.stringify(segments);
    localStorage.setItem(STORAGE_KEYS.CLIENT_SEGMENTS, segmentsJson);
  } catch (error) {
    console.error('Erro ao salvar segmentos de cliente:', error);
  }
}

/**
 * Inicializa o serviço com dados de exemplo
 */
export function initUserRegistry(): void {
  try {
    if (typeof window === 'undefined') return;

    // Verificar se já existem usuários
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      // Criar dados de exemplo
      const sampleUsers: User[] = createSampleUsers();
      saveUsers(sampleUsers);
    }

    // Verificar se já existem segmentos
    const existingSegments = localStorage.getItem(STORAGE_KEYS.CLIENT_SEGMENTS);
    if (!existingSegments) {
      // Criar segmentos de exemplo
      const sampleSegments: ClientSegment[] = createSampleSegments();
      saveClientSegments(sampleSegments);
    }
  } catch (error) {
    console.error('Erro ao inicializar o serviço de cadastro de usuários:', error);
  }
}

/**
 * Cria usuários de exemplo
 * @returns Lista de usuários de exemplo
 */
function createSampleUsers(): User[] {
  const now = new Date();
  
  // Criar barbeiros de exemplo
  const barbers: User[] = [
    {
      id: 'barber-1',
      name: 'Carlos Silva',
      email: 'carlos.silva@example.com',
      phone: '11999887766',
      type: UserType.BARBER,
      birthDate: '1985-05-15',
      gender: 'male',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      isActive: true,
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        notifications: true,
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: false
      },
      barberData: {
        specialties: ['Corte Masculino', 'Barba', 'Tratamento Capilar'],
        schedule: {
          monday: [{ start: '09:00', end: '18:00' }],
          tuesday: [{ start: '09:00', end: '18:00' }],
          wednesday: [{ start: '09:00', end: '18:00' }],
          thursday: [{ start: '09:00', end: '18:00' }],
          friday: [{ start: '09:00', end: '18:00' }],
          saturday: [{ start: '09:00', end: '15:00' }],
          sunday: []
        },
        commission: 0.5,
        rating: 4.8,
        totalClients: 120,
        totalServices: 450
      }
    },
    {
      id: 'barber-2',
      name: 'André Santos',
      email: 'andre.santos@example.com',
      phone: '11998877665',
      type: UserType.BARBER,
      birthDate: '1990-08-22',
      gender: 'male',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false
      },
      barberData: {
        specialties: ['Corte Moderno', 'Barba Estilizada', 'Coloração'],
        schedule: {
          monday: [{ start: '12:00', end: '21:00' }],
          tuesday: [{ start: '12:00', end: '21:00' }],
          wednesday: [{ start: '12:00', end: '21:00' }],
          thursday: [{ start: '12:00', end: '21:00' }],
          friday: [{ start: '12:00', end: '21:00' }],
          saturday: [{ start: '10:00', end: '18:00' }],
          sunday: []
        },
        commission: 0.5,
        rating: 4.9,
        totalClients: 85,
        totalServices: 320
      }
    }
  ];

  // Criar clientes de exemplo
  const clients: User[] = [
    {
      id: 'client-1',
      name: 'Lucas Gomes',
      email: 'lucas.gomes@example.com',
      phone: '11987654321',
      type: UserType.CLIENT,
      birthDate: '1990-01-15',
      gender: 'male',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      isActive: true,
      preferences: {
        theme: 'dark',
        language: 'pt-BR',
        notifications: true,
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: true
      },
      clientData: {
        segments: ['segment-1', 'segment-3'],
        lastVisit: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        totalVisits: 8,
        totalSpent: 480,
        averageTicket: 60,
        favoriteServices: ['Corte Masculino', 'Barba'],
        favoriteBarbers: ['barber-1'],
        isActive: true
      }
    },
    {
      id: 'client-2',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@example.com',
      phone: '11976543210',
      type: UserType.CLIENT,
      birthDate: '1985-07-22',
      gender: 'male',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      isActive: true,
      preferences: {
        theme: 'light',
        language: 'pt-BR',
        notifications: true,
        emailNotifications: false,
        smsNotifications: true,
        marketingEmails: false
      },
      clientData: {
        segments: ['segment-2'],
        lastVisit: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        totalVisits: 5,
        totalSpent: 350,
        averageTicket: 70,
        favoriteServices: ['Corte Moderno', 'Tratamento Capilar'],
        favoriteBarbers: ['barber-2'],
        isActive: true
      }
    },
    {
      id: 'client-3',
      name: 'Mariana Costa',
      email: 'mariana.costa@example.com',
      phone: '11965432109',
      type: UserType.CLIENT,
      birthDate: '1992-03-10',
      gender: 'female',
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      isActive: true,
      preferences: {
        theme: 'system',
        language: 'pt-BR',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      clientData: {
        segments: ['segment-4'],
        lastVisit: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        totalVisits: 3,
        totalSpent: 210,
        averageTicket: 70,
        favoriteServices: ['Corte Feminino', 'Tratamento Capilar'],
        favoriteBarbers: ['barber-1'],
        isActive: true,
        riskLevel: 'medium'
      }
    }
  ];

  // Criar administrador de exemplo
  const admin: User = {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@example.com',
    phone: '11999999999',
    type: UserType.ADMIN,
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
    isActive: true,
    preferences: {
      theme: 'dark',
      language: 'pt-BR',
      notifications: true,
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false
    }
  };

  // Combinar todos os usuários
  return [...barbers, ...clients, admin];
}

/**
 * Cria segmentos de cliente de exemplo
 * @returns Lista de segmentos de exemplo
 */
function createSampleSegments(): ClientSegment[] {
  const now = new Date();
  
  return [
    {
      id: 'segment-1',
      name: 'Cliente Frequente',
      description: 'Clientes que visitam a barbearia pelo menos uma vez por mês',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'segment-2',
      name: 'Cliente Premium',
      description: 'Clientes que gastam mais de R$ 100 por visita',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'segment-3',
      name: 'Cliente Fiel',
      description: 'Clientes que frequentam a barbearia há mais de 6 meses',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'segment-4',
      name: 'Cliente Inativo',
      description: 'Clientes que não visitam a barbearia há mais de 30 dias',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'segment-5',
      name: 'Novo Cliente',
      description: 'Clientes que visitaram a barbearia pela primeira vez nos últimos 30 dias',
      createdAt: now,
      updatedAt: now
    }
  ];
}

// Inicializar o serviço quando importado
if (typeof window !== 'undefined') {
  initUserRegistry();
}
