import { api } from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
  captchaToken: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/auth/login", data);

  return response.data;

}


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function register(data: RegisterRequest) {
  const response = await api.post("/auth/register", data);

  return response.data;
}

export async function forgotPassword(email: string) {
  return api.post("/auth/forgot-password", { email });
}

export async function verifyOtp(email: string, otp: string) {
  return api.post("/auth/verify-otp", {
    email,
    otp,
  });
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
) {
  return api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
}

export async function googleLogin(idToken: string) {
  const response = await api.post("/auth/google", {
    idToken,
  });

  return response.data;
}
