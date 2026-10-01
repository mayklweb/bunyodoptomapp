import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export type UpdateProfilePayload = {
  name?: string;
  brightday?: string;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
};

export type DeleteAccountPayload = {
  password: string;
};

export const userService = {
  getMe: async () => {
    const { data } = await api.get(ENDPOINTS.USERS.ME);

    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await api.put(ENDPOINTS.USERS.ME, payload);

    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await api.put(ENDPOINTS.USERS.CHANGE_PASSWORD, payload);

    return data;
  },

  deleteAccount: async (payload: DeleteAccountPayload) => {
    const { data } = await api.delete(ENDPOINTS.USERS.ME, {
      data: payload,
    });

    return data;
  },
};
