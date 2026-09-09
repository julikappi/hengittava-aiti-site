#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const FORM_ID = 'KwdnBPweNizsuCIjX5sr';
const WRONG_FORM_ID = 'KwdnBPweNizsuCijX5sr';
const WIDGET_SRC = 'https://api.leadconnectorhq.com/widget/form/' + FORM_ID;
const THANKS = '/kiitos/kun-huusit/';
const WRONG_HOMEMADE = 'backend.leadconnectorhq.com/forms/submit';

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
const server = readFileSync(join(root, 'server.mjs'), 'utf8');
const viikko = readFileSync(join(root, 'vercel.json'), 'utf8');
const hermosto = readFileSync(join(root, 'hermosto-reset/index.html'), 'utf8');

assert(page === publicPage, 'public/kun-huusit mirrors root page');
assert(page.includes(WIDGET_SRC), 'page embeds official GHL widget URL');
assert(page.includes('data-form-id="' + FORM_ID + '"'), 'iframe data-form-id is KwdnBPweNizsuCIjX5sr');
assert(page.includes("var FORM_ID = '" + FORM_ID + "'"), 'JS FORM_ID is KwdnBPweNizsuCIjX5sr');
assert(!page.includes(WRONG_FORM_ID), 'lowercase-i typo id is gone from the page');
assert(!publicPage.includes(WRONG_FORM_ID), 'lowercase-i typo id is gone from public page');
assert(page.includes('https://link.msgsndr.com/js/form_embed.js'), 'page loads official form_embed.js');
assert(page.includes("THANKS = '" + THANKS + "'"), 'success still goes to /kiitos/kun-huusit/');
assert(page.includes("type !== 'msgsndr-form-submit'"), 'thank-you waits for GHL submit postMessage');
assert(page.includes('payload.fingerprint || payload.contactId'), 'thank-you requires fingerprint or contactId');
assert(page.includes("type === 'highlevel.setHeight' || type === 'set-sticky-contacts'"), 'height/sticky messages are not treated as success');
assert(!page.includes(WRONG_HOMEMADE), 'page does not homemade-post to forms/submit');
assert(!page.includes('/api/kun-huusit'), 'page does not use the homemade API proxy');
assert(!existsSync(join(root, 'api/kun-huusit.js')), 'homemade api/kun-huusit.js is deleted');
assert(!server.includes('/api/kun-huusit'), 'preview server does not route homemade submit');
assert(!page.includes('mailerlite'), 'no MailerLite');
assert(page.includes('--cream: #FBF7F1'), 'warm cream card kept');
assert(page.includes('Kun huusit taas'), 'Finnish heading kept');
assert(viikko.includes('sites.leadconnectorhq.com/preview/uq6JC6cu8w0iri3DmvfS'), 'Viikko 1 funnel redirect untouched');
assert(hermosto.includes('hermosto-reset'), 'Viikko 1 sales page file still present');

const widget = await fetch(WIDGET_SRC, {
  headers: { 'User-Agent': 'Mozilla/5.0 HengittavaAitiWidgetCheck' },
});
const widgetText = await widget.text();
const widgetHasForm = widget.ok && /type=["']email["']|name=["']email["']|Sähköposti/i.test(widgetText);
const widgetFailed = /Failed to get form data|Not found/i.test(widgetText);
console.log('widget http', widget.status, 'hasForm', widgetHasForm, 'failedBanner', widgetFailed);
assert(widget.status === 200, 'official widget URL returns HTTP 200');
assert(widgetHasForm, 'official widget HTML includes an email field');
assert(!widgetFailed, 'official widget does not return a GHL 404 banner');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall checks passed');
