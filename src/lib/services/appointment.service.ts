/**
 * Serviço de agendamentos
 *
 * Este serviço gerencia os agendamentos da barbearia, incluindo
 * criação, atualização, cancelamento e consulta de agendamentos.
 */

import { Appointment } from '../types';
import { get, getAll, update } from './database.service';
import { logger } from './logger.service';
import { cache } from './cache.service';
import { DatabaseRecord } from '../types/database';

const CACHE_TTL = 5 * 60; // 5 minutes

function mapStatus(status: string): Appointment['status'] {
  switch (status) {
    case 'cancelled':
    case 'canceled':
      return 'canceled' as Appointment['status'];
    case 'confirmed':
      return 'confirmed' as Appointment['status'];
    case 'no-show':
      return 'no-show' as Appointment['status'];
    case 'completed':
      return 'completed' as Appointment['status'];
    case 'scheduled':
    default:
      return 'scheduled' as Appointment['status'];
  }
}

function mapStatusToDatabase(status: Appointment['status']): 'scheduled' | 'completed' | 'cancelled' {
  switch (status) {
    case 'canceled':
      return 'cancelled';
    case 'confirmed':
    case 'no-show':
      return 'scheduled'; // Mapear para scheduled no banco
    case 'completed':
      return 'completed';
    case 'scheduled':
    default:
      return 'scheduled';
  }
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  try {
    // Check cache first
    const cached = cache.get(`appointment_${id}`);
    if (cached) return cached as Appointment;

    const dbAppointment = await get<'appointments'>('appointments', id);
    if (dbAppointment) {
      // Mapear snake_case para camelCase
      const appointment: Appointment = {
        id: dbAppointment.id,
        clientId: dbAppointment.client_id,
        professionalId: dbAppointment.barber_id,
        serviceId: dbAppointment.service_id,
        date: dbAppointment.date,
        status: mapStatus(dbAppointment.status),
        duration: dbAppointment.duration,
        price: dbAppointment.price,
        notes: dbAppointment.notes ?? undefined,
        createdAt: dbAppointment.created_at,
        updatedAt: dbAppointment.updated_at ?? dbAppointment.created_at,
        isActive: true,
      };
      cache.set(`appointment_${id}`, appointment, { ttl: CACHE_TTL });
      return appointment;
    }
    return null;
  } catch (error) {
    logger.error('Error fetching appointment:', error);
    return null;
  }
}

export async function getClientAppointments(clientId: string): Promise<Appointment[]> {
  try {
    // Check cache first
    const cacheKey = `appointments_client_${clientId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached as Appointment[];

    const appointments = await getAll<'appointments'>('appointments');
    const filtered = appointments
      .filter((a: any) => a.client_id === clientId)
      .map((dbAppointment: any) => ({
        id: dbAppointment.id,
        clientId: dbAppointment.client_id,
        professionalId: dbAppointment.barber_id,
        serviceId: dbAppointment.service_id,
        date: dbAppointment.date,
        status: mapStatus(dbAppointment.status),
        duration: dbAppointment.duration,
        price: dbAppointment.price,
        notes: dbAppointment.notes ?? undefined,
        createdAt: dbAppointment.created_at,
        updatedAt: dbAppointment.updated_at ?? dbAppointment.created_at,
        isActive: true,
      }));

    cache.set(cacheKey, filtered, { ttl: CACHE_TTL });
    return filtered;
  } catch (error) {
    logger.error('Error fetching client appointments:', error);
    return [];
  }
}

export async function getProfessionalAppointments(professionalId: string): Promise<Appointment[]> {
  try {
    // Check cache first
    const cacheKey = `appointments_professional_${professionalId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached as Appointment[];

    const appointments = await getAll<'appointments'>('appointments');
    const filtered = appointments
      .filter((a: any) => a.barber_id === professionalId)
      .map((dbAppointment: any) => ({
        id: dbAppointment.id,
        clientId: dbAppointment.client_id,
        professionalId: dbAppointment.barber_id,
        serviceId: dbAppointment.service_id,
        date: dbAppointment.date,
        status: mapStatus(dbAppointment.status),
        duration: dbAppointment.duration,
        price: dbAppointment.price,
        notes: dbAppointment.notes ?? undefined,
        createdAt: dbAppointment.created_at,
        updatedAt: dbAppointment.updated_at ?? dbAppointment.created_at,
        isActive: true,
      }));

    cache.set(cacheKey, filtered, { ttl: CACHE_TTL });
    return filtered;
  } catch (error) {
    logger.error('Error fetching professional appointments:', error);
    return [];
  }
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
  try {
    const dbAppointment = await update<'appointments'>('appointments', id, {
      status: mapStatusToDatabase(status) as any,
      updated_at: new Date().toISOString()
    });

    if (dbAppointment) {
      // Mapear snake_case para camelCase
      const appointment: Appointment = {
        id: dbAppointment.id,
        clientId: dbAppointment.client_id,
        professionalId: dbAppointment.barber_id,
        serviceId: dbAppointment.service_id,
        date: dbAppointment.date,
        status: mapStatus(dbAppointment.status),
        duration: dbAppointment.duration,
        price: dbAppointment.price,
        notes: dbAppointment.notes ?? undefined,
        createdAt: dbAppointment.created_at,
        updatedAt: dbAppointment.updated_at ?? dbAppointment.created_at,
        isActive: true,
      };
      // Update appointment cache
      cache.set(`appointment_${id}`, appointment, { ttl: CACHE_TTL });
      // Clear client and professional caches
      cache.remove(`appointments_client_${dbAppointment.client_id}`);
      cache.remove(`appointments_professional_${dbAppointment.barber_id}`);
      return appointment;
    }
    return null;
  } catch (error) {
    logger.error('Error updating appointment status:', error);
    return null;
  }
}

export async function getAvailableTimeSlots(date: string, professionalId?: string): Promise<string[]> {
  try {
    // Horários de trabalho: 9h às 18h
    const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
                      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    
    // Buscar agendamentos existentes para a data
    const appointments = await getAll<'appointments'>('appointments');
    const dateAppointments = appointments.filter((a: any) => 
      a.date === date && (!professionalId || a.barber_id === professionalId)
    );
    
    // Filtrar horários ocupados
    const occupiedSlots = dateAppointments.map((a: any) => a.time);
    const availableSlots = workHours.filter(slot => !occupiedSlots.includes(slot));
    
    return availableSlots;
  } catch (error) {
    logger.error('Error fetching available time slots:', error);
    return [];
  }
}

export async function completeAppointment(id: string): Promise<Appointment | null> {
  try {
    return await updateAppointmentStatus(id, 'completed');
  } catch (error) {
    logger.error('Error completing appointment:', error);
    return null;
  }
}
