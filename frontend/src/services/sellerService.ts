import { api } from "../api/axios";
import type { SellerDashboard, SellerOrder } from "../types/seller";
import type { Product } from "../types/product";

export async function getSellerDashboard(): Promise<SellerDashboard> {
  const response = await api.get("/seller/dashboard");
  return response.data;
}

export async function getSellerProfile() {
  const response = await api.get("/seller/profile");
  return response.data;
}

export async function getSellerProducts(): Promise<Product[]> {
  const response = await api.get("/seller/products");
  return response.data;
}

export async function createSellerProduct(product: any) {
  const response = await api.post("/seller/products", product);
  return response.data;
}

export async function updateSellerProduct(id: number, product: any) {
  const response = await api.put(`/seller/products/${id}`, product);
  return response.data;
}

export async function deleteSellerProduct(id: number) {
  const response = await api.delete(`/seller/products/${id}`);
  return response.data;
}

export async function getSellerOrders(): Promise<SellerOrder[]> {
  const response = await api.get("/seller/orders");
  return response.data;
}
