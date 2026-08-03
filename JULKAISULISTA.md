# Hengittävä Äiti — mitä tarvitaan ennen julkaisua

Tarkistettu 3.8.2026 repon haarasta `change/ig-brand-alignment`.

## Lyhyt vastaus

Kaikki linkit sivustolla toimivat. Yksikään sähköposti ei lähde mistään, koska sivustolla ei ole
sähköpostijärjestelmää lainkaan. Lisäksi maksullinen PDF on kenen tahansa ladattavissa ilman maksua.

Alla on kaikki, mikä pitää tehdä. Jaoin ne neljään osaan sen mukaan, mitä tarvitsen sinulta ja
mitä voin tehdä itse.

---

## 0. Ensin: uusin versio ei ole livenä

Työskentelet haarassa `change/ig-brand-alignment`, jossa on kuusi committia enemmän kuin
`main`-haarassa. Vercel julkaisee `main`-haaran. Instagram-ruudukko, uusi hero ja kiitos-sivujen
yhtenäistetyt tekstit eivät siis vielä näy osoitteessa hengittava-aiti.fi.

Lisäksi `index.html`:ssä on committoimattomia muutoksia (kolme kuvaa vaihdettu `loading="eager"`:iin).

**Tarvitaan:** pull request haarasta `main`-haaraan, Vercelin preview-tarkistus ja merge.

---

## 1. Sähköpostit

### 1.1 Mikä puuttuu

Ilmaisen oppaan lomake `/opas/` lähettää etunimen ja sähköpostin GET-parametreina kiitos-sivulle ja
tallentaa ne selaimen `sessionStorage`en. Osoite ei päädy mihinkään järjestelmään. Kun kävijä
sulkee välilehden, tieto katoaa. Sähköpostilistaa ei siis ole kertynyt yhtään.

Kaupan puolella `api/create-payment.js` välittää sähköpostin Paytrailille maksutapahtumaa varten.
`api/paytrail-callback.js` tarkistaa allekirjoituksen ja palauttaa JSONin. Se ei tallenna tilausta,
ei luo kontaktia eikä lähetä mitään. Ostaja saa tuotteen vain siltä kiitos-sivulta, jolle hän
päätyy maksun jälkeen.

### 1.2 Mitä GoHighLevelissä pitää tehdä

Nämä teet sinä GHL:ssä. Tarvitsen lopputuloksena kaksi URL-osoitetta.

**a) Lähettävä domain kuntoon.** GHL:ssä Settings → Email Services → Dedicated Domain. Lisää
alidomain, esimerkiksi `mail.hengittava-aiti.fi`. GHL antaa SPF-, DKIM- ja DMARC-tietueet, jotka
lisätään hengittava-aiti.fi:n DNS-asetuksiin. Ilman tätä viestit menevät roskapostiin tai eivät
lähde ollenkaan.

Lähettäjäksi kannattaa laittaa `hei@hengittava-aiti.fi`, koska se osoite näkyy jo footerissa ja
ostoehdoissa.

**b) Workflow 1: ilmainen opas.** Trigger: Inbound Webhook. Toiminnot järjestyksessä:

1. Create/Update Contact (etunimi, sähköposti)
2. Add Tag: `ilmaisopas`
3. Send Email: opas latauslinkkinä
4. Halutessasi 3–5 viestin jatkosarja, joka johtaa 21 päivän oppaaseen

**c) Workflow 2: ostovahvistus.** Trigger: Inbound Webhook. Toiminnot:

1. Create/Update Contact
2. Add Tag: `hr21-ostaja`
3. Remove Tag: `ilmaisopas` (jotta ostaja ei saa enää myyntiviestejä samasta tuotteesta)
4. Send Email: tilausvahvistus ja latauslinkki

Tilausvahvistuksessa pitää lukea myyjä (Maradevi Oy, Y-tunnus 3323765-3), tuote, hinta 19 €,
sisältyvä alv 25,5 %, tilausnumero ja tieto peruutusoikeuden raukeamisesta. Etämyynnissä
vahvistus on annettava pysyvällä tavalla, ja sähköposti täyttää tämän.

**d) Kopioi molempien webhookien URL:t.** Ne ovat muotoa
`https://services.leadconnectorhq.com/hooks/<locationId>/webhook-trigger/<uuid>`.

### 1.3 Mitä koodiin tulee

Kun webhook-osoitteet ovat tiedossa, teen nämä:

**Uusi tiedosto `api/subscribe.js`.** Ottaa vastaan etunimen ja sähköpostin, välittää ne GHL:n
liidi-webhookiin ja ohjaa kävijän kiitos-sivulle. Webhook-URL pysyy palvelimella
ympäristömuuttujassa, joten se ei näy sivun lähdekoodissa.

**Muutos `/opas/`-lomakkeeseen.** `action` osoittamaan `/api/subscribe`, metodi POST. Nykyinen
`sessionStorage`-viritys ja kiitos-sivun uudelleenohjaus voivat jäädä varmistukseksi.

**Muutos `api/paytrail-callback.js`:ään.** Allekirjoituksen tarkistuksen jälkeen haetaan
Paytrailin Get payment -rajapinnasta maksuun liitetty sähköpostiosoite transaktiotunnuksella ja
lähetetään se ostowebhookiin. Osoitetta ei kannata välittää callback-URL:n parametrina, koska
Paytrail allekirjoittaa vain omat `checkout-`-alkuiset kenttänsä, jolloin lisätty parametri olisi
väärennettävissä.

**Ympäristömuuttujat Verceliin** (Settings → Environment Variables, kaikki kolme ympäristöä):

