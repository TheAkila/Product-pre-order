import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { ProductFormData } from '@/types/product';

function checkAdminPassword(adminPassword?: string) {
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  return !!correctPassword && adminPassword === correctPassword;
}

// PUT /api/products/[productId] - Update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body: Partial<ProductFormData> & { adminPassword?: string } = await request.json();

    if (!checkAdminPassword(body.adminPassword)) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Invalid admin password' }, { status: 401 });
    }

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { adminPassword: _adminPassword, ...updateFields } = body;
    void _adminPassword;

    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updateFields,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true, id: productId });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[productId] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json().catch(() => ({}));

    if (!checkAdminPassword(body.adminPassword)) {
      return NextResponse.json({ error: 'Unauthorized', details: 'Invalid admin password' }, { status: 401 });
    }

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);

    return NextResponse.json({ success: true, productId });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
