import { api } from "./axios";
import type { GallerySort, GalleryPost, GalleryAuthor } from "../types/gallery";
import type { Comment } from "../types/comment";

export async function fetchGalleryPosts(sort: GallerySort = "recent"): Promise<GalleryPost[]> {
  const { data } = await api.get<{ posts: GalleryPost[] }>("/gallery", { params: { sort } });
  return data.posts;
}

export async function uploadGalleryPost(
  file: File,
  title: string,
  description?: string
): Promise<GalleryPost> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  if (description) formData.append("caption", description);

  const { data } = await api.post<{ post: GalleryPost }>("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.post;
}

export async function fetchGalleryPost(id: string): Promise<GalleryPost> {
  const { data } = await api.get<{ post: GalleryPost }>(`/gallery/${id}`);
  return data.post;
}

export async function updateGalleryPost(
  id: string,
  updates: { title?: string; caption?: string }
): Promise<GalleryPost> {
  const { data } = await api.patch<{ post: GalleryPost }>(`/gallery/${id}`, updates);
  return data.post;
}

export async function deleteGalleryPost(id: string): Promise<void> {
  await api.delete(`/gallery/${id}`);
}

export async function toggleGalleryLike(
  id: string
): Promise<{ liked: boolean; likesCount: number }> {
  const { data } = await api.post<{ liked: boolean; likesCount: number }>(`/gallery/${id}/like`);
  return data;
}

export async function fetchGalleryLikers(id: string): Promise<GalleryAuthor[]> {
  const { data } = await api.get<{ likers: GalleryAuthor[] }>(`/gallery/${id}/likes`);
  return data.likers;
}

export async function fetchGalleryComments(id: string): Promise<Comment[]> {
  const { data } = await api.get<{ comments: Comment[] }>(`/gallery/${id}/comments`);
  return data.comments;
}

export async function postGalleryComment(id: string, content: string): Promise<Comment> {
  const { data } = await api.post<{ comment: Comment }>(`/gallery/${id}/comments`, { content });
  return data.comment;
}

export async function updateGalleryComment(
  postId: string,
  commentId: string,
  content: string
): Promise<Comment> {
  const { data } = await api.patch<{ comment: Comment }>(
    `/gallery/${postId}/comments/${commentId}`,
    { content }
  );
  return data.comment;
}

export async function deleteGalleryComment(postId: string, commentId: string): Promise<void> {
  await api.delete(`/gallery/${postId}/comments/${commentId}`);
}