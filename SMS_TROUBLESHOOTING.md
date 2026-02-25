# SMS Not Sending - Troubleshooting Guide

Your SMS system is configured but not sending. Let's diagnose the issue step by step.

## ✅ What's Configured Correctly

```
✅ TEXTLK_API_KEY is set
✅ TEXTLK_SENDER_ID = "Lifting S"
✅ TEXTLK_ADMIN_PHONE = "764829645"
✅ lib/sms.ts exists (old service)
✅ lib/sms-new.ts exists (new service)
✅ /api/orders route calls SMS functions
✅ /api/sms-test endpoint exists
```

## ❌ What's Happening

When testing: `curl http://localhost:3001/api/sms-test?action=http&phone=771234567`

**Result:** Text.lk API returning `404 Not Found`

**Cause:** One of these:
1. API key is being rejected by Text.lk
2. API endpoint is wrong
3. Account is inactive or suspended
4. Text.lk service is experiencing issues

---

## 🔧 Step 1: Verify Your Text.lk Account

### Check Account Status
1. Go to: https://app.text.lk/
2. Log in with your account
3. Check:
   - ✅ Account is "Active" (not suspended)
   - ✅ You have SMS credits remaining
   - ✅ API key is valid

### Where to Find Your API Key
1. Login to https://app.text.lk/
2. Go to: **Settings** → **API** (or **Developers**)
3. Find your API key (looks like `2806|...`)
4. Copy the exact key

### Verify the Key Format
```
Format: MERCHANT_ID|TOKEN
Example: 2806|78hrnBSzMyn4S7bbzGfzwILQkehWtiQbUQeI4keG65bf1095

Your current key (first 20 chars):
2806|78hrnBSzMyn4S7bbz...
```

---

## 🔧 Step 2: Update API Key

If the key is invalid or changed:

1. **Get your correct API key from Text.lk**
2. **Update `.env.local`:**
   ```env
   # Replace with your actual API key from Text.lk
   TEXTLK_API_KEY=2806|PASTE_YOUR_ACTUAL_KEY_HERE
   TEXTLK_API_TOKEN=2806|PASTE_YOUR_ACTUAL_KEY_HERE
   ```

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Test again:**
   ```bash
   curl http://localhost:3001/api/sms-test?action=http&phone=771234567
   ```

---

## 🔧 Step 3: Check Account Balance

Text.lk requires SMS credits to send messages.

**Check your balance:**
1. Go to: https://app.text.lk/
2. Click on **Wallet** or **Account** → **Balance**
3. Check you have credits (should show a number like `1500`)

**If no credits:**
- Buy credits at https://app.text.lk/
- Then test again

---

## 🔧 Step 4: Try the New SMS Service

The old SMS service (`lib/sms.ts`) might have issues. Try the new one with OAuth 2.0 support:

**Option A: Quick switch (recommended)**
```bash
cd "/Users/akilanishan/Desktop/Projects/Product pre order"

# Backup old version
mv lib/sms.ts lib/sms-old.ts

# Use new version
mv lib/sms-new.ts lib/sms.ts

# Restart server
npm run dev
```

**Option B: Update imports**
```typescript
// In app/api/orders/route.ts, change:
// FROM:
import { ... } from '@/lib/sms';

// TO:
import { ... } from '@/lib/sms-new';
```

---

## 🧪 Step 5: Test the SMS Endpoint

**Make sure dev server is running:**
```bash
npm run dev
# Should show: ✓ Ready in X.Xs
```

**Test HTTP API:**
```bash
curl "http://localhost:3001/api/sms-test?action=http&phone=771234567"
```

**Expected Response:**
```json
{
  "action": "HTTP API Test",
  "result": {
    "success": true,
    "response": "1"
  }
}
```

**If you still get 404:**
- The API key is likely invalid
- Check step 2: Update API Key

---

## 🧪 Step 6: Place a Test Order with Logs

1. **Start dev server with logs visible:**
   ```bash
   npm run dev
   ```

2. **In another terminal, place a test order:**
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

3. **Watch the dev server console for:**
   ```
   [SMS] Order Confirmation - Order: ..., Customer: Test User
   ✓ SMS sent successfully to 771234567
   ```

   **OR if SMS fails:**
   ```
   SMS not sent: [error message]
   SMS sending failed: [error details]
   ```

---

## 📋 Checklist: Do This In Order

- [ ] **Verify Text.lk account is active**
  - Go to https://app.text.lk/ and log in
  - Check account status and available credits

- [ ] **Copy correct API key**
  - Get from Text.lk → Settings/API
  - Make sure it's the full key (includes `2806|...`)

- [ ] **Update .env.local**
  ```env
   TEXTLK_API_KEY=2806|PASTE_YOUR_KEY_HERE
   ```

- [ ] **Restart dev server**
  ```bash
   npm run dev
   ```

- [ ] **Test SMS endpoint**
   ```bash
   curl http://localhost:3001/api/sms-test?action=http&phone=771234567
   ```

- [ ] **If still failing, try new service**
   ```bash
   mv lib/sms.ts lib/sms-old.ts
   mv lib/sms-new.ts lib/sms.ts
   npm run dev
   ```

- [ ] **Place test order and check logs**
   - Watch dev server console for [SMS] messages

---

## 🔍 Debug: Check What Parameters Are Being Sent

If you want to see exactly what's being sent to Text.lk API:

Edit `lib/sms.ts` (or the service you're using) and add this before the fetch:

```typescript
console.log('📤 Sending SMS with:');
console.log('  API Key:', apiKey.slice(0, 20) + '...');
console.log('  Endpoint:', endpoint);
console.log('  Phone:', formattedPhone);
console.log('  Sender:', senderId);
console.log('  Message:', message.slice(0, 50) + '...');
```

Then look at `npm run dev` output to see what's being sent.

---

## 🆘 Still Not Working?

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Getting 404 from Text.lk | API key is invalid. Get the correct one from Text.lk account |
| SMS sends but customer doesn't receive | Text.lk account may have no credits. Buy more at text.lk |
| "SMS service not configured" | TEXTLK_API_KEY is empty in .env.local |
| Dev server crashes | Check `.env.local` syntax (no quotes around values) |
| Port already in use | Close other dev server: `killall node` |

### Manual API Test

To test Text.lk API directly (outside your app):

```bash
# Test with your actual API key
APIKEY="2806|YOUR_KEY_HERE"
PHONE="771234567"

curl -X POST "https://app.text.lk/api/http/send_sms.php" \
  -d "session_id=$APIKEY" \
  -d "to=$PHONE" \
  -d "message=Test SMS from Lifting Social" \
  -d "from=Lifting S"
```

If this returns `1`, your API key works!

---

## 📞 Need Help?

### Contact Text.lk Support
- Website: https://app.text.lk/
- They can verify your API key is working

### Check These Docs
- [SMS_QUICK_START.md](SMS_QUICK_START.md) - Examples
- [SMS_INTEGRATION_GUIDE.md](SMS_INTEGRATION_GUIDE.md) - Complete reference
- [SMS_USER_AND_ADMIN_GUIDE.md](SMS_USER_AND_ADMIN_GUIDE.md) - User/Admin workflow

### What to Tell Me
If you still need help, tell me:
1. Current status of `/api/sms-test?action=http&phone=771234567`
2. What's in your `.env.local` (TEXTLK_API_KEY part)
3. What error you see in `npm run dev` console
4. Whether you have credits in Text.lk account
