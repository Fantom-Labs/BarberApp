/**
 * Serviço de autenticação
 *
 * Este serviço utiliza o armazenamento persistente para autenticar usuários
 * e manter o estado de login entre sessões.
 */

import { sendWelcomeEmail } from "./email-service";
import {
  getUserByEmail,
  saveUser,
  setCurrentUser,
  getCurrentUser as getStoredCurrentUser,
  clearCurrentUser,
  isEmailInUse,
  isPhoneInUse,
  StoredUser
} from "./storage-service";

// Reutilizando a interface StoredUser do storage-service
export type User = StoredUser;

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
  type: "client" | "professional";
}

// Mapa de senhas para usuários (em um ambiente real, as senhas seriam armazenadas com hash)
const userPasswords: Record<string, string> = {
  // Senha para o usuário pré-cadastrado Lucas Gomes
  "user-lucas-gomes": "senha123",

  // Senhas para outros usuários de exemplo
  "user-1": "senha123",
  "user-2": "senha123",
  "user-3": "senha123",
};

/**
 * Realiza o login de um usuário
 */
export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
  console.log("Tentando login com:", credentials.email);

  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 800));

  // Verificar se o email é do Lucas Gomes (login especial)
  if (credentials.email.toLowerCase() === "lucas.gomes@example.com" && credentials.password === "senha123") {
    const user = getUserByEmail("lucas.gomes@example.com");

    if (user) {
      // Atualizar a data do último login
      user.lastLogin = new Date().toISOString();

      // Definir como usuário atual
      setCurrentUser(user);

      // Gerar token
      const token = `token-${user.id}-${Date.now()}`;

      return { user, token };
    }
  }

  // Busca o usuário pelo email
  const user = getUserByEmail(credentials.email);

  // Verifica se o usuário existe e a senha está correta
  if (user && userPasswords[user.id] === credentials.password) {
    // Definir como usuário atual
    setCurrentUser(user);

    // Gerar token
    const token = `token-${user.id}-${Date.now()}`;

    return { user, token };
  }

  return null;
}

/**
 * Registra um novo usuário
 */
export async function register(data: RegisterData): Promise<{ user: User; token: string }> {
  console.log("Registrando novo usuário:", data);

  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Verifica se o email já está em uso
  if (isEmailInUse(data.email)) {
    throw new Error("Este email já está em uso");
  }

  // Verifica se o telefone já está em uso
  if (isPhoneInUse(data.phone)) {
    throw new Error("Este telefone já está em uso");
  }

  // Cria um novo usuário
  const userId = `user-${Date.now()}`;
  const newUser: User = {
    id: userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    birthDate: data.birthDate,
    type: data.type,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: "light",
      language: "pt-BR",
      notifications: true,
      emailNotifications: true,
    },
    appointments: [],
  };

  // Salvar a senha no mapa de senhas
  userPasswords[userId] = data.password;

  // Salvar o usuário no armazenamento
  saveUser(newUser);

  // Definir como usuário atual
  setCurrentUser(newUser);

  // Envia email de boas-vindas
  const userTypeText = data.type === "client" ? "Cliente" : "Profissional";
  await sendWelcomeEmail(data.name, data.email, userTypeText);

  // Gera um token
  const token = `token-${userId}-${Date.now()}`;

  return { user: newUser, token };
}

/**
 * Recuperação de senha
 */
export async function forgotPassword(email: string): Promise<boolean> {
  console.log("Solicitando recuperação de senha para:", email);

  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 800));

  // Verifica se o email existe
  const user = getUserByEmail(email);

  // Se o usuário existe, simula o envio de um email de recuperação
  if (user) {
    console.log(`Email de recuperação enviado para ${email}`);
    return true;
  }

  return false;
}

/**
 * Obtém o usuário atual
 */
export async function getCurrentUser(token?: string): Promise<User | null> {
  console.log("Obtendo usuário atual");

  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obter o usuário atual do armazenamento
  const currentUser = getStoredCurrentUser();

  // Se o token for fornecido, verificar se é válido
  if (token && currentUser) {
    // Em um ambiente real, verificaríamos o token adequadamente
    if (token.includes(currentUser.id)) {
      return currentUser;
    }
    return null;
  }

  return currentUser;
}

/**
 * Realiza o logout
 */
export async function logout(): Promise<void> {
  console.log("Realizando logout");

  // Sem atraso para acelerar o processo de logout

  // Limpar o usuário atual
  clearCurrentUser();

  console.log("Logout realizado com sucesso");
}
