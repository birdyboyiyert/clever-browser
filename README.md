# clever

A minimal, real browser embedded in a page: address bar, back/forward, reload — loads actual live websites. Static site, no backend, free to host forever.

Live at: **https://birdyboyiyert.github.io/clever/**

## Why

Named after `s3.amazonaws.com/cleverlearning/index.html` — a page I found that was stuck forever trying to boot a WASM-emulated VM (broken because it needed a service-worker health-check endpoint a static S3 bucket can't serve). That sent me down a real rabbit hole: first building an actual working in-browser x86 VM (booting a real Linux kernel via [v86](https://github.com/copy/v86)), then a real graphical OS with real networking (KolibriOS, routed through v86's public relay). Both worked, but neither was actually *a browser* — the ask, once I got straight to it, was much simpler: something that just loads real websites, right here on the page.

## How it works

- A `<form>` with an address bar normalizes whatever you type — adds `https://` to bare domains, sends anything else to a search — and points an `<iframe>` at it.
- Its own back/forward history stack (cross-origin iframes don't expose their internal history to the parent page, so this page tracks navigation itself).
- Some sites set `X-Frame-Options` / `Content-Security-Policy: frame-ancestors` to refuse being embedded at all (Google, most banks, etc.) — that's the site's own security choice, not something a static page can work around without a server-side proxy that fetches and rewrites the page. Those show blank; the ↗ button opens them in a real tab instead.

## Running it locally

```bash
cd docs
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Deployment

Static site in `docs/`, served via GitHub Pages directly off `main`. No build step, no backend, no server to keep alive.
