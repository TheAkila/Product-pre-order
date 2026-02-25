# SMS System: User & Admin Guide

Complete guide for both customers and administrators using the SMS notification system.

## 📱 User (Customer) Side

### What Customers Receive

Customers automatically receive SMS notifications at key points in their order journey. **No action needed** - it's automatic!

#### 1️⃣ Order Confirmation SMS
**When:** Immediately after placing an order
**Recipient:** Customer's phone number entered in the order form
**Message:** 
```
Order Confirmed! Hi John, your Lifting Social order #12345678 is confirmed. 
We'll notify you when it ships. Thanks!
```
**What it means:** Their order was successfully created in the system.

#### 2️⃣ Payment Confirmation SMS
**When:** After successful PayHere payment
**Recipient:** Customer's phone number
**Message:**
```
Payment Confirmed! Hi John, we received your payment of LKR 1500 for order 
#12345678. Thank you!
```
**What it means:** Payment was successful and order is ready for preparation.

#### 3️⃣ Delivery Status SMS
**When:** Admin updates the order status (optional - admin-controlled)
**Recipient:** Customer's phone number
**Messages vary by status:**

**Status: PROCESSING**
```
Your Lifting Social order #12345678 is being prepared. Estimated delivery: 2-3 days.
```

**Status: SHIPPED**
```
Your order #12345678 has been shipped! Track your delivery via SMS updates.
```

**Status: DELIVERED**
```
Your Lifting Social Elite Gym Shaker has been delivered! Enjoy your gear. 
Thank you for your order!
```

### Customer Journey Timeline

```
1. Customer visits website
   ↓
2. Fills order form (name, email, phone, address)
   ↓
3. Submits order
   ↓
   → 📱 RECEIVES: Order Confirmation SMS
   ↓
4. Proceeds to payment (PayHere)
   ↓
5. Completes payment
   ↓
   → 📱 RECEIVES: Payment Confirmation SMS
   ↓
6. Admin prepares order
   ↓
   → 📱 RECEIVES: Status SMS "PROCESSING" (if admin sends it)
   ↓
7. Admin ships order
   ↓
   → 📱 RECEIVES: Status SMS "SHIPPED" (if admin sends it)
   ↓
8. Customer receives product
   ↓
   → 📱 RECEIVES: Status SMS "DELIVERED" (if admin sends it)
```

### How Phone Numbers Are Handled

The system accepts phone numbers in **any format**:

✅ **Accepted formats:**
- `771234567` (9 digits)
- `0771234567` (with leading 0)
- `+94771234567` (with country code)
- `077-123-4567` (with dashes)
- `+94 (77) 123-4567` (with spaces and parentheses)

All are automatically converted to the correct format: `771234567`

### Troubleshooting: Not Getting SMS?

**Problem: Didn't receive Order Confirmation SMS**
- ✓ Check phone number entered was correct
- ✓ Check SMS balance (Text.lk may have credit issues)
- ✓ Wait a few seconds - SMS can take time
- ✓ Check spam folder

**Problem: Didn't receive Payment Confirmation SMS**
- ✓ Confirm payment was successful (check PayHere confirmation)
- ✓ Same troubleshooting as order SMS
- ✓ Admin may not have sent status update

**Problem: Not receiving Delivery Updates**
- ✓ Admin must manually send delivery update
- ✓ Not automatic - only happens when admin updates status

---

## 👨‍💼 Admin Side

### Admin Dashboard Overview

Admins manage orders and manually send delivery status updates.

### How to Access Admin Dashboard

1. **URL:** `http://yourdomain.com/admin`
2. **Password:** Set in `.env.local` as `NEXT_PUBLIC_ADMIN_PASSWORD`
3. **Default:** Currently set to `abekon` (change this in production!)

### What Admins Can Do

#### 1. View All Orders
**Location:** Admin Dashboard
**Shows:**
- Order ID
- Customer name and phone
- Order amount
- Order date
- Payment status (completed/pending)
- Delivery status (not set/processing/shipped/delivered)

#### 2. Update Delivery Status
**Purpose:** Send automatic SMS to customer with status update
**How to:**
1. Open Admin Dashboard
2. Find the order
3. Click "Update Status" or similar button
4. Choose status:
   - **PROCESSING** → Customer gets: "Order is being prepared, 2-3 days delivery"
   - **SHIPPED** → Customer gets: "Order has been shipped! Track via SMS"
   - **DELIVERED** → Customer gets: "Package delivered! Enjoy your gear"
