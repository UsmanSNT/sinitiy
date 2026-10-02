import { Router, static as serveStatic } from "express";
import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { requireAuth } from "../auth/middleware";

export const uploadsRouter = Router();

// Fayllar git'ga kirmaydi (.gitignore) va deploy'dagi `git reset --hard` ularga tegmaydi.
export const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_BYTES = 5 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Yuklangan rasmlarni /api/uploads/<fayl> orqali beradi (nginx /api/ ni shu ilovaga yo'naltiradi).
uploadsRouter.use(serveStatic(UPLOAD_DIR, { maxAge: "7d", index: false }));

// Mobil va web bir xil ishlashi uchun multipart o'rniga base64 JSON qabul qilinadi.
// 5MB rasm base64'da ~6.7MB bo'ladi, shuning uchun faqat shu route'da limit kengaytirilgan.
uploadsRouter.post("/", requireAuth, express.json({ limit: "8mb" }), async (req, res) => {
  const { data, mimeType } = req.body as { data?: unknown; mimeType?: unknown };
  const ext = typeof mimeType === "string" ? EXTENSIONS[mimeType] : undefined;
  if (typeof data !== "string" || !ext) {
    return res.status(400).json({ message: "JPG, PNG, WEBP 이미지만 업로드할 수 있습니다" });
  }

  const buffer = Buffer.from(data, "base64");
  if (buffer.length === 0) return res.status(400).json({ message: "잘못된 요청입니다" });
  if (buffer.length > MAX_BYTES) return res.status(413).json({ message: "이미지는 5MB 이하만 업로드할 수 있습니다" });

  const filename = `${crypto.randomUUID()}.${ext}`;
  await fs.promises.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return res.status(201).json({ path: `/api/uploads/${filename}` });
});