| Muuttuja | Arvo |
|---|---|
| `GHL_LEAD_WEBHOOK` | Workflow 1:n webhook-URL |
| `GHL_PURCHASE_WEBHOOK` | Workflow 2:n webhook-URL |
| `PAYTRAIL_MERCHANT_ID` | Paytrailin kauppiastunnus |
| `PAYTRAIL_SECRET` | Paytrailin salainen avain |
| `SITE_URL` | `https://hengittava-aiti.fi` |

Kaksi jälkimmäistä Paytrail-muuttujaa ovat pakollisia jo nyt. Ilman niitä `/api/create-payment`
palauttaa virheen 500 eikä kukaan pysty ostamaan.

---

## 2. Maksullinen PDF on tällä hetkellä ilmainen

`/materiaalit/Hermosto-Reset-21-paivaa.pdf` on tavallinen staattinen tiedosto. Kiitos-sivulla
`/kiitos/hermosto-reset-21/` ei ole minkäänlaista tarkistusta siitä, onko maksu tehty. Kuka
tahansa, joka arvaa tai löytää osoitteen, lataa 19 euron oppaan ilmaiseksi. Google indeksoi sen
myös, koska sivustolla ei ole robots.txt-tiedostoa.

Kaksi tapaa korjata:

**Vaihtoehto A, vähemmän koodia.** Siirrä maksullinen PDF GHL:n mediakirjastoon tai
Memberships-osioon ja poista se reposta. Ostovahvistus sisältää linkin sinne. Kiitos-sivulta
poistetaan suora latauslinkki ja tilalle tulee teksti, että opas tulee sähköpostiin.

**Vaihtoehto B, enemmän hallintaa.** PDF pois julkisesta kansiosta, tilalle
`/api/lataa?token=…`, joka tarkistaa HMAC-allekirjoitetun ja aikarajoitetun tunnisteen. Linkki
toimii esimerkiksi 72 tuntia ja on sidottu maksutapahtumaan.

Ilmainen viikko-opas voi jäädä nykyiselleen suoraksi latauslinkiksi.

---

## 3. Lakisääteiset puutteet kassalla

Nämä ovat pieniä muutoksia, mutta ne pitää tehdä ennen ensimmäistä maksua.

**Peruutusoikeuden raukeaminen.** Omat ostoehtosi sanovat: "Kassalla tulee näkyä tähän erillinen
hyväksyntä ennen tuotteen toimittamista." Sivulla `/kauppa/hermosto-reset/` ei ole tällaista
valintaruutua. Ilman sitä ostajalla säilyy 14 päivän peruutusoikeus, vaikka hän olisi jo ladannut
oppaan. Lisään pakollisen valintaruudun ennen maksunappia.

**Markkinointilupa oppaan lomakkeeseen.** Jos ilmaisen oppaan jättäneille lähetetään
myöhemmin myyntiviestejä, lomakkeessa pitää olla erillinen suostumus ja linkki
tietosuojaselosteeseen. Nyt kumpaakaan ei ole.

**Tietosuojaseloste.** Nykyinen teksti puhuu palveluntarjoajista yleisellä tasolla. Kun GHL
otetaan käyttöön, selosteeseen nimetään käsittelijät (Paytrail, GoHighLevel, Vercel) ja mainitaan
tietojen siirto EU:n ulkopuolelle, koska GHL on yhdysvaltalainen palvelu.

**Hinnan esitys.** Kassalla lukee 19 €. Varmista, että se on arvonlisäverollinen loppuhinta.
Koodissa alv-prosentti on 25,5.

---

## 4. Pienet korjaukset

`public/`-kansio on kopio juuresta, mutta kaksi PDF:ää eroaa juuren versioista. Ajetaan
README:ssä oleva rsync-komento ennen mergeä.

Kansiossa `materiaalit/` on tiedosto `Hermosto-Reset-7pv-Ilmaisopas.pdf`, johon ei viittaa
yksikään sivu. Se on todennäköisesti vanha versio viikko-oppaasta. Poistetaanko?

Sivustolta puuttuu robots.txt ja sitemap.xml. Robots.txt tarvitaan viimeistään siinä vaiheessa,
kun materiaalikansio halutaan pois hakutuloksista.

Etusivun sosiaalisen median jakokuva on suhteellinen polku `kuvat/IMG_6335.jpg`. Facebook ja
WhatsApp vaativat täyden osoitteen, joten jaettu linkki näkyy nyt ilman kuvaa. Muutetaan muotoon
`https://hengittava-aiti.fi/kuvat/IMG_6335.jpg`.

Footerissa on kaksi Spotify-linkkiä, joista Tunnepurku osoittaa Linktreehen ja HTML:ssä on
TODO-kommentti oikean osoitteen vaihtamisesta. Onko soittolista jo olemassa?

---

## 5. Mitä tarvitsen sinulta

1. GHL:n kahden workflown webhook-URL:t
2. Pääsy hengittava-aiti.fi:n DNS-asetuksiin, tai laita SPF-, DKIM- ja DMARC-tietueet itse
3. Paytrailin kauppiastunnus ja salainen avain Vercelin ympäristömuuttujiin
4. Päätös kohdasta 2: menevätkö maksulliset PDF:t GHL:ään vai tehdäänkö allekirjoitetut linkit
5. Vastaus kahteen kysymykseen kohdassa 4 (vanha PDF, Tunnepurku-soittolista)

Kun nämä ovat kasassa, koodimuutokset ovat noin puolen päivän työ. Testaan maksuputken
Paytrailin testitunnuksilla ennen kuin mitään menee tuotantoon.
