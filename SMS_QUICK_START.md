# SMS Integration - Quick Start Guide

## Your SMS Integration is Ready! 🎉

This guide shows how to use the new enhanced SMS service with OAuth 2.0 support.

## Current Status

✅ **Environment configured** - `.env.local` updated with OAuth credentials
✅ **SMS service created** - `lib/sms-new.ts` with all functions
✅ **Test endpoint ready** - `/api/sms-test` for testing
✅ **Dev server running** - Ready to test on localhost:3002

## Using the SMS Service

### Import the Service
```typescript
import { 
  sendOrderConfirmationSMS,
  sendPaymentConfirmationSMS,
  sendAdminOrderNotificationSMS,
  sendDeliveryUpdateSMS,
  checkSmsBalance,
  getSmsDeliveryReport
} from '@/lib/sms';  // Or 'sms-new' if you haven't migrated yet
```

### 1. Send Order Confirmation SMS

```typescript
// When customer creates an order
const result = await sendOrderConfirmationSMS(
  phone: '771234567',           // Customer phone
  orderId: 'order-123',         // Order ID
  customerName: 'John Doe'      // Customer name
);

// Response: 
// {
//   success: true,
//   message: "SMS sent successfully",
//   messageId: "msg-12345",       // Only in OAuth
//   credits: 1432,                // Only in OAuth
//   details: { ... }
// }
```

### 2. Send Payment Confirmation SMS

```typescript
// When payment is received (e.g., in PayHere webhook)
const result = await sendPaymentConfirmationSMS(
  phone: '771234567',           // Customer phone
  orderId: 'order-123',
  customerName: 'John Doe',
  amount: 1500                  // Order amount in LKR
);
```

### 3. Notify Admin of New Order

```typescript
// Also when customer creates an order
const result = await sendAdminOrderNotificationSMS(
  orderId: 'order-123',
  customerName: 'John Doe',
  phone: '771234567',
  amount: 1500
);
// Admin receives: "New Order! #order-123 from John Doe - LKR 1500. Phone: 771234567"
```

### 4. Send Delivery Status Update

```typescript
// When admin updates order status
const result = await sendDeliveryUpdateSMS(
  phone: '771234567',
  orderId: 'order-123',
  status: 'DELIVERED'              // PROCESSING | SHIPPED | DELIVERED
);
// Customer receives tailored message based on status
```

### 5. Check SMS Balance (OAuth Only)

```typescript
// Check how many SMS credits you have left
const balance = await checkSmsBalance();

if (balance.success) {
  console.log(`Remaining credits: ${balance.credits}`);
} else {
  console.log(`Error: ${balance.message}`);
}
```

### 6. Get Delivery Report (OAuth Only)

```typescript
// Check if an SMS was delivered to recipient
const report = await getSmsDeliveryReport('msg-12345');

if (report.success) {
  console.log('SMS details:', report.details);
} else {
  console.log(`Error: ${report.message}`);
}
```

## Error Handling

```typescript
const result = await sendOrderConfirmationSMS(phone, orderId, name);

if (!result.success) {
  console.error(`SMS failed: ${result.message}`);
  // Log to monitoring system
  // Send email as backup?
  // App continues - SMS failure doesn't break order creation
}
```

## Testing the Endpoints

### Via Browser/Curl

```bash
# Test HTTP API
curl "http://localhost:3002/api/sms-test?action=http&phone=771234567"

# Test OAuth API
curl "http://localhost:3002/api/sms-test?action=oauth&phone=771234567"

# Check balance
curl "http://localhost:3002/api/sms-test?action=balance"

# Get delivery report
curl "http://localhost:3002/api/sms-test?action=report&messageId=msg-12345"

# Test both APIs (default)
curl "http://localhost:3002/api/sms-test?phone=771234567&message=Hello"
```

### Via JavaScript

```typescript
// In your component or API route
const response = await fetch('/api/sms-test?action=oauth&phone=771234567');
const data = await response.json();

console.log({
  success: data.result.success,
  response: data.result.response,
  timestamp: data.timestamp
});
```

## Integration Examples

### In Order Creation Route

```typescript
// app/api/orders/route.ts
import { sendOrderConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms-new';

export async function POST(request: Request) {
  const body = await request.json();
  
  // ... validate order data ...
  
  // Save to Firestore
  const docRef = await db.collection('orders').add({
    customerName: body.customerName,
    phone: body.phone,
    amount: body.amount,
    createdAt: new Date(),
  });

  // Send SMS notifications (non-blocking)
  Promise.all([
    sendOrderConfirmationSMS(body.phone, docRef.id, body.customerName),
    sendAdminOrderNotificationSMS(docRef.id, body.customerName, body.phone, body.amount),
  ]).catch(error => {
    console.error('SMS notification failed:', error);
    // Still return success - SMS is secondary
  });

  return NextResponse.json({ orderId: docRef.id });
}
```

### In PayHere Webhook

```typescript
// app/api/payment/payhere/notify/route.ts
import { sendPaymentConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms-new';

export async function POST(request: Request) {
  // ... verify PayHere signature ...
  
  if (status_code === 2) {  // Payment successful
    // Update order in Firestore
    await db.collection('orders').doc(orderId).update({
      paymentStatus: 'completed',
      paymentId: merchant_reference
    });

    // Get order details for SMS
    const orderDoc = await db.collection('orders').doc(orderId).get();
    const order = orderDoc.data();

    // Send notifications (non-blocking)
    Promise.all([
      sendPaymentConfirmationSMS(order.phone, orderId, order.customerName, order.amount),
      sendAdminOrderNotificationSMS(orderId, order.customerName, order.phone, order.amount),
    ]).catch(error => {
      console.error('Payment SMS notification failed:', error);
    });
  }

  return NextResponse.json({ success: true });
}
```

