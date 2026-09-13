export interface GalleryAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
  isBlocked?: boolean;
}

export interface GalleryPost {
  id: string;
  title: string;
  imageUrl: string;
  caption: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: GalleryAuthor;
  isLikedByMe?: boolean;
}

export type GallerySort = "recent" | "popular";