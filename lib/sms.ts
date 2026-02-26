/**
 * Text.lk SMS Integration (Official Package)
 * Using the official textlk-node package
 * 
 * Documentation: https://text.lk/docs/textlk-nextjs-integration/
 * Package: https://www.npmjs.com/package/textlk-node
 */

import { sendSMS as textlkSendSMS } from 'textlk-node';

interface SMSResponse {
  success: boolean;
  message: string;
  messageId?: string;
  details?: any;
}

/**
 * Format phone number for Text.lk API
 * IMPORTANT: Text.lk requires phone number WITH country code (94 for Sri Lanka)
 * 
 * Accepted inputs:
 * - 771234567 (9 digits) → 94771234567
 * - 0771234567 (10 digits with leading 0) → 94771234567
 * - +94771234567 (international format) → 94771234567
 * - 94771234567 (already formatted) → 94771234567
 */
function formatPhoneNumberForTextLK(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // If it starts with 94 (country code), keep it
  if (cleaned.startsWith('94')) {
    return cleaned;
  }

  // If it starts with 0, replace with 94
  if (cleaned.startsWith('0')) {
    return '94' + cleaned.slice(1);
  }

  // If it's 9 digits (no country code), add 94
  if (cleaned.length === 9) {
    return '94' + cleaned;
  }

  // If it's 10 digits starting with 7, add 94
  if (cleaned.length === 10 && cleaned.startsWith('7')) {
    return '94' + cleaned;
  }

  // Already has country code or invalid format
  console.warn(`⚠️ Phone number ${phone} may be in an unexpected format. Using as-is: ${cleaned}`);
  return cleaned;
}

/**
 * Core SMS sending function using official textlk-node package
 */
async function sendSMS(
  phone: string,
  message: string,
  senderId?: string
): Promise<SMSResponse> {
  const apiToken = process.env.TEXTLK_API_TOKEN;
  const senderIdEnv = process.env.TEXTLK_SENDER_ID || 'LiftSocial';
  const finalSenderId = senderId || senderIdEnv;

  if (!apiToken) {
    console.warn('❌ TEXTLK_API_TOKEN not configured');
    return {
      success: false,
      message: 'SMS service not configured - missing API token',
    };
  }

  // Format phone number (THIS IS CRITICAL - MUST INCLUDE COUNTRY CODE)
  const formattedPhone = formatPhoneNumberForTextLK(phone);

  // Validate phone number has country code
  if (!formattedPhone.startsWith('94')) {
    console.error(`❌ Invalid phone number: ${phone} → ${formattedPhone}`);
    return {
      success: false,
      message: `Invalid phone number format - must be Sri Lankan number (94XXXXXXXXX)`,
    };
  }

  // Validate message length
  if (message.length === 0) {
    return {
      success: false,
      message: 'Message cannot be empty',
    };
  }

  if (message.length > 320) {
    console.warn(`⚠️ Message length ${message.length} exceeds 320 characters`);
  }

  try {
    console.log(`📱 Sending SMS to ${formattedPhone} via TextLK...`);

    // Use official textlk-node package
    const result = await textlkSendSMS({
      phoneNumber: formattedPhone,
      message: message,
      apiToken: apiToken,
      senderId: finalSenderId,
    });

    console.log(`✅ SMS sent successfully to ${formattedPhone}`, {
      messageId: result.data?.uid,
      status: result.data?.status,
      cost: result.data?.cost,
    });

    return {
      success: true,
      message: 'SMS sent successfully',
      messageId: result.data?.uid,
      details: result,
    };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${formattedPhone}:`, error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: `SMS failed: ${errorMessage}`,
      details: error,
    };
  }
}

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
 * Called when payment is received via PayHere
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
 * Send admin notification SMS for new orders or payments
 * Admin receives SMS when customer places order or completes payment
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
    console.warn('[SMS] Admin phone not configured - skipping admin notification');
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
 * Send delivery status update SMS to customer
 * Called when admin updates order delivery status
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
