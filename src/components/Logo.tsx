"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";

// Usando memo para evitar re-renderizações desnecessárias
export const Logo = memo(function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center justify-center h-16">
      {showText ? (
        <div className="flex items-center">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="mr-2"
            priority
            loading="eager"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white">DIMY</span>
          <span className="text-sm ml-1 text-orange-500">BARBER</span>
        </div>
      ) : (
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          priority
          loading="eager"
        />
      )}
    </Link>
  );
});
