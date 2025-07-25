"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Só renderiza no cliente, após a montagem
  if (!mounted) return null;

  // Cria um portal para o elemento body
  return createPortal(
    children,
    document.body
  );
}
