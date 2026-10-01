import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export type OrderProduct = {
  id: number;
  name?: string;
  price?: number;
  count?: number;
  qty?: number;
  images?: {
    url: string;
  }[];
  [key: string]: unknown;
};

export type CheckoutPayload = {
  user_id: number;
  total_amount: number;
  address_id: number;
  market: unknown;
  market_id: number;
  payment_method: "cash";
  payed: boolean;
  status: "pending" | "preparing" | "delivered" | "cancelled";
  products: OrderProduct[];
};

export type UpdateOrderStatusPayload = {
  status: "pending" | "preparing" | "delivered" | "cancelled";
};

export const orderService = {
  getOrders: async () => {
    const { data } = await api.get(ENDPOINTS.ORDERS.LIST);

    return data.data;
  },

  getOrder: async (id: number | string) => {
    const { data } = await api.get(
      ENDPOINTS.ORDERS.BY_ID(id),
    );

    return data.data;
  },

  checkout: async (payload: CheckoutPayload) => {
    const { data } = await api.post(
      ENDPOINTS.ORDERS.CHECKOUT,
      payload,
    );

    return data.data;
  },

  cancelOrder: async (id: number | string) => {
    const { data } = await api.post(
      ENDPOINTS.ORDERS.CANCEL(id),
    );

    return data.data;
  },

  updateStatus: async (
    id: number | string,
    payload: UpdateOrderStatusPayload,
  ) => {
    const { data } = await api.put(
      ENDPOINTS.ORDERS.UPDATE_STATUS(id),
      payload,
    );

    return data.data;
  },
};