5. Click "Save" or "Update"
6. SMS automatically sent to customer

#### 3. Monitor SMS Activity
**Via Test Endpoint:**
```
URL: http://yourdomain.com/api/sms-test
```
Shows:
- Which SMS API is being used (HTTP or OAuth)
- Response status from Text.lk
- Message ID (for tracking)
- Credits remaining

#### 4. Check SMS Balance (Advanced)
**Via API:**
```bash
curl "http://yourdomain.com/api/sms-test?action=balance"
```
Returns:
```json
{
  "action": "Get SMS Balance",
  "result": {
    "success": true,
    "credits": 1432,
    "data": { ... }
  }
}
```

### Admin Workflow

```
1. Admin logs in to dashboard
   ↓
2. Views pending orders
   ↓
3. As you prepare each order:
   → Update status to "PROCESSING"
   → 📱 SENDS: Status SMS to customer
   ↓
4. When order ships:
   → Update status to "SHIPPED"
   → 📱 SENDS: Status SMS to customer
   ↓
5. When customer receives (optional):
   → Update status to "DELIVERED"
   → 📱 SENDS: Status SMS with thank you message
```

### Admin SMS Notifications

**When:** New order is created
**Recipient:** Admin phone (set in `.env.local` as `TEXTLK_ADMIN_PHONE`)
**Message:**
```
New Order! #12345678 from John Doe - LKR 1500. Phone: 0771234567
```

Also sent when payment is successful:
```
New Order! #12345678 from John Doe - LKR 1500. Phone: 0771234567
```

### API Endpoint for Delivery Updates

**Endpoint:** `POST /api/orders/[orderId]/delivery`

**Request:**
```bash
curl -X POST http://localhost:3000/api/orders/order-123/delivery \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryStatus": "DELIVERED",
    "adminPassword": "abekon"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery status updated and SMS sent"
}
```

### Protected with Admin Password

**Why:** Prevent unauthorized status updates
**How:** Every delivery update requires admin password
**Location:** `.env.local` → `NEXT_PUBLIC_ADMIN_PASSWORD`

### SMS Sending Points - Technical View

#### When SMS is Sent to Customer

```typescript
// 1. Order Creation
POST /api/orders
→ sendOrderConfirmationSMS(phone, orderId, name)

// 2. Payment Success
POST /api/payment/payhere/notify
→ sendPaymentConfirmationSMS(phone, orderId, name, amount)

// 3. Delivery Status Update
POST /api/orders/[orderId]/delivery
→ sendDeliveryUpdateSMS(phone, orderId, status)
```

#### When SMS is Sent to Admin

```typescript
// 1. New Order Created
POST /api/orders
→ sendAdminOrderNotificationSMS(orderId, name, phone, amount)

// 2. Payment Received
POST /api/payment/payhere/notify
→ sendAdminOrderNotificationSMS(orderId, name, phone, amount)
```

---

## 🔋 Configuration & Setup

### Environment Variables

**For SMS System:**
```env
# OAuth API (recommended for balance checking)
TEXTLK_API_TOKEN=2806|78hrnBSzMyn4S7bbzGfzwlLQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE_V3=https://app.text.lk/api/v3
TEXTLK_USE_OAUTH=true

# HTTP API (fallback)
TEXTLK_API_KEY=2806|78hrnBSzMyn4S7bbzGfzwILQkehWt1QbUQeI4keG65bf1095

# SMS Configuration
TEXTLK_SENDER_ID=Lifting S              # Brand name in SMS (max 11 chars)
TEXTLK_ADMIN_PHONE=764829645            # Admin receives notifications here

# Admin Dashboard
NEXT_PUBLIC_ADMIN_PASSWORD=abekon       # ⚠️ CHANGE THIS IN PRODUCTION!
```

### Change Admin Phone

1. Open `.env.local`
2. Change `TEXTLK_ADMIN_PHONE` to your phone number
3. Format: `771234567` (9 digits, no country code)
4. Save and restart dev server: `npm run dev`

### Change Admin Password

