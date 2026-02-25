import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import { sendDeliveryUpdateSMS } from '@/lib/sms';

/**
 * Delivery Confirmation API
 * Admin can mark order as delivered and send SMS to customer
 * POST /api/orders/[orderId]/delivery
 * Body: { deliveryStatus: 'DELIVERED' | 'SHIPPED' | 'PROCESSING' }
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { deliveryStatus, adminPassword } = body;

    // Verify admin password
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (!correctPassword || adminPassword !== correctPassword) {
      console.warn(`Unauthorized delivery update attempt for order ${orderId}`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!deliveryStatus || !['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(deliveryStatus)) {
      return NextResponse.json(
        { error: 'Invalid delivery status' },
        { status: 400 }
      );
    }

    // Check Firebase connection
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const orderRef = doc(db, 'orders', orderId);
    
    // Get current order details
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    const phone = orderData.phone;
    const customerName = orderData.name?.split(' ')[0] || 'Customer';

    // Update order delivery status
    await updateDoc(orderRef, {
      deliveryStatus,
      updatedAt: Timestamp.now(),
    });

    console.log(`✓ Order ${orderId} delivery status updated to ${deliveryStatus}`);

    // Send SMS to customer about delivery update
    try {
      const smsResult = await sendDeliveryUpdateSMS(phone, orderId, deliveryStatus);

      if (smsResult.success) {
        console.log(`✓ Delivery update SMS sent to ${phone} - Status: ${deliveryStatus}`);
      } else {
        console.warn(`Delivery SMS failed: ${smsResult.message}`);
        // Don't fail the update if SMS fails
      }
    } catch (smsError) {
      console.error('Error sending delivery SMS:', smsError);
      // Continue - SMS failure shouldn't break the status update
    }

    return NextResponse.json({
      success: true,
      message: `Order marked as ${deliveryStatus}`,
      orderId,
      deliveryStatus,
      smsNotification: 'Customer will receive an SMS update',
    });
  } catch (error) {
    console.error('Error processing delivery update:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery status' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders/[orderId]/delivery - Get order delivery status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();

    return NextResponse.json({
      orderId,
      name: orderData.name,
      phone: orderData.phone,
      deliveryStatus: orderData.deliveryStatus || 'PENDING',
      paymentStatus: orderData.paymentStatus,
      deliveryMethod: orderData.deliveryMethod,
      createdAt: orderData.createdAt?.toDate(),
      updatedAt: orderData.updatedAt?.toDate(),
    });
  } catch (error) {
    console.error('Error fetching delivery status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
