import { cloudinary, getCloudinaryStatus } from '@/lib/cloudinary';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImageToStorage(file: File, folder: string): Promise<{ url?: string; error?: string; status?: number }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Only PNG, JPEG, or WEBP images are allowed', status: 400 };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: 'Image must be smaller than 5MB', status: 400 };
  }

  const cloudinaryStatus = getCloudinaryStatus();
  if (!cloudinaryStatus.isConfigured) {
    return {
      error: `Image storage not configured. Missing env vars: ${cloudinaryStatus.missingEnvVars.join(', ')}`,
      status: 500,
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `lifting-social/${folder}`,
      resource_type: 'image',
    });
    return { url: result.secure_url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Upload failed', status: 500 };
  }
}
