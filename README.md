# Personal website

Source of <https://spektakularaalex.github.io/>. Plain HTML, CSS and JavaScript: no build step,
no dependencies, no trackers. GitHub Pages serves these files directly.

> **`/ionsource/` must keep its URL.** The QR code on the printed poster points there. Never rename
> or move the `ionsource/` folder.

## Preview

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Opening the files directly does not work, because links start with `/`.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/music/` | `music/index.html` |
| `/gallery/` | `gallery/index.html` |
| `/ionsource/` | `ionsource/index.html` (poster: `ionsource/poster.pdf`) |
| `/cv.pdf` | `cv.pdf` |
| any missing URL | `404.html` |

Styles are in `assets/css/style.css` (colours at the top), scripts in `assets/js/`:
`site.js` (email links), `gallery.js` (lightbox), `cr3bp.js` (three-body figure).

**Header and footer** are written out in every page, between `HEADER` and `FOOTER` comments. With
five pages that is simpler than a JavaScript include: the navigation works without JavaScript,
never flickers in, and is visible to search engines. To change it, edit it in one page and copy it
to `index.html`, `music/`, `gallery/`, `ionsource/` and `404.html` (`aria-current="page"` marks the
current page).

## Replace a placeholder image

Overwrite the file in `assets/img/` with your photo, keeping the **same name and aspect ratio**, and
update the `alt` text (remove "(placeholder)"). Keep files under about 300 KB. On macOS:

```sh
sips -s format jpeg -s formatOptions 75 -Z 1500 ~/photo.jpg --out assets/img/gallery-01.jpg
```

If the aspect ratio differs, images in cards and grids are cropped to fit. For `portrait.jpg` and
the music photos, also update `width` and `height` in the HTML. `portrait.jpg` is the picture in
link previews too.

## Add a gallery photo

1. Save it as `assets/img/gallery-13.jpg` (next number).
2. In `gallery/index.html`, copy an `<li>` line, change the number (twice), the `alt` text and the
   caption. The lightbox picks it up automatically.

The home page shows eight photos: edit the list under `§05` in `index.html`.

## Add a project card

In `index.html` under `§03`, copy and edit:

```html
<li>
  <img src="/assets/img/project-NAME.jpg" width="960" height="600" loading="lazy" alt="Describe the photo">
  <h3>Title</h3>
  <p>One line. <a class="nb" href="https://…">Code ↗</a></p>
</li>
```

Interest cards (`§04`), recordings (`music/`) and a contact form (`§06`) have commented-out templates.

## Poster and CV

Overwrite `ionsource/poster.pdf` (currently a placeholder) or `cv.pdf`.

## Open facts

```sh
grep -rn "VERIFY" --include="*.html" .
```

HTML comments are public in the page source, so delete each one as you resolve it.

## Deploy

1. The GitHub repository must be named `SpektakularaAlex.github.io` and be public.
   After renaming it, update your clone:
   `git remote set-url origin https://github.com/SpektakularaAlex/SpektakularaAlex.github.io.git`
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Push to `main`.
