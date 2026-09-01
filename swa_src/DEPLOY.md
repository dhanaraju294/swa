# Deploying the SWA site to Vercel (static) + pointing it at your DuckDNS IP

Your server IP: **157.50.147.141** (behind DuckDNS).

---

## 0. What this folder is now

`swa_src` used to contain **Vite dev-server output**, not source code — every file
began with `import ... from "/node_modules/.vite/deps/..."` and ended in a base64
sourcemap. That cannot be built or deployed by anything.

The real TypeScript was recovered out of the `sourcesContent` field of those
sourcemaps, and the folder is now a normal, buildable Vite + React app:

```
swa_src/
├── index.html          # entry (was missing)
├── package.json        # real deps (was missing)
├── vite.config.ts      # @ alias + /api dev proxy
├── tsconfig.json
├── vercel.json         # SPA rewrites + /api → DuckDNS
├── .env.example
└── src/                # recovered source
```

Verified locally: `npm run build` ✅ · `npx tsc --noEmit` ✅

---

## 1. Deploy to Vercel

### Option A — Dashboard (easiest)

1. Push this branch to GitHub.
2. Vercel → **Add New… → Project** → import the repo.
3. **Important:** set **Root Directory** to `swa_src`.
   (The repo root is the React Native app; without this Vercel builds the wrong thing.)
4. Vercel auto-detects Vite. Confirm:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Deploy.**

### Option B — CLI

```bash
npm i -g vercel
cd swa_src
vercel          # preview deploy
vercel --prod   # production
```

Since you run the CLI from inside `swa_src`, that folder is already the root.

> It deploys as a **static site**: Vite outputs plain HTML/CSS/JS to `dist/`,
> served from Vercel's CDN. No Node server, no serverless functions.

---

## 2. Pointing at your DuckDNS IP — pick the right one

This is the part worth being precise about, because "point Vercel at my IP" can
mean two different things.

### ⚠️ You cannot make `yoursite.vercel.app` resolve to 157.50.147.141

Vercel serves the static files from its own CDN. DNS for the site itself points
at Vercel, not at your box. What you *can* do is make the **site talk to your
server** for API/data. That's case A, and it's almost certainly what you want.

---

### Case A — Static site on Vercel, backend on your DuckDNS box ✅ recommended

Your React app calls `/api/contact/contact`. `vercel.json` already rewrites that
to your DuckDNS host:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://swa-backend.duckdns.org/api/:path*" },
    { "source": "/(.*)",       "destination": "/index.html" }
  ]
}
```

**Edit `swa_src/vercel.json` and replace `swa-backend.duckdns.org` with your
actual DuckDNS subdomain.**

Why this beats calling the IP from the browser:

- The browser only ever sees same-origin `/api/...` → **no CORS setup**.
- **No mixed-content error.** Your Vercel site is HTTPS; a browser will refuse to
  call `http://157.50.147.141` from an HTTPS page. Vercel does the call server-side.
- Your raw IP stays hidden.

The second rewrite is the **SPA fallback** — required, or refreshing any deep
link 404s.

#### Set up DuckDNS

1. <https://www.duckdns.org> → sign in → create subdomain, e.g. `swa-backend`.
2. Set the IP to **157.50.147.141** → **update ip**.
3. Keep it current from the server:

```bash
mkdir -p ~/duckdns && cd ~/duckdns
echo 'echo url="https://www.duckdns.org/update?domains=swa-backend&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -' > duck.sh
chmod 700 duck.sh
(crontab -l 2>/dev/null; echo "*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1") | crontab -
```

Verify: `dig +short swa-backend.duckdns.org` → `157.50.147.141`

#### Give it HTTPS (needed for the rewrite target)

Vercel requires a valid certificate on the destination. DuckDNS domains work
with Let's Encrypt:

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d swa-backend.duckdns.org
```

Point nginx at whatever port your API listens on:

```nginx
server {
    server_name swa-backend.duckdns.org;
    location /api/ {
        proxy_pass http://127.0.0.1:8080;   # your backend port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Open port 443/80 in your firewall **and forward them on your router** — a home
IP like this usually needs port forwarding.

> **If you truly cannot get HTTPS**, set the destination to
> `http://157.50.147.141/api/:path*`. Vercel allows plain-HTTP rewrite targets
> (it's a server-to-server call, so the browser never sees it), but the hop is
> unencrypted. HTTPS is strongly preferred.

---

### Case B — You want the domain itself served from your box

Then Vercel isn't hosting it. Put your DuckDNS domain in DNS as an `A` record to
157.50.147.141 and serve `dist/` from nginx yourself:

```bash
cd swa_src && npm run build
sudo cp -r dist/* /var/www/swa/
```

```nginx
server {
    listen 443 ssl;
    server_name swa-backend.duckdns.org;
    root /var/www/swa;
    location / { try_files $uri $uri/ /index.html; }   # SPA fallback
}
```

You cannot mix the two: a hostname resolves either to Vercel or to your IP.

---

### Custom domain on Vercel (if you own a real domain)

Project → Settings → Domains → add it, then at your registrar:

| Type  | Name | Value                   |
|-------|------|-------------------------|
| A     | @    | `76.76.21.21`           |
| CNAME | www  | `cname.vercel-dns.com`  |

Those are **Vercel's** values — not your DuckDNS IP.

---

## 3. Environment variables

Leave `VITE_API_BASE_URL` **unset/empty in production** so the app calls
same-origin `/api/...` and the rewrite handles routing. Only set it to an
absolute URL if you deliberately want the browser to hit your backend directly
(then you must enable CORS on the backend and it must be HTTPS).

For local dev, copy `.env.example` → `.env` and set:

```
VITE_API_PROXY_TARGET=https://swa-backend.duckdns.org
```

`vite.config.ts` proxies `/api` there so local dev mirrors production.

```bash
npm install
npm run dev      # http://localhost:5173
```

---

## 4. Deployment checklist

- [ ] Root Directory set to `swa_src` in Vercel
- [ ] `vercel.json` destination points at **your** DuckDNS subdomain
- [ ] DuckDNS resolves to 157.50.147.141
- [ ] Backend reachable over HTTPS; ports forwarded
- [ ] Deep link (e.g. `/anything`) loads instead of 404 → SPA rewrite working
- [ ] Contact form submits successfully
