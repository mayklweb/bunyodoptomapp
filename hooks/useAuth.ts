
export function useGetMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.getMe,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.user, user);
    },
  });
}

export function useUser() {
  // Read user from localStorage on mount
  const initialUser =
    typeof window !== "undefined"
      ? (() => {
          const stored = localStorage.getItem("user");
          // Handle null, "undefined", "null", or invalid JSON
          if (!stored || stored === "undefined" || stored === "null") {
            return null;
          }
          try {
            return JSON.parse(stored);
          } catch {
            return null;
          }
        })()
      : null;

  return useQuery<UserType | null>({
    queryKey: queryKeys.user,
    queryFn: () => null,
    staleTime: Infinity,
    retry: false, // Changed from true
    enabled: false,
    initialData: initialUser, // ✅ Initialize from localStorage
  });
}


export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      queryClient.setQueryData(queryKeys.user, updatedUser); // sync cache
    },
  });
}
