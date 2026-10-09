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
const terms = readFileSync(join(root, 'klubi/ehdot/index.html'), 'utf8');
const publicTerms = readFileSync(join(root, 'public/klubi/ehdot/index.html'), 'utf8');
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
  'taysikuu-meri.jpg',
];

assert(page === publicPage, 'public/klubi mirrors root page');
assert(page.includes('lang="fi"'), 'html lang is fi');
assert(page.includes('<title>Hengittävien äitien klubi</title>'), 'title is Juliana’s');
assert(
  page.includes('Äitien oma pieni kylä keskellä arkea.'),
  'meta description taken from new hero copy',
);
assert(page.includes('Hengittävien äitien klubi'), 'club name kept');
assert(
  !/Hengittävien Äitien Klubi/.test(page.replace(/<title>[\s\S]*?<\/title>/, '')),
  'club name not title-cased in copy',
);

assert(page.includes('Ovet aukeavat 18.10. Ensimmäinen klubikuukausi alkaa 1.11.'), 'hero dates from brief');
assert(page.includes('Sinun ei tarvitse jaksaa kaikkea yksin.'), 'hero tagline from brief');
assert(!page.includes('syysloma'), 'autumn-holiday hook removed');
assert(page.includes('Mikä on Hengittävien äitien klubi?'), 'intro heading kept');
assert(page.includes('Saat olla keskeneräinen ja samalla kasvaa. Sinun ei tarvitse pärjätä yksin.'), 'intro close from brief');
assert(page.includes('Mitä Hengittävien äitien klubi ei ole?'), 'not-this heading verbatim');
assert(
  page.includes('Se ei ole paikka, jossa arvostellaan muita tai jäädään yksin pyörittelemään arjen ongelmia. Se ei myöskään ole joogakerho, jumpparyhmä tai tiettyyn maailmankatsomukseen sitoutunut yhteisö.'),
  'not-this paragraph verbatim',
);
assert(page.includes('Mitä se sitten on?'), 'is-this heading verbatim');
assert(
  page.includes('Paikka, jossa jokainen saa olla oma itsensä ja tulla kohdatuksi lämpimästi ja kunnioittavasti. Klubissa hoidetaan äidin hyvinvointia kokonaisuutena: naisena, äitinä ja osana perhettä.'),
  'is-this paragraph verbatim',
);
assert(page.includes('Hyvinvoiva nainen ja äiti'), 'pillar 1 title verbatim');
assert(page.includes('Opimme ymmärtämään itseämme, tunteitamme ja hermostoamme sekä pitämään huolta omasta jaksamisestamme.'), 'pillar 1 text verbatim');
assert(page.includes('Kasvua äitiydessä'), 'pillar 2 title verbatim');
assert(page.includes('Löydämme uusia näkökulmia vanhemmuuteen ja keinoja tukea lastemme hyvinvointia.'), 'pillar 2 text verbatim');
assert(page.includes('Parempi tunnelma perheessäsi ja kotonasi'), 'pillar 3 title verbatim');
assert(page.includes('Kuljemme pienin askelin kohti arkea, jossa kaikkien on parempi olla, ilman uusia suorituspaineita.'), 'pillar 3 text verbatim');
assert((page.match(/<article class="pillar"/g) || []).length === 3, 'three is-this cards');
assert(page.includes('Klubi on sinulle, jos'), 'recognition heading kept');
assert(page.includes('Keskellä kaikkea'), 'community heading kept');
assert(page.includes('Mitä voit oppia klubissa?'), 'learn heading from brief');
assert((page.match(/<ul class="gives">[\s\S]*?<\/ul>/)[0].match(/<li>/g) || []).length === 8, 'learn list has 8 items');
assert(page.includes('Pienet harjoitukset eivät poista kaikkia arjen haasteita.'), 'no-miracle closing on learn list');
assert(page.includes('Hengittävä äiti ei ole äiti, joka ei koskaan hermostu tai väsy.'), 'hengittävä äiti reframed');
assert(page.includes('Sinun rauhasi tarttuu lapsiin'), 'co-regulation heading kept');
assert(page.includes('Hyvinvointisi on arvokasta myös sinun itsesi vuoksi'), 'wellbeing for mother herself');
assert(page.includes('Näin klubikuukausi kulkee'), 'month heading kept');
assert(page.includes('Pysähtymisen taito'), 'November theme kept');
assert(page.includes('Riittävä joulu'), 'December theme kept');
assert(page.includes('Saat heti liittyessäsi'), 'immediate gifts heading kept');
assert(page.includes('sunnuntaina 25.10. klo 20'), 'intro evening date kept');
assert(page.includes('Täydenkuun syvän rentoutuksen äänitteen ja pienen yllätyksen'), 'October moon bonus is the recording plus a surprise');
assert(page.includes('/klubi/img/taysikuu-meri.jpg'), 'bonus uses distinct moon photo');
assert(page.includes('pexels.com/photo/view-of-a-full-moon-above-the-sea-25819968'), 'bonus photo credited');
assert(!page.includes('Hermosto Reset -käsikirjan'), 'handbook offer removed');
assert(page.includes('Syksyn kohokohta: tavataan Helsingissä'), 'Valo meetup heading kept');
assert(page.includes('Täällä ei suoriteta'), 'anti-hustle heading kept');
assert(page.includes('Kuka minä olen'), 'about heading kept');
assert(page.includes('kolmen lapsen äiti ja joogaopettaja'), 'Juliana bio kept');
assert(page.includes('Klubi 19 €/kk'), 'club price kept');
assert(page.includes('kun liityt lokakuussa.'), 'october price line kept');
assert(page.includes('Ensimmäinen maksu kattaa marraskuun.'), 'November coverage wording kept');
assert(page.includes('Klubi PLUS 89 €/kk'), 'PLUS price kept');
assert(page.includes('Jäsenmaksut tarkistetaan tarvittaessa kerran vuodessa.'), 'annual price-review term present');
assert(!page.includes('Klubi + Hengitystila'), 'Hengitystila tier removed');
assert(page.includes('Tulossa 2027: Hengittävä Koti'), '2027 heading kept');
assert(page.includes('Etkö ole vielä varma?'), 'soft-step heading kept');
assert(page.includes('Täysikuun nollaukseen maanantaina 26.10. klo 21.00'), 'nollaushetki date kept');
assert(page.includes('Tule mukaan Hengittävien äitien yhteisöön.'), 'closing lead from brief');
assert(page.includes('Voinko lopettaa jäsenyyden?'), 'cancel FAQ present');
assert(page.includes('Mitä PLUS-jäsenyys sisältää?'), 'PLUS FAQ present');
assert(
  page.includes('Kyseessä on kuukausijäsenyys. Veloitus tapahtuu automaattisesti kerran kuukaudessa. Lokakuussa liittyvien ensimmäinen veloitus on 1.11. Jokainen maksu kattaa kalenterikuukauden.'),
  'payment FAQ states monthly billing and 1.11. first charge',
);
assert(
  page.includes('Kyllä. Sitoutumisaikaa ei ole, ja jäsenyyden voi perua. <a href="/klubi/ehdot/">Katso tarkemmin ehdoista.</a>'),
  'cancel FAQ stays non-committal and points to terms',
);
assert(
  page.includes('Kyllä. Voit pitää 1–3 kuukauden tauon. <a href="/klubi/ehdot/">Katso tarkemmin ehdoista.</a>'),
  'pause FAQ stays non-committal and points to terms',
);
assert(page.includes('<h3>Ehdot</h3>'), 'Ehdot heading under prices');
assert(page.includes('Lue tarkemmin ehdoista'), 'Ehdot block links to terms page');
assert(!page.includes('class="pricing-note"'), 'old pricing-note is merged into Ehdot');
assert(!page.includes('class="price-terms"'), 'old price-terms is merged into Ehdot');
assert(page.includes('Voit osallistua liveen myös ilman kameraa.'), 'camera-off FAQ kept');
assert(!page.includes('[kellonaika]'), 'meetup time placeholder removed');
assert(!page.includes('[hinta]'), 'meetup price placeholders removed');
assert(!page.includes('Voit peroa'), 'FAQ cancel verb is perua, not typo peroa');
assert(!page.includes('—'), 'no em-dashes in the page');

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
assert(
  page.includes("klubi: 'https://link.fastpaydirect.com/payment-link/6ac7adab075ea22a20cdd237'"),
  'klubi 19 €/kk founder checkout in KLUBI.LINKS',
);
assert(
  page.includes("regular: 'https://link.fastpaydirect.com/payment-link/6ac7ae22075ea22a20cdd23b'"),
  'regular 25 €/kk stored as LINKS.regular',
);
assert(
  page.includes("plus: 'https://link.fastpaydirect.com/payment-link/6ac7ae4ec0e70c7fefb73499'"),
  'PLUS 89 €/kk checkout in KLUBI.LINKS',
);
assert(!page.includes('hengitystila'), 'Hengitystila LINKS entry removed');
assert(!page.includes("meetup: '#'"), 'Valo LINKS entry removed');
assert(!page.includes('data-klubi-link="regular"'), 'regular checkout is stored only, not wired');
assert((page.match(/data-klubi-link="klubi"/g) || []).length === 3, 'founder checkout on price card, closing CTA, sticky bar');
assert((page.match(/href="#hinta"/g) || []).length === 4, 'upper-page CTAs still scroll to #hinta');
assert(page.includes('Linkki: GHL-tilauslinkki (Stripe) Klubi 19 €/kk'), 'GHL comment kept for club checkout');
assert(vercel.includes('"/klubi/?"'), 'vercel.json routes /klubi/');
assert(vercel.includes('"/klubi/ehdot/?"'), 'vercel.json routes /klubi/ehdot/');
assert(terms === publicTerms, 'public/klubi/ehdot mirrors root terms page');
assert(terms.includes('<h1>Jäsenyysehdot</h1>'), 'terms page heading');
assert(terms.includes('Ehdot päivitetään tähän ennen klubin avautumista.'), 'terms page placeholder copy');
assert(terms.includes('href="/klubi/"'), 'terms page links back to /klubi/');
assert(/<meta name="robots" content="noindex/.test(terms), 'terms page is noindex');

assert((page.match(/Liity klubiin/g) || []).length >= 3, 'club join buttons present');
assert(page.includes('Liity PLUS-jäseneksi'), 'PLUS button label kept');
assert(page.includes('Ilmoittaudu Täysikuun nollaukseen'), 'full-moon button label kept');
assert((page.match(/<article class="tier/g) || []).length === 2, 'exactly two price cards');

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
