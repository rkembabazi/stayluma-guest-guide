# Updating an existing property

All of a property's content lives in one file:
`properties/<slug>/data.js`. To change anything a guest sees — the
wifi password, a house rule, a local recommendation, the host's
message — edit that file directly. Nothing else needs to change.

## Common edits

- **Wifi password changed:** edit `wifi.password` in the property's
  `data.js`.
- **New house rule:** add an object to the `houseRules` array,
  following the shape of the existing entries. `icon` must be one of
  the keys defined in `assets/js/icons.js` (see that file for the
  full list, or reuse an icon already used elsewhere).
- **Swap a photo:** replace the file in `properties/<slug>/photos/`
  (keep the same filename to avoid also editing `data.js`), or change
  the filename in `photos.hero` / `host.photo` to match a new file.
- **Change the private/PIN section:** edit `private.pin` or the
  `private.fields` array. To remove the private section entirely,
  delete the whole `private` block from `data.js`.
- **Add or remove a local recommendation:** edit the `localGuide.items`
  array. If you add a new category, also add it to
  `localGuide.categories` or the filter chip won't appear.

## After editing

Preview locally (`docs/deploying.md` covers the local server), check
the page, then deploy the same way as any other change — there's no
separate "publish" step beyond pushing to GitHub.

## What you should not need to touch

- `assets/css/*` and `assets/js/*` — shared across every property.
  A design change here affects every guide at once, which is rarely
  what you want for a single property update.
- `template/*` — only used when creating a *new* property.
