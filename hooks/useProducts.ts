import {
  getAllProducts,
  getProduct,
  getProducts,
} from "@/services/api/product.api";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useAllProducts = (categoryId?: string | number) => {
  return useInfiniteQuery({
    queryKey: ["products", categoryId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getAllProducts({
        offset: pageParam as number,
        limit: 20,
        category_id: categoryId,
      });

      return res; // ✅ hech qanday filter qilmasdan xom javobni qaytaramiz
    },
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.pagination?.hasMore) return undefined;
      // ✅ real fetch qilingan son (res.data.length) asosida hisoblanadi, filterlangan emas
      return lastPage.pagination.offset + (lastPage.data?.length ?? 0);
    },
    initialPageParam: 0,
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await getProducts();

      return data.filter(
        (product: any) => product.images && product.images.length > 0,
      );
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await getProduct(id);
      return data;
    },
    enabled: !!id,
  });
};
