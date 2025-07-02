import mongoose, { Document, Schema } from "mongoose";
import { UserTypes } from "./user-model";

export interface OTPType extends Document {
  otpCode: string;
  emailAddress: string;
  user: UserTypes | null; // Correctly use UserType here
  expiryAt: Date;
  createdAt: Date; // Timestamps automatically handled by Mongoose
  updatedAt: Date;
}

const otpSchema = new Schema<OTPType>(
  {
    otpCode: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model in MongoDB
      default: null,
      required: false,
    },
    expiryAt: {
      type: Date,
      default: () => new Date(Date.now() + 1 * 120 * 1000), // Set to 2 minutes from now
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 120 });

const OTP = mongoose.model<OTPType>("OTP", otpSchema);

export default OTP;
