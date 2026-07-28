const { getSecret, getBaseUrl, redirect, json, verifyReturnSignature } = require('./_paytrail');

module.exports = async function handler(req, res) {
  const url = new URL(req.url, getBaseUrl(req));
  const secret = getSecret();
  const status = url.searchParams.get('status') || 'cancel';

  if (!secret) {
    return json(res, 500, { error: 'Paytrail configuration missing' });
  }

  const query = Object.fromEntries(url.searchParams.entries());
  const verified = verifyReturnSignature(secret, query);

  if (status === 'success' && verified) {
    return redirect(res, 303, '/kiitos/hermosto-reset-21/?payment=success');
  }

  if (status === 'success' && !verified) {
    return redirect(res, 303, '/hermosto-reset/?payment=unverified');
  }

  return redirect(res, 303, '/hermosto-reset/?payment=cancel');
};
