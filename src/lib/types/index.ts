export * from './base';
export * from './user';
export * from './client';
export * from './product';
export * from './service';
export * from './appointment';
export * from './order';

// Table names type
export type TableName = 'users' | 'products' | 'services' | 'orders' | 'appointments' | 'clients' | 'interactions';

// JSON type for database compatibility
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// Client Insight type
export interface ClientInsight {
  clientId: string;
  totalInteractions: number;
  recentInteractions: number;
  engagementLevel: string;
  lastInteraction: string | null;
}
