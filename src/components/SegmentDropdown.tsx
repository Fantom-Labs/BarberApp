"use client";

import React, { useEffect, useRef, useState } from 'react';
import Portal from './Portal';
import { ClientSegment } from '@/lib/client-analytics';
import ClientSegmentBadge from './ClientSegmentBadge';

interface SegmentDropdownProps {
  segments: ClientSegment[];
  onSelect: (segmentName: string) => void;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export default function SegmentDropdown({
  segments,
  onSelect,
  isOpen,
  onClose,
  triggerRef
}: SegmentDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  // Calcular posição do dropdown baseado no elemento de referência
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192, // 48rem (w-48) = 192px
        width: 192
      });
    }
  }, [isOpen, triggerRef]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Verificar se o clique foi no trigger (para evitar fechar imediatamente)
      if (triggerRef.current && triggerRef.current.contains(event.target as Node)) {
        return;
      }

      // Verificar se o clique foi fora do dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Usar setTimeout para evitar que o evento de clique que abriu o dropdown também o feche
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        ref={dropdownRef}
        className="fixed bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 text-xs"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        {segments.map((segment) => (
          <button
            key={segment.id}
            onClick={() => {
              onSelect(segment.name);
              onClose();
            }}
            className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <ClientSegmentBadge segment={segment.name} className="mr-1 text-xs" showPercentage={true} />
          </button>
        ))}
      </div>
    </Portal>
  );
}
