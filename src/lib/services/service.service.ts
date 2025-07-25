import { Service, BaseRecord } from '../types';
import { create, get, getAll, update, remove } from './database.service';
import { logger } from './logger.service';

export async function createService(data: Omit<Service, keyof BaseRecord>): Promise<Service | null> {
  try {
    const now = new Date().toISOString();
    const service = await create<'services'>('services', {
      ...data,
      id: crypto.randomUUID(),
      is_active: true,
      created_at: now,
      updated_at: now
    } as any);
    return service as unknown as Service;
  } catch (error) {
    logger.error('Error creating service:', error);
    return null;
  }
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const service = await get<'services'>('services', id);
    return service as unknown as Service;
  } catch (error) {
    logger.error('Error getting service:', error);
    return null;
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const services = await getAll<'services'>('services');
    return services as unknown as Service[];
  } catch (error) {
    logger.error('Error getting all services:', error);
    return [];
  }
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service | null> {
  try {
    const service = await update<'services'>('services', id, {
      ...data,
      updated_at: new Date().toISOString()
    } as any);
    return service as unknown as Service;
  } catch (error) {
    logger.error('Error updating service:', error);
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await remove('services', id);
    return true;
  } catch (error) {
    logger.error('Error deleting service:', error);
    return false;
  }
}
