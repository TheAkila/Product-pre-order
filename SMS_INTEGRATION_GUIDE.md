# Text.lk SMS Integration Guide

Complete documentation for using Text.lk SMS service with Lifting Social.

## Overview

Your SMS integration now supports **two authentication methods**:

1. **HTTP API (Legacy)** - Session-based authentication
   - Endpoint: `https://app.text.lk/api/http/send_sms.php`
   - Uses: `TEXTLK_API_KEY` (session_id)
   - Status: Supported, stable

2. **OAuth 2.0 API v3 (Recommended)** - Token-based authentication
   - Endpoint: `https://app.text.lk/api/v3/`
   - Uses: `TEXTLK_API_TOKEN` (Bearer token)
   - Status: Recommended for new projects
   - Features: Balance checking, delivery reports, advanced scheduling

## Configuration

### Environment Variables

```env
# HTTP API (Backward Compatible)
TEXTLK_API_KEY=2806|78hrnBSzMyn4S7bbzGfzwILQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE=https://app.text.lk/api/http

# OAuth 2.0 API v3 (Recommended)
TEXTLK_API_TOKEN=2806|78hrnBSzMyn4S7bbzGfzwlLQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE_V3=https://app.text.lk/api/v3
TEXTLK_USE_OAUTH=true          # Enable OAuth (set to 'true' or 'false')

# SMS Configuration
TEXTLK_SENDER_ID=Lifting S      # Your sender ID/brand name
TEXTLK_ADMIN_PHONE=764829645    # Admin phone for notifications
```

**Note:** Both tokens are provided; they may be the same or different depending on your Text.lk account setup.

## Features Implemented

### 📱 SMS Functions

#### 1. Order Confirmation SMS
**When triggered:** Order is created
**Recipient:** Customer
**Message format:** "Order Confirmed! Hi {name}, your Lifting Social order #{orderId} is confirmed..."

```typescript
import { sendOrderConfirmationSMS } from '@/lib/sms-new';

await sendOrderConfirmationSMS('771234567', 'order-123', 'John Doe');
```

#### 2. Payment Confirmation SMS
**When triggered:** Payment is successful (via PayHere webhook)
**Recipient:** Customer + Admin
**Message format:** "Payment Confirmed! Hi {name}, we received your payment of LKR {amount}..."

```typescript
import { sendPaymentConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms-new';

await sendPaymentConfirmationSMS('771234567', 'order-123', 'John Doe', 1500);
await sendAdminOrderNotificationSMS('order-123', 'John Doe', '771234567', 1500);
```

#### 3. Delivery Status SMS
**When triggered:** Admin updates delivery status
**Recipient:** Customer
**Message format:** Dynamic based on status (PROCESSING/SHIPPED/DELIVERED)

```typescript
import { sendDeliveryUpdateSMS } from '@/lib/sms-new';

await sendDeliveryUpdateSMS('771234567', 'order-123', 'DELIVERED');
```

#### 4. Check SMS Balance (OAuth only)
**Purpose:** Monitor available SMS credits
**Returns:** Remaining credits

```typescript
import { checkSmsBalance } from '@/lib/sms-new';

const balance = await checkSmsBalance();
// Response: { success: true, credits: 1432, ... }
```

#### 5. Get Delivery Report (OAuth only)
**Purpose:** Track SMS delivery status
**Returns:** Delivery status for specific message

```typescript
import { getSmsDeliveryReport } from '@/lib/sms-new';

const report = await getSmsDeliveryReport('message-id-123');
// Response: { success: true, delivered: true, timestamp: '...', ... }
```

## Testing

### Test Endpoint: `/api/sms-test`

#### Test Both APIs
```bash
curl "http://localhost:3000/api/sms-test?action=send&phone=771234567"
```

#### Test HTTP API Only
```bash
curl "http://localhost:3000/api/sms-test?action=http&phone=771234567&message=Hello%20World"
```

