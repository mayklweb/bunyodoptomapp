import { addressApi } from '@/services/api/address.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const AddressKeys = {
  all: ['addresses'],
  one: (id: number) => ['addresses', id],
};

// 🔹 list
export function useAddress() {
  return useQuery({
    queryKey: AddressKeys.all,
    queryFn: addressApi.get,
  });
}

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => addressApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AddressKeys.all });
    },
  });
};

// 🔹 update
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number; data: any }) =>
      addressApi.update(payload.id, payload.data),

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: AddressKeys.all });
      queryClient.invalidateQueries({ queryKey: AddressKeys.one(payload.id) });
    },
  });
};

// 🔹 delete
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AddressKeys.all });
    },
  });
};
