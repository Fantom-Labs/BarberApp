"use client";

import { useState, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import { Language, getCurrentLanguage, setLanguage } from "@/lib/i18n";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("pt-BR");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const currentLang = getCurrentLanguage();
      setSelectedLanguage(currentLang);
    } catch (error) {
      console.error('Error getting language:', error);
      // Fallback to default language
      setSelectedLanguage('pt-BR');
    }
  }, []);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "pt-BR", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    try {
      setLanguage(language);
      setIsOpen(false);

      // Recarregar a página para aplicar o novo idioma
      // Em uma aplicação real, você usaria um contexto ou estado global
      // para atualizar os componentes sem recarregar a página
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error setting language:', error);
      setIsOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
        aria-label="Select language"
      >
        <FiGlobe className="h-5 w-5" />
        <span className="text-sm font-medium">
          {languages.find((lang) => lang.code === selectedLanguage)?.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 ${
                selectedLanguage === language.code
                  ? "bg-gray-100 dark:bg-gray-700 text-primary"
                  : ""
              }`}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
