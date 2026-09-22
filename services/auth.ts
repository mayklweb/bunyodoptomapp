import { api } from "./api/api";

export const loginRequest = async (phone: string, password: string) => {
  const { data } = await api.post("/users/login", {
    phone,
    password,
  });

  return data;
};

export const signupRequest = async (
  name: string,
  phone: string,
  password: string,
) => {
  const { data } = await api.post("/users/signup", {
    name,
    phone,
    password,
  });

  return data;
};

// ─────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────

export const sendPasswordResetOtp = async (phone: string) => {
  const { data } = await api.post("/users/forgot-password/send-otp", {
    phone,
  });

  return data;
};

export const verifyPasswordResetOtp = async (phone: string, code: string) => {
  const { data } = await api.post("/users/forgot-password/verify-otp", {
    phone,
    code,
  });

  return data;
};

export const resetPassword = async (
  phone: string,
  resetToken: string,
  newPassword: string,
) => {
  const { data } = await api.post("/users/forgot-password/reset", {
    phone,
    resetToken,
    new_password: newPassword,
  });

  return data;
};

export const verifyOtpRequest = async (phone: string, code: string) => {
  const { data } = await api.post("/users/verify-otp", {
    phone,
    code,
  });

  return data;
};

export const sendOtpRequest = async (phone: string) => {
  const { data } = await api.post("/users/send-otp", {
    phone,
  });

  return data;
};