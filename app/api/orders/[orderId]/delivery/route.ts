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
  let orderId = 'unknown';
  try {
    const resolvedParams = await params;
    orderId = resolvedParams.orderId;
    console.log(`[Delivery API] Processing request for order: ${orderId}`);
    
    const body = await request.json();
    const { deliveryStatus, adminPassword } = body;
    console.log(`[Delivery API] Request body - status: ${deliveryStatus}, password provided: ${!!adminPassword}`);

    // Verify admin password
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    console.log(`[Delivery API] Password check - correct password exists: ${!!correctPassword}, match: ${adminPassword === correctPassword}`);
    
    if (!correctPassword || adminPassword !== correctPassword) {
      console.warn(`[Delivery API] Unauthorized attempt for order ${orderId}`);
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Invalid admin password' },
        { status: 401 }
      );
    }

    if (!deliveryStatus || !['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(deliveryStatus)) {
      console.warn(`[Delivery API] Invalid status: ${deliveryStatus}`);
      return NextResponse.json(
        { error: 'Invalid delivery status', details: `Received: ${deliveryStatus}` },
        { status: 400 }
      );
    }

    // Check Firebase connection
    const firebaseStatus = getFirebaseStatus();
    console.log(`[Delivery API] Firebase status:`, firebaseStatus);
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
    let smsResult = { success: false, message: 'Not attempted' };
    try {
      console.log(`[SMS] Attempting to send delivery update to ${phone} for status ${deliveryStatus}`);
      smsResult = await sendDeliveryUpdateSMS(phone, orderId, deliveryStatus);

      if (smsResult.success) {
        console.log(`✓ Delivery update SMS sent to ${phone} - Status: ${deliveryStatus}`);
      } else {
        console.warn(`Delivery SMS failed: ${smsResult.message}`, smsResult);
        // Don't fail the update if SMS fails
      }
    } catch (smsError) {
      console.error('Error sending delivery SMS:', smsError);
      smsResult = { success: false, message: smsError instanceof Error ? smsError.message : 'Unknown error' };
      // Continue - SMS failure shouldn't break the status update
    }

    return NextResponse.json({
      success: true,
      message: `Order marked as ${deliveryStatus}`,
      orderId,
      deliveryStatus,
      smsNotification: smsResult.success ? 'SMS sent successfully' : `SMS failed: ${smsResult.message}`,
      smsDetails: smsResult,
    });
  } catch (error) {
    console.error(`[Delivery API] Error for order ${orderId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update delivery status', details: errorMessage },
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
