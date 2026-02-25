import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import crypto from 'crypto';
import { sendOrderConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms';

/**
 * PayHere IPN (Instant Payment Notification) Handler
 * This endpoint receives payment status updates from PayHere
 * IMPORTANT: This must be publicly accessible (no authentication)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract PayHere parameters
    const merchantId = formData.get('merchant_id') as string;
    const orderId = formData.get('order_id') as string;
    const paymentId = formData.get('payment_id') as string;
    const payhereAmount = formData.get('payhere_amount') as string;
    const payhereCurrency = formData.get('payhere_currency') as string;
    const statusCode = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;

    console.log('PayHere IPN received:', {
      merchantId,
      orderId,
      paymentId,
      statusCode,
    });

    // Verify merchant ID
    if (merchantId !== process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID) {
      console.error('Invalid merchant ID');
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 });
    }

    // Verify signature (hash)
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      console.error('Merchant secret not configured');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const localHash = crypto
      .createHash('md5')
      .update(`${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`)
      .digest('hex')
      .toUpperCase();

    if (localHash !== md5sig) {
      console.error('Hash verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update order status based on PayHere status code
    // Status codes: 2 = Success, 0 = Pending, -1 = Canceled, -2 = Failed, -3 = Chargedback
    let paymentStatus: 'PAID' | 'PENDING_PAYMENT' | 'CANCELLED';

    switch (statusCode) {
      case '2':
        paymentStatus = 'PAID';
        break;
      case '0':
        paymentStatus = 'PENDING_PAYMENT';
        break;
      case '-1':
      case '-2':
      case '-3':
        paymentStatus = 'CANCELLED';
        break;
      default:
        paymentStatus = 'PENDING_PAYMENT';
    }

    // Update order in Firebase
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      console.error('Firebase not properly initialized for payment update:', firebaseStatus);
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: 'Service temporarily unavailable',
          firebase: firebaseStatus
        },
        { status: 503 }
      );
    }
    
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus,
      paymentId,
      updatedAt: Timestamp.now(),
    });

    console.log(`Order ${orderId} updated to ${paymentStatus}`);

    // Send SMS confirmation if payment is successful
    if (statusCode === '2' && paymentStatus === 'PAID') {
      try {
        // Get order details for SMS
        const orderDoc = await getDoc(orderRef);
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          const phone = orderData.phone;
          const customerName = orderData.name?.split(' ')[0] || 'Customer';
          const amount = orderData.amount;

          // Send SMS notification to customer
          const smsResult = await sendOrderConfirmationSMS(phone, orderId, customerName);
          
          if (smsResult.success) {
            console.log(`✓ Payment confirmation SMS sent to customer ${phone}`);
          } else {
            console.warn(`SMS to customer failed: ${smsResult.message}`);
          }

          // Send admin notification SMS about successful payment
          try {
            const adminSmsResult = await sendAdminOrderNotificationSMS(orderId, customerName, phone, amount);
            if (adminSmsResult.success) {
              console.log(`✓ Payment notification SMS sent to admin`);
            } else {
              console.warn(`Admin SMS failed: ${adminSmsResult.message}`);
            }
          } catch (adminSmsError) {
            console.error('Error sending admin SMS:', adminSmsError);
          }
        }
      } catch (smsError) {
        console.error('Error sending SMS:', smsError);
        // Continue - SMS failure shouldn't break the payment confirmation
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayHere IPN error:', error);
    return NextResponse.json(
      { error: 'IPN processing failed' },
      { status: 500 }
    );
  }
}
