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
  'hengahdys-kahvi-ikkunalla.jpg',
  'metsa-aurinko.jpg',
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

assert(page.includes('Kun arki vie kaiken tilan, myös äiti tarvitsee jonkun, joka kannattelee.'), 'hero subtitle verbatim');
assert(page.includes('Sinun ei tarvitse selvitä yksin.'), 'hero emphasis line verbatim');
assert(page.includes('starttaa syysloman jälkeen'), 'hero start after autumn holiday');
assert(page.includes('maanantaina 19.10.'), 'club opens Monday 19.10.');
assert(page.includes('Ensimmäinen klubin LIVE pidetään sunnuntaina 25.10.'), 'first live is Sunday 25.10.');
assert(page.includes('Maanantaina 19.10. saat ensimmäiset materiaalit sähköpostiisi.'), '19.10. first materials by email');
assert(!page.includes('18.10.'), 'no 18.10. left on the page');
assert(!page.includes('Ovet aukeavat'), 'old door-open line removed');
assert(!page.includes('Sinun ei tarvitse jaksaa kaikkea yksin.'), 'old hero breath removed');
assert(page.includes('Mikä on Hengittävien äitien klubi?'), 'intro heading restored');
assert(!page.includes('Näin klubi toimii'), 'how-it-works rename undone');
assert(
  page.includes('Hengittävien äitien klubi on yhteisö äideille, jotka haluavat voida paremmin keskellä tavallista arkea ja kasvaa omassa äitiydessään.'),
  'intro opening paragraph restored',
);
assert(
  page.includes('Opettelemme ymmärtämään hermoston toimintaa, tunnistamaan omia tarpeitamme ja löytämään keinoja palautua silloinkin, kun lapset tarvitsevat, puhelin soi ja oma aika tuntuu olevan aina viimeisenä.'),
  'intro hermosto paragraph restored',
);
assert(
  page.includes('Joka kuukausi keskitymme yhteen teemaan. Saat lyhyitä luentoja, käytännön harjoituksia ja pieniä tehtäviä, joita voit kokeilla omassa arjessasi. Sunnuntaisin kokoonnumme yhteiseen liveen, ja omassa kyläryhmässäsi saat jakaa kokemuksia muiden äitien kanssa.'),
  'intro monthly-theme paragraph restored',
);
assert(
  page.includes('Et tarvitse pitkiä vapaita hetkiä tai valmiita taitoja. Tarkoitus ei ole lisätä tekemistä kalenteriisi, vaan auttaa sinua löytämään uusia tapoja toimia ja voida paremmin sen elämän keskellä, jota jo elät.'),
  'intro no-extra-work paragraph restored',
);
assert(page.includes('Saat olla keskeneräinen ja samalla kasvaa. Sinun ei tarvitse pärjätä yksin.'), 'intro close restored in full');
assert(page.includes('hengahdys-kahvi-ikkunalla.jpg'), 'hero breathing-pause photo present');
assert(page.includes('metsa-aurinko.jpg'), 'intro uses Juliana’s sunlit forest photo');
assert(page.includes('photo--colour'), 'sunlit forest stays in colour');
assert(page.includes('Aurinko siivilöityy männikön läpi syksyisessä metsässä.'), 'sunlit forest has Finnish alt');
assert(!page.includes('aiti-ja-lapset-syysmetsa.jpg'), 'Pexels forest-path file unused');
assert(!page.includes('5533872'), 'Pexels 5533872 credit removed');
assert(page.includes('6968357'), 'hero photo credits Mikhail Nilov / Pexels');
assert(/Tuntuuko[\s\S]*hengahdys-kahvi-ikkunalla[\s\S]*Sinun ei tarvitse selvitä yksin/.test(page), 'pause photo sits before the hero emphasis line');
assert(/Saat olla keskeneräinen ja samalla kasvaa\.[\s\S]*metsa-aurinko/.test(page), 'sunlit forest sits after the keskeneräinen line');
assert(!/#h-rauha\s*\{/.test(page), 'no per-heading size shrink for rauha');
assert(!/h2[^{]*\{[^}]*font-size:[^}]*1\.05rem/.test(page), 'main h2s are not shrunk to 1.05rem');
assert(/h2\s*\{[^}]*font-size:\s*clamp\(1\.5rem,\s*5\.6vw,\s*2\.05rem\)/.test(page), 'all main white-label h2s share one size');
assert(!page.includes('Mitä se sitten on?'), 'is-this heading removed into the intro');
assert(
  page.includes('Paikka, jossa jokainen saa olla oma itsensä ja tulla kohdatuksi lämpimästi ja kunnioittavasti. Klubissa hoidetaan äidin hyvinvointia kokonaisuutena: naisena, äitinä ja osana perhettä.'),
  'former is-this paragraph kept verbatim in the intro',
);
assert(page.includes('Hyvinvoiva nainen ja äiti'), 'pillar 1 title verbatim');
assert(page.includes('Opimme ymmärtämään itseämme, tunteitamme ja hermostoamme sekä pitämään huolta omasta jaksamisestamme.'), 'pillar 1 text verbatim');
assert(page.includes('Kasvua äitiydessä'), 'pillar 2 title verbatim');
assert(page.includes('Löydämme uusia näkökulmia vanhemmuuteen ja keinoja tukea lastemme hyvinvointia.'), 'pillar 2 text verbatim');
assert(page.includes('Parempi tunnelma perheessäsi ja kotonasi'), 'pillar 3 title verbatim');
assert(page.includes('Kuljemme pienin askelin kohti arkea, jossa kaikkien on parempi olla, ilman uusia suorituspaineita.'), 'pillar 3 text verbatim');
assert((page.match(/<article class="pillar"/g) || []).length === 3, 'three what-the-club-is cards');
assert(
  /id="h-mikaon"[\s\S]*Paikka, jossa jokainen saa olla[\s\S]*Parempi tunnelma perheessäsi ja kotonasi[\s\S]*<\/section>/.test(page),
  'is-this copy and cards sit inside the intro section',
);
assert(page.includes('Mitä Hengittävien äitien klubi ei ole?'), 'not-this heading is a main white-label h2');
assert(page.includes('Klubi ei ole:'), 'not-this list lead-in verbatim');
assert(page.includes('paikka, jossa arvostellaan muita ja toimitaan'), 'not-list item 1 verbatim');
assert(page.includes('juorukerho'), 'not-list item 2 verbatim');
assert(page.includes('paikka, jossa jäädään pyörittelemään ongelmia'), 'not-list item 3 verbatim');
assert(page.includes('joogakerho'), 'not-list item 4 verbatim');
assert(page.includes('jumppakerho'), 'not-list item 5 verbatim');
assert(page.includes('yksi paikka, jossa suoritetaan lisää'), 'not-list item 6 verbatim with the added comma');
assert(page.includes('new age -yhteisö'), 'not-list item 7 verbatim');
assert(
  !page.includes('Se ei ole paikka, jossa arvostellaan muita tai jäädään yksin pyörittelemään arjen ongelmia.'),
  'old not-this paragraph removed',
);
assert(!page.includes('class="is-this"'), 'standalone is-this section removed');
assert(page.includes('Klubi on sinulle, jos'), 'recognition heading kept');
assert(page.includes('Oma rauhan keidas keskellä arkea'), 'community heading renamed');
assert(!page.includes('Keskellä kaikkea'), 'old community heading removed');
assert(page.includes('Mitä voit oppia klubissa?'), 'learn heading from brief');
assert((page.match(/<ul class="gives">[\s\S]*?<\/ul>/)[0].match(/<li>/g) || []).length === 8, 'learn list has 8 items');
assert(page.includes('Pienet harjoitukset eivät poista kaikkia arjen haasteita.'), 'no-miracle closing on learn list');
assert(page.includes('Hengittävä äiti ei ole äiti, joka ei koskaan hermostu tai väsy.'), 'hengittävä äiti reframed');
assert(page.includes('Lapsellesi turvaa ja parhaat muistot'), 'childhood-home heading verbatim');
assert(
  page.includes('Lapsesi parhaat muistot syntyvät lapsuuden kodissa – ja sinä luot sen tunnelman.'),
  'childhood-home lead verbatim',
);
assert(
  page.includes('Lapsuuden kodin tunnelma kulkee lapsen mukana pitkälle aikuisuuteen. Se, millaisena hän kokee kodin, läheisyyden ja turvan, luo pohjan sille, miten hän näkee itsensä, muut ihmiset ja maailman. Lapset aistivat kaiken, ja me haluamme olla heille paras mahdollinen malli. Täällä yhteisössä kuljemme kohti sitä keskeneräisinä ja epätäydellisinä, mutta selkeällä päämäärällä. Riittää, että haluat olla joka päivä vähän parempi äiti, ihminen ja puoliso. Yksi askel päivässä riittää.'),
  'childhood-home body verbatim',
);
assert(!page.includes('Sinun rauhasi tarttuu lapsiin'), 'old rauha heading removed');
assert(!page.includes('Hyvinvointisi on arvokasta myös sinun itsesi vuoksi'), 'old wellbeing line removed from this section');
assert(page.includes('Näin klubikuukausi kulkee'), 'month heading kept');
assert(
  page.includes('Joka kuukaudella on oma laajempi teema, jota harjoittelemme 4 viikkoa. Joka viikon maanantaina saat miniluennon ja pienen harjoituksen. Jokainen viikko käydään läpi yhdessä Zoom-livessä, jossa vastaan kysymyksiinne ja käymme aiheen läpi vielä yhdessä.'),
  'month rhythm paragraph verbatim',
);
assert(!page.includes('harjoittelemma'), 'harjoittelemma typo not present');
assert(!page.includes('Viikko 1:'), 'week-by-week breakdown removed');
assert(!page.includes('class="weeks"'), 'weeks list markup removed');
assert(page.includes('Kurssin alusta ja materiaalit'), 'platform subheading present');
assert(
  page.includes('Klubilla on oma kurssialusta. Sieltä löydät luennot, harjoitukset, tulostettavat PDF-tarkistuslistat ja livejen tallenteet. Samalla alustalla on keskustelutila, jossa voit jutella muiden äitien ja oman kyläryhmäsi kanssa.'),
  'platform paragraph gathers existing facts only',
);
assert(!page.includes('muut materiaalit'), 'vague other-materials phrase removed');
assert(
  !page.includes('Voit katsoa viikon materiaalin tai palata siihen myöhemmin, tulla liveen tai kuunnella tallenteen.'),
  'duplicate platform/recording sentence removed from anti-hustle',
);
assert(page.includes('Entä jos joku viikko jää väliin?'), 'missed-week FAQ question verbatim');
assert(
  page.includes('Ei haittaa. Voit tutustua materiaaleihin myöhemmin tai jättää ne väliin ja tulla mukaan kuluvaan viikkoon. Klubissa ei ole rästejä, sillä tärkeintä on, ettei tästä tule suoritusta.'),
  'missed-week FAQ answer verbatim',
);
assert(page.includes('Pysähtymisen taito'), 'November theme kept');
assert(page.includes('Riittävä joulu'), 'December theme kept');
assert(page.includes('Saat heti liittyessäsi'), 'immediate gifts heading kept');
assert(page.includes('sunnuntaina 25.10. klo 20'), 'intro evening date kept');
assert(page.includes('Täydenkuun syvän rentoutuksen äänitteen ja pienen yllätyksen'), 'October moon bonus is the recording plus a surprise');
assert(page.includes('/klubi/img/taysikuu-meri.jpg'), 'bonus uses distinct moon photo');
assert(page.includes('pexels.com/photo/view-of-a-full-moon-above-the-sea-25819968'), 'bonus photo credited');
assert(!page.includes('Hermosto Reset -käsikirjan'), 'handbook offer removed');
assert(page.includes('Tavataan Helsingissä'), 'Valo meetup heading without autumn');
assert(page.includes('Retriitti alkuvuodesta 2027. Hinnat ilmoitetaan pian. Varaa paikkasi jo nyt.'), 'Valo 2027 dates and prices verbatim');
assert(!page.includes('Syksyn kohokohta'), 'Valo autumn heading removed');
assert(!page.includes('Marraskuun viimeisenä viikonloppuna'), 'Valo November date removed');
assert(!page.includes('Klubilaiset saavat lipun etuhintaan'), 'old Valo member-price line removed');
assert(page.includes('Täällä ei suoriteta'), 'anti-hustle heading kept');
assert(page.includes('Kuka minä olen'), 'about heading kept');
assert(page.includes('kolmen lapsen äiti ja joogaopettaja'), 'Juliana bio kept');
assert(page.includes('Klubi 19 €/kk'), 'club price kept');
assert(page.includes('kun liityt lokakuussa.'), 'october price line kept');
assert(page.includes('Saat heti pääsyn klubiin.'), 'Klubi card grants access immediately');
assert(!page.includes('Ensimmäinen maksu kattaa marraskuun.'), 'calendar-month first-charge line removed');
assert(!page.includes('kalenterikuukauden'), 'payment does not cover a calendar month');
assert(!page.includes('ensimmäinen veloitus on 1.11.'), 'first charge is not on 1.11.');
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
  page.includes('Kyseessä on kuukausijäsenyys. Maksu veloitetaan kortilla liittyessäsi ja sen jälkeen automaattisesti kuukauden välein liittymispäivästä. Näet liittymiskuukautesi materiaalit ja kaikki tulevat kuukaudet.'),
  'payment FAQ is join-date monthly billing',
);
assert(
  page.includes('Kyllä. Jäsenyydessä ei ole sitoutumisaikaa. Voit perua jäsenyyden milloin vain viestillä osoitteeseen'),
  'cancel FAQ is anytime by email',
);
assert(
  page.includes('ja pääsy päättyy maksetun kuukauden lopussa.'),
  'cancel FAQ says access ends at the end of the paid month',
);
assert(
  page.includes('Kyllä. Voit pitää 1–3 kuukauden tauon pyytämällä sitä viestillä osoitteeseen'),
  'pause FAQ is 1–3 months by email, no billing during pause',
);
assert(page.includes('Tauon aikana sinua ei laskuteta.'), 'pause FAQ says no billing during pause');
assert(
  page.includes('Maksu veloitetaan liittyessä ja sen jälkeen automaattisesti kuukauden välein liittymispäivästä.'),
  'Ehdot block uses join-date billing',
);
assert(
  page.includes('Jäsenyyden voi perua milloin vain, ja pääsy päättyy maksetun kuukauden lopussa.'),
  'Ehdot cancel access-end',
);
assert(!page.includes('Maksettuja jäsenmaksuja ei palauteta.'), 'no-refund sentence is not on the sales page');
assert(page.includes('1–3 kuukauden tauon voi pitää pyynnöstä, ja tauon aikana ei laskuteta.'), 'Ehdot pause is on request');
assert((page.match(/hei@hengittava-aiti.fi/g) || []).length >= 2, 'cancel and pause FAQs use the contact email');
assert(page.includes('<h3>Ehdot</h3>'), 'Ehdot heading under prices');
assert(page.includes('Lue tarkemmin ehdoista'), 'Ehdot block links to terms page');
assert(!page.includes('class="pricing-note"'), 'old pricing-note is merged into Ehdot');
assert(!page.includes('class="price-terms"'), 'old price-terms is merged into Ehdot');
assert(page.includes('Voit osallistua liveen myös ilman kameraa.'), 'camera-off FAQ kept');
assert(!page.includes('[kellonaika]'), 'meetup time placeholder removed');
assert(!page.includes('[hinta]'), 'meetup price placeholders removed');
assert(!page.includes('Voit peroa'), 'FAQ cancel verb is perua, not typo peroa');
assert(!page.includes('—'), 'no em-dashes in the page');

