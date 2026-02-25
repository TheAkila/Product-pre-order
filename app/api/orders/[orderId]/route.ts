import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';

// DELETE /api/orders/[orderId] - Delete a specific order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('DELETE request received for orderId:', orderId);

    if (!orderId) {
      console.error('Order ID is missing');
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check Firebase status
    const firebaseStatus = getFirebaseStatus();
    console.log('Firebase status:', firebaseStatus);
    
    if (!firebaseStatus.isInitialized || !db) {
      console.error('Firebase is not properly initialized');
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details: firebaseStatus.error || 'Firebase not initialized',
          missingEnvVars: firebaseStatus.missingEnvVars,
        },
        { status: 500 }
      );
    }

    // Delete the order document
    console.log('Attempting to delete order from Firestore:', orderId);
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
    console.log('Order deleted successfully:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
      orderId: orderId,
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', {
      message: errorMessage,
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Failed to delete order',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
