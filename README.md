# Hengittävä Äiti

Static site for **Hengittävä Äiti** (`hengittava-aiti.fi`).
Ilme seuraa Instagram-tiliä [@hengittava_aiti](https://instagram.com/hengittava_aiti):
mustavalkoinen dokumentaarinen valokuva, valkoinen terävä tekstilaatikko, serif-teksti.

## Local preview

```bash
npm run dev
```

Then open <http://localhost:7100>.

## Sivut

| Polku | Tiedosto |
|---|---|
| `/` | `index.html` |
| `/hermosto-reset/` | myyntisivu, 19 € |
| `/kauppa/hermosto-reset/` | kassa (Paytrail, `api/create-payment`) |
| `/opas/` | ilmaisen oppaan lomake |
| `/kiitos/opas/`, `/kiitos/musiikki/`, `/kiitos/hermosto-reset-21/` | kiitos-sivut |
| `/minun-tarinani/` | Julianan tarina |
| `/ostoehdot/`, `/tietosuoja/` | lakisääteiset sivut |

## `public/` on peilikopio

Vercel deployaa **repon juuren** (Output Directory `.`). Kansio `public/` on
identtinen kopio juuresta ja se on versionhallinnassa. **Pidä ne samassa tahdissa:**

```bash
rsync -a --delete --exclude '.git' --exclude 'public' --exclude 'node_modules' ./ public/
```

## Instagram-ruudut

Etusivun `InstagramProof`-sektio on staattinen grid — ei Instagram-embediä eikä Graph APIa.
Kuvat ja ohjeet niiden vaihtamiseen: **[`kuvat/ig/README.md`](kuvat/ig/README.md)**.

## Designtokenit

Kaikki värit ja fontit ovat `tailwind.config`-lohkossa `index.html`:ssä ja
`hermosto-reset/index.html`:ssä. Pienemmillä alasivuilla samat arvot ovat CSS-muuttujina.

| Token | Käyttö |
|---|---|
| `ink` `#141414` | tekstilaatikon musta, tumma tausta |
| `paper` `#FFFFFF` / `warm` `#F7F5F2` / `deep` `#EDEAE5` | valkoinen laatikko, taustat |
| `dawn` `#F6E3D2 → #A65E3C` | vain auringonnousu/-lasku, BreathingMomentin hehku, yksi CTA |
| `plum` `#2A1845` | **vain** logo, footer ja yksi väliotesektio |

Laventeli ja nude on poistettu. Ei varjoja, ei gradientteja korteissa, ei pyöristyksiä.

## Vercel

- Framework Preset: **Other**
- Build Command: leave empty / none
- Output Directory: `.`
- Production Branch: `main`

## Editing workflow

- Create a new branch for each change.
- Preview locally with `npm run dev`.
- Open a pull request, let Vercel create a preview deployment.
- Merge to `main` only after Miska approves the preview.

## Notes

Single self-contained HTML pages using Tailwind via CDN — no build step.
Porting notes for a later Next.js/React migration live at the top of `index.html`;
every section keeps its `data-component="…"` attribute and `@component` comment.
