import { api } from "./api";

export const userApi = {
  getProfile: async () => {
    const { data } = await api.get("/users/me");
    return data.data;
  },
  updateProfile: async (payload: any) => {
    const { data } = await api.put("/users/me", payload);
    return data.data;
  },

  deleteProfile: async (payload: { password: string }) => {
    const { data } = await api.delete("/users/me", { data: payload });
    return data.data;
  },
};
