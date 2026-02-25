# SMS Integration Implementation Plan

## Summary

Your Lifting Social Pre-Order app now has **two SMS implementations**:

1. **Current (Existing)** - `lib/sms.ts` - Works, uses HTTP API only
2. **Enhanced (New)** - `lib/sms-new.ts` - OAuth 2.0 + HTTP fallback, with balance checking

## What's New ✨

### Previous Implementation (`lib/sms.ts`)
```
✓ Order confirmation SMS
✓ Admin notifications  
✓ Delivery status updates
✓ HTTP API integration
✗ No OAuth 2.0 support
✗ Can't check balance
✗ Can't track delivery reports
✗ Limited error handling
```

### New Implementation (`lib/sms-new.ts`)
```
✓ Order confirmation SMS
✓ Payment confirmation SMS (NEW)
✓ Admin notifications
✓ Delivery status updates
✓ HTTP API integration
✓ OAuth 2.0 API support (NEW)
✓ Check SMS balance (NEW)
✓ Track delivery reports (NEW)
✓ Enhanced error handling
✓ Better logging
✓ Automatic fallback (OAuth → HTTP)
```

## Implementation Plan

### Option A: Quick Migration (Recommended) ⚡

**Time Required:** 2 minutes

1. **Backup old version:**
   ```bash
   mv lib/sms.ts lib/sms-old.ts
   ```

2. **Use new version:**
   ```bash
   mv lib/sms-new.ts lib/sms.ts
   ```

3. **Update imports** (none needed - functions are the same!)

4. **Optional: Add payment SMS** to existing flows:
   ```typescript
   import { sendPaymentConfirmationSMS } from '@/lib/sms';
   
   // In PayHere webhook
   await sendPaymentConfirmationSMS(phone, orderId, name, amount);
   ```

5. **Test:**
   ```bash
   npm run dev
   curl "http://localhost:3002/api/sms-test?action=balance"
   ```

### Option B: Gradual Migration 🐢

**Time Required:** 30+ minutes (do over time)

1. **Keep both files for now**
   ```
   lib/sms.ts         (current)
   lib/sms-new.ts     (new - enhanced)
   ```

2. **In new code, use:**
   ```typescript
   import { ... } from '@/lib/sms-new';
   ```

3. **In existing code, keep using:**
   ```typescript
   import { ... } from '@/lib/sms';
   ```

4. **Gradually update imports as you refactor**

### Option C: Testing First 🧪

**Time Required:** 15 minutes

1. **Keep everything as-is for now**
   ```
   lib/sms.ts   (keeps working)
   lib/sms-new.ts   (available for testing)
   ```

2. **Test new version with test endpoint:**
   ```bash
   curl "http://localhost:3002/api/sms-test?action=balance"
   curl "http://localhost:3002/api/sms-test?action=oauth&phone=771234567"
   ```

3. **When confident, do Option A or B**

## Configuration Changes

### Updated `.env.local` ✅ (Already Done)

```env
# HTTP API (existing - works)
TEXTLK_API_KEY=2806|78hrnBSzMyn4S7bbzGfzwILQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE=https://app.text.lk/api/http

# OAuth 2.0 API (new - advanced features)
TEXTLK_API_TOKEN=2806|78hrnBSzMyn4S7bbzGfzwlLQkehWt1QbUQeI4keG65bf1095
TEXTLK_API_BASE_V3=https://app.text.lk/api/v3
TEXTLK_USE_OAUTH=true

# SMS Configuration (same)
TEXTLK_SENDER_ID=Lifting S
TEXTLK_ADMIN_PHONE=764829645
```

## Files Created

### Documentation
- ✅ `SMS_QUICK_START.md` - Start here! Copy-paste examples
- ✅ `SMS_INTEGRATION_GUIDE.md` - Complete API reference
- ✅ `SMS_MIGRATION_SUMMARY.md` - What changed and why
- ✅ `SMS_IMPLEMENTATION_PLAN.md` - This file

### Code
- ✅ `lib/sms-new.ts` - Enhanced SMS service (446 lines)
- ✅ `app/api/sms-test/route.ts` - Test endpoint for debugging

### Existing (No Changes)
- `lib/sms.ts` - Current version (still works)
- `app/api/orders/route.ts` - Order creation
- `app/api/payment/payhere/notify/route.ts` - Payment webhook
- `app/api/orders/[orderId]/delivery/route.ts` - Delivery updates

## Comparison: Old vs New

### Sending Order Confirmation
```typescript
// Old (still works)
await sendOrderConfirmationSMS(phone, orderId, name);
// Returns: Promise<SMSResponse>

// New (same function signature, more features)
await sendOrderConfirmationSMS(phone, orderId, name);
// Returns: Promise<SMSResponse> with messageId & credits
```

### New Capabilities
```typescript
// Check balance (new)
const balance = await checkSmsBalance();

// Track delivery (new)
const report = await getSmsDeliveryReport(messageId);

// Send payment confirmation (new)
await sendPaymentConfirmationSMS(phone, orderId, name, amount);
```

## Step-by-Step Migration

### Step 1: Understand What You Have
```bash
# Current implementation (HTTP API only)
cat lib/sms.ts | head -30

# New implementation (OAuth 2.0 + HTTP)
cat lib/sms-new.ts | head -30
```

