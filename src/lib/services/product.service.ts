/**
 * Serviço de produtos e serviços
 * 
 * Este serviço gerencia os produtos e serviços oferecidos pela barbearia,
 * incluindo estoque, preços e categorias.
 */

import { Product, Service, Order, OrderItem } from '../types';
import { 
  getAll, 
  create, 
  update, 
  get, 
  remove 
} from './database.service';
import { addClientInteraction } from './client.service';

/**
 * Obtém todos os produtos
 */
export async function getAllProducts(): Promise<Product[]> {
  const products = await getAll<'products'>('products');
  return products as unknown as Product[];
}

/**
 * Obtém um produto pelo ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const product = await get<'products'>('products', id);
  return product as unknown as Product;
}

/**
 * Obtém produtos por categoria
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAll<'products'>('products');
  const filtered = products.filter((product: any) => product.category === category);
  return filtered as unknown as Product[];
}

/**
 * Cria um novo produto
 */
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
  try {
    const newProduct = await create<'products'>('products', {
      ...productData,
      is_active: true
    } as any);
    
    return newProduct as unknown as Product;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return null;
  }
}

/**
 * Atualiza um produto existente
 */
export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  try {
    const updatedData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    
    const updated = await update<'products'>('products', id, updatedData as any);
    return updated as unknown as Product;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return null;
  }
}

/**
 * Atualiza o estoque de um produto
 */
export async function updateProductStock(id: string, quantity: number): Promise<Product | null> {
  try {
    const product = await getProductById(id);
    if (!product) {
      throw new Error('Produto não encontrado');
    }
    
    const newStock = product.stockQuantity + quantity;
    if (newStock < 0) {
      throw new Error('Estoque insuficiente');
    }
    
    const updated = await update<'products'>('products', id, {
      stock_quantity: newStock,
      updated_at: new Date().toISOString()
    } as any);
    
    return updated as unknown as Product;
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    return null;
  }
}

/**
 * Desativa um produto
 */
export async function deactivateProduct(id: string): Promise<boolean> {
  try {
    const updated = await update<'products'>('products', id, {
      is_active: false,
      updated_at: new Date().toISOString()
    } as any);
    
    return !!updated;
  } catch (error) {
    console.error('Erro ao desativar produto:', error);
    return false;
  }
}

/**
 * Obtém todos os serviços
 */
export async function getAllServices(): Promise<Service[]> {
  const services = await getAll<'services'>('services');
  return services as unknown as Service[];
}

/**
 * Obtém um serviço pelo ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const service = await get<'services'>('services', id);
  return service as unknown as Service;
}

/**
 * Obtém serviços por categoria
 */
export async function getServicesByCategory(category: string): Promise<Service[]> {
  const services = await getAll<'services'>('services');
  const filtered = services.filter((service: any) => service.category === category);
  return filtered as unknown as Service[];
}

/**
 * Cria um novo serviço
 */
export async function createService(serviceData: Omit<Service, 'id'>): Promise<Service | null> {
  try {
    const newService = await create<'services'>('services', {
      ...serviceData,
      is_active: true
    } as any);
    
    return newService as unknown as Service;
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return null;
  }
}

/**
 * Atualiza um serviço existente
 */
export async function updateService(id: string, data: Partial<Service>): Promise<Service | null> {
  try {
    const updated = await update<'services'>('services', id, data as any);
    return updated as unknown as Service;
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return null;
  }
}

/**
 * Desativa um serviço
 */
export async function deactivateService(id: string): Promise<boolean> {
  try {
    const updated = await update<'services'>('services', id, {
      is_active: false
    } as any);
    
    return !!updated;
  } catch (error) {
    console.error('Erro ao desativar serviço:', error);
    return false;
  }
}

/**
 * Cria um novo pedido
 */
export async function createOrder(
  clientId: string, 
  items: Array<{ productId: string, quantity: number }>,
  paymentMethod: string
): Promise<Order | null> {
  try {
    // Verificar estoque e calcular total
    let total = 0;
    const orderItems: OrderItem[] = [];
    
    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }
      
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto ${product.name}`);
      }
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        product: product
      });
      
      total += product.price * item.quantity;
    }
    
    // Criar o pedido
    const order = await create<'orders'>('orders', {
      client_id: clientId,
      items: orderItems as any,
      total,
      status: 'pending',
      payment_method: paymentMethod,
      is_active: true
    } as any);
    
    // Atualizar estoque dos produtos
    for (const item of items) {
      await updateProductStock(item.productId, -item.quantity);
    }
    
    // Registrar interação com o cliente
    await addClientInteraction({
      clientId,
      type: 'purchase',
      description: `Pedido criado - Total: R$ ${total.toFixed(2)}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    });
    
    return order as unknown as Order;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return null;
  }
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  try {
    const updated = await update<'orders'>('orders', id, {
      status: status === 'canceled' ? 'cancelled' : status,
      updated_at: new Date().toISOString()
    } as any);
    
    return updated as unknown as Order;
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return null;
  }
}

/**
 * Obtém os pedidos de um cliente
 */
export async function getClientOrders(clientId: string): Promise<Order[]> {
  const orders = await getAll<'orders'>('orders');
  const filtered = (orders as any[]).filter((order: any) => order.client_id === clientId);
  return filtered as unknown as Order[];
}

/**
 * Obtém um pedido pelo ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const order = await get<'orders'>('orders', id);
  return order as unknown as Order;
}

/**
 * Cancela um pedido
 */
export async function cancelOrder(id: string): Promise<boolean> {
  try {
    const updated = await update<'orders'>('orders', id, {
      status: 'cancelled',
      updated_at: new Date().toISOString()
    } as any);
    
    return !!updated;
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    return false;
  }
}
