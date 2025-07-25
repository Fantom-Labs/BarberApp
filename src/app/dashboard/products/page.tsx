import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import TopProductsSection from "@/components/TopProductsSection";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  // Dados de exemplo
  const products = [
    {
      id: 1,
      name: "Pomada Modeladora",
      description: "Pomada modeladora com fixação forte",
      price: 45.90,
      stock: 15,
      category: "Cabelo",
      image: "https://placehold.co/100x100/orange/white?text=Pomada"
    },
    {
      id: 2,
      name: "Óleo para Barba",
      description: "Óleo hidratante para barba",
      price: 39.90,
      stock: 8,
      category: "Barba",
      image: "https://placehold.co/100x100/orange/white?text=Óleo"
    },
    {
      id: 3,
      name: "Shampoo Anticaspa",
      description: "Shampoo especial para combater a caspa",
      price: 29.90,
      stock: 20,
      category: "Cabelo",
      image: "https://placehold.co/100x100/orange/white?text=Shampoo"
    },
    {
      id: 4,
      name: "Pente Profissional",
      description: "Pente de alta qualidade para barbeiros",
      price: 25.50,
      stock: 12,
      category: "Acessórios",
      image: "https://placehold.co/100x100/orange/white?text=Pente"
    },
    {
      id: 5,
      name: "Máquina de Corte",
      description: "Máquina de corte profissional",
      price: 199.90,
      stock: 5,
      category: "Equipamentos",
      image: "https://placehold.co/100x100/orange/white?text=Máquina"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
          <FiPlus />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex space-x-2">
            <select className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary">
              <option value="all">Todas Categorias</option>
              <option value="hair">Cabelo</option>
              <option value="beard">Barba</option>
              <option value="accessories">Acessórios</option>
              <option value="equipment">Equipamentos</option>
            </select>

            <select className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-primary">
              <option value="newest">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="stock-asc">Menor Estoque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>

                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Estoque: {product.stock}</span>
                </div>

                <div className="mt-2 flex space-x-2">
                  <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                    <FiEdit2 />
                  </button>
                  <button className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 text-sm">
              <span className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {product.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      <TopProductsSection />

      {/* Paginação */}
      <div className="flex justify-center mt-6">
        <nav className="flex space-x-1">
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50" disabled>
            Anterior
          </button>
          <button className="px-3 py-1 rounded-md bg-primary text-white">
            1
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            2
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            3
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            Próximo
          </button>
        </nav>
      </div>
    </div>
  );
}
