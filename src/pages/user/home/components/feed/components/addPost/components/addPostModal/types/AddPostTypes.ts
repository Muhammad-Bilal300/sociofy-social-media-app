// types/posts.ts

export interface AddPostFormData {
  description: string;
  postStatus?: string; // e.g., "public", "private" etc. (optional based on backend)
  feeling?: string | null;
  location?: string | null;
  locationCoords?: [number, number] | null;
  files?: File[];
}

export interface AddPostResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: any; // optionally define structure of savedPost
}
