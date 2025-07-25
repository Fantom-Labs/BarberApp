"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Esconder a splash screen após 1.5 segundos
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50">
      <div className="animate-pulse">
        <Image 
          src="/images/logo.svg" 
          alt="DIMY Barber Logo" 
          width={120} 
          height={120} 
          className="mb-4"
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">DIMY BARBER</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Carregando...</p>
    </div>
  );
}
