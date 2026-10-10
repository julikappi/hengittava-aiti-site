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
  'valo-kattoterassi.jpg',
];

assert(page === publicPage, 'public/klubi mirrors root page');
assert(page.includes('lang="fi"'), 'html lang is fi');
assert(page.includes('<title>Hengittävien äitien klubi</title>'), 'title is Juliana’s');
assert(page.includes('<meta name="robots" content="index,follow">'), 'sales page is indexable');
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
assert(page.includes('@media (min-width: 56.25rem)'), 'desktop reading layout starts at 900px');
assert(page.includes('.split'), 'desktop text+image split class present');
assert((page.match(/class="wrap split"/g) || []).length === 3, 'three natural text+image splits');
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
assert(page.includes('Retriitti – Hengähdystauko Hotelli Valossa'), 'Valo meetup heading verbatim');
assert(!page.includes('Tavataan Helsingissä'), 'old Valo Helsinki heading removed');
assert(page.includes('Retriitti alkuvuodesta 2027. Hinnat ilmoitetaan pian. Varaa paikkasi jo nyt.'), 'Valo 2027 dates and prices verbatim');
assert(page.includes('Päiväretriitti'), 'Valo day option heading');
assert(
  page.includes('Yksi pitkä ja perusteellinen kehollinen harjoitus, joka laskee kierroksia ja palauttaa sinut takaisin flow-tilaan.'),
  'Valo day option text verbatim',
);
assert(page.includes('Yli yön'), 'Valo overnight option heading');
assert(
  page.includes('Kaksi pitkää, perusteellisesti lataavaa harjoitusta, ravitsevaa ruokaa ja rentoutumista Hotelli Valon upealla spa-osastolla.'),
  'Valo overnight option text verbatim',
);
assert(!page.includes('Luvassa on luento, yhteinen harjoitus'), 'old Valo lecture paragraph removed');
assert(page.includes('data-form-id="0s8Zj7kjIA8LTWOoIAYA"'), 'day retreat GHL form id');
assert(page.includes('data-form-name="Retriitti Valo – päiväretriitti"'), 'day retreat GHL form name');
assert(page.includes('data-form-id="9DTL1P28Fcz7sgJMbC4S"'), 'overnight retreat GHL form id');
assert(page.includes('data-form-name="Retriitti Valo – yli yön"'), 'overnight retreat GHL form name');
assert((page.match(/link\.msgsndr\.com\/js\/form_embed\.js/g) || []).length === 1, 'GHL form_embed.js loaded once');
assert(
  !/<iframe[^>]*data-form-id="0s8Zj7kjIA8LTWOoIAYA"[^>]*loading="lazy"/.test(page) &&
    !/<iframe[^>]*data-form-id="9DTL1P28Fcz7sgJMbC4S"[^>]*loading="lazy"/.test(page),
  'Valo form iframes are not lazy-loaded so GHL can unhide them',
);
assert(page.includes('valo-kattoterassi.jpg'), 'Valo rooftop photo present');
assert(page.includes('Hotelli Valon kattoterassi, poreallas ja sauna aurinkoisena päivänä.'), 'Valo rooftop alt verbatim');
assert(
  /valo-kattoterassi\.jpg[^>]*photo--colour/.test(page) || /photo--colour[^>]*valo-kattoterassi\.jpg/.test(page),
  'Valo rooftop stays in colour',
);
assert(!page.includes('Syksyn kohokohta'), 'Valo autumn heading removed');
assert(!page.includes('Marraskuun viimeisenä viikonloppuna'), 'Valo November date removed');
assert(!page.includes('Klubilaiset saavat lipun etuhintaan'), 'old Valo member-price line removed');
assert(page.includes('Täällä ei suoriteta'), 'anti-hustle heading kept');
assert(page.includes('Kuka minä olen'), 'about heading kept');
assert(page.includes('kolmen lapsen äiti ja joogaopettaja'), 'Juliana bio kept');
assert(page.includes('Klubi 19 €/kk'), 'club price kept');
assert(
  page.includes('Liittymishinta 19 €/kk* on voimassa 31.10. asti. 1.11. alkaen hinta on 25 €/kk.'),
  'founder price until 31.10. then 25 €/kk, asterisk on 19 €',
);
assert(
  !page.includes('Hinta pysyy sinulla 19 eurossa niin kauan kuin jäsenyytesi jatkuu.'),
  'no as-long-as-membership-continues price promise',
);
assert(!page.includes('koko jäsenyytesi ajan'), 'no whole-membership price promise');
assert(!page.includes('niin kauan kuin jäsenyys jatkuu'), 'no while-membership-continues price promise');
assert(
  page.includes('*Liittymishintasi 19 €/kk on voimassa vähintään 31.10.2027 asti, kunhan tilauksesi jatkuu katkeamatta. Mahdollisista hinnanmuutoksista ilmoitetaan vähintään 30 päivää etukäteen.'),
  'approved 19 € footnote through 31.10.2027 with 30-day notice',
);
assert((page.match(/class="price-fn"/g) || []).length === 4, 'footnote on hero, price card, Ehdot block, and payment FAQ');
assert(page.includes('perustajahintaan – 19 € / kk 31.10. asti.'), 'hero names the 31.10. founder deadline');
assert(
  /Lokakuussa liittyville[\s\S]{0,40}19 €\/kk\*[\s\S]{0,20}ei sitoutumisaikaa\./.test(page),
  'hero names October price and no commitment',
);
assert(page.includes('<h2 id="h-hinta">Klubin hinta</h2>'), 'price section heading is Klubin hinta');
assert((page.match(/class="cta-band"/g) || []).length === 2, 'two mid-page CTA bands');
assert(
  (page.match(/Valmis hengittämään kevyemmin\?[\s\S]{0,40}19 €\/kk[\s\S]{0,20}lokakuussa\./g) || []).length === 2,
  'CTA bands share the October join line',
);
assert(page.includes('Lokakuussa liittyville'), 'hero October price lead present');
assert((page.match(/Kyllä, liityn/g) || []).length === 3, 'hero and two bands use Kyllä, liityn');
assert(!page.includes('<dialog'), 'no popup dialogs');
assert(!page.includes('class="modal'), 'no popup modals');
assert(!page.includes('kun liityt lokakuussa.'), 'old october-only price lead removed');
assert(!page.includes('ellei jäsenyys- tai hinnoitteluehtoihin'), 'old lock caveat removed from the card');
assert(!page.includes('uusien jäsenten hinta on 25 €/kk'), 'new-member-only 25 € wording replaced');
assert(!page.includes('Saat heti pääsyn klubiin'), 'immediate-access sentence removed from the price card');
assert(!page.includes('Ensimmäinen maksu kattaa marraskuun.'), 'calendar-month first-charge line removed');
assert(!page.includes('kalenterikuukauden'), 'payment does not cover a calendar month');
assert(!page.includes('ensimmäinen veloitus on 1.11.'), 'first charge is not on 1.11.');
assert(page.includes('Klubi PLUS 89 €/kk'), 'PLUS price kept');
assert(page.includes('Jäsenmaksut tarkistetaan tarvittaessa kerran vuodessa.'), 'annual price-review term present');
assert(!page.includes('Klubi + Hengitystila'), 'Hengitystila tier removed');
assert(page.includes('Tulossa 2027: Hengittävä Koti'), '2027 heading kept');
assert(page.includes('Etkö ole vielä varma?'), 'soft-step heading kept');
assert(page.includes('Täydenkuun nollaushetkeen maanantaina 26.10. klo 21.00'), 'nollaushetki date kept');
assert(page.includes('noin 30 minuutin harjoituksen Zoomissa'), 'nollaushetki duration is about 30 minutes');
assert(!page.includes('Täysikuun nollauk'), 'old Täysikuun nollaus name removed');
assert(!page.includes('20 min'), '20-minute duration removed from the club page');
assert(page.includes('Tule mukaan Hengittävien äitien yhteisöön.'), 'closing lead from brief');
assert(page.includes('Voinko lopettaa jäsenyyden?'), 'cancel FAQ present');
assert(page.includes('Mitä PLUS-jäsenyys sisältää?'), 'PLUS FAQ present');
assert(
  page.includes('Kyseessä on kuukausijäsenyys. Maksu veloitetaan kortilla liittyessäsi ja sen jälkeen automaattisesti kuukauden välein liittymispäivästä. Näet liittymiskuukautesi materiaalit ja kaikki tulevat kuukaudet.'),
  'payment FAQ is join-date monthly billing',
);
assert(
  (page.match(/Haluatko maksaa laskulla\? Laita viestiä osoitteeseen/g) || []).length === 2,
  'invoice-by-email line under price cards and in the payment FAQ',
);
assert(
  page.includes('class="invoice-note"') && page.includes('Haluatko maksaa laskulla?'),
  'invoice note sits under the price cards',
);
assert(!page.includes('3 kuukauden lasku'), 'no 3-month billing mention');
assert(!page.includes('laskutusjaksosta'), 'no extra invoice-period wording');
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

