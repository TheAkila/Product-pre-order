import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';

// DELETE /api/hero-slides/[slideId] - Remove a slide (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slideId: string }> }
) {
  try {
    const { slideId } = await params;
    const body = await request.json().catch(() => ({}));

    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!correctPassword || body.adminPassword !== correctPassword) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Invalid admin password' }, { status: 401 });
    }

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    await deleteDoc(doc(db, 'heroSlides', slideId));

    return NextResponse.json({ success: true, slideId });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
