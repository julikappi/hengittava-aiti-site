#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const handler = require(join(root, 'api/kun-huusit.js'));

const FORM_ID = 'KwdnBPweNizsuCijX5sr';
const LOCATION_ID = 'l3cu8ZF9ixwviG2oTLGF';
const WRONG_ID = 'I3cu8ZF9ixvviG2oTLGF';
const THANKS = '/kiitos/kun-huusit/';

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', msg);
  } else {
    console.log('ok  ', msg);
  }
}

const page = readFileSync(join(root, 'kun-huusit/index.html'), 'utf8');
const publicPage = readFileSync(join(root, 'public/kun-huusit/index.html'), 'utf8');
const apiSrc = readFileSync(join(root, 'api/kun-huusit.js'), 'utf8');
const viikko = readFileSync(join(root, 'vercel.json'), 'utf8');

assert(page === publicPage, 'public/kun-huusit mirrors root page');
assert(page.includes(LOCATION_ID), 'page uses dashboard location id');
assert(apiSrc.includes(LOCATION_ID), 'api uses dashboard location id');
assert(!page.includes(WRONG_ID), 'page does not use the I/ixvvi location id');
assert(!apiSrc.includes(WRONG_ID), 'api does not contain the I/ixvvi location id');
assert(handler.LOCATION_ID === LOCATION_ID, 'handler.LOCATION_ID is the dashboard id');
assert(handler.SUBMIT_URL.includes(LOCATION_ID), 'submit URL includes dashboard location id');
assert(!handler.SUBMIT_URL.includes(WRONG_ID), 'submit URL does not include the wrong id');
assert(handler.FORM_ID === FORM_ID, 'form id is KwdnBPweNizsuCijX5sr');
assert(page.includes(FORM_ID), 'page posts to form KwdnBPweNizsuCijX5sr');
assert(page.includes('Lähetä miniopas minulle'), 'button text unchanged');
assert(page.includes('--cream: #FBF7F1'), 'warm cream card kept');
assert(!page.includes('ghl-submit'), 'hidden iframe fallback removed');
assert(!page.includes('crossOrigin'), 'cross-origin iframe is not treated as success');
assert(!page.includes('mailerlite'), 'no MailerLite');
assert(page.includes("THANKS = '" + THANKS + "'"), 'success still goes to /kiitos/kun-huusit/');
assert(page.includes('json.fingerprint || json.contactId'), 'thank-you requires GHL fingerprint or contactId');
assert(viikko.includes('sites.leadconnectorhq.com/preview/uq6JC6cu8w0iri3DmvfS'), 'Viikko 1 funnel redirect untouched');

assert(handler.isAccepted(200, { fingerprint: 'fp_1' }) === true, 'fingerprint is accepted');
assert(handler.isAccepted(200, { contactId: 'ct_1' }) === true, 'contactId is accepted');
assert(handler.isAccepted(200, { status: true }) === false, 'status true without fingerprint is not accepted');
assert(handler.isAccepted(200, { error: false }) === false, 'empty 200 body is not accepted');
assert(handler.isAccepted(403, { fingerprint: 'fp_1' }) === false, 'non-2xx is not accepted');
assert(handler.isAccepted(200, null) === false, 'Cloudflare HTML / non-JSON is not accepted');

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(key, value) {
      this.headers[key] = value;
    },
    end(chunk) {
      this.body = chunk || '';
    },
  };
}

async function call(body, fetchImpl, method = 'POST') {
  const req = { method, body };
  const res = mockRes();
  await handler(req, res, fetchImpl);
  return { status: res.statusCode, json: JSON.parse(res.body || '{}') };
}

const captured = [];
const okFetch = async (url, opts) => {
  captured.push({ url, opts });
  return {
    status: 200,
    text: async () => JSON.stringify({ fingerprint: 'fp_test', contactId: 'ct_test' }),
  };
};

const htmlFetch = async () => ({
  status: 403,
  text: async () => '<title>Attention Required! | Cloudflare</title>',
});

{
  const result = await call({ email: 'test@example.com', first_name: 'Testi' }, okFetch);
  assert(result.status === 200 && result.json.ok === true, 'handler returns 200 when GHL sends fingerprint');
  assert(result.json.fingerprint === 'fp_test', 'handler forwards fingerprint');
  assert(captured[0] && captured[0].url.includes(LOCATION_ID), 'outbound GHL URL uses dashboard location id');
  assert(captured[0] && !captured[0].url.includes(WRONG_ID), 'outbound GHL URL does not use the wrong id');
  const formData = captured[0].opts.body;
  const serialized = formData.get('formData');
  assert(serialized.includes(LOCATION_ID), 'formData JSON uses dashboard location id');
  assert(serialized.includes(FORM_ID), 'formData JSON uses form KwdnBPweNizsuCijX5sr');
  assert(formData.get('locationId') === LOCATION_ID, 'multipart locationId is the dashboard id');
}

{
  const result = await call({ email: 'test@example.com' }, htmlFetch);
  assert(result.status === 502 && result.json.error === true, 'Cloudflare HTML is treated as failure');
}

{
  const result = await call({ email: 'not-an-email' }, okFetch);
  assert(result.status === 400, 'invalid email is rejected before GHL');
}

{
  const result = await call({}, okFetch, 'GET');
  assert(result.status === 405, 'GET is not allowed');
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
