/**
 * Sistema de internacionalização simples
 *
 * Em um ambiente real, você usaria uma biblioteca como i18next ou next-intl
 */

export type Language = "pt-BR" | "en" | "es";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Traduções
const translations: Translations = {
  // Autenticação
  "auth.login.title": {
    "pt-BR": "Login",
    "en": "Login",
    "es": "Iniciar Sesión"
  },
  "auth.login.email": {
    "pt-BR": "Email",
    "en": "Email",
    "es": "Correo Electrónico"
  },
  "auth.login.password": {
    "pt-BR": "Senha",
    "en": "Password",
    "es": "Contraseña"
  },
  "auth.login.forgotPassword": {
    "pt-BR": "Esqueceu a senha?",
    "en": "Forgot password?",
    "es": "¿Olvidó su contraseña?"
  },
  "auth.login.button": {
    "pt-BR": "Entrar",
    "en": "Sign In",
    "es": "Entrar"
  },
  "auth.login.noAccount": {
    "pt-BR": "Não tem uma conta?",
    "en": "Don't have an account?",
    "es": "¿No tiene una cuenta?"
  },
  "auth.login.signUp": {
    "pt-BR": "Cadastre-se",
    "en": "Sign Up",
    "es": "Regístrese"
  },

  // Registro
  "auth.register.title": {
    "pt-BR": "Criar uma Conta",
    "en": "Create an Account",
    "es": "Crear una Cuenta"
  },
  "auth.register.name": {
    "pt-BR": "Nome Completo",
    "en": "Full Name",
    "es": "Nombre Completo"
  },
  "auth.register.email": {
    "pt-BR": "Email",
    "en": "Email",
    "es": "Correo Electrónico"
  },
  "auth.register.phone": {
    "pt-BR": "Telefone",
    "en": "Phone",
    "es": "Teléfono"
  },
  "auth.register.birthDate": {
    "pt-BR": "Data de Nascimento",
    "en": "Date of Birth",
    "es": "Fecha de Nacimiento"
  },
  "auth.register.password": {
    "pt-BR": "Senha",
    "en": "Password",
    "es": "Contraseña"
  },
  "auth.register.confirmPassword": {
    "pt-BR": "Confirmar Senha",
    "en": "Confirm Password",
    "es": "Confirmar Contraseña"
  },
  "auth.register.button": {
    "pt-BR": "Cadastrar",
    "en": "Register",
    "es": "Registrarse"
  },
  "auth.register.haveAccount": {
    "pt-BR": "Já tem uma conta?",
    "en": "Already have an account?",
    "es": "¿Ya tiene una cuenta?"
  },
  "auth.register.signIn": {
    "pt-BR": "Entrar",
    "en": "Sign In",
    "es": "Iniciar Sesión"
  },

  // Dashboard
  "dashboard.welcome": {
    "pt-BR": "Bem-vindo ao seu Dashboard",
    "en": "Welcome to your Dashboard",
    "es": "Bienvenido a su Panel"
  },
  "dashboard.appointments": {
    "pt-BR": "Agendamentos",
    "en": "Appointments",
    "es": "Citas"
  },
  "dashboard.products": {
    "pt-BR": "Produtos",
    "en": "Products",
    "es": "Productos"
  },
  "dashboard.courses": {
    "pt-BR": "Cursos",
    "en": "Courses",
    "es": "Cursos"
  },

  // Comum
  "common.loading": {
    "pt-BR": "Carregando...",
    "en": "Loading...",
    "es": "Cargando..."
  },
  "common.error": {
    "pt-BR": "Ocorreu um erro",
    "en": "An error occurred",
    "es": "Ocurrió un error"
  },
  "common.success": {
    "pt-BR": "Sucesso!",
    "en": "Success!",
    "es": "¡Éxito!"
  }
};

/**
 * Obtém a tradução para uma chave
 */
export function translate(key: string, language: Language = "pt-BR"): string {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  return translations[key][language] || translations[key]["pt-BR"] || key;
}

/**
 * Obtém o idioma atual
 */
export function getCurrentLanguage(): Language {
  if (typeof window === "undefined") {
    // Usar a configuração do .env.local ou o padrão
    return (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language) || "pt-BR";
  }

  try {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage && (storedLanguage === "pt-BR" || storedLanguage === "en" || storedLanguage === "es")) {
      return storedLanguage as Language;
    }
    // Usar a configuração do .env.local ou o padrão
    return (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language) || "pt-BR";
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language) || "pt-BR";
  }
}

/**
 * Define o idioma atual
 */
export function setLanguage(language: Language): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("language", language);
      // Em um ambiente real, você recarregaria a página ou atualizaria os componentes
    } catch (error) {
      console.error("Error setting language in localStorage:", error);
    }
  }
}
