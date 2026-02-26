import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Test endpoint to verify PayHere hash generation
 * Remove this after testing
 */
export async function POST(request: NextRequest) {
  try {
    const { merchantId, orderId, amount, currency } = await request.json();

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantSecret) {
      return NextResponse.json({ error: 'Secret not configured' }, { status: 500 });
    }

    // Try both versions: base64 and plain
    const hashedSecretBase64 = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const decodedSecret = Buffer.from(merchantSecret, 'base64').toString('utf-8');
    const hashedSecretDecoded = crypto
      .createHash('md5')
      .update(decodedSecret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2);

    // Hash with base64 secret
    const hashString1 = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecretBase64}`;
    const hash1 = crypto
      .createHash('md5')
      .update(hashString1)
      .digest('hex')
      .toUpperCase();

    // Hash with decoded secret
    const hashString2 = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecretDecoded}`;
    const hash2 = crypto
      .createHash('md5')
      .update(hashString2)
      .digest('hex')
      .toUpperCase();

    return NextResponse.json({
      merchantId,
      orderId,
      amount: amountFormatted,
      currency,
      secretType: {
        base64: merchantSecret,
        decoded: decodedSecret,
      },
      hashes: {
        withBase64Secret: {
          hashedSecret: hashedSecretBase64,
          hashString: hashString1,
          hash: hash1,
        },
        withDecodedSecret: {
          hashedSecret: hashedSecretDecoded,
          hashString: hashString2,
          hash: hash2,
        },
      },
      testUrl: `https://www.payhere.lk/pay/checkout?hash=${hash1}&merchant_id=${merchantId}&order_id=${orderId}&amount=${amountFormatted}&currency=${currency}`,
    });
  } catch (error) {
    console.error('Hash test error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
