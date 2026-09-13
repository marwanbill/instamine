import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTalentComment,
  fetchTalentComments,
  postTalentComment,
  updateTalentComment,
} from "../api/talents.api";

export function useTalentComments(id: string) {
  return useQuery({
    queryKey: ["talent-comments", id],
    queryFn: () => fetchTalentComments(id),
    enabled: !!id,
  });
}

export function usePostTalentComment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postTalentComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-comments", id] });
      queryClient.setQueryData(["talent-post", id], (old: any) =>
        old ? { ...old, commentsCount: old.commentsCount + 1 } : old
      );
      queryClient.invalidateQueries({ queryKey: ["talents"] });
    },
  });
}

export function useUpdateTalentComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateTalentComment(postId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-comments", postId] });
    },
  });
}

export function useDeleteTalentComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteTalentComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-comments", postId] });
      queryClient.setQueryData(["talent-post", postId], (old: any) =>
        old ? { ...old, commentsCount: Math.max(0, old.commentsCount - 1) } : old
      );
      queryClient.invalidateQueries({ queryKey: ["talents"] });
    },
  });
}