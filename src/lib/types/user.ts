import { BaseRecord } from './base';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
}

export interface User extends BaseRecord {
  name: string;
  email: string;
  phone: string;
  type: 'client' | 'professional';
  birthDate: string;
  lastLogin: string;
  preferences: UserPreferences;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, keyof BaseRecord | 'lastLogin' | 'preferences'> {
  password: string;
}
