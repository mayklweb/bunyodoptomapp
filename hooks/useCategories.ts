import { getCategories } from '@/services/api/categories.api';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await getCategories();
      return data;
    },
  });
};
