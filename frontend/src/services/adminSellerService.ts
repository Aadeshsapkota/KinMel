import { api } from "../api/axios";
import type { Seller } from "../types/seller";

export async function getAllSellers(): Promise<Seller[]> {
  const response = await api.get("/admin/sellers");
  return response.data;
}

export async function createSeller(data: {
  companyName: string;
  description: string;
  logoUrl?: string;
  userId: number;
}): Promise<Seller> {
  const response = await api.post("/admin/sellers", data);
  return response.data;
}

export async function updateSeller(
  id: number,
  data: {
    companyName: string;
    description: string;
    logoUrl?: string;
    isApproved: boolean;
    isSuspended: boolean;
  },
): Promise<Seller> {
  const response = await api.put(`/admin/sellers/${id}`, data);
  return response.data;
}

export async function deleteSeller(id: number) {
  const response = await api.delete(`/admin/sellers/${id}`);
  return response.data;
}
