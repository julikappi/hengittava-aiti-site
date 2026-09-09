const FORM_ID = 'KwdnBPweNizsuCijX5sr';
// GHL dashboard location id: lowercase L, then ixwvi (not uppercase I / ixvvi).
const LOCATION_ID = 'l3cu8ZF9ixwviG2oTLGF';
const SUBMIT_URL =
  `https://backend.leadconnectorhq.com/forms/submit?formId=${encodeURIComponent(FORM_ID)}` +
  `&locationId=${encodeURIComponent(LOCATION_ID)}`;
const LEGACY_SUBMIT_URL = 'https://backend.leadconnectorhq.com/appengine/form';

const GHL_HEADERS = {
  channel: 'APP',
  source: 'WEB_USER',
  version: '2021-04-15',
  timezone: 'Europe/Helsinki',
  Origin: 'https://api.leadconnectorhq.com',
  Referer: `https://api.leadconnectorhq.com/widget/form/${FORM_ID}`,
};

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

function jsonPayload(email, firstName) {
  const payload = {
    formId: FORM_ID,
    location_id: LOCATION_ID,
    email,
    eventData: { medium: 'form', mediumId: FORM_ID },
  };
  if (firstName) payload.first_name = firstName;
  return payload;
}

function ghlFormData(email, firstName) {
  const form = new FormData();
  form.set('formData', JSON.stringify(jsonPayload(email, firstName)));
  form.append('locationId', LOCATION_ID);
  form.append('formId', FORM_ID);
  return form;
}

function parseGhlBody(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isAccepted(status, parsed) {
  if (status < 200 || status >= 300) return false;
  if (!parsed || typeof parsed !== 'object') return false;
  if (parsed.error === true || parsed.status === false) return false;
  return Boolean(parsed.fingerprint || parsed.contactId);
}

async function readResult(response) {
  const text = await response.text();
  return { status: response.status, parsed: parseGhlBody(text), text };
}

async function postToGhl(email, firstName, fetchImpl) {
  const primary = await readResult(
    await fetchImpl(SUBMIT_URL, {
      method: 'POST',
      body: ghlFormData(email, firstName),
      headers: GHL_HEADERS,
    })
  );
  if (isAccepted(primary.status, primary.parsed)) return primary;

  const legacy = await readResult(
    await fetchImpl(LEGACY_SUBMIT_URL, {
      method: 'POST',
      headers: { ...GHL_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonPayload(email, firstName)),
    })
  );
  if (isAccepted(legacy.status, legacy.parsed)) return legacy;
  return primary.status === 403 && legacy.status ? legacy : primary;
}

async function handler(req, res, fetchImpl = fetch) {
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

  let result;
  try {
    result = await postToGhl(email, firstName, fetchImpl);
  } catch {
    return json(res, 502, { error: true, message: 'ghl unreachable' });
  }

  if (!isAccepted(result.status, result.parsed)) {
    return json(res, 502, {
      error: true,
      status: result.status,
      message: (result.parsed && (result.parsed.message || result.parsed.msg)) || 'ghl rejected',
    });
  }

  return json(res, 200, {
    ok: true,
    fingerprint: result.parsed.fingerprint || null,
    contactId: result.parsed.contactId || null,
  });
}

handler.FORM_ID = FORM_ID;
handler.LOCATION_ID = LOCATION_ID;
handler.SUBMIT_URL = SUBMIT_URL;
handler.LEGACY_SUBMIT_URL = LEGACY_SUBMIT_URL;
handler.isAccepted = isAccepted;

module.exports = handler;
