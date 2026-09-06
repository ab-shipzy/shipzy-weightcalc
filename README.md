# ShipzyCart Weight Calculator (PWA)

Volumetric weight calculator for on-the-go chargeable weight quotes. Single-file HTML app, PWA-ready, served via Express for Railway, wrappable into an Android APK with Bubblewrap.

## Formulas (dimensions converted to cm internally)
| Mode | Formula | Divisor |
|---|---|---|
| 10 CFT | L × W × H / 2700 | 2700 |
| 6 CFT | L × W × H / 4500 | 4500 |
| Air (Domestic/International) | L × W × H / 5000 | 5000 |

- Units: cm (default), inch, feet, meter — auto-converted to cm.
- Multiple box types: per-line qty × per-box actual weight + dimensions.
- Chargeable weight = max(total actual, total volumetric). Basis shown.
- Total CBM also displayed.

## Structure
```
server.js            # Express static server (Railway)
package.json
public/
  index.html         # entire app (vanilla JS, no build step)
  manifest.json      # PWA manifest
  sw.js              # service worker (offline cache)
  icons/             # 192 + 512 PNG
```

## Run locally
```bash
npm install
npm start          # http://localhost:3000
```

## 1. Push to GitHub
```bash
cd shipzy-weightcalc
git init
git add .
git commit -m "Weight calculator v1"
gh repo create ab-shipzy/shipzy-weightcalc --private --source=. --push
# or: git remote add origin git@github.com:ab-shipzy/shipzy-weightcalc.git && git push -u origin main
```

## 2. Deploy on Railway
1. Railway dashboard → New Project → Deploy from GitHub repo → select `shipzy-weightcalc`.
2. No config needed — Railway detects `npm start`, binds `$PORT` automatically.
3. Settings → Networking → Generate Domain (e.g. `shipzy-weightcalc.up.railway.app`).
4. Every `git push` to main auto-deploys.

HTTPS is mandatory for Bubblewrap — Railway domains are HTTPS by default. ✅

## 3. Build APK with Bubblewrap
```bash
npm i -g @bubblewrap/cli
mkdir twa && cd twa
bubblewrap init --manifest=https://YOUR-DOMAIN.up.railway.app/manifest.json
# accept defaults; package id e.g. in.shipzy.weightcalc
bubblewrap build
# outputs app-release-signed.apk + app-release-bundle.aab
```
- First run installs JDK + Android SDK automatically (say yes).
- To remove the browser URL bar in the APK: after `bubblewrap build`, copy the
  SHA-256 fingerprint it prints into `public/assetlinks.json` and serve it at
  `/.well-known/assetlinks.json`, then redeploy. (Optional — app works without it,
  just shows a small address bar.)

## Tests
Validated with `node --check` (server, sw, inline script) + jsdom: 19 assertions covering all three divisors, all four unit conversions, multi-box-type totals, qty multiplication, chargeable-weight basis, and box removal. All passing.

---
Wham Vision Private Limited · ShipzyCart
