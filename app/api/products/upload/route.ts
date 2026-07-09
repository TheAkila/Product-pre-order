import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, getFirebaseStatus } from '@/lib/firebase';

// POST /api/products/upload - Upload a product image to Firebase Storage (admin only)
// Expects multipart/form-data with fields: file, adminPassword
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const adminPassword = formData.get('adminPassword');

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!correctPassword || adminPassword !== correctPassword) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Invalid admin password' }, { status: 401 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PNG, JPEG, or WEBP images are allowed' }, { status: 400 });
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: 'Image must be smaller than 5MB' }, { status: 400 });
    }

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !storage) {
      return NextResponse.json(
        {
          error: 'Image storage not configured',
          details: firebaseStatus.error || 'Firebase Storage not initialized',
        },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const extension = file.name.split('.').pop() || 'png';
    const path = `product-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, new Uint8Array(arrayBuffer), { contentType: file.type });
    const url = await getDownloadURL(storageRef);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading product image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
