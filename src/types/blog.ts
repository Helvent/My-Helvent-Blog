export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body_markdown: string;
  cover_image: string | null;
  status: PostStatus;
  featured: boolean;
  published_at: string | null;
  author_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author?: Profile | null;
  categories?: PostCategory[] | null;
  tags?: PostTag[] | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostCategory {
  category_id: string;
  categories?: Category;
}

export interface PostTag {
  tag_id: string;
  tags?: Tag;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  is_approved: boolean;
  parent_comment_id: string | null;
  created_at: string;
  replies?: Comment[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}