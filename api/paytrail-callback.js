const { getSecret, getBaseUrl, json, verifyReturnSignature } = require('./_paytrail');

module.exports = async function handler(req, res) {
  const url = new URL(req.url, getBaseUrl(req));
  const secret = getSecret();

  if (!secret) {
    return json(res, 500, { error: 'Paytrail configuration missing' });
  }

  const query = Object.fromEntries(url.searchParams.entries());
  const verified = verifyReturnSignature(secret, query);

  if (!verified) {
    return json(res, 400, { ok: false, error: 'Invalid Paytrail signature' });
  }

  return json(res, 200, {
    ok: true,
    status: url.searchParams.get('status') || null,
    transactionId: url.searchParams.get('checkout-transaction-id') || null,
    stamp: url.searchParams.get('checkout-stamp') || null,
  });
};
