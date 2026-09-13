import type { GalleryAuthor } from "./gallery";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: GalleryAuthor;
}