import { BaseRecord } from './base';

export interface Service extends BaseRecord {
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}
