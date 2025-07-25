/**
 * Tipos e funções para gerenciamento de produtos
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  
  // Informações para envio
  weight: number; // em kg
  dimensions: {
    length: number; // em cm
    width: number; // em cm
    height: number; // em cm
  };
  sku: string;
  barcode?: string;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
  search?: string;
}

// Dados de exemplo com informações de envio
export const sampleProducts: Product[] = [
  { 
    id: 1, 
    name: "Pomada Modeladora", 
    description: "Pomada modeladora com fixação forte para todos os tipos de cabelo. Ideal para penteados estruturados e com efeito matte.", 
    price: 45.90, 
    stock: 15, 
    category: "Cabelo",
    image: "https://placehold.co/100x100/orange/white?text=Pomada",
    weight: 0.15,
    dimensions: {
      length: 8,
      width: 8,
      height: 4
    },
    sku: "POM-MOD-001",
    barcode: "7891234567890",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-04-01T14:30:00Z"
  },
  { 
    id: 2, 
    name: "Óleo para Barba", 
    description: "Óleo hidratante para barba com ingredientes naturais. Amacia e dá brilho à barba, além de hidratar a pele.", 
    price: 39.90, 
    stock: 8, 
    category: "Barba",
    image: "https://placehold.co/100x100/orange/white?text=Óleo",
    weight: 0.10,
    dimensions: {
      length: 5,
      width: 5,
      height: 12
    },
    sku: "OLE-BAR-002",
    barcode: "7891234567891",
    createdAt: "2025-03-10T09:15:00Z",
    updatedAt: "2025-04-02T11:20:00Z"
  },
  { 
    id: 3, 
    name: "Shampoo Anticaspa", 
    description: "Shampoo especial para combater a caspa e aliviar a coceira. Fórmula com zinco piritiona e extratos naturais.", 
    price: 29.90, 
    stock: 20, 
    category: "Cabelo",
    image: "https://placehold.co/100x100/orange/white?text=Shampoo",
    weight: 0.30,
    dimensions: {
      length: 6,
      width: 6,
      height: 15
    },
    sku: "SHA-ANT-003",
    barcode: "7891234567892",
    createdAt: "2025-02-20T14:45:00Z",
    updatedAt: "2025-03-25T16:10:00Z"
  },
  { 
    id: 4, 
    name: "Pente Profissional", 
    description: "Pente de alta qualidade para barbeiros, resistente ao calor e com dentes largos para desembaraçar facilmente.", 
    price: 25.50, 
    stock: 12, 
    category: "Acessórios",
    image: "https://placehold.co/100x100/orange/white?text=Pente",
    weight: 0.05,
    dimensions: {
      length: 20,
      width: 3,
      height: 1
    },
    sku: "PEN-PRO-004",
    barcode: "7891234567893",
    createdAt: "2025-03-05T11:30:00Z",
    updatedAt: "2025-04-03T09:45:00Z"
  },
  { 
    id: 5, 
    name: "Máquina de Corte", 
    description: "Máquina de corte profissional com lâminas de aço inoxidável, motor potente e bateria de longa duração.", 
    price: 199.90, 
    stock: 5, 
    category: "Equipamentos",
    image: "https://placehold.co/100x100/orange/white?text=Máquina",
    weight: 0.45,
    dimensions: {
      length: 18,
      width: 5,
      height: 4
    },
    sku: "MAQ-COR-005",
    barcode: "7891234567894",
    createdAt: "2025-01-15T08:20:00Z",
    updatedAt: "2025-03-20T13:15:00Z"
  },
];

/**
 * Busca produtos com filtros
 */
export function getProducts(filters?: ProductFilters): Product[] {
  let filteredProducts = [...sampleProducts];
  
  if (filters) {
    // Filtrar por categoria
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    // Filtrar por preço
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }
    
    // Filtrar por estoque
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }
    
    // Filtrar por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenar
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
          // Em um sistema real, isso seria baseado em vendas ou visualizações
          // Aqui estamos apenas simulando
          filteredProducts.sort((a, b) => b.stock - a.stock);
          break;
      }
    }
  }
  
  return filteredProducts;
}

/**
 * Busca um produto pelo ID
 */
export function getProductById(id: number): Product | undefined {
  return sampleProducts.find(p => p.id === id);
}

/**
 * Busca um produto pelo SKU
 */
export function getProductBySku(sku: string): Product | undefined {
  return sampleProducts.find(p => p.sku === sku);
}
