import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteGalleryPost,
  fetchGalleryPost,
  toggleGalleryLike,
  updateGalleryPost,
} from "../api/gallery.api";

export function useGalleryPost(id: string) {
  return useQuery({
    queryKey: ["gallery-post", id],
    queryFn: () => fetchGalleryPost(id),
    enabled: !!id,
  });
}

export function useToggleGalleryLike(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleGalleryLike(id),
    onSuccess: (result) => {
      queryClient.setQueryData(["gallery-post", id], (old: any) =>
        old ? { ...old, isLikedByMe: result.liked, likesCount: result.likesCount } : old
      );
      queryClient.invalidateQueries({ queryKey: ["gallery-likers", id] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useUpdateGalleryPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { title?: string; caption?: string }) => updateGalleryPost(id, updates),
    onSuccess: (post) => {
      queryClient.setQueryData(["gallery-post", id], post);
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useDeleteGalleryPost() {
  return useMutation({
    mutationFn: (id: string) => deleteGalleryPost(id),
  });
}