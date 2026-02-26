/**
 * Text.lk SMS Integration (Enhanced)
 * Supports both OAuth 2.0 (v3 API) and HTTP API
 * 
 * API Documentation: https://app.text.lk/developers/http-docs
 * OAuth 2.0 Documentation: https://app.text.lk/developers/docs
 */

interface SMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
  credits?: number;
  details?: any;
}

interface TextLkOAuthResponse {
  status: boolean;
  message?: string;
  data?: {
    message_id: string;
    credits_remaining: number;
  };
  error?: string;
}

interface TextLkHttpResponse {
  status: number;
  body: string;
}

/**
 * Get SMS API endpoint based on configuration
 */
function getApiEndpoint(): { type: 'oauth' | 'http'; url: string } {
  const useOAuth = process.env.TEXTLK_USE_OAUTH === 'true';
  
  if (useOAuth) {
    return {
      type: 'oauth',
      url: process.env.TEXTLK_API_BASE_V3 || 'https://app.text.lk/api/v3',
    };
  }

  return {
    type: 'http',
    url: process.env.TEXTLK_API_BASE || 'https://app.text.lk/api/http',
  };
}

/**
 * Send SMS using OAuth 2.0 API (V3 - Recommended)
 */
async function sendSmsViaOAuth(
  phone: string,
  message: string,
  sender: string,
  apiToken: string
): Promise<SMSResponse> {
  try {
    const endpoint = `${process.env.TEXTLK_API_BASE_V3 || 'https://app.text.lk/api/v3'}/sms/send`;

    const payload = {
      recipients: [{ phone }],
      message,
      sender_id: sender,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data: TextLkOAuthResponse = await response.json();

    if (data.status) {
      console.log(`✓ SMS sent via OAuth 2.0 to ${phone}`, {
        messageId: data.data?.message_id,
        creditsRemaining: data.data?.credits_remaining,
      });

      return {
        success: true,
        message: 'SMS sent successfully',
        messageId: data.data?.message_id,
        credits: data.data?.credits_remaining,
        details: data,
      };
    } else {
      console.error('OAuth SMS sending failed:', data.message || data.error);
      return {
        success: false,
        message: data.message || data.error || 'OAuth SMS failed',
        details: data,
      };
    }
  } catch (error) {
    console.error('Error sending SMS via OAuth:', error);
    return {
      success: false,
      message: `OAuth error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Send SMS using HTTP API (Legacy fallback)
 */
async function sendSmsViaHttp(
  phone: string,
  message: string,
  sender: string,
  apiKey: string
): Promise<SMSResponse> {
  try {
    const endpoint = `${process.env.TEXTLK_API_BASE || 'https://app.text.lk/api/http'}/send_sms.php`;

    const params = new URLSearchParams({
      session_id: apiKey,
      to: phone,
      message: message,
      from: sender,
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseText = await response.text();

    // Text.lk HTTP API returns "1" for success or error code/message
    if (response.ok && responseText.trim() === '1') {
      console.log(`✓ SMS sent via HTTP API to ${phone}`);

      return {
        success: true,
        message: 'SMS sent successfully',
        details: { response: responseText },
      };
    } else {
      console.error('HTTP SMS sending failed:', responseText);

      // Try to parse error response
      let errorMessage = responseText;
      if (responseText.includes('invalid session')) {
        errorMessage = 'Invalid API credentials';
      } else if (responseText.includes('invalid to')) {
        errorMessage = 'Invalid phone number format';
      } else if (responseText.includes('invalid message')) {
        errorMessage = 'Invalid message content';
      }

      return {
        success: false,
        message: `HTTP SMS failed: ${errorMessage}`,
        details: { response: responseText },
      };
    }
  } catch (error) {
    console.error('Error sending SMS via HTTP:', error);
    return {
      success: false,
      message: `HTTP error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Format phone number for Text.lk
 * Converts to format without country code: 771234567
 */
function formatPhoneNumberForTextLK(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Remove +94 prefix if present (Sri Lanka country code)
  if (cleaned.startsWith('94')) {
    cleaned = cleaned.slice(2);
  }

  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // Validate length (Sri Lanka phone numbers are 9 digits after country code)
  if (cleaned.length !== 9) {
    console.warn(`Phone number ${phone} formatted to ${cleaned} - length ${cleaned.length} (expected 9)`);
  }

  return cleaned;
}

/**
 * Core SMS sending function with API selection
 */
async function sendSMS(
  phone: string,
  message: string,
  sender: string
): Promise<SMSResponse> {
  const apiKey = process.env.TEXTLK_API_KEY;
  const apiToken = process.env.TEXTLK_API_TOKEN || apiKey; // OAuth token preference

  if (!apiKey && !apiToken) {
    console.warn('Text.lk API credentials not configured.');
    return {
      success: false,
      message: 'SMS service not configured',
    };
  }

  // Validate message length (SMS is typically 160 characters)
  if (message.length > 320) {
    console.warn(`SMS message length ${message.length} exceeds recommended 320 characters`);
  }

  // Validate phone number
  const formattedPhone = formatPhoneNumberForTextLK(phone);
  if (formattedPhone.length !== 9) {
    return {
      success: false,
      message: `Invalid phone number: ${phone}`,
    };
  }

  const endpoint = getApiEndpoint();

  // Try OAuth first if enabled
  if (endpoint.type === 'oauth' && apiToken) {
    console.log(`Attempting to send SMS via OAuth 2.0 to ${formattedPhone}`);
    const oauthResult = await sendSmsViaOAuth(formattedPhone, message, sender, apiToken);

    if (oauthResult.success) {
      return oauthResult;
    }

    console.warn('OAuth failed, falling back to HTTP API');
  }

  // Fall back to HTTP API
  if (apiKey) {
    console.log(`Sending SMS via HTTP API to ${formattedPhone}`);
    return await sendSmsViaHttp(formattedPhone, message, sender, apiKey);
  }

  return {
    success: false,
    message: 'No valid SMS API credentials available',
  };
}

/**
 * Send order confirmation SMS to customer
 */
export async function sendOrderConfirmationSMS(
  phone: string,
  orderId: string,
  customerName: string
): Promise<SMSResponse> {
  const senderId = process.env.TEXTLK_SENDER_ID || 'LiftSocial';

  const message = `Order Confirmed! Hi ${customerName}, your Lifting Social order #${orderId.slice(-8)} is confirmed. We'll notify you when it ships. Thanks!`;

  console.log(`[SMS] Order Confirmation - Order: ${orderId}, Customer: ${customerName}`);

  return await sendSMS(phone, message, senderId);
}

/**
 * Send payment confirmation SMS to customer
 */
export async function sendPaymentConfirmationSMS(
  phone: string,
  orderId: string,
  customerName: string,
  amount: number
): Promise<SMSResponse> {
  const senderId = process.env.TEXTLK_SENDER_ID || 'LiftSocial';

  const message = `Payment Confirmed! Hi ${customerName}, we received your payment of LKR ${amount} for order #${orderId.slice(-8)}. Thank you!`;

  console.log(`[SMS] Payment Confirmation - Order: ${orderId}, Amount: LKR ${amount}`);

  return await sendSMS(phone, message, senderId);
}

/**
 * Send admin notification SMS for new orders
 */
export async function sendAdminOrderNotificationSMS(
  orderId: string,
  customerName: string,
  phone: string,
  amount: number
): Promise<SMSResponse> {
  const senderId = process.env.TEXTLK_SENDER_ID || 'LiftSocial';
  const adminPhone = process.env.TEXTLK_ADMIN_PHONE;

  if (!adminPhone) {
    console.warn('[SMS] Admin phone not configured for order notifications');
    return {
      success: false,
      message: 'Admin phone not configured',
    };
  }

  const message = `New Order! #${orderId.slice(-8)} from ${customerName} - LKR ${amount}. Phone: ${phone}`;

  console.log(`[SMS] Admin Notification - Order: ${orderId}, Amount: LKR ${amount}`);

  return await sendSMS(adminPhone, message, senderId);
}

/**
 * Send delivery update SMS
 */
export async function sendDeliveryUpdateSMS(
  phone: string,
  orderId: string,
  status: string
): Promise<SMSResponse> {
  const senderId = process.env.TEXTLK_SENDER_ID || 'LiftSocial';

  let message = '';

  switch (status) {
    case 'PROCESSING':
      message = `Your Lifting Social order #${orderId.slice(-8)} is being prepared. Estimated delivery: 2-3 days.`;
      break;
    case 'SHIPPED':
      message = `Your order #${orderId.slice(-8)} has been shipped! Track your delivery via SMS updates.`;
      break;
    case 'DELIVERED':
      message = `Your Lifting Social Elite Gym Shaker has been delivered! Enjoy your gear. Thank you for your order!`;
      break;
    default:
      message = `Update on order #${orderId.slice(-8)}: ${status}. - Lifting Social`;
  }

  console.log(`[SMS] Delivery Update - Order: ${orderId}, Status: ${status}`);

  return await sendSMS(phone, message, senderId);
}

/**
 * Check SMS credit balance (OAuth API only)
 */
export async function checkSmsBalance(): Promise<SMSResponse> {
  const apiToken = process.env.TEXTLK_API_TOKEN;

  if (!apiToken) {
    return {
      success: false,
      message: 'OAuth token not configured. Credit check requires OAuth API.',
    };
  }

  try {
    const endpoint = `${process.env.TEXTLK_API_BASE_V3 || 'https://app.text.lk/api/v3'}/account/balance`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    const data: TextLkOAuthResponse = await response.json();

    if (data.status) {
      console.log(`SMS Balance: ${data.data?.credits_remaining} credits`);
      return {
        success: true,
        message: 'Balance retrieved',
        credits: data.data?.credits_remaining,
        details: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to retrieve balance',
        details: data,
      };
    }
  } catch (error) {
    console.error('Error checking SMS balance:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get SMS delivery report (OAuth API only)
 */
export async function getSmsDeliveryReport(messageId: string): Promise<SMSResponse> {
  const apiToken = process.env.TEXTLK_API_TOKEN;

  if (!apiToken) {
    return {
      success: false,
      message: 'OAuth token not configured. Delivery report requires OAuth API.',
    };
  }

  try {
    const endpoint = `${process.env.TEXTLK_API_BASE_V3 || 'https://app.text.lk/api/v3'}/sms/report/${messageId}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    const data: TextLkOAuthResponse = await response.json();

    if (data.status) {
      console.log(`Delivery Report for ${messageId}:`, data.data);
      return {
        success: true,
        message: 'Report retrieved',
        details: data.data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to retrieve report',
        details: data,
      };
    }
  } catch (error) {
    console.error('Error getting delivery report:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
