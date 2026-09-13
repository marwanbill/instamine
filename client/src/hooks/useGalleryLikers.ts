import { useQuery } from "@tanstack/react-query";
import { fetchGalleryLikers } from "../api/gallery.api";

export function useGalleryLikers(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["gallery-likers", id],
    queryFn: () => fetchGalleryLikers(id),
    enabled,
  });
}