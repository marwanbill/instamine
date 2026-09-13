import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blockUser, fetchAdminUsers, unblockUser } from "../api/admin.api";

export function useAdminUsers(search?: string) {
  return useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => fetchAdminUsers(search),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["talents"] });
      queryClient.invalidateQueries({ queryKey: ["cv-directory"] });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["talents"] });
      queryClient.invalidateQueries({ queryKey: ["cv-directory"] });
    },
  });
}