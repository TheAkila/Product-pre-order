#!/bin/bash

# SMS Troubleshooting Diagnostic Script
echo "🔍 SMS System Diagnostic Report"
echo "================================"
echo ""

# Check 1: Environment Variables
echo "1️⃣  CHECKING ENVIRONMENT VARIABLES..."
echo ""

if grep -q "TEXTLK_API_KEY" .env.local; then
    API_KEY=$(grep "TEXTLK_API_KEY=" .env.local | cut -d'=' -f2)
    if [ -z "$API_KEY" ]; then
        echo "❌ TEXTLK_API_KEY is empty"
    else
        echo "✅ TEXTLK_API_KEY is set: $(echo $API_KEY | cut -c1-30)..."
    fi
else
    echo "❌ TEXTLK_API_KEY not found in .env.local"
fi

echo ""

if grep -q "TEXTLK_SENDER_ID" .env.local; then
    SENDER=$(grep "TEXTLK_SENDER_ID=" .env.local | cut -d'=' -f2)
    echo "✅ TEXTLK_SENDER_ID is set: $SENDER"
else
    echo "❌ TEXTLK_SENDER_ID not found"
fi

echo ""

if grep -q "TEXTLK_ADMIN_PHONE" .env.local; then
    ADMIN=$(grep "TEXTLK_ADMIN_PHONE=" .env.local | cut -d'=' -f2)
    echo "✅ TEXTLK_ADMIN_PHONE is set: $ADMIN"
else
    echo "❌ TEXTLK_ADMIN_PHONE not found"
fi

echo ""

# Check 2: SMS Service Files
echo "2️⃣  CHECKING SMS SERVICE FILES..."
echo ""

if [ -f "lib/sms.ts" ]; then
    echo "✅ lib/sms.ts exists (Old SMS service)"
else
    echo "❌ lib/sms.ts not found"
fi

if [ -f "lib/sms-new.ts" ]; then
    echo "✅ lib/sms-new.ts exists (New SMS service with OAuth)"
else
    echo "❌ lib/sms-new.ts not found"
fi

echo ""

# Check 3: API Routes
echo "3️⃣  CHECKING API ROUTES..."
echo ""

if [ -f "app/api/orders/route.ts" ]; then
    echo "✅ /api/orders route exists"
    if grep -q "sendOrderConfirmationSMS" "app/api/orders/route.ts"; then
        echo "   - Calls sendOrderConfirmationSMS ✓"
    fi
    if grep -q "sendAdminOrderNotificationSMS" "app/api/orders/route.ts"; then
        echo "   - Calls sendAdminOrderNotificationSMS ✓"
    fi
else
    echo "❌ /api/orders route not found"
fi

echo ""

if [ -f "app/api/sms-test/route.ts" ]; then
    echo "✅ /api/sms-test route exists (Test endpoint)"
else
    echo "❌ /api/sms-test route not found"
fi

echo ""

# Check 4: Current import in orders route
echo "4️⃣  CHECKING WHICH SMS SERVICE IS BEING USED..."
echo ""

if grep -q "from '@/lib/sms'" "app/api/orders/route.ts"; then
    echo "📌 Using OLD SMS service: lib/sms.ts"
    echo "   To switch to new service:"
    echo "   1. Change import to: from '@/lib/sms-new'"
    echo "   OR"
    echo "   2. Run: mv lib/sms.ts lib/sms-old.ts && mv lib/sms-new.ts lib/sms.ts"
else
    echo "📌 Using custom SMS service"
fi

echo ""
echo "================================"
echo "Next steps:"
echo ""
echo "1. Check if SMS test endpoint works:"
echo "   curl 'http://localhost:3001/api/sms-test?action=http&phone=771234567'"
echo ""
echo "2. Check server logs for errors:"
echo "   npm run dev"
echo "   (Watch console for [SMS] messages)"
echo ""
echo "3. Verify Text.lk account:"
echo "   - Check at: https://app.text.lk/"
echo "   - Verify API key is correct"
echo "   - Check account has credits"
echo ""
