import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, getFirebaseStatus } from '@/lib/firebase';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImageToStorage(file: File, folder: string): Promise<{ url?: string; error?: string; status?: number }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Only PNG, JPEG, or WEBP images are allowed', status: 400 };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: 'Image must be smaller than 5MB', status: 400 };
  }

  const firebaseStatus = getFirebaseStatus();
  if (!firebaseStatus.isInitialized || !storage) {
    return { error: firebaseStatus.error || 'Firebase Storage not initialized', status: 500 };
  }

  const arrayBuffer = await file.arrayBuffer();
  const extension = file.name.split('.').pop() || 'png';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, new Uint8Array(arrayBuffer), { contentType: file.type });
  const url = await getDownloadURL(storageRef);

  return { url };
}
