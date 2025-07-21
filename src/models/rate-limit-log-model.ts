import mongoose, { Document, Schema } from "mongoose";

export interface RateLimitLogType extends Document {
  ip: string;
  requests: number;
  blockedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitLogSchema: Schema<RateLimitLogType> = new Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    requests: {
      type: Number,
      required: true,
    },
    blockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RateLimitLog = mongoose.model<RateLimitLogType>("RateLimitLog", RateLimitLogSchema);
export default RateLimitLog;
