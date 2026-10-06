#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', msg);
  } else {
    console.log('ok  ', msg);
  }
}

const page = readFileSync(join(root, 'klubi/index.html'), 'utf8');
const publicPage = readFileSync(join(root, 'public/klubi/index.html'), 'utf8');
const vercel = readFileSync(join(root, 'vercel.json'), 'utf8');

assert(page === publicPage, 'public/klubi mirrors root page');
assert(page.includes('Hengittävien äitien klubi'), 'page title/heading kept');
assert(page.includes('Yhteisö ja matkasi kohti nautinnollisempaa äitiyttä. Klubi starttaa sunnuntaina 18.10.'), 'hero subtitle verbatim');
assert(page.includes('Jos syysloma vei viimeisetkin voimat, tule mukaan. Täällä saa hengittää.'), 'hero closer verbatim');
assert(page.includes('Klubi on sinun yhteisösi ja tukipilarisi.'), 'what-it-is opener verbatim');
assert(page.includes('[kellonaika]'), 'meetup time placeholder kept');
assert(page.includes('[hinta]'), 'meetup price placeholders kept');
assert(page.includes('[määrä]'), 'meetup capacity placeholder kept');
assert(page.includes('data-todo="klubi-checkout-founder"'), 'founder checkout placeholder marked');
assert(page.includes('data-todo="klubi-checkout-regular"'), 'regular checkout placeholder marked');
assert(page.includes('data-todo="klubi-plus-checkout"'), 'PLUS checkout placeholder marked');
assert(page.includes('data-todo="hotelli-valo-tickets"'), 'Valo ticket placeholder marked');
assert(page.includes("FOUNDER_ENDS: '2026-11-02T00:00:00+02:00'"), 'founder switch date is Mon 2.11. Helsinki');
assert(page.includes("MEETUP_HIDES: '2026-11-30T00:00:00+02:00'"), 'meetup hides after 29.11.');
assert(page.includes('family=EB+Garamond') && page.includes('family=Karla'), 'EB Garamond + Karla loaded');
assert(page.includes('og:title'), 'Open Graph title present');
assert(page.includes('og:description'), 'Open Graph description present');
assert(page.includes('og:image'), 'Open Graph image present');
assert(page.includes('https://hengittava-aiti.fi/klubi/'), 'canonical / og:url point at /klubi/');
assert(!/buy\.stripe\.com/.test(page), 'no live Stripe checkout wired');
assert(vercel.includes('"/klubi/?"'), 'vercel.json routes /klubi/');
assert(page.includes('Liity PLUS-jäseneksi'), 'PLUS button label kept');
assert(page.includes('Varaa paikkasi'), 'meetup button label kept');
assert((page.match(/Liity klubiin/g) || []).length >= 3, 'club join buttons present');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall klubi checks passed');
