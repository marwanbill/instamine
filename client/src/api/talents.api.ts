import { api } from "./axios";
import type { TalentCategory, TalentComment, TalentPost } from "../types/talent";
import type { GalleryAuthor } from "../types/gallery";

export async function fetchTalentPosts(
  sort: "recent" | "popular" = "recent"
): Promise<TalentPost[]> {
  const { data } = await api.get<{ posts: TalentPost[] }>("/talents", { params: { sort } });
  return data.posts;
}

export async function createTalentPost(
  file: File,
  title: string,
  content: string,
  category: TalentCategory
): Promise<TalentPost> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);

  const { data } = await api.post<{ post: TalentPost }>("/talents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.post;
}

export async function fetchTalentPost(id: string): Promise<TalentPost> {
  const { data } = await api.get<{ post: TalentPost }>(`/talents/${id}`);
  return data.post;
}

export async function updateTalentPost(
  id: string,
  updates: { title?: string; content?: string; category?: TalentCategory }
): Promise<TalentPost> {
  const { data } = await api.patch<{ post: TalentPost }>(`/talents/${id}`, updates);
  return data.post;
}

export async function deleteTalentPost(id: string): Promise<void> {
  await api.delete(`/talents/${id}`);
}

export async function toggleTalentLike(
  id: string
): Promise<{ liked: boolean; likesCount: number }> {
  const { data } = await api.post<{ liked: boolean; likesCount: number }>(`/talents/${id}/like`);
  return data;
}

export async function fetchTalentLikers(id: string): Promise<GalleryAuthor[]> {
  const { data } = await api.get<{ likers: GalleryAuthor[] }>(`/talents/${id}/likes`);
  return data.likers;
}

export async function fetchTalentComments(id: string): Promise<TalentComment[]> {
  const { data } = await api.get<{ comments: TalentComment[] }>(`/talents/${id}/comments`);
  return data.comments;
}

export async function postTalentComment(id: string, content: string): Promise<TalentComment> {
  const { data } = await api.post<{ comment: TalentComment }>(`/talents/${id}/comments`, {
    content,
  });
  return data.comment;
}

export async function updateTalentComment(
  postId: string,
  commentId: string,
  content: string
): Promise<TalentComment> {
  const { data } = await api.patch<{ comment: TalentComment }>(
    `/talents/${postId}/comments/${commentId}`,
    { content }
  );
  return data.comment;
}

export async function deleteTalentComment(postId: string, commentId: string): Promise<void> {
  await api.delete(`/talents/${postId}/comments/${commentId}`);
}