// Serviço de pedidos (orders) - mock inicial
import { Order } from '../types';
import { get, getAll, update } from './database.service';

/**
 * Obtém um pedido pelo ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const order = await get('orders', id);
  return order as unknown as Order | null;
}

/**
 * Obtém pedidos de um cliente
 */
export async function getClientOrders(clientId: string): Promise<Order[]> {
  const all = await getAll('orders');
  const filtered = (all as any[]).filter(order => order.client_id === clientId);
  return filtered as unknown as Order[];
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const updated = await update('orders', id, {
    status,
    updated_at: new Date().toISOString()
  } as any);
  return updated as unknown as Order;
}

/**
 * Cancela um pedido
 */
export async function cancelOrder(id: string): Promise<boolean> {
  const updated = await update('orders', id, {
    status: 'cancelled',
    updated_at: new Date().toISOString()
  } as any);
  return !!updated;
}
