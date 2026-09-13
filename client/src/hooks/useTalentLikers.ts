import { useQuery } from "@tanstack/react-query";
import { fetchTalentLikers } from "../api/talents.api";

export function useTalentLikers(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["talent-likers", id],
    queryFn: () => fetchTalentLikers(id),
    enabled,
  });
}