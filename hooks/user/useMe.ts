import { useQuery } from "@tanstack/react-query";

import { userService } from "@/services/user.service";
import { userKeys } from "./user.keys";

export function useProfile() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userService.getMe,
  });
}