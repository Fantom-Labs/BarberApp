"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiPackage, FiTruck, FiPrinter, FiMail, FiCreditCard, FiMapPin, FiUser, FiCalendar, FiClock } from "react-icons/fi";
import { sampleOrders, trackOrder, updateOrderStatus } from "@/lib/orders";

type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (params.id) {
      // Em um ambiente real, faríamos uma chamada à API
      const foundOrder = sampleOrders.find(o => o.id === params.id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      }
      
      setLoading(false);
    }
  }, [params.id]);

  const handleTrackOrder = async () => {
    if (!order || !order.shipping.trackingCode) return;
    
    setTrackingLoading(true);
    
    try {
      const info = await trackOrder(order.id);
      setTrackingInfo(info);
    } catch (error) {
      console.error("Erro ao rastrear pedido:", error);
      alert("Não foi possível rastrear o pedido. Tente novamente mais tarde.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    
    try {
      const updatedOrder = await updateOrderStatus(order.id, newStatus);
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      alert("Não foi possível atualizar o status do pedido. Tente novamente mais tarde.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Pedido não encontrado</h2>
        <button
          onClick={() => router.back()}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors mx-auto"
        >
          <FiArrowLeft />
          <span>Voltar</span>
        </button>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'PAID':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'CANCELED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'PAID': return 'Pago';
      case 'PROCESSING': return 'Processando';
      case 'SHIPPED': return 'Enviado';
      case 'DELIVERED': return 'Entregue';
      case 'CANCELED': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <FiArrowLeft />
          <span>Voltar para pedidos</span>
        </button>

        <div className="flex space-x-2">
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
            <FiPrinter />
            <span>Imprimir</span>
          </button>
          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
            <FiMail />
            <span>Enviar Email</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <FiCalendar className="text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FiUser className="text-primary" />
              <h3 className="font-semibold">Informações do Cliente</h3>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Nome:</span> {order.customerName}</p>
              <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
              <p><span className="font-medium">ID do Cliente:</span> {order.customerId}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FiMapPin className="text-primary" />
              <h3 className="font-semibold">Endereço de Entrega</h3>
            </div>
            <div className="space-y-2">
              <p>{order.shippingAddress.street}, {order.shippingAddress.number}</p>
              {order.shippingAddress.complement && <p>{order.shippingAddress.complement}</p>}
              <p>{order.shippingAddress.neighborhood}</p>
              <p>{order.shippingAddress.city} - {order.shippingAddress.state}</p>
              <p>CEP: {order.shippingAddress.cep}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FiCreditCard className="text-primary" />
              <h3 className="font-semibold">Informações de Pagamento</h3>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Método:</span> 
                {order.payment.method === 'CREDIT_CARD' ? 'Cartão de Crédito' : 
                 order.payment.method === 'BOLETO' ? 'Boleto' : 'PIX'}
              </p>
              <p>
                <span className="font-medium">Status:</span> 
                <span className={
                  order.payment.status === 'PAID' ? 'text-green-600 dark:text-green-400' : 
                  order.payment.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-red-600 dark:text-red-400'
                }>
                  {order.payment.status === 'PAID' ? 'Pago' : 
                   order.payment.status === 'PENDING' ? 'Pendente' : 'Falhou'}
                </span>
              </p>
              {order.payment.installments && (
                <p><span className="font-medium">Parcelas:</span> {order.payment.installments}x</p>
              )}
              {order.payment.paidAt && (
                <p><span className="font-medium">Data do Pagamento:</span> {new Date(order.payment.paidAt).toLocaleDateString('pt-BR')}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold mb-4">Itens do Pedido</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantidade</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço Unit.</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3 whitespace-nowrap">{item.productName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.productSku}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">{item.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">R$ {item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-medium">R$ {item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-medium">Subtotal</td>
                  <td className="px-4 py-3 text-right font-medium">R$ {order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-medium">Frete</td>
                  <td className="px-4 py-3 text-right font-medium">R$ {order.shippingCost.toFixed(2)}</td>
                </tr>
                {order.discount > 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right font-medium">Desconto</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">-R$ {order.discount.toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                  <td colSpan={4} className="px-4 py-3 text-right font-bold">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-primary text-lg">R$ {order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FiTruck className="text-primary" />
              <h3 className="font-semibold">Informações de Envio</h3>
            </div>
            
            <div className="space-y-3">
              <p>
                <span className="font-medium">Método:</span> 
                {order.shipping.method === 'PAC' ? 'PAC' : 
                 order.shipping.method === 'SEDEX' ? 'SEDEX' : 'Retirada na Loja'}
              </p>
              
              <p><span className="font-medium">Valor do Frete:</span> R$ {order.shipping.cost.toFixed(2)}</p>
              
              <p>
                <span className="font-medium">Prazo de Entrega:</span> 
                {order.shipping.estimatedDelivery} dias úteis
              </p>
              
              {order.shipping.trackingCode && (
                <div>
                  <p className="font-medium mb-1">Código de Rastreio:</p>
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm font-mono">
                      {order.shipping.trackingCode}
                    </span>
                    <button
                      onClick={handleTrackOrder}
                      disabled={trackingLoading}
                      className="text-primary hover:text-primary-dark text-sm"
                    >
                      {trackingLoading ? "Rastreando..." : "Rastrear"}
                    </button>
                  </div>
                </div>
              )}
              
              {trackingInfo && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Histórico de Rastreamento:</p>
                  <div className="space-y-3">
                    {trackingInfo.trackingInfo.map((info: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary pl-3 py-1">
                        <p className="font-medium">{info.status}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{info.local}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(info.dataHora).toLocaleDateString('pt-BR')} às {new Date(info.dataHora).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <FiPackage className="text-primary" />
              <h3 className="font-semibold">Atualizar Status do Pedido</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status atual: <span className={`font-medium ${getStatusBadgeClass(order.status)}`}>{getStatusText(order.status)}</span>
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus('PROCESSING' as OrderStatus)}
                  disabled={updatingStatus || order.status === 'PROCESSING'}
                  className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                >
                  Processando
                </button>
                
                <button
                  onClick={() => handleUpdateStatus('SHIPPED' as OrderStatus)}
                  disabled={updatingStatus || order.status === 'SHIPPED'}
                  className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
                >
                  Enviado
                </button>
                
                <button
                  onClick={() => handleUpdateStatus('DELIVERED' as OrderStatus)}
                  disabled={updatingStatus || order.status === 'DELIVERED'}
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                >
                  Entregue
                </button>
                
                <button
                  onClick={() => handleUpdateStatus('CANCELED' as OrderStatus)}
                  disabled={updatingStatus || order.status === 'CANCELED'}
                  className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                >
                  Cancelado
                </button>
              </div>
              
              {order.notes && (
                <div className="mt-4">
                  <p className="font-medium mb-1">Observações:</p>
                  <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg">{order.notes}</p>
                </div>
              )}
              
              <div className="mt-4">
                <label htmlFor="notes" className="block font-medium mb-1">Adicionar Observação:</label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800"
                  placeholder="Adicione uma observação ao pedido..."
                ></textarea>
                <button className="mt-2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Salvar Observação
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
