export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;

  compareAtPrice?: number;
  installmentPlan?: string;
  images?: string[];
  brand?: string;
  isActive?: boolean;
  sku?: string;
  trackQuantity?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  urlHandle?: string;
  metaDescription?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  variants?: string;
  specifications?: string;
  features?: string[];
  sellerId?: number;
  sellerName?: string;
}
