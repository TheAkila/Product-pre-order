# 📱 Text.lk SMS Setup Guide

## Step 1: Register for Text.lk

1. Go to: https://www.text.lk/
2. Click **"Sign Up"** (top right)
3. Fill in your details:
   - Full Name
   - Email
   - Mobile Number
   - Password
4. Verify your email address
5. Login to your account

## Step 2: Get Your API Credentials

1. After login, go to **Dashboard**
2. Click on **"API"** or **"Integration"** menu
3. Find your **Session ID** (this is your API key)
   - Format: Long alphanumeric string
   - Example: `1a2b3c4d5e6f7g8h9i0j...`
4. Copy this Session ID - you'll need it

## Step 3: Choose/Register Sender ID

1. In dashboard, go to **"Sender ID"** section
2. You can use:
   - **Default:** `Text.lk` (free)
   - **Custom:** Register your brand name
     - Example: `LiftingSoc` (max 11 characters)
     - Registration takes 1-2 days
     - One-time fee: ~LKR 5,000

**For now:** Use the default or register `LiftingSoc`

## Step 4: Add Credits to Your Account

1. Go to **"Recharge"** or **"Top Up"** in dashboard
2. Choose payment method:
   - Credit/Debit Card
   - Bank Transfer
   - Mobile Payment
3. Minimum top-up: LKR 500

**Pricing:**
- Local SMS: ~LKR 0.50 per message
- Lower rates for bulk (5000+ SMS)

**Recommended:**
- Start with LKR 1,000 (~2000 SMS)
- For 100 pre-orders: ~LKR 50

## Step 5: Add Credentials to Your App

### For Local Development:

Edit `.env.local`:
```env
TEXTLK_API_KEY=your_actual_session_id_here
TEXTLK_SENDER_ID=LiftingSoc
```

Replace:
- `your_actual_session_id_here` → Your Session ID from dashboard
- `LiftingSoc` → Your registered Sender ID (or use default)

### For Vercel Production:

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add these variables:
   ```
   TEXTLK_API_KEY = your_actual_session_id_here
   TEXTLK_SENDER_ID = LiftingSoc
   ```
4. Select: **Production, Preview, Development**
5. Save and **Redeploy**

## Step 6: Test SMS Sending

### Test via cURL (from terminal):

```bash
curl -X POST https://www.text.lk/api/v3/sms/send \
  -d "session_id=YOUR_SESSION_ID" \
  -d "to=771234567" \
  -d "from=LiftingSoc" \
  -d "message=Test from Lifting Social"
```

Replace:
- `YOUR_SESSION_ID` → Your actual Session ID
- `771234567` → Your phone number (without +94 or 0)
- `LiftingSoc` → Your Sender ID

**Expected Response:**
```json
{
  "status": "success",
  "message": "SMS sent successfully"
}
```

You should receive the SMS within seconds!

## Step 7: Verify Integration

1. Complete a test order on your site
2. Use PayHere sandbox to test payment
3. Check your phone for confirmation SMS
4. Check Vercel logs: `vercel logs`
5. Look for "SMS sent successfully"
6. Check Text.lk dashboard for SMS logs

## Phone Number Format

The system automatically handles these formats:
- `0771234567` → Converted to `771234567`
- `+94771234567` → Converted to `771234567`
- `771234567` → Used as is

**Text.lk requires:** Number without country code or leading zero

## SMS Message Templates

### Order Confirmation (Sent automatically after payment):
```
Order Confirmed! Hi [Name], your Lifting Social order #[ID] is confirmed. We'll notify you when it ships. Thanks!
```

**Example:**
```
Order Confirmed! Hi Akila, your Lifting Social order #2PEyyA12 is confirmed. We'll notify you when it ships. Thanks!
```

### Delivery Updates (Manual from admin):
- **Processing:** "Your order is being prepared..."
- **Shipped:** "Your order has been shipped..."
- **Delivered:** "Your tee has been delivered..."

## Troubleshooting

### SMS Not Sending?

**Check 1: Session ID is Correct**
- Copy entire Session ID from dashboard
- No extra spaces
- Check if it's active (not expired)

**Check 2: Account Balance**
- Login to Text.lk dashboard
- Check "Balance" or "Credits"
- Top up if balance is low

**Check 3: Phone Number Format**
- Must be Sri Lankan number
- System removes +94 and 0 automatically
- Format: 771234567 (9 digits)

**Check 4: Sender ID**
- If using custom Sender ID, ensure it's approved
- Default sender ID always works
- Case sensitive

**Check 5: Check Logs**
- Vercel logs: `vercel logs`
- Look for "SMS sent successfully" or errors
- Text.lk dashboard → SMS Logs

### Common Errors:

**"Invalid session_id"**
- Session ID is wrong or expired
- Copy from dashboard again

**"Insufficient balance"**
- Top up your account
- Check current balance

**"Invalid phone number"**
- Must be 9 digits (without 0 or +94)
- Example: 771234567

**"Sender ID not approved"**
- Use default sender ID
- Or wait for approval (1-2 days)

**"Message too long"**
- Single SMS = 160 characters
- Messages are auto-truncated

## Cost Estimate

For 100 pre-orders:
- 100 order confirmations: LKR 50
- 100 shipping notifications: LKR 50
- 100 delivery confirmations: LKR 50
- **Total: ~LKR 150 (less than $0.50 USD)**

## Character Limits

- **160 characters:** 1 SMS (LKR 0.50)
- **161-306 characters:** 2 SMS (LKR 1.00)
- **307-459 characters:** 3 SMS (LKR 1.50)

**Tip:** Keep messages under 160 characters!

## Support

**Text.lk Support:**
- Email: info@text.lk
- Phone: +94 11 7 989 989
- Live Chat: Available on website during business hours

**Your Integration:**
- Check Vercel logs for errors
- Test with your phone first
- Check Text.lk dashboard SMS logs

## API Documentation

Full API docs: https://www.text.lk/apidocumentation

## Quick Start Checklist

- [ ] Register at text.lk
- [ ] Get Session ID
- [ ] Choose Sender ID
- [ ] Top up LKR 1,000
- [ ] Add to `.env.local`
- [ ] Add to Vercel env vars
- [ ] Test with cURL
- [ ] Complete test order
- [ ] Verify SMS received
- [ ] Check logs
- [ ] Deploy to production

**Total setup time: ~10 minutes**
**Initial cost: LKR 1,000 (~$3 USD)**

---

## Advantages of Text.lk

✅ **Simple:** Just Session ID needed (no complex OAuth)
✅ **Cheap:** LKR 0.50 per SMS (cheaper than Dialog)
✅ **Fast:** Setup in 10 minutes
✅ **Reliable:** Established Sri Lankan service
✅ **Dashboard:** Easy to track all SMS
✅ **Support:** Local support team

🚀 Once configured, SMS notifications are fully automatic!
