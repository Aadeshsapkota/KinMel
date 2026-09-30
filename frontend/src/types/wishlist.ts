export interface WishlistResponse {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  compareAtPrice: number | null;
  brand: string;
  stock: number;
  addedDate: string;
}
