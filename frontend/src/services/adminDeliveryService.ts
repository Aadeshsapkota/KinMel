import { api } from "../api/axios";

export async function getDeliveryAgents() {
  const response = await api.get("/delivery/agents");

  return response.data;
}

export async function assignDeliveryAgent(
  orderId: number,
  deliveryAgentId: number,
) {
  const response = await api.post(`/delivery/orders/${orderId}/assign`, {
    deliveryAgentId,
  });

  return response.data;
}

export async function getAllDeliveries() {
  const response = await api.get("/delivery/orders/all");

  return response.data;
}
