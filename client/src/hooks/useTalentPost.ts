import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTalentPost,
  fetchTalentPost,
  toggleTalentLike,
  updateTalentPost,
} from "../api/talents.api";
import type { TalentCategory } from "../types/talent";

export function useTalentPost(id: string) {
  return useQuery({
    queryKey: ["talent-post", id],
    queryFn: () => fetchTalentPost(id),
    enabled: !!id,
  });
}

export function useToggleTalentLike(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleTalentLike(id),
    onSuccess: (result) => {
      queryClient.setQueryData(["talent-post", id], (old: any) =>
        old ? { ...old, isLikedByMe: result.liked, likesCount: result.likesCount } : old
      );
      queryClient.invalidateQueries({ queryKey: ["talent-likers", id] });
      queryClient.invalidateQueries({ queryKey: ["talents"] });
    },
  });
}

export function useUpdateTalentPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { title?: string; content?: string; category?: TalentCategory }) =>
      updateTalentPost(id, updates),
    onSuccess: (post) => {
      queryClient.setQueryData(["talent-post", id], post);
      queryClient.invalidateQueries({ queryKey: ["talents"] });
    },
  });
}

export function useDeleteTalentPost() {
  return useMutation({
    mutationFn: (id: string) => deleteTalentPost(id),
  });
}