assert(page.includes('#FBF7F1'), 'cream paper from the live site');
assert(page.includes('#2A2320'), 'ink token kept in the site palette');
assert(page.includes('#3B2A45'), 'plum from the live site');
assert(page.includes('#A8827A'), 'old rose / dawn from the live site');
assert(page.includes('#8A6A64'), 'dawn-700 fill for rose buttons');
assert(page.includes('#4A423E'), 'ink-soft body text');
assert(page.includes('#F0E6E3'), 'old-rose tint for the Klubi card');
assert(page.includes('#F8F3F1'), 'old-rose mist for the closing section');
assert(page.includes('#FFFFFF'), 'white heading labels');
assert(!page.includes('#F2C4A8'), 'peach accent removed');
assert(!page.includes('#FAF8F4'), 'off-brand cream removed');
assert(!page.includes('#3B2A4A'), 'off-brand violet removed');
assert(!page.includes('background: var(--ink)'), 'buttons are not ink/near-black');
assert(!page.includes('.tier--featured { background: var(--violet)'), 'Klubi card is not a dark plum block');
assert(!page.includes('.closing { background: var(--violet)'), 'closing is not a dark plum block');
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
assert(terms.includes('<h2>Jäsenyyden päättäminen</h2>'), 'terms page cancel heading');
assert(
  terms.includes('Jäsenyyden voi perua milloin vain viestillä osoitteeseen'),
  'terms page cancel by email',
);
assert(terms.includes('Pääsy päättyy maksetun kuukauden lopussa.'), 'terms page access-end');
assert(terms.includes('Maksettuja jäsenmaksuja ei palauteta.'), 'no-refund sentence lives on the terms page');
assert(terms.includes('Ehdot päivitetään tähän ennen klubin avautumista.'), 'terms page placeholder copy');
assert(terms.includes('href="/klubi/"'), 'terms page links back to /klubi/');
assert(/<meta name="robots" content="noindex/.test(terms), 'terms page is noindex');
assert(terms.includes('#A8827A'), 'terms page uses old rose');
assert(terms.includes('#FBF7F1'), 'terms page uses cream paper');
assert(terms.includes('#8A6A64'), 'terms page uses dawn-700 for rose fills');
assert(terms.includes('#4A423E'), 'terms page body is ink-soft');
assert(!terms.includes('#F2C4A8'), 'terms page peach removed');
assert(!terms.includes('#FAF8F4'), 'terms page off-brand cream removed');
assert(!terms.includes('background: var(--ink)'), 'terms buttons are not ink/near-black');

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
