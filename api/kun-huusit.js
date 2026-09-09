const FORM_ID = 'KwdnBPweNizsuCijX5sr';
const LOCATION_ID = 'I3cu8ZF9ixvviG2oTLGF';
const SUBMIT_URL =
  `https://backend.leadconnectorhq.com/forms/submit?formId=${encodeURIComponent(FORM_ID)}` +
  `&locationId=${encodeURIComponent(LOCATION_ID)}`;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: true, message: 'Method not allowed' });
  }

  const body = await readBody(req);
  const email = String(body.email || '').trim();
  const firstName = String(body.first_name || '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(res, 400, { error: true, message: 'email required' });
  }

  const payload = {
    formId: FORM_ID,
    location_id: LOCATION_ID,
    email,
  };
  if (firstName) payload.first_name = firstName;

  const form = new FormData();
  form.set('formData', JSON.stringify(payload));
  form.append('locationId', LOCATION_ID);
  form.append('formId', FORM_ID);

  let ghl;
  try {
    ghl = await fetch(SUBMIT_URL, { method: 'POST', body: form });
  } catch {
    return json(res, 502, { error: true, message: 'ghl unreachable' });
  }

  const text = await ghl.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }

  const accepted =
    ghl.ok &&
    parsed &&
    parsed.error !== true &&
    parsed.status !== false &&
    (parsed.fingerprint || parsed.contactId || parsed.status === true || parsed.ok === true);

  if (!accepted) {
    return json(res, 502, {
      error: true,
      status: ghl.status,
      message: (parsed && (parsed.message || parsed.msg)) || 'ghl rejected',
    });
  }

  return json(res, 200, {
    ok: true,
    fingerprint: parsed.fingerprint || null,
    contactId: parsed.contactId || null,
  });
};
