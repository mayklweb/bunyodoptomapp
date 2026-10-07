import { categoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "./category.keys";

// import { categoryService } from "@/services/category.service";
// import { productKeys } from "./category.keys";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list,

    queryFn: async () => {
      const response = await categoryService.getCategories()

      return response.data;
    },
  });
}
