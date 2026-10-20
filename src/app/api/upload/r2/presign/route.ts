import { NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, getR2Config, isR2Configured } from "@/lib/r2-client";
import { getSupabaseUser } from "@/lib/supabase-server";
import { successResponse, errorResponse, forbiddenResponse, serverErrorResponse } from "@/lib/api-utils";

const UPLOAD_ROLES = ["MEDIA", "PRESIDENT", "GS", "PLATFORM_ADMIN"];
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export async function POST(request: NextRequest) {
  try {
    // 1. Verify caller has media upload privileges
    const caller = await getSupabaseUser(UPLOAD_ROLES);
    if (!caller) {
      return forbiddenResponse("Only MEDIA, PRESIDENT, GS, or PLATFORM_ADMIN can upload to Gallery");
    }

    // 2. Check if R2 is configured
    if (!isR2Configured()) {
      return errorResponse("Cloudflare R2 is not configured on this server.", 503);
    }

    const body = await request.json();
    const { filename, contentType, folder = "gallery" } = body;

    if (!filename || !contentType) {
      return errorResponse("filename and contentType are required");
    }

    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      return errorResponse("Only JPEG, PNG, WEBP, and GIF images are permitted");
    }

    const rawExt = String(filename).split(".").pop()?.toLowerCase() || "";
    const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : "jpg";

    const sanitizedFolder = String(folder).replace(/[^a-zA-Z0-9_-]/g, "") || "gallery";
    const uniqueKey = `${sanitizedFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { bucketName, publicUrl } = getR2Config();
    const s3Client = getR2Client();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      ContentType: contentType,
    });

    // Generate direct upload URL valid for 10 minutes (600 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    const cdnUrl = publicUrl
      ? `${publicUrl}/${uniqueKey}`
      : `https://${bucketName}.r2.dev/${uniqueKey}`;

    return successResponse({
      uploadUrl,
      publicUrl: cdnUrl,
      key: uniqueKey,
    });
  } catch (error) {
    console.error("[R2 Presign Error]:", error);
    return serverErrorResponse();
  }
}
