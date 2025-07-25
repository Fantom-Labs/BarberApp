"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit, FiTrash2, FiPackage, FiTruck, FiBarChart2 } from "react-icons/fi";
import { getProductById } from "@/lib/products";
import { calcularFrete } from "@/lib/correios";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [cepDestino, setCepDestino] = useState("");
  const [freteInfo, setFreteInfo] = useState<any>(null);
  const [calculandoFrete, setCalculandoFrete] = useState(false);

  useEffect(() => {
    if (params.id) {
      // Em um ambiente real, faríamos uma chamada à API
      const productId = parseInt(params.id as string);
      const foundProduct = getProductById(productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
      }
      
      setLoading(false);
    }
  }, [params.id]);

  const handleCalcularFrete = async () => {
    if (!cepDestino || cepDestino.length !== 8) {
      alert("Por favor, informe um CEP válido");
      return;
    }

    setCalculandoFrete(true);

    try {
      // Calcular frete PAC
      const fretePAC = await calcularFrete({
        cepOrigem: "30130110", // CEP da loja
        cepDestino,
        peso: product.weight,
        comprimento: product.dimensions.length,
        altura: product.dimensions.height,
        largura: product.dimensions.width,
        servico: "PAC"
      });

      // Calcular frete SEDEX
      const freteSEDEX = await calcularFrete({
        cepOrigem: "30130110", // CEP da loja
        cepDestino,
        peso: product.weight,
        comprimento: product.dimensions.length,
        altura: product.dimensions.height,
        largura: product.dimensions.width,
        servico: "SEDEX"
      });

      setFreteInfo({
        pac: fretePAC,
        sedex: freteSEDEX
      });
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      alert("Não foi possível calcular o frete. Tente novamente mais tarde.");
    } finally {
      setCalculandoFrete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <FiArrowLeft />
          <span>Voltar para produtos</span>
        </button>

        <div className="flex space-x-2">
          <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            <FiEdit />
          </button>
          <button className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-xs object-contain"
            />
          </div>

          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                {product.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                SKU: {product.sku}
              </span>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-primary mb-2">
                R$ {product.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Estoque: {product.stock} unidades
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold mb-2">Calcular Frete</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Digite o CEP"
                  value={cepDestino}
                  onChange={(e) => setCepDestino(e.target.value.replace(/\D/g, ""))}
                  maxLength={8}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleCalcularFrete}
                  disabled={calculandoFrete}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {calculandoFrete ? "Calculando..." : "Calcular"}
                </button>
              </div>

              {freteInfo && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiTruck className="text-primary" />
                      <span>PAC</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">R$ {freteInfo.pac.valor.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Entrega em até {freteInfo.pac.prazoEntrega} dias úteis
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiTruck className="text-primary" />
                      <span>SEDEX</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">R$ {freteInfo.sedex.valor.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Entrega em até {freteInfo.sedex.prazoEntrega} dias úteis
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "details"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Detalhes
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "shipping"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("shipping")}
            >
              Informações de Envio
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "stats"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("stats")}
            >
              Estatísticas
            </button>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Informações do Produto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Categoria</p>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SKU</p>
                      <p>{product.sku}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Código de Barras</p>
                      <p>{product.barcode || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estoque</p>
                      <p>{product.stock} unidades</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Dimensões e Peso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Comprimento</p>
                      <p className="font-semibold">{product.dimensions.length} cm</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Largura</p>
                      <p className="font-semibold">{product.dimensions.width} cm</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Altura</p>
                      <p className="font-semibold">{product.dimensions.height} cm</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Peso</p>
                      <p className="font-semibold">{product.weight} kg</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Informações de Envio</h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiPackage className="text-primary" />
                      <span className="font-medium">Embalagem</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      Este produto é enviado em embalagem segura e adequada para proteger o conteúdo durante o transporte.
                    </p>

                    <div className="flex items-center space-x-2 mb-2">
                      <FiTruck className="text-primary" />
                      <span className="font-medium">Métodos de Envio</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>PAC - Entrega econômica pelos Correios</li>
                      <li>SEDEX - Entrega expressa pelos Correios</li>
                      <li>Retirada na loja - Sem custo de envio</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Estatísticas de Vendas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiBarChart2 className="text-primary" />
                        <span className="font-medium">Vendas no Mês</span>
                      </div>
                      <p className="text-2xl font-bold">12 unidades</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiBarChart2 className="text-green-500" />
                        <span className="font-medium">Receita no Mês</span>
                      </div>
                      <p className="text-2xl font-bold">R$ 550,80</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiBarChart2 className="text-blue-500" />
                        <span className="font-medium">Visualizações</span>
                      </div>
                      <p className="text-2xl font-bold">245</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Histórico de Estoque</h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>05/04/2025</span>
                        <span className="text-green-500">+10 unidades</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>01/04/2025</span>
                        <span className="text-red-500">-5 unidades</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>25/03/2025</span>
                        <span className="text-red-500">-8 unidades</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>15/03/2025</span>
                        <span className="text-green-500">+20 unidades</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
