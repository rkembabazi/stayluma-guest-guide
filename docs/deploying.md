# Deploying

This is a plain static site — no build step, no server-side code, no
Node/npm required. It's currently deployed on GitHub Pages from the
`rkembabazi/stayluma-guest-guide` repository.

## Previewing locally before you deploy

This machine doesn't have a working Node or Python install, so the
project previews with Ruby's built-in static server instead (Ruby
ships with macOS):

```bash
cd /path/to/StayLuma
ruby -run -e httpd . -p 4173
```

Then open `http://127.0.0.1:4173/` in a browser. `.claude/launch.json`
already has this configured if you're using the Claude Code app's
built-in preview.

If a different machine has Node available, any static server works
instead — e.g. `npx serve .`

## Deploying a change

1. Commit your changes:
   ```bash
   git add -A
   git commit -m "Describe the change"
   ```
2. Push to GitHub:
   ```bash
   git push
   ```
3. GitHub Pages rebuilds automatically, usually within a minute or
   two. No manual "deploy" step beyond the push.

If `git push` asks for a password, GitHub no longer accepts your
account password there — use a Personal Access Token instead
(Settings → Developer settings → Personal access tokens on
github.com, with the `repo` scope checked). **Never paste a token
into a chat or anywhere other than the terminal's password prompt**
— if one is ever exposed like that, revoke it immediately at
`github.com/settings/tokens` and generate a new one.

If typing a token in a terminal is awkward, GitHub Desktop
(File → Add Local Repository, pointed at this folder) signs in
through the browser instead and avoids tokens entirely.

## URLs

- **Sales landing page:** the repository root (`/`)
- **Flagship demo:** `/demo/` (redirects to `/properties/casa-baraza/`)
- **A given property's guide:** `/properties/<slug>/`
- **A given property's printable QR sign:** `/properties/<slug>/qr.html`
- **Host intake form:** `/intake/`

## Adding a brand-new property to the deployed site

There's no separate deploy step for a new property — it's the same
`git add` / `commit` / `push` as any other change, once the new
`properties/<slug>/` folder exists locally (see
`docs/adding-a-new-property.md`).
