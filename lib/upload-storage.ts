import path from "path";

const configuredUploadDir = process.env.UPLOAD_DIR?.trim();

export const runtimeUploadDir =
  configuredUploadDir && configuredUploadDir.length > 0
    ? configuredUploadDir
    : path.join(process.cwd(), "data", "uploads");

export const legacyPublicUploadDir = path.join(
  process.cwd(),
  "public",
  "uploads",
);

export function sanitizeUploadFileName(fileName: string) {
  return path.basename(fileName);
}

export function getRuntimeUploadPath(fileName: string) {
  return path.join(runtimeUploadDir, sanitizeUploadFileName(fileName));
}

export function getUploadLookupPaths(fileName: string) {
  const safeFileName = sanitizeUploadFileName(fileName);

  return [
    path.join(runtimeUploadDir, safeFileName),
    path.join(legacyPublicUploadDir, safeFileName),
  ];
}
