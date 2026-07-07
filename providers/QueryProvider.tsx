import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // ✅ 429 bo'lsa cheksiz qayta urinmaydi
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000), // backoff
      staleTime: 1000 * 60, // 1 daqiqa — qayta-qayta fetch qilmaydi
    },
  },
});
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}