assert(page.includes('https://hengittava-aiti.fi/nollaushetki/'), 'nollaushetki CTA url');
assert(!page.includes('perjantain-nollaushetki'), 'old nollaushetki path removed from the club page');
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
assert((page.match(/href="#hinta"/g) || []).length === 6, 'upper-page CTAs still scroll to #hinta');
assert(
  (page.match(/href="https:\/\/link\.fastpaydirect\.com\/payment-link\/6ac7adab075ea22a20cdd237"/g) || []).length === 3,
  'founder checkout hrefs are the live FastPay URL, not #',
);
assert(
  (page.match(/href="https:\/\/link\.fastpaydirect\.com\/payment-link\/6ac7ae4ec0e70c7fefb73499"/g) || []).length === 1,
  'PLUS checkout href is the live FastPay URL, not #',
);
assert(!/<a[^>]*data-klubi-link="(?:klubi|plus)"[^>]*href="#">/.test(page), 'no checkout button left as href="#"');
assert(!/href="#(?!hinta)/.test(page), 'no leftover placeholder href="#"');
assert(vercel.includes('"/klubi/?"'), 'vercel.json routes /klubi/');
assert(vercel.includes('"/klubi/ehdot/?"'), 'vercel.json routes /klubi/ehdot/');
const home = readFileSync(join(root, 'index.html'), 'utf8');
const publicHome = readFileSync(join(root, 'public/index.html'), 'utf8');
const hermosto = readFileSync(join(root, 'hermosto-reset/index.html'), 'utf8');
assert(home === publicHome, 'public homepage mirrors root homepage');
assert(
  home.includes('<a class="nav-link hdr-fg-soft" href="/klubi/">Klubi</a>'),
  'homepage desktop nav links to /klubi/',
);
assert(
  home.includes('<a href="/klubi/" class="mobile-link">Klubi</a>'),
  'homepage mobile nav links to /klubi/',
);
assert(
  (home.match(/href="\/klubi\/">Klubi<\/a>/g) || []).length >= 3,
  'homepage footer also links to /klubi/',
);
assert(
  hermosto.includes('<a class="nav-link hdr-fg-soft" href="/klubi/">Klubi</a>'),
  'shared hermosto-reset nav links to /klubi/',
);
assert(terms === publicTerms, 'public/klubi/ehdot mirrors root terms page');
assert(terms.includes('<h1>Jäsenyysehdot</h1>'), 'terms page heading');
assert(terms.includes('Myyjä on ILO Wellness.'), 'terms page names the seller');
assert(!terms.includes('Maradevi Oy'), 'terms page no longer names Maradevi as seller');
assert(terms.includes('Hengittävien äitien klubi on kuukausijäsenyys.'), 'terms page names the product');
assert(terms.includes('<h2>Hinta</h2>'), 'terms page price heading');
assert(
  terms.includes('Liittymishinta 19 €/kk* on voimassa 31.10.2026 asti. 1.11.2026 alkaen hinta on 25 €/kk.'),
  'terms page founder price until 31.10.2026 then 25 €',
);
assert(terms.includes('Klubi PLUS 89 €/kk'), 'terms page PLUS price');
assert(terms.includes('45 minuutin henkilökohtaisen Zoom-kartoituksen'), 'terms page PLUS assessment');
assert(
  terms.includes('viikoittaisen henkilökohtaisen viestin Julianalta oman reflektiosi pohjalta'),
  'terms page PLUS uses the shortened weekly-message line',
);
assert(!terms.includes('kirjoitettu tai äänitetty'), 'terms page PLUS no longer names written or recorded replies');
assert(terms.includes('enintään 10'), 'terms page PLUS cap');
assert(
  !terms.includes('Hinta pysyy sinulla 19 eurossa niin kauan kuin jäsenyytesi jatkuu.'),
  'terms page has no as-long-as-membership-continues promise',
);
assert(!terms.includes('koko jäsenyytesi ajan'), 'terms page has no whole-membership price promise');
assert(
  terms.includes('*Liittymishintasi 19 €/kk on voimassa vähintään 31.10.2027 asti, kunhan tilauksesi jatkuu katkeamatta. Mahdollisista hinnanmuutoksista ilmoitetaan vähintään 30 päivää etukäteen.'),
  'terms page has the same approved 19 € footnote',
);
assert(terms.includes('kortilla, Apple Paylla tai Google Paylla (Stripe)'), 'terms page payment methods');
assert(terms.includes('kuukauden välein liittymispäivästä'), 'terms page join-date billing');
assert(
  terms.includes('Laskulla maksamisesta voi sopia erikseen viestillä osoitteeseen'),
  'terms page invoice-by-email under Maksaminen',
);
assert(!terms.includes('3 kuukauden lasku'), 'terms page has no 3-month billing');
assert(terms.includes('<h2>Jäsenyyden päättäminen</h2>'), 'terms page cancel heading');
assert(
  terms.includes('Jäsenyyden voi perua milloin vain viestillä osoitteeseen'),
  'terms page cancel by email',
);
assert(terms.includes('Pääsy päättyy maksetun kuukauden lopussa.'), 'terms page access-end');
assert(terms.includes('Maksettuja jäsenmaksuja ei palauteta'), 'no-refund sentence lives on the terms page');
assert(terms.includes('1–3 kuukauden tauon'), 'terms page pause');
assert(terms.includes('<h2>Materiaalit ja livet</h2>'), 'terms page materials heading');
assert(!terms.includes('Klubin alkaminen ja materiaalit'), 'old start-date heading removed');
assert(!terms.includes('19.10.2026'), 'terms page has no club start date');
assert(!terms.includes('25.10.2026'), 'terms page has no first live date');
assert(terms.includes('Saat materiaalit sähköpostiisi, ja sisältö on käytössäsi klubin alustalla.'), 'terms page materials by email and platform');
assert(terms.includes('Livet voidaan tallentaa.'), 'terms page lives may be recorded');
assert(terms.includes('ilman kameraa'), 'terms page camera may be off');
assert(terms.includes('menetät 14 päivän peruutusoikeuden'), 'terms page digital-content withdrawal waiver');
assert(terms.includes('kuluttajansuojalain mukaisesti'), 'terms page cites consumer protection law');
assert(terms.includes('henkilökohtaiseen käyttöön'), 'terms page personal use');
assert(terms.includes('Klubi ei ole terapiaa eikä terveydenhuoltoa.'), 'terms page not therapy');
assert(terms.includes('kunnioittavasti'), 'terms page respectful conduct');
assert(terms.includes('href="/tietosuoja/"'), 'terms page links to the site privacy policy');
assert(terms.includes('Ehtojen muutoksista ilmoitetaan etukäteen.'), 'terms page change notice');
assert(!terms.includes('Ehdot päivitetään tähän ennen klubin avautumista.'), 'terms placeholder removed');
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
assert(page.includes('Ilmoittaudu Täydenkuun nollaushetkeen'), 'full-moon button label kept');
assert(!page.includes('kirjoitettu tai äänitetty'), 'PLUS no longer names written or recorded replies');
assert(
  page.includes('viikoittainen henkilökohtainen viesti Julianalta oman reflektiosi pohjalta'),
  'PLUS card uses the shortened weekly-message line',
);
assert(
  page.includes('viikoittaisen henkilökohtaisen viestin Julianalta oman reflektiosi pohjalta'),
  'PLUS FAQ uses the shortened weekly-message line',
);
assert(!page.includes('min-height: 520px'), 'Valo form wrappers are not a fixed 520px tall');
assert(!page.includes('data-height="520"'), 'Valo iframes are not a fixed 520px tall');
assert(page.includes('.option-form {\n    position: relative;'), 'Valo form wrappers contain the absolutely positioned GHL iframe');
assert(page.includes('background: transparent'), 'Valo form wrappers are not a white box');
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
