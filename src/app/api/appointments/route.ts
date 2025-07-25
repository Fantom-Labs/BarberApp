import { NextRequest } from 'next/server';
import {
  getAppointmentById,
  getClientAppointments,
  getProfessionalAppointments,
  updateAppointmentStatus
} from '@/lib/services/appointment.service';
import { create } from '@/lib/services/database.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';
import { Appointment } from '@/lib/types';

type CreateAppointmentData = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>;

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute<Appointment | Appointment[]>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clientId = searchParams.get('clientId');
    const professionalId = searchParams.get('professionalId');

    if (id) {
      const appointment = await getAppointmentById(id);
      if (!appointment) {
        throw new ApiError('Agendamento não encontrado', 404);
      }
      return {
        success: true,
        data: appointment
      };
    }

    if (clientId) {
      const appointments = await getClientAppointments(clientId);
      return {
        success: true,
        data: appointments
      };
    }

    if (professionalId) {
      const appointments = await getProfessionalAppointments(professionalId);
      return {
        success: true,
        data: appointments
      };
    }

    throw new ApiError('ID do cliente ou profissional é obrigatório');
  }, request);
}

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute<Appointment>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();

    // Validar dados do agendamento
    const appointmentData = ApiHandlerService.validate<CreateAppointmentData>(data, {
      clientId: { required: true },
      professionalId: { required: true },
      serviceId: { required: true },
      date: { required: true },
      status: { required: true }
    });

    // Criar agendamento
    const appointment = await create<'appointments'>('appointments', {
      id: crypto.randomUUID(),
      client_id: appointmentData.clientId,
      barber_id: appointmentData.professionalId,
      service_id: appointmentData.serviceId,
      date: appointmentData.date,
      time: '09:00', // valor padrão, ajuste conforme necessário
      duration: appointmentData.duration,
      status: 'scheduled', // ou derive de appointmentData.status se compatível
      price: appointmentData.price,
      notes: appointmentData.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: null
    });

    if (!appointment) {
      throw new ApiError('Não foi possível criar o agendamento');
    }

    // Converter snake_case para camelCase
    const camelAppointment: Appointment = {
      id: appointment.id,
      clientId: appointment.client_id,
      professionalId: appointment.barber_id,
      serviceId: appointment.service_id,
      date: appointment.date,
      status: appointment.status as Appointment['status'],
      duration: appointment.duration,
      price: appointment.price,
      notes: appointment.notes ?? undefined,
      createdAt: appointment.created_at ?? '',
      updatedAt: appointment.updated_at ?? appointment.created_at ?? '',
      isActive: true,
      // service e metadata não vêm do banco
    };
    return {
      success: true,
      data: camelAppointment
    };
  }, request);
}

export async function PUT(request: NextRequest) {
  return ApiHandlerService.execute<Appointment>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();
    const { id, status } = ApiHandlerService.validate<{ id: string; status: Appointment['status'] }>(data, {
      id: { required: true },
      status: { required: true }
    });

    const appointment = await updateAppointmentStatus(id, status);
    if (!appointment) {
      throw new ApiError('Agendamento não encontrado');
    }

    return {
      success: true,
      data: appointment
    };
  }, request);
}
