import { createSupabaseBrowser } from './supabase-browser';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const MAX_SUPABASE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB for Supabase
const MAX_R2_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB for Gallery on Cloudflare R2

/**
 * Upload a file directly to Cloudflare R2 using a secure presigned PUT URL.
 * Bypasses Vercel's 4.5MB serverless body limit and incurs $0 egress bandwidth fees.
 */
export async function uploadToR2(file: File, folder: string = 'gallery'): Promise<string> {
  if (file.size > MAX_R2_FILE_SIZE_BYTES) {
    throw new Error('Gallery image exceeds the 15MB limit');
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.');
  }

  // 1. Request presigned upload URL from our authenticated API route
  const presignRes = await fetch('/api/upload/r2/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder,
    }),
  });

  const presignData = await presignRes.json();
  if (!presignRes.ok || !presignData.success) {
    throw new Error(presignData.error || 'Failed to acquire direct upload URL');
  }

  const { uploadUrl, publicUrl } = presignData.data;

  // 2. Direct binary PUT from browser to Cloudflare R2 edge
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`Direct upload to Cloudflare R2 failed: HTTP ${uploadRes.status}`);
  }

  return publicUrl;
}

/**
 * Upload a file to Supabase Storage from the browser with strict security validation.
 * Used for Committee Member portraits and Member Achievement verification proofs.
 *
 * Bucket: "uploads"
 * Path:   {folder}/{timestamp}-{random}.{ext}
 */
export async function uploadToSupabase(file: File, folder: string = 'uploads'): Promise<string> {
  if (file.size > MAX_SUPABASE_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds the 5MB limit');
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are permitted.');
  }

  const rawExt = file.name.split('.').pop()?.toLowerCase() || '';
  const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : 'jpg';
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';

  const supabase = createSupabaseBrowser();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const storagePath = `${sanitizedFolder}/${filename}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from('uploads').getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Smart hybrid uploader:
 * - 'gallery' ➔ Cloudflare R2 (with automatic Supabase fallback if R2 is not yet configured)
 * - 'committee', 'achievements', and others ➔ Supabase Storage
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (folder === 'gallery') {
    try {
      return await uploadToR2(file, 'gallery');
    } catch (err) {
      console.warn('[Storage] Cloudflare R2 direct upload unavailable, falling back to Supabase:', err);
      return await uploadToSupabase(file, 'gallery');
    }
  }
  return await uploadToSupabase(file, folder);
}
