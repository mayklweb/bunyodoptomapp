import { ordersApi } from '@/services/api/order.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export const orderKeys = {
  all: ['orders'],
  one: (id: number) => ['orders', id],
};

// 🔹 list
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: ordersApi.fetchAll,
  });
}

// 🔹 single
export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.one(id),
    queryFn: () => ordersApi.fetchById(id),
    enabled: !!id,
  });
}

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => ordersApi.checkout(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });

      Toast.show({
        type: 'success',
        text1: 'Buyurtma qabul qilindi',
        text2: "Tez orada siz bilan bog'lanamiz",
      });
    },

    onError: (err) => {
      console.log('Checkout xatosi:', err);

      Toast.show({
        type: 'error',
        text1: "Buyurtma qabul qilinmadi",
        text2: "Qaytadan urinib ko'ring",
      });
    },
  });
};

// 🔹 cancel
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.cancel(id),

    onSuccess: (_, id) => {
      queryClient.setQueryData(
        orderKeys.all,
        (old: any[]) =>
          old?.map((order) => (order.id === id ? { ...order, status: 'cancelled' } : order)) ?? []
      );
    },
  });
}