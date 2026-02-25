# SMS Not Sending - Quick Fix Guide

Your SMS system is **not working** because the Text.lk API is returning a 404 error.

## 🎯 Most Likely Reason

Your **API key is invalid or expired** in Text.lk

## ⚡ Quick Fix (3 steps - 5 minutes)

### Step 1: Get Your Correct API Key
```
1. Go to: https://app.text.lk/
2. Login to your account
3. Go to: Settings → API (or Developers)
4. Copy your API key (looks like: 2806|XXXXXXXXXXXX)
```

### Step 2: Update .env.local
```bash
# Open this file:
.env.local

# Find this line:
TEXTLK_API_KEY=2806|78hrnBSzMyn4S7bbzGfzwILQkehWtiQbUQeI4keG65bf1095

# Replace XXXX with your actual key from step 1:
TEXTLK_API_KEY=2806|YOUR_ACTUAL_KEY_FROM_TEXT_LK

# Save file
```

### Step 3: Restart & Test
```bash
# Stop dev server (press Ctrl+C)

# Restart
npm run dev

# Test SMS
curl "http://localhost:3001/api/sms-test?action=http&phone=771234567"

# Should see: "success": true
```

---

## ✅ If That Doesn't Work

Try using the **new SMS service** (has better error handling):

```bash
# Backup old version
mv lib/sms.ts lib/sms-old.ts

# Use new version
mv lib/sms-new.ts lib/sms.ts

# Restart
npm run dev

# Test again
curl "http://localhost:3001/api/sms-test?action=http&phone=771234567"
```

---

## 📊 What to Check on Text.lk

Before placing an order, make sure:

1. **Account is Active** ✅
   - Not suspended or blocked

2. **You Have Credits** ✅
   - Should show a number (like 500 credits remaining)
   - Each SMS = 1 credit
   - If 0 credits, buy more

3. **API Key is Valid** ✅
   - Get it from Settings/API
   - Looks like: `2806|XXXXXXXXXXXX` (includes numbers, letters, pipe)

---

## 🧪 After Fixing - Test This

### 1. Check API Works
```bash
curl "http://localhost:3001/api/sms-test?action=http&phone=771234567"
```

**Should return:**
```json
{
  "success": true,
  "response": "1"
}
```

### 2. Place Test Order (via curl)
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

**Should see in console:**
```
✓ Order created successfully: order-123
✓ Order confirmation SMS sent to 771234567
✓ Admin notification SMS sent
```

### 3. Check Your Phone (771234567)
You should receive:
```
"Order Confirmed! Hi Test User, your Lifting Social order #... is confirmed."
```

---

## 📞 Still Not Working?

### Check These

1. **Is Text.lk account active?**
   - Go to https://app.text.lk/ and login
   - Should show account dashboard

2. **Do you have API credits?**
   - Wallet/Balance should show a number > 0
   - If 0, you need to buy credits

3. **Is the API key correct?**
   - Must be full key: `2806|....` (has the pipe `|`)
   - Get from Settings → API in Text.lk

4. **Is .env.local saved?**
   - After editing, make sure you saved the file
   - Dev server should be restarted

---

## 📋 Copying API Key - Step by Step

1. **Login to Text.lk**
   ```
   https://app.text.lk/
   Username: (your email)
   Password: (your password)
   ```

2. **Find API Key**
   - Look for: Settings, API, Developers, or Account
   - You should see your API key displayed
   - Example format: `2806|78hrnBSzMyn4S7bbzGfzw...`

3. **Copy the ENTIRE key**
   - Select all (Ctrl+A or Cmd+A)
   - Copy (Ctrl+C or Cmd+C)

4. **Paste in .env.local**
   ```
   TEXTLK_API_KEY=PASTE_HERE
   ```

5. **Make sure it looks like this:**
   ```
   TEXTLK_API_KEY=2806|78hrnBSzMyn4S7bbzGfzwILQkehWtiQbUQeI4keG65bf1095
   ```
   (Note: Has `2806|` at the start, contains letters and numbers)

---

## Next Steps

1. Get correct API key from Text.lk
2. Update .env.local
3. Restart dev server
4. Test the endpoint
5. Place test order
6. Check phone for SMS

**Questions?** See [SMS_TROUBLESHOOTING.md](SMS_TROUBLESHOOTING.md) for detailed guide
