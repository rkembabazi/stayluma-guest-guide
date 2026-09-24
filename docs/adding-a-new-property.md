# Adding a new property

There are two ways to get a new property's content: through the host
intake form, or by hand. Either way, the result is the same: a folder
under `properties/<slug>/` containing an `index.html`, a `qr.html`,
and a `data.js`.

## Option A — via the intake form (recommended)

1. Send the host to `/intake/` (or fill it out with them on a call).
2. They work through the 10 steps. Their answers autosave to their
   browser as they go (see `docs/manual-steps-and-limitations.md` for
   what that does and doesn't mean).
3. On the last step, they click **Download data.js**. This downloads
   a single file — it does not publish anything automatically.
4. **You place that file manually**:
   - Pick a slug for the property (a short, URL-safe name, e.g.
     `villa-amara`). The review step suggests one based on the
     property name.
   - Copy `template/index.html` and `template/qr.html` into a new
     folder: `properties/<slug>/`.
   - Put the downloaded file at `properties/<slug>/data.js`.
   - Open `properties/<slug>/index.html` and update the `<title>`
     and `<meta name="description">` tags to match the property
     (everything else in that file is generic and needs no changes).
5. **Add photos manually.** The intake form validates photo file
   *formats* but can't upload anything (there's no backend — see the
   limitations doc). Ask the host to send the actual image files,
   then place them at `properties/<slug>/photos/` and make sure the
   filenames match what's in `data.js` under `photos.hero` and
   `host.photo`. If a property has no photos yet, leave those fields
   blank — the guide shows a built-in illustration instead.
6. Deploy (see `docs/deploying.md`).

## Option B — by hand

1. Copy `template/index.html`, `template/qr.html`, and
   `template/data.template.js` into `properties/<slug>/`, renaming
   the last one to `data.js`.
2. Fill in every field in `data.js` — it's annotated inline with what
   each one does and which values are optional.
3. Update the `<title>` and `<meta name="description">` in that
   property's `index.html`.
4. Add any photos to `properties/<slug>/photos/`.
5. Deploy.

## What never needs to change

Nothing in `assets/` (CSS, icons, the render engine, the QR library)
is property-specific. If you find yourself editing those files to
make one property look different from another, something's gone
wrong — the whole point of the template is that it doesn't need
per-property changes.
