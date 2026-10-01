import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";
import { productKeys } from "./product.keys";

export function useProducts() {
  return useQuery({
    queryKey: productKeys.list,

    queryFn: async () => {
      const response = await productService.getAllProducts();

      return response.data.filter(
        (product: any) => product.images && product.images.length > 0,
      );
    },
  });
}
