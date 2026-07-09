import { v2 as cloudinary } from 'cloudinary';

// Server-only - do not prefix these with NEXT_PUBLIC_. Uploads happen inside
// API routes (app/api/products/upload, app/api/hero-slides/upload), never
// directly from the browser.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function getCloudinaryStatus() {
  return {
    isConfigured: !!(cloudName && apiKey && apiSecret),
    missingEnvVars: [
      ...(!cloudName ? ['CLOUDINARY_CLOUD_NAME'] : []),
      ...(!apiKey ? ['CLOUDINARY_API_KEY'] : []),
      ...(!apiSecret ? ['CLOUDINARY_API_SECRET'] : []),
    ],
  };
}

export { cloudinary };
