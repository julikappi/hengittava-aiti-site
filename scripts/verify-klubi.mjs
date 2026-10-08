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
assert(page.includes('Hengittävien äitien klubi'), 'club name kept');
assert(!/Hengittävien Äitien Klubi/.test(page.replace(/<title>[\s\S]*?<\/title>/, '')), 'club name not title-cased in copy');
assert(page.includes('Klubi alkaa sunnuntaina 18.10.'), 'hero eyebrow verbatim');
assert(page.includes('Paikka, jossa sinäkin saat vihdoin hengittää. Viikoittaiset hengitys- ja kehoharjoitukset, jotka mahtuvat äidin arkeen, ja yhteisö, joka kantaa myös raskaina viikkoina.'), 'hero lead verbatim');
assert(page.includes('Kannatko sinäkin koko perhettä, mutta kukaan ei kanna sinua?'), 'pain heading verbatim');
assert(page.includes('Klubi on sinun yhteisösi ja tukipilarisi'), 'solution heading verbatim');
assert(page.includes('Sinun rauhasi tarttuu lapsiin'), 'co-regulation heading verbatim');
assert(page.includes('Näin klubiviikko kulkee'), 'week heading verbatim');
assert(page.includes('Saat heti liittyessäsi'), 'immediate gifts heading kept');
assert(page.includes('Sinäkin ansaitset hengähdyksen'), 'closing heading verbatim');
assert(page.includes('[kellonaika]'), 'meetup time placeholder kept');
assert(page.includes('[hinta]'), 'meetup price placeholders kept');
assert(page.includes('[määrä]'), 'meetup capacity placeholder kept');
assert(page.includes('[Paikkamerkki: tarkennus siitä, mitä GHL-yhteisössä'), 'community placeholder kept');
assert(page.includes('[Paikkamerkki: Julianan oma lause'), 'Juliana sentence placeholder kept');
assert(page.includes('MEMBER_QUOTE: \'\''), 'member quote empty by default');
assert(page.includes('data-todo="klubi-checkout-founder"'), 'founder checkout placeholder marked');
assert(page.includes('data-todo="klubi-checkout-regular"'), 'regular checkout placeholder marked');
assert(page.includes('data-todo="klubi-plus-checkout"'), 'PLUS checkout placeholder marked');
assert(page.includes('data-todo="hotelli-valo-tickets"'), 'Valo ticket placeholder marked');
assert(page.includes("FOUNDER_ENDS: '2026-11-02T00:00:00+02:00'"), 'founder switch date is Mon 2.11. Helsinki');
assert(page.includes("MEETUP_HIDES: '2026-11-30T00:00:00+02:00'"), 'meetup hides after 29.11.');
assert(page.includes('founder-countdown'), 'founder countdown present');
assert(page.includes('family=Playfair+Display'), 'Playfair Display loaded');
assert(page.includes('sticky-cta'), 'sticky mobile CTA present');
assert(page.includes('https://hengittava-aiti.fi/perjantain-nollaushetki/#ilmoittaudu'), 'nollaushetki CTA url');
assert(page.includes('26.10., 24.11., 22.1. ja 21.2.'), 'nollaushetki dates');
assert(page.includes('og:title'), 'Open Graph title present');
assert(page.includes('og:description'), 'Open Graph description present');
assert(page.includes('og:image'), 'Open Graph image present');
assert(page.includes('https://hengittava-aiti.fi/klubi/'), 'canonical / og:url point at /klubi/');
assert(!/buy\.stripe\.com/.test(page), 'no live Stripe checkout wired');
assert(!page.includes('—'), 'no em-dashes in the page');
assert(vercel.includes('"/klubi/?"'), 'vercel.json routes /klubi/');
assert(page.includes('Liity PLUS-jäseneksi'), 'PLUS button label kept');
assert(page.includes('Liity perustajahinnalla'), 'founder urgency button kept');
assert(page.includes('Varaa paikkasi'), 'meetup button label kept');
assert((page.match(/Liity klubiin/g) || []).length >= 3, 'club join buttons present');
assert(!page.includes('Voit peroa'), 'FAQ cancel verb is perua, not typo peroa');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall klubi checks passed');
