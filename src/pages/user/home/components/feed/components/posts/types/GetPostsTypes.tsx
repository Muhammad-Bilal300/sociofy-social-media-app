export interface PostFile {
  format?: string;
  url?: string;
}

export interface PostUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface Post {
  _id?: string;
  description?: string;
  feeling?: string | null;
  location?: string | null;
  locationCoords?: [number, number] | null;
  files?: PostFile[];
  user?: PostUser;
  isEdited?: boolean;
  postStatus?: "PUBLIC" | "PRIVATE" | string;
  sharedPost?: Post | null;
  sharedBy?: PostUser | null;
  noOfReacts?: number;
  noOfComments?: number;
  noOfShares?: number;
  noOfReports?: number;
  noOfBookmarks?: number;
  createdAt?: string;
  updatedAt?: string;
}
