/**
 * Sistema de pedidos com integração de envio
 */

import { Product } from './products';
import { calcularFrete, gerarEtiqueta, rastrearEncomenda } from './correios';

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingInfo {
  method: 'PAC' | 'SEDEX' | 'RETIRADA';
  cost: number;
  estimatedDelivery: number; // em dias
  trackingCode?: string;
  status?: string;
  trackingHistory?: any[];
}

export interface PaymentInfo {
  method: 'CREDIT_CARD' | 'BOLETO' | 'PIX';
  status: 'PENDING' | 'PAID' | 'FAILED';
  transactionId?: string;
  installments?: number;
  paidAt?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  shipping: ShippingInfo;
  payment: PaymentInfo;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dados de exemplo
export const sampleOrders: Order[] = [
  {
    id: 'ORD-2025-0001',
    customerId: 'USR-001',
    customerName: 'João Silva',
    customerEmail: 'joao.silva@example.com',
    items: [
      {
        productId: 1,
        productName: 'Pomada Modeladora',
        productSku: 'POM-MOD-001',
        quantity: 2,
        unitPrice: 45.90,
        totalPrice: 91.80
      },
      {
        productId: 2,
        productName: 'Óleo para Barba',
        productSku: 'OLE-BAR-002',
        quantity: 1,
        unitPrice: 39.90,
        totalPrice: 39.90
      }
    ],
    subtotal: 131.70,
    shippingCost: 18.50,
    discount: 0,
    total: 150.20,
    shippingAddress: {
      cep: '30130-110',
      street: 'Rua dos Carijós',
      number: '150',
      complement: 'Apto 302',
      neighborhood: 'Centro',
      city: 'Belo Horizonte',
      state: 'MG'
    },
    shipping: {
      method: 'PAC',
      cost: 18.50,
      estimatedDelivery: 5,
      trackingCode: 'BR123456789BR',
      status: 'Em trânsito'
    },
    payment: {
      method: 'CREDIT_CARD',
      status: 'PAID',
      transactionId: 'TRX-123456',
      installments: 1,
      paidAt: '2025-04-05T14:30:00Z'
    },
    status: 'SHIPPED',
    createdAt: '2025-04-05T14:25:00Z',
    updatedAt: '2025-04-06T10:15:00Z'
  },
  {
    id: 'ORD-2025-0002',
    customerId: 'USR-002',
    customerName: 'Maria Oliveira',
    customerEmail: 'maria.oliveira@example.com',
    items: [
      {
        productId: 5,
        productName: 'Máquina de Corte',
        productSku: 'MAQ-COR-005',
        quantity: 1,
        unitPrice: 199.90,
        totalPrice: 199.90
      }
    ],
    subtotal: 199.90,
    shippingCost: 25.90,
    discount: 20.00,
    total: 205.80,
    shippingAddress: {
      cep: '04538-132',
      street: 'Av. Brigadeiro Faria Lima',
      number: '3477',
      complement: 'Sala 1001',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP'
    },
    shipping: {
      method: 'SEDEX',
      cost: 25.90,
      estimatedDelivery: 2,
      trackingCode: 'BR987654321BR',
      status: 'Entregue'
    },
    payment: {
      method: 'PIX',
      status: 'PAID',
      transactionId: 'PIX-789012',
      paidAt: '2025-04-03T09:45:00Z'
    },
    status: 'DELIVERED',
    createdAt: '2025-04-03T09:40:00Z',
    updatedAt: '2025-04-05T11:20:00Z'
  }
];

/**
 * Cria um novo pedido
 */
export async function createOrder(
  customerId: string,
  customerName: string,
  customerEmail: string,
  items: { productId: number, quantity: number }[],
  shippingAddress: Address,
  shippingMethod: 'PAC' | 'SEDEX' | 'RETIRADA',
  paymentMethod: 'CREDIT_CARD' | 'BOLETO' | 'PIX',
  discount: number = 0
): Promise<Order> {
  try {
    // Em um ambiente real, aqui seria feita uma chamada à API do backend
    
    // Simulação de criação de pedido
    const orderItems: OrderItem[] = items.map(item => {
      // Aqui buscaríamos o produto do banco de dados
      const product = { id: item.productId, name: `Produto ${item.productId}`, price: 50.0, sku: `SKU-00${item.productId}` };
      
      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: product.price * item.quantity
      };
    });
    
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Calcular frete (em um ambiente real)
    let shippingCost = 0;
    if (shippingMethod !== 'RETIRADA') {
      // Simulação de cálculo de frete
      const freteResponse = await calcularFrete({
        cepOrigem: '30130-110', // CEP da loja
        cepDestino: shippingAddress.cep,
        peso: 1, // Peso total em kg
        comprimento: 20,
        altura: 15,
        largura: 10,
        servico: shippingMethod
      });
      
      shippingCost = freteResponse.valor;
    }
    
    const total = subtotal + shippingCost - discount;
    
    // Gerar código de rastreio (em um ambiente real)
    const trackingCode = shippingMethod !== 'RETIRADA' 
      ? await gerarEtiqueta('ORD-' + Date.now(), shippingAddress)
      : undefined;
    
    const newOrder: Order = {
      id: 'ORD-' + Date.now(),
      customerId,
      customerName,
      customerEmail,
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      total,
      shippingAddress,
      shipping: {
        method: shippingMethod,
        cost: shippingCost,
        estimatedDelivery: shippingMethod === 'SEDEX' ? 2 : 5,
        trackingCode,
        status: 'Aguardando postagem'
      },
      payment: {
        method: paymentMethod,
        status: 'PENDING'
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newOrder;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw new Error('Não foi possível criar o pedido. Tente novamente mais tarde.');
  }
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  try {
    // Em um ambiente real, aqui seria feita uma chamada à API do backend
    
    // Simulação de atualização de pedido
    const order = sampleOrders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error(`Pedido ${orderId} não encontrado`);
    }
    
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };
    
    return updatedOrder;
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    throw new Error('Não foi possível atualizar o status do pedido. Tente novamente mais tarde.');
  }
}

/**
 * Rastreia um pedido pelos Correios
 */
export async function trackOrder(orderId: string): Promise<any> {
  try {
    // Em um ambiente real, aqui seria feita uma chamada à API do backend
    
    // Simulação de rastreamento
    const order = sampleOrders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error(`Pedido ${orderId} não encontrado`);
    }
    
    if (!order.shipping.trackingCode) {
      throw new Error(`Pedido ${orderId} não possui código de rastreio`);
    }
    
    const trackingInfo = await rastrearEncomenda(order.shipping.trackingCode);
    
    return {
      orderId,
      trackingCode: order.shipping.trackingCode,
      trackingInfo
    };
  } catch (error) {
    console.error('Erro ao rastrear pedido:', error);
    throw new Error('Não foi possível rastrear o pedido. Tente novamente mais tarde.');
  }
}
