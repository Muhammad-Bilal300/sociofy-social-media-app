import { Document, Schema, Types, model } from "mongoose";
import { UserTypes } from "./user-model";

interface FileObject {
  format: string;
  url: string;
}

interface ReplyTypes extends Document {
  description?: string;
  files?: FileObject[];

  isEdited?: boolean;
  user: Types.ObjectId | UserTypes;
  comment: Types.ObjectId;
}

const fileSchema = new Schema<FileObject>(
  {
    format: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const replySchema = new Schema<ReplyTypes>(
  {
    description: {
      type: String,
    },
    files: [fileSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isEdited: {
      type: Boolean,
      required: false,
      default: false,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

const Reply = model<ReplyTypes>("Reply", replySchema);

export default Reply;
