export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type TableName = 'users' | 'services' | 'appointments' | 'products' | 'orders' | 'client_interactions';

export interface DatabaseRecord extends BaseRecord {
  [key: string]: any;
}

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface DatabaseSchema {
  users: DatabaseRecord;
  services: DatabaseRecord;
  appointments: DatabaseRecord;
  products: DatabaseRecord;
  orders: DatabaseRecord;
  client_interactions: DatabaseRecord;
}
