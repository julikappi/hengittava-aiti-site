# kuvat/ig/ — Instagram-ruutujen kuvat

Tänne tulevat sivuston mustavalkoiset dokumentaariset kuvat ja auringonnousu/-laskukuvat.
Kuvat haetaan tarkalla tiedostonimellä, joten **nimeä kuva täsmälleen alla olevalla nimellä**
ja pudota se tähän kansioon. Koodiin ei tarvitse koskea.

Jos kuva puuttuu, ruutu näkyy mustana tekstilaatikkona. Sivu ei hajoa.

## Tiedostonimet

| Tiedostonimi | Missä näkyy | Millainen kuva | Muoto |
|---|---|---|---|
| `hero.jpg` | Etusivun ja myyntisivun hero, /minun-tarinani | Äiti ja lapsi selin kameraan, ulkona. Tilaa tekstilaatikolle alalaidassa. | vaaka, väh. 2000 px leveä, alle ~400 kt |
| `01.jpg` | Instagram-ruutu 1 | Lapsi sadetakissa metsäpolulla | pysty 4:5, väh. 1200 px |
| `02.jpg` | Instagram-ruutu 2 | Koululaiset reput selässä | pysty 4:5 |
| `03.jpg` | Instagram-ruutu 3 | Kädet lapsen hiuksissa (detalji) | pysty 4:5 |
| `04.jpg` | Instagram-ruutu 4 | Vauva korissa tai pieni lapsi | pysty 4:5 |
| `05-auringonnousu.jpg` | Instagram-ruutu 5 | **Auringonnousu tai -lasku**, meri tai järvi. Säilyy värillisenä. | pysty 4:5 |
| `06.jpg` | Instagram-ruutu 6 | Lapsi rannalla selin kameraan | pysty 4:5 |
| `breathing-auringonnousu.jpg` | Hengittävä hetki -sektion tausta | Auringonnousu, rauhallinen taivas. Käytetään hyvin tummennettuna. | vaaka, väh. 2000 px |

Lisäksi juurikansiossa `kuvat/`:

| Tiedostonimi | Missä näkyy | Huom |
|---|---|---|
| `IMG_6335.jpg` | ClosingCTA-sektion tausta | Auringonlasku, säilyy värillisenä ja tummennettuna |
| `IMG_3596.jpg` | Minusta-sektio ja myyntisivu | Juliana — näytetään mustavalkoisena |

## Miten vaihdan ruudun kuvan?

1. Nimeä uusi kuva yllä olevan taulukon mukaan (esim. `03.jpg`).
2. Korvaa vanha tiedosto tässä kansiossa.
3. Kopioi sama tiedosto myös kansioon `public/kuvat/ig/` (juuri ja `public/` pidetään samassa tahdissa).

## Miten vaihdan ruudun tekstin?

Avaa `index.html` ja etsi `data-component="InstagramProof"`. Jokainen ruutu on tätä muotoa:

```html
<figure class="ig-frame ig-frame--45">
  <img src="kuvat/ig/01.jpg" class="ig-photo" alt="Kuvaileva alt-teksti" loading="lazy" onerror="this.style.display='none'">
  <figcaption class="ig-caption ig-caption--bottom">
    <p class="ig-hook">Iso koukku tähän.</p>
  </figcaption>
</figure>
```

- `ig-hook` = iso teksti valkoisessa laatikossa.
- Laatikon paikkaa vaihdetaan luokalla: `ig-caption--bottom`, `--top`, `--center`, `--right`.
- Pienempi tarkennus tulee omaan laatikkoonsa `<div class="ig-substack">` — siirrä sitä
  `style="left:12%; top:26%;"` -arvoilla.
- Auringonnousu-/laskukuva pitää värinsä luokalla `ig-photo--dawn` (muut pakotetaan mustavalkoisiksi).

Muista tehdä sama muutos myös tiedostoon `public/index.html`.

## Sääntöjä

- Ei stock-kuvia. Vain Julianan omat kuvat.
- Alt-teksti aina suomeksi ja kuvaileva.
- Kaikki muut kuvat kuin hero: `loading="lazy"`. Hero: `fetchpriority="high"`.
- Pakkaa kuvat ennen lisäämistä (esim. squoosh.app). Hero alle ~400 kt, ruudut alle ~200 kt.
