import { storeApi } from '@/services/api/store.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const storeKeys = {
  all: ['markets'],
  one: (id: number) => ['markets', id],
};

// 🔹 list
export function useStore() {
  return useQuery({
    queryKey: storeKeys.all,
    queryFn: storeApi.get,
  });
}

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => storeApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
  });
};

// 🔹 update
export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: number; data: any }) => storeApi.update(payload.id, payload.data),

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      queryClient.invalidateQueries({ queryKey: storeKeys.one(payload.id) });
    },
  });
};

// 🔹 delete
export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => storeApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
    },
  });
};
