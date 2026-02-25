# SMS Integration - Final Validation Checklist

## ✅ Pre-Test Checklist

Before testing, verify these are in place:

### Configuration Files
- [ ] `.env.local` contains `TEXTLK_API_TOKEN=3545|...`
- [ ] `.env.local` contains `TEXTLK_SENDER_ID=Lifting S`
- [ ] `.env.local` contains `TEXTLK_ADMIN_PHONE=764829645`
- [ ] No empty values for SMS configuration

### Source Code
- [ ] `lib/sms.ts` exists and uses `textlk-node`
- [ ] `types/textlk-node.d.ts` exists for TypeScript definitions
- [ ] `app/api/orders/route.ts` calls SMS functions
- [ ] `app/api/payment/payhere/notify/route.ts` has SMS calls

### Build & Compilation
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No compilation warnings about SMS

### Text.lk Account
- [ ] Account is active at https://app.text.lk/
- [ ] Account has available SMS credits (> 0)
- [ ] API token is valid and correct
- [ ] Sender ID is set in account

---

## 🧪 Testing Sequence

### Test Phase 1: Compilation

```bash
cd "/Users/akilanishan/Desktop/Projects/Product pre order"
npm run build
```

**Expected: ✓ Compiled successfully**

### Test Phase 2: Dev Server

```bash
npm run dev
```

**Expected: ✓ Ready in Xs**
**Note: Server runs on port 3001 (port 3000 in use)**

### Test Phase 3: Place Test Order

```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "771234567",
    "quantity": 1,
    "deliveryMethod": "SELFPICKUP"
  }'
```

**Expected Response:**
- HTTP 200
- `orderId` field present
- `paymentStatus: "PENDING_PAYMENT"`

### Test Phase 4: SMS Delivery

**Wait 5-10 seconds, then check:**

1. **Your phone (771234567)**
   - [ ] Received SMS from "Lifting S"
   - [ ] Message starts with "Order Confirmed!"
   - [ ] Contains order ID

2. **Admin phone (764829645)**
   - [ ] Received SMS from "Lifting S"
   - [ ] Message starts with "New Order!"
   - [ ] Contains amount: "LKR 1500"

3. **Dev console (`npm run dev` output)**
   - [ ] See `✅ SMS sent successfully to 94771234567`
   - [ ] See `[SMS] Order Confirmation - Order: ...`
   - [ ] See `[SMS] Admin Notification - Order: ...`

---

## 📝 Test Results Template

**Test Date:** ________________
**Tester:** ____________________

### Build Test
- Compilation Status: ☐ Success ☐ Failed
- Errors: _______________________________
- Comments: _____________________________

### Dev Server Test
- Server Started: ☐ Success ☐ Failed
- Port: ☐ 3000 ☐ 3001 ☐ Other: ____
- Comments: _____________________________

### Order Creation Test
- Order Created: ☐ Yes ☐ No
- Order ID: _____________________________
- Response Code: ________________________
- Comments: _____________________________

### SMS Delivery Test - Customer

**Phone Tested:** 771234567
- SMS Received: ☐ Yes ☐ No ☐ Time: ___:___
- SMS From: ____________________________
- Message Content: ______________________
- Contains Order ID: ☐ Yes ☐ No

### SMS Delivery Test - Admin

**Phone Tested:** 764829645
- SMS Received: ☐ Yes ☐ No ☐ Time: ___:___
- SMS From: ____________________________
- Message Content: ______________________
- Contains Amount: ☐ Yes ☐ No

### Console Logs Test
- Order confirmation SMS logged: ☐ Yes ☐ No
- Admin notification SMS logged: ☐ Yes ☐ No
- Error messages found: ☐ Yes ☐ No
- Details: ______________________________

### Overall Result

☐ **ALL TESTS PASSED** - SMS System Working ✅
☐ **PARTIAL SUCCESS** - Some SMS received
☐ **FAILED** - No SMS received

### Issues Found
1. ________________________________________
2. ________________________________________
3. ________________________________________

### Next Steps
- ________________________________________
- ________________________________________

---

## 🚀 Production Readiness

