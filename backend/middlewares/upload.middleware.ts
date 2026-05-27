import multer from "multer";
import path from "path";
import fs from "fs";

export const createUploader = (subDir?: string) => {
  const baseDir = "uploads"; // root uploads folder
  const uploadDir = subDir ? path.join(baseDir, subDir) : baseDir;

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  return multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (_req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "video/mp4",
        "video/quicktime",
        "video/mov",
      ];
      if (allowedTypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error("Invalid file type"));
    },
  });
};
