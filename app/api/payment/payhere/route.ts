import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db, getFirebaseStatus } from '@/lib/firebase';
import crypto from 'crypto';

/**
 * PayHere Payment Initiation
 * Redirects user to PayHere payment gateway
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order from Firebase
    const firebaseStatus = getFirebaseStatus();
    if (!firebaseStatus.isInitialized || !db) {
      console.error('Firebase not properly initialized for payment processing:', firebaseStatus);
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
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderSnap.data();

    // PayHere configuration
    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const mode = process.env.NEXT_PUBLIC_PAYHERE_MODE || 'sandbox';

    if (!merchantId || !merchantSecret) {
      return NextResponse.json(
        { error: 'PayHere configuration missing' },
        { status: 500 }
      );
    }

    // Generate PayHere hash
    // Format: merchant_id + order_id + amount + currency + md5(merchant_secret)
    // IMPORTANT: amount MUST be formatted to exactly 2 decimal places as a string
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = Number(order.amount).toFixed(2);
    const hashString = `${merchantId}${orderId}${amountFormatted}LKR${hashedSecret}`;
    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    // Build PayHere payment form
    const payhereUrl = mode === 'live' 
      ? 'https://www.payhere.lk/pay/checkout'
      : 'https://sandbox.payhere.lk/pay/checkout';

    // Create HTML form that auto-submits
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting to Payment...</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #0a0a0a;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .loader {
              text-align: center;
            }
            .spinner {
              border: 3px solid rgba(255, 255, 255, 0.1);
              border-top: 3px solid white;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loader">
            <div class="spinner"></div>
            <p>Redirecting to secure payment...</p>
          </div>
          <form id="payhere_form" method="post" action="${payhereUrl}">
            <input type="hidden" name="merchant_id" value="${merchantId}">
            <input type="hidden" name="return_url" value="${baseUrl}/success">
            <input type="hidden" name="cancel_url" value="${baseUrl}/cancel">
            <input type="hidden" name="notify_url" value="${baseUrl}/api/payment/payhere/notify">
            <input type="hidden" name="order_id" value="${orderId}">
            <input type="hidden" name="items" value="Lifting Social Elite Gym Shaker">
            <input type="hidden" name="currency" value="LKR">
            <input type="hidden" name="amount" value="${amountFormatted}">
            <input type="hidden" name="first_name" value="${order.name.split(' ')[0] || 'Customer'}">
            <input type="hidden" name="last_name" value="${order.name.split(' ').slice(1).join(' ') || ''}">
            <input type="hidden" name="email" value="${order.email || 'customer@liftingsocial.com'}">
            <input type="hidden" name="phone" value="${order.phone}">
            <input type="hidden" name="address" value="Sri Lanka">
            <input type="hidden" name="city" value="Colombo">
            <input type="hidden" name="country" value="Sri Lanka">
            <input type="hidden" name="hash" value="${hash}">
          </form>
          <script>
            document.getElementById('payhere_form').submit();
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('PayHere payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.stack : String(error) },
      { status: 500 }
    );
  }
}
