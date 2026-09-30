import { api } from "../api/axios";
import type { AdminOrderDetails } from "../types/admin";

export async function getOrderById(id: number): Promise<AdminOrderDetails> {
  const response = await api.get(`/admin/orders/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function updateOrderStatus(id: number, status: string) {
  return api.put(
    `/admin/orders/${id}/status`,
    { status },
    {
      headers: getAuthHeaders(),
    },
  );
}
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getDashboardStats() {
  const response = await api.get("/admin/dashboard", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getUsers() {
  const response = await api.get("/admin/users", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getOrders() {
  const response = await api.get("/admin/orders", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function updateUserRole(userId: number, role: string) {
  await api.put(
    `/admin/users/${userId}/role`,
    {
      role,
    },
    {
      headers: getAuthHeaders(),
    },
  );
}
