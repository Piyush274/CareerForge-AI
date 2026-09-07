import { initializeApp, cert, getApps } from "firebase-admin/app";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFirebaseCredential() {
  // 1. Try FIREBASE_SERVICE_ACCOUNT (JSON string or Base64)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      let raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      if (!raw.startsWith("{") && raw.length > 20) {
        try {
          raw = Buffer.from(raw, "base64").toString("utf-8");
        } catch {
          // keep raw
        }
      }
      const parsed = JSON.parse(raw);
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return cert(parsed);
    } catch (err) {
      console.error("⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err.message);
    }
  }

  // 2. Try FIREBASE_SERVICE_ACCOUNT_BASE64
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.trim(), "base64").toString("utf-8");
      const parsed = JSON.parse(decoded);
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return cert(parsed);
    } catch (err) {
      console.error("⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable:", err.message);
    }
  }

  // 3. Try individual env variables (Render/Cloud friendly)
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    try {
      return cert({
        projectId: process.env.FIREBASE_PROJECT_ID.trim(),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL.trim(),
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    } catch (err) {
      console.error("⚠️ Failed to parse individual Firebase environment variables:", err.message);
    }
  }

  // 4. Try local serviceAccountKey.json (Development fallback)
  const candidatePaths = [
    path.resolve(__dirname, "..", "serviceAccountKey.json"),
    path.resolve(process.cwd(), "serviceAccountKey.json"),
  ];

  for (const localKeyPath of candidatePaths) {
    if (fs.existsSync(localKeyPath)) {
      try {
        const localKey = JSON.parse(fs.readFileSync(localKeyPath, "utf-8"));
        if (localKey.private_key) {
          localKey.private_key = localKey.private_key.replace(/\\n/g, "\n");
        }
        return cert(localKey);
      } catch (err) {
        console.error(`⚠️ Failed to parse ${localKeyPath}:`, err.message);
      }
    }
  }

  return null;
}

const credential = getFirebaseCredential();

let app = null;

if (getApps().length > 0) {
  app = getApps()[0];
} else if (credential) {
  app = initializeApp({ credential });
  console.log("🔥 Firebase Admin initialized successfully!");
} else {
  console.error(
    "⚠️ FIREBASE WARNING: No valid credentials found for Firebase Admin.\n" +
    "👉 To enable Firebase Auth on Render, add FIREBASE_SERVICE_ACCOUNT (full JSON from serviceAccountKey.json) in your Render Environment Variables."
  );
}

export { app };