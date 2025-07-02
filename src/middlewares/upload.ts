import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadPath = path.join(__dirname, "..", "..", "uploads", "files");

fs.mkdirSync(uploadPath, { recursive: true });

// Define the storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only images and video files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/quicktime", // mov
    "video/x-msvideo", // avi
    "video/x-matroska", // mkv
  ];

  const allowedExtensions = /\.(jpg|jpeg|png|gif|mp4|mov|avi|mkv)$/i;

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.test(file.originalname)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files (jpg, jpeg, png, gif, mp4, mov, avi, mkv) are allowed."
      )
    );
  }
};

// Initialize multer with the storage and fileFilter settings
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit to 50MB
  fileFilter,
});

export default upload;
