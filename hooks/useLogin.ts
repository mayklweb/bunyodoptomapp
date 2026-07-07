import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest } from "@/services/auth";
import { useAuthStore } from "@/store/auth.store";

// export const useLogin = () => {
//   const setAuth = useAuthStore((state) => state.setAuth);

//   return useMutation({
//     mutationFn: ({
//       phone,
//       password,
//     }: {
//       phone: string;
//       password: string;
//     }) => loginRequest(phone, password),

//     onSuccess: (data) => {
//       setAuth({
//         token: data.token,
//         user: data.user,
//       });
//     },
//   });
// };

export function useLogin() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) =>
      loginRequest(phone, password),
    onSuccess: (data) => {
      // 🔥 ENG MUHIM QATOR — eski keshni butunlay tozalash
      queryClient.clear();

      // setAuth ichida cart ham avtomatik tozalanadi (auth.store.ts)
      setAuth({
        token: data.token,
        user: data.user,
      });
    },
  });
}
