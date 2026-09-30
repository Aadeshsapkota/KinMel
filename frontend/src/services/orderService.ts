import { api } from "../api/axios";

import type { Order } from "../types/order";
import type { OrderDetails } from "../types/orderDetails";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getOrders() {
  const response = await api.get<Order[]>("/orders", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function getOrderById(id: number): Promise<OrderDetails> {
  const response = await api.get(`/orders/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function deleteOrder(id: number) {
  return api.delete(`/orders/${id}`, {
    headers: getAuthHeaders(),
  });
}

export async function cancelOrder(id: number) {
  return api.post(`/orders/${id}/cancel`, {}, {
    headers: getAuthHeaders(),
  });
}
