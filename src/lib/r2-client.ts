import { S3Client } from "@aws-sdk/client-s3";

function clean(str?: string): string {
  if (!str) return "";
  return str.trim().replace(/^["']|["']$/g, "").trim();
}

export function isR2Configured(): boolean {
  const accountId = clean(process.env.R2_ACCOUNT_ID);
  const accessKeyId = clean(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.R2_SECRET_ACCESS_KEY);

  return Boolean(accountId && accessKeyId && secretAccessKey);
}

export function getR2Config() {
  const accountId = clean(process.env.R2_ACCOUNT_ID);
  const accessKeyId = clean(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = clean(process.env.R2_SECRET_ACCESS_KEY);
  const bucketName = clean(process.env.R2_BUCKET_NAME) || "diurc-gallery";
  const publicUrl = clean(process.env.R2_PUBLIC_URL).replace(/\/+$/, "");

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
  };
}

let cachedR2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (cachedR2Client) return cachedR2Client;

  const { accountId, accessKeyId, secretAccessKey } = getR2Config();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 is not configured. Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY.");
  }

  cachedR2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return cachedR2Client;
}
