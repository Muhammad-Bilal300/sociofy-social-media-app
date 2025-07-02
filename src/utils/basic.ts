import path from "path";

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

const getFileFormat = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const imageFormats = [".jpg", ".jpeg", ".png", ".gif"];
  const videoFormats = [".mp4", ".mov", ".avi", ".mkv"];

  if (imageFormats.includes(ext)) {
    return "IMAGE";
  } else if (videoFormats.includes(ext)) {
    return "VIDEO";
  }
  return "UNKNOWN";
};

export { generateOtp,getFileFormat };
