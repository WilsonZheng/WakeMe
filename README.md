# WakeMe

A tiny static site that keeps an iPhone screen from auto-locking, with one URL per action.

Live at **https://wake-me.vercel.app** (the old `ioswakeme.vercel.app` 308-redirects there).

| URL | What it does |
| --- | --- |
| `/on` (also `/awake`, `/wake`) | Requests a screen wake lock as soon as the page opens. The screen stays on while the page is visible. |
| `/off` (also `/stop`, `/sleep`) | Leaves the wake lock behind, so Auto-Lock works normally again, and explains how to set Auto-Lock to Never in iOS Settings. |
| `/` | Landing page linking to both. |

## How it works

- `assets/wake.js` calls `navigator.wakeLock.request("screen")` (Safari 16.4+).
- If Safari wants a user gesture first, a full-screen "Tap anywhere" layer appears; one tap acquires the lock.
- Browsers without the API fall back to a looping, muted, inline 4-second video (`assets/blank.mp4`), the NoSleep.js trick.
- The browser drops the lock whenever the page is hidden; the page re-acquires it on return.

No build step and no dependencies. UI is English or Chinese based on the browser language, with a toggle.

## Run locally

```sh
npx vercel@latest dev   # honours cleanUrls and the redirects in vercel.json
```

## Deploy

Hosted on Vercel (personal account, project `wakeme`). The project is connected to this GitHub repo, so every push to `main` deploys to production.
