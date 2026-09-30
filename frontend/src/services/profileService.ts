import { api } from "../api/axios";
import type { Profile } from "../types/profile";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get(
    "/profile",
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}

export async function updateProfile(
  name: string,
  phoneNumber: string
) {
  await api.put(
    "/profile",
    {
      name,
      phoneNumber,
    },
    {
      headers: getAuthHeaders(),
    }
  );
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  await api.put(
    "/profile/change-password",
    {
      oldPassword,
      newPassword,
      confirmPassword,
    },
    {
      headers: getAuthHeaders(),
    }
  );
}

export async function getAddresses() {
  const response = await api.get("/profile/addresses", {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function addAddress(addressData: any) {
  await api.post("/profile/addresses", addressData, {
    headers: getAuthHeaders(),
  });
}

export async function deleteAddress(id: number) {
  await api.delete(`/profile/addresses/${id}`, {
    headers: getAuthHeaders(),
  });
}