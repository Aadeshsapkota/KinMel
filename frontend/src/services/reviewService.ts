import { api } from "../api/axios";
import type { Review } from "../types/review";

function getAuthHeaders() {
  const token =
    localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getReviews(
  productId: number,
) {
  const response =
    await api.get<Review[]>(
      `/reviews/product/${productId}`,
    );

  return response.data;
}

export async function createReview(
  productId: number,
  rating: number,
  comment: string,
) {
  return api.post(
    "/reviews",
    {
      productId,
      rating,
      comment,
    },
    {
      headers: getAuthHeaders(),
    },
  );
}