import { api } from "../api/axios";
import type { CartItem } from "../types/cartItem";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface CheckoutRequest {
  fullName: string;

  phoneNumber: string;

  addressLine1: string;

  addressLine2: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  paymentMethod: string;
}

export interface EsewaCheckoutResponse {
  paymentUrl: string;
  formData: Record<string, string>;
}

export async function addToCart(
  productId: number,
  quantity: number
) {
  return api.post(
    "/cart",
    {
      productId,
      quantity,
    },
    {
      headers: getAuthHeaders(),
    },
  );
}

export async function getCart() {
  const response =
    await api.get<CartItem[]>(
      "/cart",
      {
        headers:
          getAuthHeaders(),
      }
    );

  return response.data;
}

export async function createOrder(
  data: CheckoutRequest
) {
  return api.post(
    "/orders",
    data,
    {
      headers:
        getAuthHeaders(),
    },
  );
}

export async function createCheckoutSession(data: CheckoutRequest) {
  const response = await api.post<EsewaCheckoutResponse>(
    "/payments/create-session",
    data,
    { headers: getAuthHeaders() }
  );

  return response.data;
}

export async function confirmPayment(transactionUuid: string) {
  const response = await api.post<boolean>(
    `/payments/confirm/${transactionUuid}`,
    null,
    { headers: getAuthHeaders() }
  );

  return response.data;
}