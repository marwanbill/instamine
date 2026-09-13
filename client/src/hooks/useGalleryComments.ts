import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGalleryComment,
  fetchGalleryComments,
  postGalleryComment,
  updateGalleryComment,
} from "../api/gallery.api";

export function useGalleryComments(id: string) {
  return useQuery({
    queryKey: ["gallery-comments", id],
    queryFn: () => fetchGalleryComments(id),
    enabled: !!id,
  });
}

export function usePostGalleryComment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postGalleryComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-comments", id] });
      queryClient.setQueryData(["gallery-post", id], (old: any) =>
        old ? { ...old, commentsCount: old.commentsCount + 1 } : old
      );
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useUpdateGalleryComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateGalleryComment(postId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-comments", postId] });
    },
  });
}

export function useDeleteGalleryComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteGalleryComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-comments", postId] });
      queryClient.setQueryData(["gallery-post", postId], (old: any) =>
        old ? { ...old, commentsCount: Math.max(0, old.commentsCount - 1) } : old
      );
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}