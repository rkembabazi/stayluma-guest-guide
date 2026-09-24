# Where things live

```
/index.html               Sales landing page (root URL)
/landing.js                Landing page copy + render logic
/demo/index.html            Redirects to the flagship demo property

/properties/
  <slug>/
    index.html               Copied from template/, property-specific <title> only
    qr.html                  Copied from template/, no changes needed
    data.js                  ALL of this property's content — the file you edit
    photos/                  This property's image files

/template/
  index.html                  The shell every new property's index.html is copied from
  qr.html                      The shell every new property's qr.html is copied from
  data.template.js             A blank, annotated data.js — copy this when adding a property by hand

/assets/
  css/
    tokens.css                 Colors, type, base resets — shared by every page
    guide.css                  Property guide page components
    landing.css                 Sales landing page components
    intake.css                  Intake form components
  js/
    icons.js                    The shared icon set (used by guides, landing, intake)
    render.js                   Renders a property guide from window.PROPERTY — generic, no property data
    pin-gate.js                  PIN-unlock logic for a property's private section
    qrcode-lib.js                 Vendored third-party QR encoder (MIT licensed, unmodified)
    qrcode.js                    Our thin wrapper around qrcode-lib.js (canvas rendering, PNG download)

/intake/
  index.html                   Host intake form shell
  intake.js                    All wizard logic: steps, validation, draft autosave, data.js export

/docs/                        You are here
```

## Data

Every property's entire content — text, contact info, house rules,
appliances, local recommendations, everything a guest reads — lives
in that property's `data.js`. That file is intentionally
self-contained: nothing in `assets/` reads from a database or an API,
it all comes from the one `window.PROPERTY` object each property's
`data.js` defines.

## Images

Images are plain files under each property's `photos/` folder,
referenced by filename from `data.js` (`photos.hero`, `host.photo`).
There's no image processing, resizing, or CDN — whatever file is
there is served as-is. Keep hero photos reasonably web-sized (a few
hundred KB, not multi-megabyte camera originals) since there's no
automatic compression.

If `photos.hero` or `host.photo` is left blank, the guide falls back
to a built-in illustration or the host's initials — a property
doesn't need photos to have a working guide.