#### Test OAuth 2.0 API Only
```bash
curl "http://localhost:3000/api/sms-test?action=oauth&phone=771234567&message=Hello%20World"
```

#### Check SMS Balance
```bash
curl "http://localhost:3000/api/sms-test?action=balance"
```

#### Get Delivery Report
```bash
curl "http://localhost:3000/api/sms-test?action=report&messageId=YOUR_MESSAGE_ID"
```

#### POST Testing
```bash
curl -X POST http://localhost:3000/api/sms-test \
  -H "Content-Type: application/json" \
  -d '{
    "action": "oauth",
    "phone": "771234567",
    "message": "Test message"
  }'
```

### Response Format

**Success Response:**
```json
{
  "action": "Send SMS (Both APIs)",
  "phone": "771234567",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "results": {
    "http": {
      "success": true,
      "response": "1",
      "statusCode": 200
    },
    "oauth": {
      "success": true,
      "response": {
        "status": true,
        "data": {
          "message_id": "msg-12345",
          "credits_remaining": 1432
        }
      },
      "statusCode": 200
    },
    "comparison": {
      "httpSuccess": true,
      "oauthSuccess": true,
      "bothSuccessful": true
    }
  }
}
```

## Migration Path

### Current Implementation
Your app currently uses the HTTP API. To migrate to OAuth 2.0:

1. **Update `.env.local`** ✅ (Done)
   ```env
   TEXTLK_USE_OAUTH=true
   TEXTLK_API_TOKEN=your_oauth_token
   ```

2. **Replace SMS service** (Choose one approach):

   **Option A: Replace entire service**
   ```bash
   # Backup old file
   mv lib/sms.ts lib/sms.backup.ts
   
   # Use new implementation
   mv lib/sms-new.ts lib/sms.ts
   
   # Update imports in existing code (no changes needed - same function names)
   ```

   **Option B: Gradual transition**
   - Keep both files
   - Import from `sms-new.ts` in new code
   - Gradually update existing imports

3. **Test thoroughly**
   - Use `/api/sms-test` endpoint
   - Monitor delivery reports
   - Check balance regularly

### Backward Compatibility

If OAuth fails, the system automatically falls back to HTTP API:
```typescript
// Automatically tries OAuth first, then HTTP
const result = await sendSMS(phone, message, sender);
```

## API Endpoint Comparison

| Feature | HTTP API | OAuth 2.0 v3 |
|---------|----------|------|
| Send SMS | ✅ Yes | ✅ Yes |
| Check Balance | ❌ No | ✅ Yes |
| Delivery Reports | ❌ No | ✅ Yes |
| Scheduled SMS | ❌ No | ✅ Yes (if Text.lk supports) |
| Batch Sending | ❌ No | ✅ Yes |
| Message Templates | ❌ No | ✅ Yes (if Text.lk supports) |
| Phone Validation | ❌ No | ✅ Yes (if Text.lk supports) |
| DLT Registration | Varies | ✅ Managed |
| Authentication | session_id | Bearer Token |
| Rate Limiting | Per message | Depends on plan |

## Integration Points in Your App

### 1. Order Creation (`/app/api/orders/route.ts`)
```typescript
import { sendOrderConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms-new';

// After order is created in Firebase
await sendOrderConfirmationSMS(phone, orderId, customerName);
await sendAdminOrderNotificationSMS(orderId, customerName, phone, amount);
```

### 2. Payment Success (`/app/api/payment/payhere/notify/route.ts`)
```typescript
import { sendPaymentConfirmationSMS, sendAdminOrderNotificationSMS } from '@/lib/sms-new';

// After payment verification
await sendPaymentConfirmationSMS(customerPhone, orderId, customerName, amount);
await sendAdminOrderNotificationSMS(orderId, customerName, customerPhone, amount);
```

