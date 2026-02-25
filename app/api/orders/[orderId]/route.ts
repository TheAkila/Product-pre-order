import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';

// DELETE /api/orders/[orderId] - Delete a specific order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check Firebase status
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      console.error('Firebase is not properly initialized');
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: firebaseStatus.error || 'Firebase not initialized',
        },
        { status: 500 }
      );
    }

    // Delete the order document
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
      orderId: orderId,
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
