/**
 * Text.lk SMS Integration
 * Sends order confirmation SMS to customers
 */

interface SMSResponse {
  success: boolean;
  message: string;
  details?: any;
}

export async function sendOrderConfirmationSMS(
  phone: string,
  orderId: string,
  customerName: string
): Promise<SMSResponse> {
  const apiKey = process.env.TEXTLK_API_KEY;
  const senderId = process.env.TEXTLK_SENDER_ID || 'LiftingSoc';
  
  // Skip if SMS is not configured
  if (!apiKey) {
    console.warn('Text.lk API key not configured. Skipping SMS notification.');
    return {
      success: false,
      message: 'SMS service not configured',
    };
  }

  // Format phone number (remove +94 prefix, text.lk expects without prefix)
  const formattedPhone = formatPhoneNumberForTextLK(phone);

  // Compose SMS message (160 characters max for single SMS)
  const message = `Order Confirmed! Hi ${customerName}, your Lifting Social order #${orderId.slice(-8)} is confirmed. We'll notify you when it ships. Thanks!`;

  try {
    console.log(`Sending SMS to ${formattedPhone} for order ${orderId}`);

    // Text.lk uses URL-encoded form data
    const params = new URLSearchParams({
      session_id: apiKey,
      to: formattedPhone,
      message: message,
      from: senderId,
    });

    const response = await fetch('https://www.text.lk/api/v3/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    // Text.lk returns {status: "success"} on success
    if (response.ok && data.status === 'success') {
      console.log(`SMS sent successfully to ${formattedPhone}`);
      return {
        success: true,
        message: 'SMS sent successfully',
        details: data,
      };
    } else {
      console.error('SMS sending failed:', data);
      return {
        success: false,
        message: `SMS failed: ${data.message || data.error || 'Unknown error'}`,
        details: data,
      };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      message: `SMS error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

  // Remove +94 prefix if present
  if (cleaned.startsWith('94')) {
    cleaned = cleaned.slice(2);
  }

  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Send delivery update SMS
 */
export async function sendDeliveryUpdateSMS(
  phone: string,
  orderId: string,
  status: string
): Promise<SMSResponse> {
  const apiKey = process.env.TEXTLK_API_KEY;
  const senderId = process.env.TEXTLK_SENDER_ID || 'LiftingSoc';
  
  if (!apiKey) {
    return { success: false, message: 'SMS service not configured' };
  }

  const formattedPhone = formatPhoneNumberForTextLK(phone);
  let message = '';

  switch (status) {
    case 'PROCESSING':
      message = `Your Lifting Social order #${orderId.slice(-8)} is being prepared. Estimated delivery: 2-3 days.`;
      break;
    case 'SHIPPED':
      message = `Your order #${orderId.slice(-8)} has been shipped! Track your delivery via SMS updates.`;
      break;
    case 'DELIVERED':
      message = `Your Lifting Social tee has been delivered! Enjoy your gear. Thank you for your order!`;
      break;
    default:
      message = `Update on order #${orderId.slice(-8)}: ${status}. - Lifting Social`;
  }

  try {
    const params = new URLSearchParams({
      session_id: apiKey,
      to: formattedPhone,
      message: message,
      from: senderId,
    });

    const response = await fetch('https://www.text.lk/api/v3/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      console.log(`Delivery update SMS sent to ${formattedPhone}`);
      return { success: true, message: 'SMS sent', details: data };
    } else {
      console.error('Delivery SMS failed:', data);
      return { success: false, message: 'SMS failed', details: data };
    }
  } catch (error) {
    console.error('Error sending delivery SMS:', error);
    return { success: false, message: `Error: ${error}` };
  }
}
