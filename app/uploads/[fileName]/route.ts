import { access, readFile } from "fs/promises";
import { constants } from "fs";
import path from "path";
import { getUploadLookupPaths, sanitizeUploadFileName } from "@/lib/upload-storage";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function findExistingUpload(fileName: string) {
  for (const candidatePath of getUploadLookupPaths(fileName)) {
    try {
      await access(candidatePath, constants.F_OK);
      return candidatePath;
    } catch {
      // Try the next candidate path.
    }
  }

  return null;
}

export async function GET(
  _request: Request,
  context: RouteContext<"/uploads/[fileName]">,
) {
  const { fileName } = await context.params;
  const safeFileName = sanitizeUploadFileName(fileName);
  const filePath = await findExistingUpload(safeFileName);

  if (!filePath) {
    return new Response("Image not found", { status: 404 });
  }

  const fileBuffer = await readFile(filePath);
  const extension = path.extname(safeFileName).toLowerCase();
  const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
