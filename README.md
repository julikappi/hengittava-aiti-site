# Hengittävä Äiti

Static single-page website for **Hengittävä Äiti** (`hengittava-aiti.fi`).

## Local preview

```bash
npm run dev
```

Then open <http://localhost:7100>.

## Vercel

This repo is ready to import into Vercel as a static site.

Recommended Vercel settings:

- Framework Preset: **Other**
- Build Command: leave empty / none
- Output Directory: `.`
- Production Branch: `main`

## Editing workflow for Super-Ruu

- Create a new branch for each change.
- Edit `index.html` and/or files under `kuvat/`.
- Preview locally with `npm run dev`.
- Open a pull request.
- Let Vercel create a preview deployment.
- Merge to `main` only after Miska approves the preview.

## Notes

The current version is intentionally a single self-contained HTML page using Tailwind via CDN. It includes porting notes in `index.html` for a later Next.js/React migration.
