# Manual steps and known limitations

This is a lean MVP: a static site with no backend, no database, and
no accounts. That keeps it simple and cheap to run, but it means a
few things are deliberately manual or limited rather than automated.
Read this before promising a host something the current build can't
actually do.

## The private/PIN section is obscurity, not security

The "private access details" section (e.g. a safe code) hides its
content behind a PIN entered in the browser. **This is not
cryptographic security.** The PIN and the protected value both ship
inside the page's own HTML/JS source — anyone who opens their
browser's developer tools can read them regardless of whether they
know the PIN.

What it *does* do:
- Keeps the value off the visible page for a casual viewer
- Keeps it out of search engine indexes
- Adds friction against someone glancing over a guest's shoulder

What it does *not* do:
- Stop a technically curious person from reading the page source
- Provide any guarantee suitable for something highly sensitive
  (e.g. don't use it for anything more sensitive than a lockbox or
  safe code you'd be comfortable changing if it leaked)

Real security here would require a backend (even a small serverless
function) to keep the secret out of the publicly-served bundle
entirely and only release it after server-side PIN validation. That's
out of scope for this phase — if a host specifically needs that,
it's a real infrastructure addition, not a config change.

## The intake form doesn't publish anything automatically

There's no server behind `/intake/`. "Submitting" the form generates
a `data.js` file in the browser and downloads it — it does not save
anywhere, notify anyone, or update the live site. Someone (you, or
whoever manages the repo) has to:

1. Receive that downloaded file
2. Create the `properties/<slug>/` folder from `template/`
3. Place the file there as `data.js`
4. Manually add any photo files the host sent separately
5. Commit and push

See `docs/adding-a-new-property.md` for the exact steps.

## Draft autosave is per-browser, not per-account

The intake form saves progress to `localStorage` so a host can close
the tab and come back later — but only in the *same browser on the
same device*. There's no account system, so:
- Switching devices loses the draft
- Clearing browser data loses the draft
- Two people can't collaborate on the same draft in real time

## Photos aren't uploaded, just validated

The intake form checks that a selected photo is a JPG, PNG, or WEBP
and previews it, but has nowhere to send the actual file — there's no
backend to receive an upload. The host still needs to send the image
file itself (email, WhatsApp, wherever's easiest) for someone to place
into `properties/<slug>/photos/`.

## Map links are placeholders, not verified

When a host doesn't provide an exact map link, the guide generates a
Google Maps *search* URL from the address or place name typed in.
That's a reasonable best-effort default, but it isn't guaranteed to
land on the exact right pin — mis-typed or ambiguous addresses can
produce a search result that isn't the property itself. Worth a quick
manual check per property before treating it as reliable.

## No accounts, no payments, no dashboard

By design for this phase. See the top-level project brief for what's
intentionally deferred to later phases.
