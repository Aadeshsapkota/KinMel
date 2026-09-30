import { api } from "../api/axios";
import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");

  return response.data;
}

export async function createCategory(category: {
  name: string;
  imageUrl: string;
  iconName: string;
}) {
  const token = localStorage.getItem("token");

  const response = await api.post("/categories", category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateCategory(
  id: number,
  category: {
    name: string;
    imageUrl: string;
    iconName: string;
  },
) {
  const token = localStorage.getItem("token");

  const response = await api.put(`/categories/${id}`, category, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteCategory(id: number) {
  const token = localStorage.getItem("token");

  return api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
