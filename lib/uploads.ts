import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function saveUploadedImage(file: File | null, folder: string) {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format image non supporté. Utilisez JPEG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image trop lourde. Taille maximale : 5 Mo.");
  }

  const extension = path.extname(file.name || "").toLowerCase() || ".jpg";
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const relativePath = `/uploads/${safeFolder}/${fileName}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", safeFolder);
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));
  return relativePath;
}
