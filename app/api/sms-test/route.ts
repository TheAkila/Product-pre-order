import { NextRequest, NextResponse } from 'next/server';

/**
 * SMS Test Endpoint
 * 
 * Test both HTTP API and OAuth 2.0 endpoints
 * 
 * Query Parameters:
 * - action: 'send' | 'http' | 'oauth' | 'balance' | 'report'
 * - phone: Phone number (e.g., 771234567 or +94771234567)
 * - message: SMS message (optional, uses default if not provided)
 * - messageId: For report action (required if action='report')
 */

// HTTP API direct test
async function testHttpApi(phone: string, message: string, sender: string) {
  try {
    const apiKey = process.env.TEXTLK_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'TEXTLK_API_KEY not configured' };
    }

    const cleanPhone = phone.replace(/\D/g, '').replace(/^94/, '').replace(/^0/, '');
    
    const params = new URLSearchParams({
      session_id: apiKey,
      to: cleanPhone,
      message: message,
      from: sender,
    });

    const response = await fetch('https://app.text.lk/api/http/send_sms.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await response.text();
    console.log('HTTP API Response:', text);

    return {
      success: text.trim() === '1',
      response: text,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// OAuth 2.0 API direct test
async function testOAuthApi(phone: string, message: string, sender: string) {
  try {
    const apiToken = process.env.TEXTLK_API_TOKEN;
    if (!apiToken) {
      return { success: false, error: 'TEXTLK_API_TOKEN not configured' };
    }

    const cleanPhone = phone.replace(/\D/g, '').replace(/^94/, '').replace(/^0/, '');

    const payload = {
      recipients: [{ phone: cleanPhone }],
      message: message,
      sender_id: sender,
    };

    const response = await fetch('https://app.text.lk/api/v3/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('OAuth API Response:', data);

    return {
      success: !!data.status,
      response: data,
      statusCode: response.status,
      token: apiToken ? `${apiToken.slice(0, 10)}...` : 'Not configured',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get SMS balance (OAuth only)
async function getBalance() {
  try {
    const apiToken = process.env.TEXTLK_API_TOKEN;
    if (!apiToken) {
      return { success: false, error: 'TEXTLK_API_TOKEN not configured' };
    }

    const response = await fetch('https://app.text.lk/api/v3/account/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    const data = await response.json();
    console.log('Balance Response:', data);

    return {
      success: !!data.status,
      response: data,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get delivery report (OAuth only)
async function getDeliveryReport(messageId: string) {
  try {
    const apiToken = process.env.TEXTLK_API_TOKEN;
    if (!apiToken) {
      return { success: false, error: 'TEXTLK_API_TOKEN not configured' };
    }

    const response = await fetch(`https://app.text.lk/api/v3/sms/report/${messageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    const data = await response.json();
    console.log('Delivery Report Response:', data);

    return {
      success: !!data.status,
      response: data,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'send';
  const phone = searchParams.get('phone') || '771234567';
  const message = searchParams.get('message') || 'Test SMS from Lifting Social';
  const messageId = searchParams.get('messageId') || '';
  const sender = process.env.TEXTLK_SENDER_ID || 'Lifting S';

  try {
    switch (action) {
      case 'http':
        return NextResponse.json({
          action: 'HTTP API Test',
          phone,
          sender,
          timestamp: new Date().toISOString(),
          result: await testHttpApi(phone, message, sender),
        });

      case 'oauth':
        return NextResponse.json({
          action: 'OAuth 2.0 API Test',
          phone,
          sender,
          timestamp: new Date().toISOString(),
          result: await testOAuthApi(phone, message, sender),
        });

      case 'balance':
        return NextResponse.json({
          action: 'Get SMS Balance',
          timestamp: new Date().toISOString(),
          result: await getBalance(),
        });

      case 'report':
        if (!messageId) {
          return NextResponse.json(
            { error: 'messageId parameter required for report action' },
            { status: 400 }
          );
        }
        return NextResponse.json({
          action: 'Get Delivery Report',
          messageId,
          timestamp: new Date().toISOString(),
          result: await getDeliveryReport(messageId),
        });

      case 'send':
      default:
        // Test both APIs
        const httpResult = await testHttpApi(phone, message, sender);
        const oauthResult = await testOAuthApi(phone, message, sender);

        return NextResponse.json({
          action: 'Send SMS (Both APIs)',
          phone,
          sender,
          message,
          timestamp: new Date().toISOString(),
          results: {
            http: httpResult,
            oauth: oauthResult,
            comparison: {
              httpSuccess: httpResult.success,
              oauthSuccess: oauthResult.success,
              bothSuccessful: httpResult.success && oauthResult.success,
              bothFailed: !httpResult.success && !oauthResult.success,
              inconsistent: httpResult.success !== oauthResult.success,
            },
          },
          documentation: {
            httpEndpoint: 'https://app.text.lk/api/http/send_sms.php',
            oauthEndpoint: 'https://app.text.lk/api/v3/sms/send',
            docs: {
              http: 'https://app.text.lk/developers/http-docs',
              oauth: 'https://app.text.lk/developers/docs',
            },
          },
        });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        action,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Support POST for sending SMS
    const body = await request.json();
    const { phone, message, action = 'send' } = body;
    const sender = process.env.TEXTLK_SENDER_ID || 'Lifting S';

    if (!phone) {
      return NextResponse.json(
        { error: 'phone parameter required' },
        { status: 400 }
      );
    }

    if (action === 'http') {
      return NextResponse.json({
        action: 'HTTP API Test (POST)',
        timestamp: new Date().toISOString(),
        result: await testHttpApi(phone, message || 'Test SMS', sender),
      });
    } else if (action === 'oauth') {
      return NextResponse.json({
        action: 'OAuth 2.0 API Test (POST)',
        timestamp: new Date().toISOString(),
        result: await testOAuthApi(phone, message || 'Test SMS', sender),
      });
    }

    // Default: test both
    const httpResult = await testHttpApi(phone, message || 'Test SMS', sender);
    const oauthResult = await testOAuthApi(phone, message || 'Test SMS', sender);

    return NextResponse.json({
      action: 'Send SMS (Both APIs)',
      timestamp: new Date().toISOString(),
      results: {
        http: httpResult,
        oauth: oauthResult,
        comparison: {
          httpSuccess: httpResult.success,
          oauthSuccess: oauthResult.success,
          bothSuccessful: httpResult.success && oauthResult.success,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
