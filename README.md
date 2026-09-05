# clever

A real Linux kernel, booted and running entirely inside a browser tab — no server, no account, nothing sent anywhere. Everything after the initial page load happens client-side in WebAssembly.

Live at: **https://birdyboyiyert.github.io/clever/**

## Why

I ran into a page (`s3.amazonaws.com/cleverlearning/index.html` — hence the name) that appeared to be "a browser inside a browser" — a VM-in-a-tab demo — but it was stuck forever on "registering service worker" because it was deployed on a plain S3 bucket that couldn't serve the health-check endpoint its service worker expected. That was interesting enough to want to understand *how* something like that even works, and then to build a working version of the idea myself instead of just reading about it.

## How it works

- **[v86](https://github.com/copy/v86)** (BSD-2-Clause) does the actual work: it's an x86 CPU + hardware emulator that JIT-compiles guest machine code to WebAssembly at runtime. It's the open-source engine behind this — I didn't reimplement x86 emulation, that would be its own multi-year project.
- On top of that, this repo is the **wrapper**: a from-scratch dark-mode UI, live boot progress (real download-progress events, not fake), a status indicator, an instruction counter / uptime readout, and restart/pause/stop controls — all wired directly to v86's JS API.
- The guest OS is a ~10MB **Buildroot Linux 6.8** kernel image (`bzImage`), which boots to a BusyBox shell in a few seconds.
- Output is rendered through **xterm.js**, piped to v86's emulated serial port (`ttyS0`) — so what you're looking at is a real terminal attached to a real (emulated) UART, attached to a real Linux kernel.

No disk image is mounted by default — it's a RAM-only guest, so nothing persists between reloads (this is deliberate: no state, no accounts, no data leaving your machine).

## Running it locally

Any static file server works — the emulator's assets (`bios/`, `images/`, `build/`) just need to be served as plain files from the `docs/` directory, e.g.:

```bash
cd docs
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Deployment

Static site in `docs/`, served via GitHub Pages directly off `main`. No build step, no service worker, no backend — just files, which is why it works reliably as a static host in a way the original stuck demo didn't.

## Credits

- [v86](https://github.com/copy/v86) by Fabian and contributors — BSD-2-Clause
- [xterm.js](https://xtermjs.org/) — MIT
- Buildroot demo kernel image via [i.copy.sh](https://i.copy.sh/), built for the v86 project
