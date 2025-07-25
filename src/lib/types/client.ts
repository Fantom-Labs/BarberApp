import { BaseRecord } from './base';
import { User } from './user';

export type ClientInteractionType =
  | 'appointment'
  | 'purchase'
  | 'feedback'
  | 'referral'
  | 'communication'
  | 'cancellation';

export interface ClientInteraction extends BaseRecord {
  clientId: string;
  type: ClientInteractionType;
  date: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface Client extends User {
  segment?: 'new' | 'regular' | 'vip' | 'inactive';
  lastVisit?: string;
  totalSpent?: number;
  appointmentsCount?: number;
  notes?: string;
}
