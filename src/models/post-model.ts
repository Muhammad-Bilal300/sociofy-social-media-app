import { Document, Schema, Types, model } from "mongoose";
import { UserTypes } from "./user-model";
import { POST_STATUS, REACTIONS } from "../constants/basic";

interface FileObject {
  format: string;
  url: string;
}
interface Reaction {
  user: Types.ObjectId;
  type:
    | REACTIONS.LIKE
    | REACTIONS.LOVE
    | REACTIONS.ANGRY
    | REACTIONS.LAUGH
    | REACTIONS.CRY
    | REACTIONS.CARE;
}

interface PostTypes extends Document {
  description?: string;
  feeling?: string | null;
  location?: string | null;
  locationCoords?: number[] | null;
  files?: FileObject[];

  isEdited?: boolean;

  postStatus: POST_STATUS.PUBLIC | POST_STATUS.FRIENDS;

  user: Types.ObjectId | UserTypes;

  sharedPost?: Types.ObjectId | null; // Reference to original post if shared
  sharedBy?: Types.ObjectId | UserTypes | null; // Who shared the post

  noOfReacts?: number;
  noOfComments?: number;
  noOfShares?: number;

  reactedUsers?: Reaction[];
  comments?: Types.ObjectId[];
  sharedUsers?: Types.ObjectId[];

  noOfReports?: number;
  noOfBookmarks?: number;

  reportedUsers?: Types.ObjectId[];
  bookmarkedUsers?: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<FileObject>(
  {
    format: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const reactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        REACTIONS.LIKE,
        REACTIONS.LOVE,
        REACTIONS.ANGRY,
        REACTIONS.LAUGH,
        REACTIONS.CRY,
        REACTIONS.CARE,
      ],
      required: true,
    },
  },
  { _id: false }
);

const postSchema = new Schema<PostTypes>(
  {
    description: {
      type: String,
      default: "",
    },
    feeling: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    locationCoords: {
      type: [Number],
      default: null,
    },

    files: [fileSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    postStatus: {
      type: String,
      enum: [POST_STATUS.PUBLIC, POST_STATUS.FRIENDS],
      required: true,
    },

    sharedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Reference to another Post document
      default: null,
    },
    sharedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    noOfReacts: {
      type: Number,
      default: 0,
    },
    noOfComments: {
      type: Number,
      default: 0,
    },
    noOfShares: {
      type: Number,
      default: 0,
    },
    reactedUsers: [reactionSchema],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    sharedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    noOfReports: {
      type: Number,
      default: 0,
    },
    noOfBookmarks: {
      type: Number,
      default: 0,
    },
    reportedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarkedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = model<PostTypes>("Post", postSchema);
export default Post;
