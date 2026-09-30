import { api } from "../api/axios";

export async function getAssignedOrders() {
  const response = await api.get("/delivery/orders");

  return response.data;
}

export async function sendDeliveryOtp(orderId: number) {
  const response = await api.post(`/delivery/orders/${orderId}/send-otp`);

  return response.data;
}

export async function verifyDeliveryOtp(orderId: number, otp: string) {
  const response = await api.post(`/delivery/orders/${orderId}/verify-otp`, {
    otp,
  });

  return response.data;
}

export async function startDelivery(orderId: number) {
  const response = await api.post(`/delivery/orders/${orderId}/start`);

  return response.data;
}
