#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
const imgDir = join(root, 'klubi/img');
const publicImgDir = join(root, 'public/klubi/img');

const requiredImages = [
  'juliana-keittio-esiliina.jpg',
  'klubi-sinulle-aiti-ja-tytar.jpg',
  'juliana-poyta-katse-sivulle.jpg',
  'hero-aiti-ja-lapsi-ikkunalla.jpg',
  'rauha-otsat-yhdessa.jpg',
  'juliana-kasi-leualla.jpg',
  'taysikuu-rajattu.jpg',
];

assert(page === publicPage, 'public/klubi mirrors root page');
assert(page.includes('lang="fi"'), 'html lang is fi');
assert(page.includes('<title>Hengittävien äitien klubi</title>'), 'title is Juliana’s');
assert(
  page.includes('Äitien oma pieni kylä keskellä kaikkea. Yhteisö ja tukipilari kohti nautinnollisempaa äitiyttä.'),
  'meta description taken from her copy',
);
assert(page.includes('Hengittävien äitien klubi'), 'club name kept');
assert(
  !/Hengittävien Äitien Klubi/.test(page.replace(/<title>[\s\S]*?<\/title>/, '')),
  'club name not title-cased in copy',
);

assert(
  page.includes('Ovet aukeavat sunnuntaina 18.10., ja ensimmäinen kuukausi alkaa 1.11.'),
  'hero dates verbatim',
);
assert(
  page.includes('Jos syysloma vei viimeisetkin voimat, tule mukaan. Täällä saa hengittää.'),
  'hero note verbatim',
);
assert(
  page.includes('Tuntuuko joskus siltä, että kaikki tarvitsevat sinua, mutta kukaan ei kysy, miten sinä voit?'),
  'breath line verbatim',
);
assert(page.includes('Klubi on sinulle, jos'), 'recognition heading verbatim');
assert(page.includes('Keskellä kaikkea'), 'community heading verbatim');
assert(page.includes('Mikä klubi on'), 'what-is heading verbatim');
assert(page.includes('Sinun rauhasi tarttuu lapsiin'), 'co-regulation heading verbatim');
assert(page.includes('Näin klubikuukausi kulkee'), 'month heading verbatim');
assert(page.includes('Saat heti liittyessäsi'), 'immediate gifts heading kept');
assert(page.includes('Syksyn kohokohta: tavataan Helsingissä'), 'Valo meetup heading kept');
assert(page.includes('Täällä ei suoriteta'), 'anti-hustle heading verbatim');
assert(page.includes('Kuka minä olen'), 'about heading verbatim');
assert(page.includes('Klubi 19 €/kk'), 'club price verbatim');
assert(page.includes('kun liityt lokakuussa.'), 'october price line verbatim');
assert(page.includes('Klubi PLUS 89 €/kk'), 'PLUS price verbatim');
assert(page.includes('Klubi + Hengitystila 249 €/kk'), 'Hengitystila price verbatim');
assert(page.includes('Etkö ole vielä varma?'), 'soft-step heading verbatim');
assert(page.includes('Mitä jos sinun ei tarvitsisi selvitä tästä kaikesta yksin?'), 'closing breath verbatim');
assert(page.includes('Tule Hengittävien äitien yhteisöön! Ilmoittautuminen alkaa 18.10.'), 'closing lead verbatim');
assert(page.includes('[kellonaika]'), 'meetup time placeholder kept');
assert(page.includes('[hinta]'), 'meetup price placeholders kept');
assert(page.includes('[määrä]'), 'meetup capacity placeholder kept');
assert(page.includes('Voit perua jäsenyyden itse.'), 'FAQ cancel verb is perua');
assert(!page.includes('Voit peroa'), 'FAQ cancel verb is perua, not typo peroa');

assert(page.includes('#FAF8F4'), 'paper colour kept');
assert(page.includes('#3B2A4A'), 'violet colour kept');
assert(page.includes('#F2C4A8'), 'peach colour kept');
assert(page.includes('sticky-cta'), 'sticky mobile CTA present');
assert(page.includes('id="hinta"'), 'price section id kept');
assert(page.includes('id="varma"'), 'full-moon section id kept');

