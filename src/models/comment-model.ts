import { Document, Schema, Types, model } from "mongoose";
import { UserTypes } from "./user-model";

interface FileObject {
  format: string;
  url: string;
}

interface CommentTypes extends Document {
  description?: string;
  files?: FileObject[];

  isEdited?: boolean;
  noOfReplies?: number;
  replies?: Types.ObjectId[];

  user: Types.ObjectId | UserTypes;
  post: Types.ObjectId;
}

const fileSchema = new Schema<FileObject>(
  {
    format: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new Schema<CommentTypes>(
  {
    description: {
      type: String,
    },
    files: [fileSchema],
    isEdited: {
      type: Boolean,
      required: false,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noOfReplies: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply", // assuming Comment is another model
      },
    ],

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model<CommentTypes>("Comment", commentSchema);

export default Comment;