### 3. Delivery Status (`/app/api/orders/[orderId]/delivery/route.ts`)
```typescript
import { sendDeliveryUpdateSMS } from '@/lib/sms-new';

// After admin updates status
await sendDeliveryUpdateSMS(customerPhone, orderId, status);
```

### 4. Admin Dashboard (Optional)
```typescript
import { checkSmsBalance, getSmsDeliveryReport } from '@/lib/sms-new';

// Display balance on admin page
const balance = await checkSmsBalance();

// Show delivery status for specific orders
const report = await getSmsDeliveryReport(messageId);
```

## Error Handling

The SMS service handles errors gracefully:

```typescript
const result = await sendOrderConfirmationSMS(phone, orderId, name);

if (!result.success) {
  console.error('SMS failed:', result.message);
  // App continues - SMS failure doesn't prevent order creation
  // Log to monitoring system for manual follow-up
}
```

## Monitoring & Debugging

### Console Logs
The service provides detailed logging:
```
✓ SMS sent via OAuth 2.0 to 771234567 { messageId: '...', creditsRemaining: 1432 }
✓ SMS sent via HTTP API to 771234567
[SMS] Order Confirmation - Order: order-123, Customer: John Doe
[SMS] Payment Confirmation - Order: order-123, Amount: LKR 1500
[SMS] Delivery Update - Order: order-123, Status: DELIVERED
```

### Phone Number Formatting
Automatically handles:
- Leading `+94` (country code)
- Leading `0`
- Spaces and dashes
- Mixed formats

Input → Output:
- `+94771234567` → `771234567` ✅
- `0771234567` → `771234567` ✅
- `771234567` → `771234567` ✅
- `077-123-4567` → `771234567` ✅

### Message Length
- Standard SMS: up to 160 characters
- Long SMS: up to 320 characters
- Warning logged if exceeds 320 characters

## Security Considerations

⚠️ **Important:** Protect your API tokens!

1. **Never** commit `.env.local` to Git
2. **Rotate** tokens periodically
3. **Monitor** API usage via Text.lk dashboard
4. **Use** environment-specific tokens (different for dev/prod)
5. **Log** SMS requests securely (don't log phone numbers in production logs)

## Text.lk API Documentation

- **HTTP API Docs**: https://app.text.lk/developers/http-docs
- **OAuth 2.0 Docs**: https://app.text.lk/developers/docs
- **Account Dashboard**: https://app.text.lk/

## Support & Troubleshooting

### Common Issues

1. **"Invalid API credentials"**
   - Check `TEXTLK_API_KEY` is correct
   - Verify account is active on Text.lk

2. **"Invalid phone number format"**
   - Should be 9 digits for Sri Lanka (071234567)
   - Service auto-formats, but verify input

3. **"Failed to retrieve balance" (OAuth only)**
   - Ensure `TEXTLK_API_TOKEN` is set
   - Verify OAuth token has account permissions

4. **SMS not sending**
   - Check account has sufficient balance
   - Verify phone number is correct
   - Check logs for specific error messages
   - Test with `/api/sms-test` endpoint

### Debug Mode

Enable detailed logging:
```typescript
// In sms-new.ts, uncomment debug statements:
console.log(`[SMS DEBUG] Sending via ${endpoint.type} to ${formattedPhone}`);
console.log(`[SMS DEBUG] Payload:`, payload);
```

## Next Steps

1. ✅ Update `.env.local` with OAuth configuration
2. 🔄 **Test endpoints** - Use `/api/sms-test` to verify both APIs work
3. 🔄 **Replace SMS service** - Update imports from `sms.ts` to `sms-new.ts`
4. 🔄 **Verify in production** - Test full order → payment → delivery flow
5. 📊 **Monitor usage** - Check Text.lk dashboard regularly
6. 🔐 **Security audit** - Ensure tokens are protected

## Questions?

- Check Text.lk documentation
- Review test endpoint responses
- Check browser console and server logs
- Test with different phone numbers and messages
