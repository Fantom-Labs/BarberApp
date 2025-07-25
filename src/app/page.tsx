import { redirect } from 'next/navigation';

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

export default function HomePage() {
  // Redirecionar para o dashboard
  redirect('/dashboard');
}
