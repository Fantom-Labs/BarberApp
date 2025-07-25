import { NextRequest } from 'next/server';
import {
  getProductById,
  getProductsByCategory,
  updateProductStock,
  deactivateProduct
} from '@/lib/services/product.service';
import { create } from '@/lib/services/database.service';
import { ApiHandlerService, ApiError } from '@/lib/services/api-handler.service';
import { Product } from '@/lib/types';

type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;

export async function GET(request: NextRequest) {
  return ApiHandlerService.execute<Product | Product[]>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (id) {
      const product = await getProductById(id);
      if (!product) {
        throw new ApiError('Produto não encontrado', 404);
      }
      return {
        success: true,
        data: product
      };
    }

    if (category) {
      const products = await getProductsByCategory(category);
      return {
        success: true,
        data: products
      };
    }

    throw new ApiError('ID ou categoria do produto é obrigatório');
  }, request);
}

export async function POST(request: NextRequest) {
  return ApiHandlerService.execute<Product>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();

    // Validar dados do produto
    const productData = ApiHandlerService.validate<CreateProductData>(data, {
      name: { required: true },
      price: { required: true },
      category: { required: true },
      description: { required: true }
    });

    // Criar produto
    const now = new Date().toISOString();
    const product = await create<'products'>('products', {
      id: crypto.randomUUID(),
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stockQuantity,
      category: productData.category,
      image: productData.imageUrl ?? null,
      is_active: true,
      created_at: now,
      updated_at: now
    });

    if (!product) {
      throw new ApiError('Não foi possível criar o produto');
    }

    // Converter snake_case para camelCase
    const camelProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.image ?? undefined,
      stockQuantity: product.stock,
      sku: '', // ajuste se necessário
      brand: '', // ajuste se necessário
      metadata: undefined,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at ?? product.created_at,
    };
    return {
      success: true,
      data: camelProduct
    };
  }, request);
}

export async function PUT(request: NextRequest) {
  return ApiHandlerService.execute<Product>(async (req) => {
    // Verificar autenticação
    await ApiHandlerService.requireAuth(req);

    const data = await req.json();
    const { id, stock } = ApiHandlerService.validate<{ id: string; stock: number }>(data, {
      id: { required: true },
      stock: { required: true }
    });

    const product = await updateProductStock(id, stock);
    if (!product) {
      throw new ApiError('Produto não encontrado');
    }

    return {
      success: true,
      data: product
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
      throw new ApiError('ID do produto é obrigatório');
    }

    const success = await deactivateProduct(id);
    if (!success) {
      throw new ApiError('Não foi possível desativar o produto');
    }

    return {
      success: true,
      data: { id }
    };
  }, request);
}
