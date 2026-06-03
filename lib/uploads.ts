import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import crypto from "crypto";
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

  const cloudinaryUrl = await uploadToCloudinary(file, folder);
  if (cloudinaryUrl) return cloudinaryUrl;

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

async function uploadToCloudinary(file: File, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const safeFolder = `restaurant-ali-baba/${folder.replace(/[^a-z0-9-]/gi, "").toLowerCase()}`;
  const signatureBase = `folder=${safeFolder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", safeFolder);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body
  });
  if (!response.ok) {
    throw new Error("Upload Cloudinary impossible. Vérifiez les variables CLOUDINARY_*.");
  }

  const payload = (await response.json()) as { secure_url?: string };
  if (!payload.secure_url) {
    throw new Error("Réponse Cloudinary invalide.");
  }
  return payload.secure_url;
}
