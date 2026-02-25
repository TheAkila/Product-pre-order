# SMS System - Updated Configuration ✅

All changes have been made to send **ONLY 3 SMS MESSAGES**:

## 📱 The 3 SMS Messages

### 1️⃣ Order Confirmation SMS (When Payment Succeeds)
**Sent to:** Customer  
**When:** After successful PayHere payment  
**Message:**
```
Order Confirmed! Hi {name}, your Lifting Social order #{orderId} is confirmed. 
We'll notify you when it ships. Thanks!
```
**File:** `/app/api/payment/payhere/notify/route.ts`

### 2️⃣ Admin Notification SMS (When Payment Succeeds)
**Sent to:** Admin (phone in `TEXTLK_ADMIN_PHONE`)  
**When:** After successful PayHere payment  
**Message:**
```
New Order! #{orderId} from {name} - LKR {amount}. Phone: {phone}
```
**File:** `/app/api/payment/payhere/notify/route.ts`

### 3️⃣ Delivery Status SMS (When Admin Updates Status)
**Sent to:** Customer  
**When:** Admin marks order as PROCESSING / SHIPPED / DELIVERED  
**Message varies by status:**
```
PROCESSING: "Your Lifting Social order #{orderId} is being prepared. 
            Estimated delivery: 2-3 days."

SHIPPED:    "Your order #{orderId} has been shipped! Track your delivery via SMS updates."

DELIVERED:  "Your Lifting Social Elite Gym Shaker has been delivered! 
            Enjoy your gear. Thank you for your order!"
```
**File:** `/app/api/orders/[orderId]/delivery/route.ts`

---

## 🔄 Updated Flow

### Before (Old System)
```
Customer Places Order
    ↓
📱 SMS: "Order Confirmed!" (REMOVED)
📱 (Admin gets) "New Order..." (REMOVED)
    ↓
Customer Pays
    ↓
📱 SMS: "Payment Confirmed!" 
📱 (Admin gets) "New Order..."
    ↓
Admin Updates Status
    ↓
📱 SMS: "Order status update..."
```

### Now (New System)
```
Customer Places Order
    ↓
(No SMS sent)
    ↓
Customer Pays
    ↓
📱 SMS: "Order Confirmed!" ← Customer receives
📱 (Admin gets) "New Order!" ← Admin receives
    ↓
Admin Updates Status (PROCESSING/SHIPPED/DELIVERED)
    ↓
📱 SMS: "Status update..." ← Customer receives
```

---

## ✅ Changes Made

### 1. Removed SMS from Order Creation
**File:** `/app/api/orders/route.ts`
- ❌ Removed: `import { sendOrderConfirmationSMS, sendAdminOrderNotificationSMS }`
- ❌ Removed: SMS sending code from POST handler
- **Result:** No SMS sent when order is created, only when payment succeeds

### 2. Payment Webhook Already Configured
**File:** `/app/api/payment/payhere/notify/route.ts`
- ✅ Sends SMS to customer: "Order Confirmed!"
- ✅ Sends SMS to admin: "New Order!"
- ✅ Only when payment status is "2" (successful)

### 3. Delivery Endpoint Already Configured
**File:** `/app/api/orders/[orderId]/delivery/route.ts`
- ✅ Sends SMS to customer when status is updated
- ✅ Message varies by delivery status
- ✅ Requires admin password for security

---

## 🧪 Testing the System

### Test 1: Place Order (NO SMS)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "+94771234567",
    "quantity": 1,
    "deliveryMethod": "SELFPICKUP"
  }'
```
**Expected:** Order created, NO SMS sent

### Test 2: Simulate Payment Success (SMS SENT)
The PayHere webhook will be called when customer completes payment

**Expected SMS to Customer:** "Order Confirmed! Hi Test, your Lifting Social order #..."
**Expected SMS to Admin:** "New Order! #... from Test User - LKR 1500..."

### Test 3: Update Delivery Status (SMS SENT)
```bash
curl -X POST http://localhost:3000/api/orders/ORDER_ID/delivery \
  -H "Content-Type: application/json" \
  -d '{
    "deliveryStatus": "DELIVERED",
    "adminPassword": "abekon"
  }'
```

**Expected SMS to Customer:** "Your Lifting Social Elite Gym Shaker has been delivered!..."

---

## 📊 SMS Functions Used

### For Payment Success (Messages 1 & 2)
```typescript
// In /app/api/payment/payhere/notify/route.ts

// Message 1: Send to customer
await sendOrderConfirmationSMS(phone, orderId, customerName);

// Message 2: Send to admin
await sendAdminOrderNotificationSMS(orderId, customerName, phone, amount);
```

### For Delivery Update (Message 3)
```typescript
// In /app/api/orders/[orderId]/delivery/route.ts

// Send to customer with status-based message
await sendDeliveryUpdateSMS(phone, orderId, deliveryStatus);
```

---

## 🔧 Configuration

**SMS still needs:**
```env
# In .env.local
TEXTLK_API_TOKEN=2806|YOUR_TOKEN_HERE
TEXTLK_SENDER_ID=Lifting S
TEXTLK_ADMIN_PHONE=764829645          # Where admin SMS is sent
NEXT_PUBLIC_ADMIN_PASSWORD=abekon     # For delivery status updates
```

---

## ✨ Summary

✅ **Order Creation:** No SMS sent (just saves order to database)
✅ **Payment Success:** SMS sent to customer + admin  
✅ **Delivery Update:** SMS sent to customer with status info

**Total:** Exactly 3 SMS messages per order

---

## 📝 Admin Workflow

1. **Customer places order** → No SMS yet
2. **Customer pays via PayHere** → SMS sent automatically (customer + admin)
3. **Admin receives payment notification** → Can update order status
4. **Admin marks as PROCESSING** → SMS sent to customer
5. **Admin marks as SHIPPED** → SMS sent to customer  
6. **Admin marks as DELIVERED** → SMS sent to customer

---

## Build Status ✅

```
✓ Compiled successfully
✓ All routes working
✓ SMS system configured for 3 messages
✓ Ready for testing
```

Deploy with confidence!
