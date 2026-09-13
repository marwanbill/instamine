import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTalentPost, fetchTalentPosts } from "../api/talents.api";
import type { TalentCategory } from "../types/talent";

export function useTalents(sort: "recent" | "popular" = "recent") {
  return useQuery({
    queryKey: ["talents", sort],
    queryFn: () => fetchTalentPosts(sort),
  });
}

export function useCreateTalentPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      title,
      content,
      category,
    }: {
      file: File;
      title: string;
      content: string;
      category: TalentCategory;
    }) => createTalentPost(file, title, content, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talents"] });
    },
  });
}