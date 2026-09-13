import type { GalleryAuthor } from "./gallery";

export type TalentCategory =
  | "DRAWING"
  | "STORY_TELLING"
  | "DESIGN"
  | "WRITING"
  | "MUSIC"
  | "PHOTOGRAPHY";

export const TALENT_CATEGORY_LABELS: Record<TalentCategory, string> = {
  DRAWING: "Drawing",
  STORY_TELLING: "Storytelling",
  DESIGN: "Design",
  WRITING: "Writing",
  MUSIC: "Music",
  PHOTOGRAPHY: "Photography",
};

export interface TalentPost {
  id: string;
  title: string;
  content: string;
  category: TalentCategory;
  mediaUrl: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: GalleryAuthor;
  isLikedByMe?: boolean;
}

export interface TalentComment {
  id: string;
  content: string;
  createdAt: string;
  author: GalleryAuthor;
}