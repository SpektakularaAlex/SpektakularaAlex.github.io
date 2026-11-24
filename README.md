# My_website

Personal academic website of Alexander Cremer. Built with React and Vite, deployed as static
files to GitHub Pages. No analytics or trackers.

## Run locally

Needs [Node.js](https://nodejs.org) 22.12 or newer.

```sh
npm install        # first time only
npm run dev        # http://localhost:5173, updates as you save
```

To test the real production build:

```sh
npm run build      # writes dist/
npm run preview    # http://localhost:4173
```

## Files

| File | Purpose |
| --- | --- |
| `src/content.jsx` | **All text on the site.** Instructions are at the top. |
| `src/App.jsx` | Layout and components. |
| `src/style.css` | All styling. Colours are the variables near the top. |
| `src/fonts/` | Self-hosted Source Serif 4 (SIL Open Font License). |
| `index.html` | Title, SEO and link-preview metadata. |
| `public/` | Copied as is: `cv.pdf`, photo, favicon, `404.html`, `robots.txt`, `sitemap.xml`. |
| `scripts/prerender.js` | Puts the rendered page into the built HTML, so it works without JavaScript. |
| `.github/workflows/deploy.yml` | Builds and deploys on every push to `main`. |

## Edit

- **News item or project:** copy a snippet from the top of `src/content.jsx`.
- **CV:** overwrite `public/cv.pdf` and change `cvUpdated` in `src/content.jsx`.
- **Photo:** start from a square image outside this folder, e.g. `~/headshot.jpg`:

  ```sh
  sips -s format jpeg -s formatOptions 82 -z 300 300 ~/headshot.jpg --out public/photo.jpg   # macOS
  cwebp -q 82 public/photo.jpg -o public/photo.webp
  ```

  Replace **both** files: browsers use the WebP and link previews use the JPG.
- **Unfinished facts:** `grep -n VERIFY src/content.jsx`. The comments are left out of the built
  page, but are readable in this repo if it is public.

## Deploy with GitHub Pages

1. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   ("Deploy from a branch" does not work any more: the site has to be built first.)
2. Commit and push to `main`, including `package-lock.json`. Progress is under the **Actions** tab.
3. The site is at <https://spektakularaalex.github.io/My_website/>.

### Optional: a root URL

To serve the site at <https://spektakularaalex.github.io/> instead:

1. **Settings → General → Repository name:** rename it to `SpektakularaAlex.github.io`.
2. Update the local clone:
   `git remote set-url origin https://github.com/SpektakularaAlex/SpektakularaAlex.github.io.git`
3. Replace `spektakularaalex.github.io/My_website/` with `spektakularaalex.github.io/` in
   `index.html`, `public/sitemap.xml` and `public/robots.txt`.
4. In `public/404.html`, change `/My_website/` to `/`.

Everything else uses relative paths. Search engines only read `robots.txt` at the root of a
domain, so it takes effect only after this rename.