After successful testing, verify:

- [ ] Build succeeds without warnings
- [ ] Dev server runs without errors
- [ ] SMS delivered for order creation
- [ ] SMS delivered for payment (when payment is processed)
- [ ] Admin receives notifications
- [ ] Phone number formatting works (e.g., 771234567 → 94771234567)
- [ ] Error messages are clear if something fails
- [ ] No sensitive data logged (API tokens, full phone numbers)
- [ ] Payment webhook SMS integration tested
- [ ] Delivery status update SMS works (after implementing)

---

## 📊 Success Criteria

| Criteria | Status | Evidence |
|----------|--------|----------|
| Build succeeds | ✅/❌ | Console output |
| Dev server runs | ✅/❌ | Port 3001 accessible |
| Order created | ✅/❌ | Order ID returned |
| Customer SMS sent | ✅/❌ | SMS received on phone |
| Admin SMS sent | ✅/❌ | Admin phone received SMS |
| Correct format | ✅/❌ | Phone: 94771234567 in logs |
| No errors | ✅/❌ | Console clean |
| Type safe | ✅/❌ | TypeScript builds |

**All criteria must be ✅ for production deployment**

---

## 🔧 If Test Fails

### Order Not Created
1. Check server is running: `npm run dev`
2. Check response for error message
3. Check Firebase connectivity in logs
4. Verify `.env.local` has Firebase config

### SMS Not Received
1. Check dev logs for `[SMS]` messages
2. Verify `TEXTLK_API_TOKEN` is set (not empty)
3. Verify phone number format: `94771234567` in logs
4. Check Text.lk account balance
5. Check if message is in SMS folder or marked as spam

### Build Fails
1. Check TypeScript errors: `npm run build`
2. Verify `types/textlk-node.d.ts` exists
3. Try rebuild: `rm -rf .next && npm run build`
4. Check Node.js version: `node --version`

### Dev Server Won't Start
1. Kill existing process: `killall node`
2. Clear build: `rm -rf .next`
3. Try again: `npm run dev`
4. Check port availability: `lsof -i :3000 :3001`

---

## 📞 Testing Phone Numbers

For testing, you can use:

**Customer Phone:** `771234567` (or your phone number)
**Admin Phone:** `764829645` (set in `.env.local`)

**Format Handling:**
- Input `771234567` is auto-converted to `94771234567`
- Input `0771234567` is auto-converted to `94771234567`
- Input `+94771234567` is recognized as `94771234567`

---

## 🎯 Quick Validation (2 minutes)

```bash
# 1. Build
npm run build
# ✅ Should see: "Compiled successfully"

# 2. Run dev server
npm run dev
# ✅ Should see: "Ready in Xs"

# 3. Place order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"771234567","quantity":1,"deliveryMethod":"SELFPICKUP"}'
# ✅ Should see: orderId and order data

# 4. Check phone for SMS
# ✅ Should receive: "Order Confirmed! Hi Test..."
```

**If all 4 steps show ✅ → SMS System Working!**

---

## 📋 After Successful Test

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Fix: SMS integration using official textlk-node package

   - Fixed phone number formatting (now includes country code 94)
   - Updated to use official textlk-node package
   - Added TypeScript declarations for textlk-node
   - Improved error handling and logging
   - All SMS functionality now working"
   ```

2. **Deploy to Production**
   - Push to GitHub
   - Vercel auto-deploys
   - Test production SMS

3. **Monitor**
   - Check Text.lk dashboard for activity
   - Monitor SMS delivery in logs
   - Respond to any failures

---

## ✅ Sign-Off

**Test Completed By:** ____________________
**Date:** _______________________________
**Result:** ☐ PASS ☐ FAIL
**Sign:** _______________________________

---

## 📚 Documentation Reference

- **SMS_FIX_COMPLETE.md** - Technical details of the fix
- **SMS_READY_TO_TEST.md** - Quick start guide
- **SMS_INTEGRATION_GUIDE.md** - Complete API reference
- **SMS_QUICK_START.md** - Copy-paste examples

For questions or issues, refer to these documents.