### In Delivery Status Endpoint

```typescript
// app/api/orders/[orderId]/delivery/route.ts
import { sendDeliveryUpdateSMS } from '@/lib/sms-new';

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = await params;
  const body = await request.json();
  const { deliveryStatus, adminPassword } = body;

  // ... verify adminPassword ...
  // ... validate status ...
  
  // Get order to send SMS to correct customer
  const order = await db.collection('orders').doc(orderId).get();
  
  // Update order status in Firestore
  await db.collection('orders').doc(orderId).update({
    deliveryStatus: deliveryStatus,
    updatedAt: new Date()
  });

  // Notify customer (non-blocking)
  sendDeliveryUpdateSMS(order.phone, orderId, deliveryStatus).catch(error => {
    console.error('Delivery SMS notification failed:', error);
  });

  return NextResponse.json({ success: true });
}
```

## Phone Number Format

The SMS service automatically handles various phone formats:

| Input | Output | Status |
|-------|--------|--------|
| `771234567` | `771234567` | ✅ Valid |
| `0771234567` | `771234567` | ✅ Valid |
| `+94771234567` | `771234567` | ✅ Valid |
| `077-123-4567` | `771234567` | ✅ Valid |
| `+94 (77) 123-4567` | `771234567` | ✅ Valid |

## Message Limits

- **Standard SMS:** 160 characters
- **Long SMS:** Up to 320 characters (charged as 2 SMS)
- **Auto-segmentation:** Messages over 160 chars sent as multiple SMS

## Environment Variables Reference

```env
# Enable OAuth 2.0 API (recommended)
TEXTLK_USE_OAUTH=true

# OAuth 2.0 API Token (for advanced features)
TEXTLK_API_TOKEN=2806|78hrnBSzMyn4S7bbzGfzwlLQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE_V3=https://app.text.lk/api/v3

# HTTP API Key (fallback)
TEXTLK_API_KEY=2806|78hrnBSzMyn4S7bbzGfzwILQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE=https://app.text.lk/api/http

# SMS Configuration
TEXTLK_SENDER_ID=Lifting S                # Your brand name (max 11 chars)
TEXTLK_ADMIN_PHONE=764829645              # Admin phone for alerts
```

## Monitoring & Logging

### Console Output
```
✓ SMS sent via OAuth 2.0 to 771234567 { messageId: 'msg-12345', creditsRemaining: 1432 }
✓ SMS sent via HTTP API to 771234567
[SMS] Order Confirmation - Order: order-123abc, Customer: John Doe
[SMS] Payment Confirmation - Order: order-123abc, Amount: LKR 1500
[SMS] Delivery Update - Order: order-123abc, Status: DELIVERED
```

### Error Logs
```
Invalid API credentials
Invalid phone number format
Invalid message content
OAuth temporarily unavailable, using HTTP API
```

## Next Steps

1. **Test the endpoints**
   ```bash
   npm run dev
   # Visit http://localhost:3002/api/sms-test
   ```

2. **Replace the old SMS service** (if using old version)
   ```bash
   # Option: Copy new implementation
   mv lib/sms.ts lib/sms-backup.ts
   mv lib/sms-new.ts lib/sms.ts
   ```

3. **Verify in your flows**
   - Create test order → Check SMS
   - Complete payment → Check SMS
   - Update delivery → Check SMS

4. **Monitor in production**
   - Check Text.lk dashboard for usage
   - Monitor balance occasionally
   - Review logs for failures

## Troubleshooting

### SMS not sending?
1. Check phone number format (should be 9 digits: 771234567)
2. Verify balance in Text.lk dashboard
3. Test with `/api/sms-test` endpoint
4. Check server logs for error messages

### Getting "Invalid API credentials"?
1. Verify `TEXTLK_API_KEY` or `TEXTLK_API_TOKEN` in `.env.local`
2. Check Text.lk account is active
3. May need to re-authenticate in Text.lk dashboard

### OAuth failing but HTTP working?
- This is expected and handled automatically
- System falls back to HTTP API
- Both can be used interchangeably

### Can't check balance?
- Balance checking requires OAuth 2.0 API
- Ensure `TEXTLK_USE_OAUTH=true`
- Verify `TEXTLK_API_TOKEN` is set

## Full Documentation

For detailed information, see:
- **SMS_INTEGRATION_GUIDE.md** - Complete API documentation
- **SMS_MIGRATION_SUMMARY.md** - Migration from old to new version
- **Text.lk API Docs** - https://app.text.lk/developers/docs

## Support

- Check Text.lk documentation: https://app.text.lk/developers/
- Review server logs: `npm run dev` and check console
- Test endpoints: Visit `/api/sms-test` while dev server is running
- Check your Text.lk account: https://app.text.lk/

## Questions?

All SMS functions are designed to be non-blocking. If SMS fails, it logs an error but doesn't break your order flow. This ensures reliable order processing even if the SMS service is temporarily down.
