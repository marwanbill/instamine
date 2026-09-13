import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGalleryPosts, uploadGalleryPost } from "../api/gallery.api";
import type { GallerySort } from "../types/gallery";

export function useGallery(sort: GallerySort = "recent") {
  return useQuery({
    queryKey: ["gallery", sort],
    queryFn: () => fetchGalleryPosts(sort),
  });
}

export function useUploadGalleryPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      title,
      description,
    }: {
      file: File;
      title: string;
      description?: string;
    }) => uploadGalleryPost(file, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}