1. Open `.env.local`
2. Change `NEXT_PUBLIC_ADMIN_PASSWORD` to a strong password
3. ⚠️ **Important:** This is exposed on the frontend (because it's `NEXT_PUBLIC_*`), so it's not super secure. For production, consider move it to server-only using a database.
4. Save and deploy

---

## 📊 Monitoring & Testing

### Test SMS Service

**Check if system is working:**
```bash
# Start dev server
npm run dev

# Visit test page
curl "http://localhost:3000/api/sms-test?action=send&phone=771234567"
```

### Response Examples

**Successful:**
```json
{
  "results": {
    "http": {
      "success": true,
      "response": "1"
    },
    "oauth": {
      "success": true,
      "response": {
        "status": true,
        "data": {
          "message_id": "msg-12345",
          "credits_remaining": 1432
        }
      }
    }
  }
}
```

**Checking Balance:**
```bash
curl "http://localhost:3000/api/sms-test?action=balance"
```

### Console Logs

**When dev server is running (`npm run dev`), you'll see:**

**Order placed:**
```
✓ SMS sent via OAuth 2.0 to 771234567 { 
  messageId: 'msg-12345', 
  creditsRemaining: 1432 
}
[SMS] Order Confirmation - Order: order-abc123, Customer: John Doe
[SMS] Admin Notification - Order: order-abc123, Amount: LKR 1500
```

**Payment received:**
```
[SMS] Payment Confirmation - Order: order-abc123, Amount: LKR 1500
```

**Status updated:**
```
[SMS] Delivery Update - Order: order-abc123, Status: SHIPPED
✓ SMS sent via HTTP API to 771234567
```

**Errors:**
```
Invalid API credentials
Invalid phone number format
OAuth temporarily unavailable, using HTTP API
```

---

## 🎯 Complete User Journey with SMS

### Scenario: Customer John Buys a Gym Shaker

#### Day 1: Order Placement
```
9:00 AM - John visits Lifting Social website
         Fills form:
         - Name: John Doe
         - Email: john@example.com
         - Phone: +94771234567
         - Delivery address: Colombo

9:01 AM - John clicks "Place Order"
         System creates order in Firebase
         
         📱 John's Phone | SMS Received:
         "Order Confirmed! Hi John, your Lifting Social order 
         #87654321 is confirmed. We'll notify you when it ships. 
         Thanks!"

         📱 Admin Phone | SMS Received:
         "New Order! #87654321 from John Doe - LKR 1500. 
         Phone: 0771234567"

9:02 AM - John proceeds to PayHere payment
         Completes payment successfully

         📱 John's Phone | SMS Received:
         "Payment Confirmed! Hi John, we received your payment 
         of LKR 1500 for order #87654321. Thank you!"

         📱 Admin Phone | SMS Received:
         "New Order! #87654321 from John Doe - LKR 1500. 
         Phone: 0771234567"
```

#### Day 2: Admin Prepares Order
```
10:00 AM - Admin logs into admin dashboard
          Views pending orders
          Finds John's order #87654321
          Clicks "Update Status"
          Selects "PROCESSING"
          Clicks "Save"

          📱 John's Phone | SMS Received:
          "Your Lifting Social order #87654321 is being prepared. 
          Estimated delivery: 2-3 days."
```

#### Day 4: Admin Ships Order
```
2:00 PM - Admin updates order status to "SHIPPED"

         📱 John's Phone | SMS Received:
         "Your order #87654321 has been shipped! Track your 
         delivery via SMS updates."
```

#### Day 5: Order Delivered
```
4:00 PM - John receives the package
         Admin updates status to "DELIVERED"

         📱 John's Phone | SMS Received:
         "Your Lifting Social Elite Gym Shaker has been delivered! 
         Enjoy your gear. Thank you for your order!"
```

---

## ⚙️ Technical Integration Points

### 1. Order Creation Flow

**File:** `/app/api/orders/route.ts`

```typescript
POST /api/orders
{
  "customerName": "John Doe",
  "phone": "+94771234567",
  "email": "john@example.com",
  "address": "Colombo",
  "amount": 1500
}
```

**What happens:**
1. Validates order data
2. Saves to Firebase Firestore
3. **Sends SMS to customer:** Order confirmation
4. **Sends SMS to admin:** New order notification
5. Returns order ID

**SMS functions called:**
```typescript
import { 
  sendOrderConfirmationSMS, 
  sendAdminOrderNotificationSMS 
} from '@/lib/sms-new';

await sendOrderConfirmationSMS(phone, orderId, name);
await sendAdminOrderNotificationSMS(orderId, name, phone, amount);
```

### 2. Payment Success Flow

**File:** `/app/api/payment/payhere/notify/route.ts`

```
PayHere IPN Webhook
↓
Verify MD5 signature
↓
Check status_code = 2 (payment successful)
↓
Update Firebase: paymentStatus = 'completed'
↓
Send SMS to customer: Payment confirmation
↓
Send SMS to admin: Order notification
↓
Return success response
```

**SMS functions called:**
```typescript
import { 
  sendPaymentConfirmationSMS, 
  sendAdminOrderNotificationSMS 
} from '@/lib/sms-new';

await sendPaymentConfirmationSMS(phone, orderId, name, amount);
await sendAdminOrderNotificationSMS(orderId, name, phone, amount);
```

### 3. Delivery Status Update Flow

**File:** `/app/api/orders/[orderId]/delivery/route.ts`

```
POST /api/orders/order-123/delivery
{
  "deliveryStatus": "SHIPPED",
  "adminPassword": "abekon"
}
↓
Verify adminPassword matches
↓
Validate status (PROCESSING|SHIPPED|DELIVERED)
↓
Update Firebase: deliveryStatus + timestamp
↓
Send SMS to customer: Status update
↓
Return success
```

**SMS functions called:**
```typescript
import { sendDeliveryUpdateSMS } from '@/lib/sms-new';

await sendDeliveryUpdateSMS(phone, orderId, status);
```

---

## 🔐 Security Considerations

### Admin Password Protection
- Required for all delivery status updates
- Currently using `NEXT_PUBLIC_*` (exposed to frontend)
- ⚠️ **Not ideal for production** - consider moving to database

### API Keys Security
- Store in `.env.local` (never commit to Git)
- Both HTTP and OAuth tokens included
- Regular rotation recommended (via Text.lk dashboard)

### Phone Number Privacy
- Stored in Firebase Firestore
- Not logged in production (security)
- Only admin can view via dashboard

---

## 📞 Phone Number Formats

### Accepted by System

All these are automatically converted to `771234567`:
- `771234567` ✅
- `0771234567` ✅
- `+94771234567` ✅
- `077 123 4567` ✅
- `077-123-4567` ✅

### Required Format

9-digit number without country code:
- **Valid:** `771234567`, `704123456`, `765123456`, `713456789`
- **Invalid:** `1234567` (too few), `07712345670` (too many), `+94` (country code only)

---

## 🐛 Troubleshooting

### SMS Not Sending?

**Check 1: Dev Server Logs**
```bash
npm run dev
# Look for [SMS] messages in console
```

**Check 2: Test Endpoint**
```bash
curl "http://localhost:3000/api/sms-test?action=balance"
# Should show remaining credits
```

**Check 3: Environment Variables**
```bash
# Make sure these are in .env.local
TEXTLK_API_KEY=...
TEXTLK_API_TOKEN=...
TEXTLK_SENDER_ID=Lifting S
TEXTLK_ADMIN_PHONE=764829645
```

**Check 4: Text.lk Account**
- Visit https://app.text.lk/
- Check account balance (need credits to send SMS)
- Verify tokens are correct

### Delivery Status Not Updating?

**Check password:**
```bash
# Verify in .env.local
NEXT_PUBLIC_ADMIN_PASSWORD=abekon
```

**Check API call:**
```bash
curl -X POST http://localhost:3000/api/orders/order-123/delivery \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryStatus": "DELIVERED",
    "adminPassword": "abekon"
  }'
```

---

## 📈 Future Enhancements

Possible improvements:

- [ ] Admin dashboard for viewing all orders with SMS status
- [ ] SMS scheduling for future delivery updates
- [ ] Delivery reports tracking (which SMSs were delivered)
- [ ] Custom SMS templates for different promotions
- [ ] Bulk SMS sending for announcements
- [ ] SMS reply handling (customer responses)
- [ ] Email fallback if SMS fails
- [ ] One-Time Password (OTP) verification

---

## Summary

### User Experience
✅ Automatic, passive notifications
✅ Multiple touchpoints in order journey
✅ Clear status updates
✅ No action required from customer

### Admin Experience
✅ Dashboard to manage orders
✅ Manual control over delivery status
✅ Admin notifications for new orders
✅ Test endpoint for debugging
✅ Balance checking capability

### Overall
✅ Reliable SMS delivery (with HTTP fallback)
✅ OAuth 2.0 support for advanced features
✅ Non-blocking (doesn't delay order processing)
✅ Production-ready with error handling
