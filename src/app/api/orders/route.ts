import { NextRequest } from 'next/server';
import {
  getOrderById,
  getClientOrders,
  updateOrderStatus,
  cancelOrder
} from '@/lib/services/order.service';
import { create } from '@/lib/services/database.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';
import { Order, OrderItem } from '@/lib/types';

type CreateOrderData = {
  clientId: string;
  items: OrderItem[];
  paymentMethod: 'credit' | 'debit' | 'cash' | 'pix';
  notes?: string;
  deliveryAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clientId = searchParams.get('clientId');

    let orders: Order | Order[];

    if (id) {
      const order = await getOrderById(id);
      if (!order) {
        throw new ApiError('Pedido não encontrado', 404);
      }
      orders = order;
    } else if (clientId) {
      orders = await getClientOrders(clientId);
    } else {
      throw new ApiError('ID do cliente ou do pedido é obrigatório');
    }

    return {
      success: true,
      data: orders
    };
  }, request);
}

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();

    // Validar dados do pedido
    const orderData = ApiHandlerService.validate<CreateOrderData>(data, {
      clientId: { required: true },
      items: { required: true },
      paymentMethod: { required: true }
    });

    // Validar items do pedido
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new ApiError('O pedido deve conter pelo menos um item');
    }

    // Calcular total do pedido
    const total = orderData.items.reduce((sum, item) => sum + (item.quantity * (item as any).price), 0);

    // Criar pedido
    const now = new Date().toISOString();
    try {
      const order = await create('orders', {
        id: crypto.randomUUID(),
        client_id: orderData.clientId,
        items: JSON.stringify(orderData.items),
        total,
        status: 'pending',
        payment_method: orderData.paymentMethod,
        created_at: now,
        updated_at: now
      });

      if (!order) {
        throw new ApiError('Não foi possível criar o pedido');
      }

      return {
        success: true,
        data: order
      };
    } catch (err: any) {
      console.error('Erro ao criar pedido:', err?.message || err);
      throw new ApiError('Erro interno ao criar pedido: ' + (err?.message || err));
    }
  }, request);
}

export async function PUT(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();
    const { id, status } = ApiHandlerService.validate<{ id: string; status: Order['status'] }>(data, {
      id: { required: true },
      status: { required: true }
    });

    const order = await updateOrderStatus(id, status);
    if (!order) {
      throw new ApiError('Pedido não encontrado');
    }

    return {
      success: true,
      data: order
    };
  }, request);
}

export async function DELETE(request: NextRequest) {
  return ApiHandlerService.execute(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError('ID do pedido é obrigatório');
    }

    const success = await cancelOrder(id);
    if (!success) {
      throw new ApiError('Não foi possível cancelar o pedido');
    }

    return {
      success: true,
      data: { id }
    };
  }, request);
}
