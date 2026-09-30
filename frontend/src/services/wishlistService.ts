import { api } from "../api/axios";
import type { WishlistResponse } from "../types/wishlist";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getWishlist() {
  const response = await api.get<WishlistResponse[]>("/wishlist", {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function addToWishlist(productId: number) {
  const response = await api.post<WishlistResponse>(
    `/wishlist/${productId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
}

export async function removeFromWishlist(productId: number) {
  const response = await api.delete(`/wishlist/${productId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}
