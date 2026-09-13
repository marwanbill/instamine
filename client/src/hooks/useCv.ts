import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAlumniProfile, fetchAlumniDirectory, fetchAlumniProfile, fetchMyProfile, upsertMyProfile } from "../api/cv.api";
import type { AlumniFilters, UpsertProfilePayload } from "../types/alumniProfile";

export function useMyProfile() {
  return useQuery({ queryKey: ["cv-me"], queryFn: fetchMyProfile });
}

export function useAlumniDirectory(filters: AlumniFilters) {
  return useQuery({
    queryKey: ["cv-directory", filters],
    queryFn: () => fetchAlumniDirectory(filters),
  });
}

export function useAlumniProfile(id: string) {
  return useQuery({
    queryKey: ["cv-profile", id],
    queryFn: () => fetchAlumniProfile(id),
    enabled: !!id,
  });
}

export function useUpsertMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertProfilePayload) => upsertMyProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(["cv-me"], profile);
      queryClient.invalidateQueries({ queryKey: ["cv-directory"] });
    },
  });
}

export function useDeleteAlumniProfile() {
  return useMutation({
    mutationFn: (id: string) => deleteAlumniProfile(id),
  });
}