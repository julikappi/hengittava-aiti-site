const crypto = require('node:crypto');

const PRODUCT = {
  name: 'Hermosto Reset — 21 päivää',
  description: 'Kohti levollisempaa arkea, rauhallisempaa vanhemmuutta ja vahvempaa sinua.',
  productCode: 'HR21',
  amount: 1900,
  vatPercentage: Number(process.env.PAYTRAIL_VAT_PERCENTAGE || '25.5'),
};

function getMerchantId() {
  return (process.env.PAYTRAIL_MERCHANT_ID || process.env.PAYTRAIL_ACCOUNT || '').trim();
}

function getSecret() {
  return (process.env.PAYTRAIL_SECRET || process.env.PAYTRAIL_SECRET_KEY || process.env.PAYTRAIL_MERCHANT_SECRET || '').trim();
}

function getBaseUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`.replace(/\/$/, '');
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function redirect(res, status, location) {
  res.statusCode = status;
  res.setHeader('location', location);
  res.end();
}

function hmac(secret, payload) {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

function calculateSignature(secret, headers, body = '') {
  const headerString = Object.keys(headers)
    .filter((key) => key.toLowerCase().startsWith('checkout-'))
    .sort()
    .map((key) => `${key}:${headers[key]}`)
    .join('\n');
  return hmac(secret, `${headerString}\n${body}`);
}

function calculateReturnSignature(secret, query) {
  const pairs = Object.entries(query)
    .filter(([key]) => key.toLowerCase().startsWith('checkout-') && key.toLowerCase() !== 'checkout-signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(',') : value}`);
  return hmac(secret, `${pairs.join('\n')}\n`);
}

function verifyReturnSignature(secret, query) {
  const given = query['checkout-signature'];
  if (!given || typeof given !== 'string') return false;
  const expected = calculateReturnSignature(secret, query);
  try {
    return crypto.timingSafeEqual(Buffer.from(given, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

module.exports = {
  PRODUCT,
  getMerchantId,
  getSecret,
  getBaseUrl,
  json,
  redirect,
  calculateSignature,
  verifyReturnSignature,
};