assert(page.includes("font-family: 'Playfair Display'"), 'Playfair Display @font-face present');
assert((page.match(/@font-face/g) || []).length >= 4, 'embedded Playfair faces present');
assert(page.includes('data:font/woff2;base64,'), 'Playfair is embedded as woff2');
assert(page.includes('font-display: block'), 'font-display block avoids fallback flash');
assert(
  page.includes('html, body, button, input, select, textarea, summary, a, h1, h2, h3, p, li, span { font-family: var(--font) !important; }'),
  'all text forced onto Playfair',
);
assert(!page.includes('Georgia'), 'no Georgia fallback');
assert(!page.includes('Times New Roman'), 'no Times fallback');
assert(!page.includes('family=Playfair'), 'not loading Playfair from Google Fonts');
assert(!page.includes('Dancing Script'), 'no Dancing Script');
assert(!page.includes('EB Garamond'), 'no EB Garamond');
assert(!page.includes('Karla'), 'no Karla');
assert(!page.includes('tailwindcss.com'), 'page is standalone CSS, not Tailwind CDN');

assert(page.includes('https://hengittava-aiti.fi/perjantain-nollaushetki/#ilmoittaudu'), 'nollaushetki CTA url');
assert(page.includes('og:title'), 'Open Graph title present');
assert(page.includes('og:description'), 'Open Graph description present');
assert(page.includes('og:image'), 'Open Graph image present');
assert(page.includes('https://hengittava-aiti.fi/klubi/img/juliana-keittio-esiliina.jpg'), 'og:image uses a page photo');
assert(page.includes('https://hengittava-aiti.fi/klubi/'), 'canonical / og:url point at /klubi/');

assert(!/buy\.stripe\.com/.test(page), 'no live Stripe checkout wired');
assert(page.includes('var KLUBI'), 'KLUBI config object present');
assert(page.includes("klubi: '#'"), 'klubi checkout still a placeholder');
assert(page.includes("plus: '#'"), 'PLUS checkout still a placeholder');
assert(page.includes("hengitystila: '#'"), 'Hengitystila checkout still a placeholder');
assert(page.includes("meetup: '#'"), 'Valo tickets still a placeholder');
assert(page.includes('data-klubi-link="klubi"'), 'klubi checkout marked for later fill');
assert(page.includes('Linkki: GHL-tilauslinkki (Stripe) Klubi 19 €/kk'), 'GHL comment kept for club checkout');
assert(vercel.includes('"/klubi/?"'), 'vercel.json routes /klubi/');

assert((page.match(/Liity klubiin/g) || []).length >= 3, 'club join buttons present');
assert(page.includes('Liity PLUS-jäseneksi'), 'PLUS button label kept');
assert(page.includes('Liity Hengitystila-tasolle'), 'Hengitystila button label kept');
assert(page.includes('Varaa paikkasi'), 'meetup button label kept');
assert(page.includes('Ilmoittaudu Täysikuun nollaukseen'), 'full-moon button label kept');

assert(!page.includes('founder-countdown'), 'old founder countdown removed');
assert(!page.includes('FOUNDER_ENDS'), 'old founder-switch logic removed');
assert(!page.includes('MEETUP_HIDES'), 'old meetup-hide logic removed');
assert(!page.includes('klubi-standalone'), 'standalone reference file not inlined');
assert(!existsSync(join(root, 'klubi/klubi-standalone.html')), 'klubi-standalone.html not committed under klubi/');
assert(!existsSync(join(root, 'klubi-standalone.html')), 'klubi-standalone.html not committed at repo root');

for (const name of requiredImages) {
  assert(page.includes(`/klubi/img/${name}`), `page references /klubi/img/${name}`);
  assert(existsSync(join(imgDir, name)), `klubi/img/${name} exists`);
  assert(existsSync(join(publicImgDir, name)), `public/klubi/img/${name} exists`);
  const a = readFileSync(join(imgDir, name));
  const b = readFileSync(join(publicImgDir, name));
  assert(a.equals(b), `public/klubi/img/${name} mirrors root image`);
}
assert(!page.includes('src="img/'), 'image srcs are root-absolute for Vercel');
assert(
  readdirSync(imgDir).filter((n) => n.endsWith('.jpg')).length >= requiredImages.length,
  'jpg files copied into klubi/img',
);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nall klubi checks passed');
