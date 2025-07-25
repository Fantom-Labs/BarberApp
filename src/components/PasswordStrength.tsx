"use client";

import { useEffect, useState } from "react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (password: string) => {
    if (!password) {
      setStrength(0);
      setMessage("");
      return;
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Variety check
    const uniqueChars = new Set(password).size;
    if (uniqueChars > 5) score += 1;
    if (uniqueChars > 10) score += 1;
    
    // Normalize to 0-100
    const normalizedScore = Math.min(Math.floor((score / 8) * 100), 100);
    setStrength(normalizedScore);
    
    // Set message based on score
    if (normalizedScore < 30) {
      setMessage("Senha fraca");
    } else if (normalizedScore < 60) {
      setMessage("Senha média");
    } else if (normalizedScore < 80) {
      setMessage("Senha forte");
    } else {
      setMessage("Senha excelente");
    }
  };

  // Determine color based on strength
  const getColor = () => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-green-500";
    return "bg-emerald-500";
  };

  if (!password) return null;

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      <p className={`text-xs mt-1 ${
        strength < 30 ? "text-red-500" : 
        strength < 60 ? "text-yellow-500" : 
        "text-green-500"
      }`}>
        {message}
      </p>
    </div>
  );
}
