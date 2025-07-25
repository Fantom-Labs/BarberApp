export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type WithoutBaseRecord<T extends BaseRecord> = Omit<T, keyof BaseRecord>;

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
