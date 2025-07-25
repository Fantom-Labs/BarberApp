import { BaseRecord } from './base';
import { Service } from './service';

export interface Appointment extends BaseRecord {
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no-show';
  duration: number;
  price: number;
  notes?: string;
  service?: Service;
  metadata?: Record<string, unknown>;
}
