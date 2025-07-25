import { NextRequest } from 'next/server';
import {
  getServiceById,
  getServicesByCategory,
  updateService,
  deactivateService
} from '@/lib/services/product.service';
import { create } from '@/lib/services/database.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';
import { Service } from '@/lib/types';

type CreateServiceData = Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute<Service | Service[]>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (id) {
      const service = await getServiceById(id);
      if (!service) {
        throw new ApiError('Serviço não encontrado', 404);
      }
      return {
        success: true,
        data: service
      };
    }

    if (category) {
      const services = await getServicesByCategory(category);
      return {
        success: true,
        data: services
      };
    }

    throw new ApiError('ID ou categoria do serviço é obrigatório');
  }, request);
}

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute<Service>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();

    // Validar dados do serviço
    const serviceData = ApiHandlerService.validate<CreateServiceData>(data, {
      name: { required: true },
      description: { required: true },
      price: { required: true },
      duration: { required: true },
      category: { required: true }
    });

    // Criar serviço
    const service = await create<'services'>('services', {
      id: crypto.randomUUID(),
      name: serviceData.name,
      description: serviceData.description,
      price: serviceData.price,
      duration: serviceData.duration,
      category: serviceData.category,
      image: serviceData.imageUrl ?? null,
      is_active: true
    });

    if (!service) {
      throw new ApiError('Não foi possível criar o serviço');
    }

    // Converter snake_case para camelCase
    const camelService: Service = {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      imageUrl: service.image ?? undefined,
      isActive: service.is_active,
      createdAt: '', // ajuste se necessário
      updatedAt: '', // ajuste se necessário
      metadata: undefined,
    };
    return {
      success: true,
      data: camelService
    };
  }, request);
}

export async function PUT(request: NextRequest) {
  return ApiHandlerService.execute<Service>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();
    const { id, price } = ApiHandlerService.validate<{ id: string; price: number }>(data, {
      id: { required: true },
      price: { required: true }
    });

    const service = await updateService(id, { price });
    if (!service) {
      throw new ApiError('Serviço não encontrado');
    }

    return {
      success: true,
      data: service
    };
  }, request);
}

export async function DELETE(request: NextRequest) {
  return ApiHandlerService.execute<{ id: string }>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError('ID do serviço é obrigatório');
    }

    const success = await deactivateService(id);
    if (!success) {
      throw new ApiError('Não foi possível desativar o serviço');
    }

    return {
      success: true,
      data: { id }
    };
  }, request);
}
