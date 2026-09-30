import { api } from "../api/axios";

export async function getReturnRequests() {
  const response = await api.get("/returns");

  return response.data;
}

export async function approveReturn(id: number) {
  const response = await api.post(`/returns/${id}/approve`);

  return response.data;
}

export async function rejectReturn(id: number) {
  const response = await api.post(`/returns/${id}/reject`);

  return response.data;
}
export async function createReturnRequest(
  orderId: number,
  productId: number,
  reason: string,
) {
  const response = await api.post("/returns", {
    orderId,
    productId,
    reason,
  });

  return response.data;
}
