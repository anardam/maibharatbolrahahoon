import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/roles";
import { createOrUpdateFile, getContentBranch, GitHubApiError } from "@/lib/github";
import { slugify } from "@/lib/utils";

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
// Vercel caps function request bodies at 4.5 MB
const MAX_BYTES = 4 * 1024 * 1024;

// POST /api/upload — commit an image to public/uploads and return its URL
export async function POST(req: NextRequest) {
  const authResult = await requireAuth("admin");
  if (!authResult.authorized) return authResult.response;

  try {
    const file = (await req.formData()).get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const ext = EXTENSIONS[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP or GIF images are allowed" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be 4 MB or smaller" }, { status: 400 });
    }

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const name = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const path = `public/uploads/${now.getFullYear()}/${month}/${Date.now()}-${name}.${ext}`;
    const branch = getContentBranch();

    await createOrUpdateFile(path, Buffer.from(await file.arrayBuffer()), `chore: upload image ${name}.${ext}`, branch);

    // Raw URL works immediately; the /uploads/... copy only exists after the next deploy
    const url = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/${branch}/${path}`;
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
