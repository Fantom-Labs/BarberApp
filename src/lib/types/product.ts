import { BaseRecord } from './base';

export interface Product extends BaseRecord {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stockQuantity: number;
  brand?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}
