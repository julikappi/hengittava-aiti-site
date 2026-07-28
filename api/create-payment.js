const {
  PRODUCT,
  getMerchantId,
  getSecret,
  getBaseUrl,
  json,
  redirect,
  calculateSignature,
} = require('./_paytrail');

module.exports = async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const merchantId = getMerchantId();
  const secret = getSecret();
  if (!merchantId || !secret) {
    return json(res, 500, {
      error: 'Paytrail configuration missing',
      message: 'PAYTRAIL_MERCHANT_ID and PAYTRAIL_SECRET must be set in Vercel Environment Variables.',
    });
  }

  const baseUrl = getBaseUrl(req);
  const nonce = cryptoRandomId();
  const stamp = `hr21-${Date.now()}-${nonce.slice(0, 8)}`;
  const reference = `HR21-${Date.now()}`;

  const body = JSON.stringify({
    stamp,
    reference,
    amount: PRODUCT.amount,
    currency: 'EUR',
    language: 'FI',
    items: [
      {
        unitPrice: PRODUCT.amount,
        units: 1,
        vatPercentage: PRODUCT.vatPercentage,
        productCode: PRODUCT.productCode,
        description: PRODUCT.name,
      },
    ],
    customer: {},
    redirectUrls: {
      success: `${baseUrl}/api/paytrail-return?status=success`,
      cancel: `${baseUrl}/api/paytrail-return?status=cancel`,
    },
    callbackUrls: {
      success: `${baseUrl}/api/paytrail-callback?status=success`,
      cancel: `${baseUrl}/api/paytrail-callback?status=cancel`,
    },
  });

  const headers = {
    'checkout-account': merchantId,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
    'checkout-nonce': nonce,
    'checkout-timestamp': new Date().toISOString(),
    'content-type': 'application/json; charset=utf-8',
  };
  headers.signature = calculateSignature(secret, headers, body);

  const response = await fetch('https://services.paytrail.com/payments', {
    method: 'POST',
    headers,
    body,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    return json(res, response.status, {
      error: 'Paytrail payment creation failed',
      details: data,
    });
  }

  const paymentUrl = data.href || data.url;
  if (!paymentUrl) {
    return json(res, 502, {
      error: 'Paytrail did not return a payment URL',
      details: data,
    });
  }

  return redirect(res, 303, paymentUrl);
};

function cryptoRandomId() {
  return require('node:crypto').randomBytes(16).toString('hex');
}
