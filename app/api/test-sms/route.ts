import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms';

/**
 * Test SMS API endpoint
 * Usage:
 * - Test customer SMS: /api/test-sms?phone=771234567&name=TestUser&type=customer
 * - Test admin SMS: /api/test-sms?type=admin
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const name = searchParams.get('name') || 'Test User';
  const type = searchParams.get('type') || 'customer';

  if (type === 'admin') {
    // Test admin notification SMS
    try {
      const testOrderId = `TEST-${Date.now()}`;
      const result = await sendAdminOrderNotificationSMS(
        testOrderId,
        'Test Customer',
        phone || '0771234567',
        5000
      );

      return NextResponse.json({
        success: result.success,
        message: result.message,
        details: result.details,
        testOrderId,
        type: 'admin',
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          type: 'admin',
        },
        { status: 500 }
      );
    }
  }

  // Test customer SMS
  if (!phone) {
    return NextResponse.json({
      error: 'Phone number is required. Usage: /api/test-sms?phone=771234567&name=TestUser&type=customer',
      examples: [
        '/api/test-sms?phone=771234567&name=John&type=customer',
        '/api/test-sms?type=admin',
      ],
    }, { status: 400 });
  }

  try {
    console.log(`Testing SMS to ${phone} for user ${name}`);
    
    const testOrderId = `TEST-${Date.now()}`;
    const result = await sendOrderConfirmationSMS(phone, testOrderId, name);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      details: result.details,
      testOrderId,
      type: 'customer',
      sentTo: phone,
    });
  } catch (error) {
    console.error('SMS test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}