import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToStorage } from '@/lib/uploadImage';

// POST /api/hero-slides/upload - Upload a hero carousel image to Firebase Storage (admin only)
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

    const result = await uploadImageToStorage(file, 'hero-slides');
    if (result.error) {
      return NextResponse.json({ error: 'Failed to upload image', details: result.error }, { status: result.status || 500 });
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Error uploading hero slide image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
