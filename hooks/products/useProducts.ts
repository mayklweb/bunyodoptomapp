import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";
import { productKeys } from "./product.keys";

export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: [...productKeys.list, categoryId],

    enabled: categoryId !== undefined,

    queryFn: async () => {
      const response = await productService.getAllProducts();

      if (categoryId === undefined) {
        return response.data;
      }

      return response.data.filter(
        (product: any) =>
          Number(product.category_id) === Number(categoryId),
      );
    },
  });
}