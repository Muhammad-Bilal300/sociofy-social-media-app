import mongoose, { Document, Schema, Types } from "mongoose";
import { GENDER, ROLES } from "../constants/basic";

export interface UserTypes extends Document {
  firstName: string;
  lastName: string;

  emailAddress: string;
  password: string | null;

  profilePicture?: string;
  coverPhoto?: string;

  bio?: string;
  gender: GENDER.MALE | GENDER.FEMALE | GENDER.OTHER;
  role?: ROLES.USER | ROLES.ADMIN;
  dateOfBirth?: Date;
  phoneNumber?: string;
  verifiedPhoneNumber?: string;
  location?: string;

  friends?: Types.ObjectId[];
  friendRequestsReceived?: Types.ObjectId[];
  friendRequestsSent?: Types.ObjectId[];

  posts?: Types.ObjectId[];
  savedPosts?: Types.ObjectId[];

  isActivated: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isOnline: boolean;
  lastSeen?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<UserTypes>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      required: false,
      default: "",
    },
    coverPhoto: {
      type: String,
      required: false,
      default: "",
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    gender: {
      type: String,
      enum: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
      required: true,
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.ADMIN],
      required: false,
      default: ROLES.USER,
    },
    dateOfBirth: {
      type: Date,
      required: false,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: "",
    },
    verifiedPhoneNumber: {
      type: String,
      required: false,
      default: "",
    },
    location: {
      type: String,
      required: false,
      default: "",
    },

    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User" }],

    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],

    isActivated: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserTypes>("User", UserSchema);
export default User;
