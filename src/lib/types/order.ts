import { BaseRecord } from './base';
import { Product } from './product';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order extends BaseRecord {
  clientId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'delivered' | 'canceled';
  paymentMethod?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}