### Step 2: Decide on Approach
- **Quick?** → Option A (2 min)
- **Careful?** → Option B (over time)
- **Testing?** → Option C (15 min)

### Step 3: Execute Migration
```bash
# Option A: Quick switch
mv lib/sms.ts lib/sms-old.ts
mv lib/sms-new.ts lib/sms.ts
npm run dev
```

### Step 4: Test Everything
```bash
# Test balance
curl "http://localhost:3002/api/sms-test?action=balance"

# Test HTTP API
curl "http://localhost:3002/api/sms-test?action=http&phone=771234567"

# Test OAuth API
curl "http://localhost:3002/api/sms-test?action=oauth&phone=771234567"

# Create test order and verify SMS
# Process test payment and verify SMS
# Update delivery and verify SMS
```

### Step 5: Deploy
```bash
npm run build
npm run deploy  # or your deployment method
```

## Rollback Plan

If something goes wrong:

```bash
# Restore old version
rm lib/sms.ts
mv lib/sms-old.ts lib/sms.ts
npm run dev

# Revert environment
# In .env.local, set TEXTLK_USE_OAUTH=false
```

## Benefits of Migration

✨ **Immediate Benefits:**
- Same code - no changes needed to existing files
- Better error messages
- More detailed logging
- Automatic fallback (OAuth → HTTP)

💪 **New Capabilities:**
- Check SMS balance via `/api/sms-test?action=balance`
- Track SMS delivery status
- Send payment confirmation SMS
- Better error handling and recovery

🚀 **Future Features:**
- Scheduled SMS
- Batch sending
- Message templates
- Advanced reporting

## FAQ

### Q: Do I need to change my existing code?
A: No! The new SMS service has the same function signatures. It's a drop-in replacement.

### Q: What if OAuth fails?
A: The system automatically falls back to HTTP API. You have redundancy!

### Q: Can I keep using the old version?
A: Yes! It still works. But we recommend upgrading for new features.

### Q: Do I need to enable OAuth?
A: Set `TEXTLK_USE_OAUTH=true` to use new features (balance, reports). If `false`, uses old HTTP API.

### Q: How do I know it's working?
A: Test with `/api/sms-test` endpoint. Check logs: `npm run dev` shows SMS status.

### Q: What if I don't have OAuth token?
A: The system falls back to HTTP API. OAuth features (balance, reports) won't work, but SMS sending still does.

## Checklist

### Pre-Migration
- [ ] Read `SMS_QUICK_START.md`
- [ ] Understand Option A/B/C differences
- [ ] Backup current `.env.local`
- [ ] Review current SMS implementation

### Migration
- [ ] Choose Option (A, B, or C)
- [ ] Execute migration steps
- [ ] Run `npm run build` - should succeed
- [ ] Run `npm run dev` - dev server starts

### Testing
- [ ] Test SMS send: `/api/sms-test?action=http`
- [ ] Test OAuth: `/api/sms-test?action=oauth`
- [ ] Test balance: `/api/sms-test?action=balance`
- [ ] Create test order → Verify SMS
- [ ] Process test payment → Verify SMS
- [ ] Update delivery → Verify SMS

### Post-Migration
- [ ] Review server logs for any errors
- [ ] Check Text.lk dashboard for activity
- [ ] Monitor first few real orders
- [ ] Delete backup files if confident

## Documentation Guide

| Document | Purpose | Time |
|----------|---------|------|
| `SMS_QUICK_START.md` | Copy-paste examples | 5 min |
| `SMS_INTEGRATION_GUIDE.md` | Complete API reference | 30 min |
| `SMS_MIGRATION_SUMMARY.md` | What changed, why, how | 15 min |
| `SMS_IMPLEMENTATION_PLAN.md` | This - step by step | 20 min |

## Support Resources

### Test During Development
- `/api/sms-test` endpoint - Test both APIs
- `npm run dev` - See console logs
- Check `.env.local` - Verify configuration

### Monitoring
- Text.lk Dashboard: https://app.text.lk/
- Server logs during `npm run dev`
- Browser DevTools Network tab (if calling from frontend)

### Troubleshooting
See `SMS_QUICK_START.md` → Troubleshooting section

## Timeline

- **Immediate (Now):** Choose Option A/B/C
- **Quick (< 5 min):** Set env variables ✅ (done)
- **Easy (2-30 min):** Execute migration
- **Quick (5 min):** Test endpoints
- **Standard (30 min):** Test full flow
- **Regular (ongoing):** Monitor production

## What You Get

After migration:

✅ Working SMS service (as before)
✅ OAuth 2.0 support (new)
✅ Balance checking (new)
✅ Delivery reports (new)
✅ Better error handling (new)
✅ Test endpoint (new)
✅ Comprehensive docs (new)
✅ Paid API features (new)
✅ Fallback redundancy (new)

## Next: Take Action! 🎯

1. **Decide:** Option A, B, or C?
2. **Read:** `SMS_QUICK_START.md`
3. **Execute:** Your chosen option
4. **Test:** Use `/api/sms-test`
5. **Deploy:** When confident

Questions? Check the docs or review logs!
