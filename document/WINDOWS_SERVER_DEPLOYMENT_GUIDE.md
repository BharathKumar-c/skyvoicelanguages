# Sky Voice Languages — Windows Server Deployment Guide

Host the Next.js website on your own Windows Server and serve it at **https://skyvoicelanguages.com** (domain registered with Hostinger).

Written against the codebase on branch `feat/visual-assets-integration` (19 Oct 2026): Next.js 16.4, Node.js 22, pnpm 11.25.0.

---

## 0. What you are deploying (read first)

| Item | Detail in this project | What it means for deployment |
|---|---|---|
| App | `apps/web` (pnpm monorepo; root `package.json` uses `pnpm@11.25.0`) | Install with pnpm from the **repo root** |
| Runtime | Next.js 16.4 requires Node ≥ 20.9; the project is developed and tested on **Node 22** | Install Node.js **22 LTS** |
| Build | `pnpm build` at the root runs `next build` in `apps/web` | Needs dev dependencies (TypeScript, Tailwind), so do a full install |
| Run | `next start` (`apps/web` script `start`) | Run it as a Windows service, bound to `127.0.0.1:3000` |
| Image processing | `sharp` (Windows x64 binary) is allowed to build in `pnpm-workspace.yaml` | Works on Windows Server x64; nothing extra to install |
| API routes | `POST /api/leads` (Book My Free Assessment), `POST /api/enquiries` (Contact Us) | Each delivers by **SMTP email** and/or **webhook**. **With neither configured, production returns 503 "temporarily unavailable"** (deliberate: no fake success) |
| Rate limiting | 5 submissions per 10 minutes per IP. The IP comes from the `X-Forwarded-For` header, held in server memory | The reverse proxy must set `X-Forwarded-For` itself. Caddy (below) does this safely |
| Admin panel | `/admin` → Website Settings. Login is checked against `ADMIN_PASSWORD_HASH` and uses a signed `HttpOnly`, `Secure`, `SameSite=Strict` cookie | **Requires HTTPS** in production (the cookie is `Secure`) |
| Admin saves | Next.js Server Actions with a built-in CSRF check: the browser's `Origin` must match the host the app sees (`X-Forwarded-Host` or `Host`) | The proxy must forward the public host name. Caddy does by default |
| Settings storage | One JSON file, `SETTINGS_FILE` (default `apps/web/data/site-settings.json`), written atomically with a `.bak` copy | Put it **outside the code folder** on a persistent disk and back it up |
| Page caching | Public pages are prerendered. Saving settings regenerates them on the next visit (written to `apps/web/.next`) | The service account needs **write access to `apps/web/.next`** |
| Env loading | `next start` and `next build` read `apps/web/.env.local` | One server-only env file. `NEXT_PUBLIC_*` values are baked in at **build** time |

> ℹ️ An older checkout may contain `install.cmd` in the repository root. It was removed on 19 Oct 2026 because it is not part of the website: it downloads and runs a third-party program (`agy.exe`, the "Antigravity CLI"). If you see it on any machine, don't run it, and don't copy it to the server.

**Architecture**

```text
Visitor ──HTTPS:443──▶ Caddy (reverse proxy, automatic Let's Encrypt certificates)
                          │  forwards Host, X-Forwarded-For/-Proto/-Host
                          ▼
                    Next.js (node next start) on 127.0.0.1:3000   ← Windows service "skyvoice-web"
                          │                 │
                          │                 └─ SMTP (smtp.gmail.com:465 or smtp.hostinger.com:465)
                          ▼
             C:\SkyVoiceData\settings\site-settings.json   (admin settings, backed up daily)
```

**Why Caddy rather than IIS:**
- It obtains and renews HTTPS certificates automatically.
- It forwards the original host by default.
- It replaces client-supplied `X-Forwarded-For` headers instead of trusting them, which keeps the rate limiter honest.

If you must use IIS, see [Appendix B](#appendix-b--using-iis-instead-of-caddy).

**Folders used in this guide** (change them if you like, but keep them consistent):

| Purpose | Path |
|---|---|
| Code (git checkout) | `C:\sites\skyvoicelanguages` |
| Admin settings data | `C:\SkyVoiceData\settings` |
| Settings backups | `C:\SkyVoiceData\backups` |
| App logs | `C:\SkyVoiceData\logs` |
| Caddy | `C:\caddy` |
| Tools (NSSM) | `C:\tools\nssm` |

---

## 1. Requirements checklist

- [ ] Windows Server 2019, 2022 or 2025, x64, with at least 2 vCPU, 4 GB RAM and 20 GB free disk (the build needs about 2 GB of RAM).
- [ ] A **static public IPv4 address** for the server.
- [ ] Administrator access over RDP.
- [ ] Inbound **TCP 80 and 443** allowed at every layer: Windows Firewall, plus any cloud or datacenter firewall or router NAT.
- [ ] Outbound **TCP 465** (SMTP over SSL) allowed, for form emails.
- [ ] Access to the Hostinger account that holds `skyvoicelanguages.com`.
- [ ] Read access to the GitHub repository `BharathKumar-c/skyvoicelanguages` (it is private, so you need a deploy key or a token; see step 4).
- [ ] A mailbox to send from: a Gmail account with 2-Step Verification, or a Hostinger Email mailbox.

---

## 2. Point the Hostinger domain at your server (do this first — DNS takes time)

1. Find the server's public IP. On the server:
   ```powershell
   (Invoke-RestMethod -Uri "https://api.ipify.org")
   ```
   Your hosting provider's panel also shows it. A `192.168.x.x` or `10.x.x.x` address is a private address; use the public one, and set up port forwarding on the router/NAT for 80 and 443.
2. Sign in to **Hostinger hPanel** → **Domains** → `skyvoicelanguages.com` → **DNS / Nameservers**.
   - The **DNS records** tab is only editable while the domain uses Hostinger's nameservers (for example `ns1.dns-parking.com`). If the nameservers point elsewhere (e.g. Cloudflare), make the same changes there instead.
   - If the domain is connected to a Hostinger hosting plan or Website Builder site, disconnect it or expect Hostinger to re-add its own records.
3. Edit the records:

   | Type | Name | Points to | TTL |
   |---|---|---|---|
   | A | `@` | *your server's public IPv4* | 300 (raise to 3600 once it works) |
   | CNAME | `www` | `skyvoicelanguages.com` | 300 |

   - **Delete** any other `A` records for `@` or `www`, e.g. Hostinger parking or builder IPs.
   - **Delete `AAAA` records** for `@` and `www` unless your server really has a public IPv6 address. Otherwise Let's Encrypt may try IPv6 and fail.
   - **Do not touch** `MX`, `TXT` (SPF/DKIM/DMARC) or mail `CNAME` records. Changing them breaks email for the domain.
   - If a **CAA** record exists, it must allow `letsencrypt.org`. Add `CAA @ 0 issue "letsencrypt.org"` if there are CAA records that don't include it.
4. Check that DNS has propagated. This usually takes minutes, but can take up to 24 hours:
   ```powershell
   Resolve-DnsName skyvoicelanguages.com -Server 8.8.8.8 -Type A
   Resolve-DnsName www.skyvoicelanguages.com -Server 8.8.8.8
   ```
   Both must resolve to your server IP before you start Caddy in step 9.

---

## 3. Prepare Windows Server

Run everything in **PowerShell as Administrator**.

1. **Update Windows**, reboot, and set the correct time zone (certificates and logs depend on the clock).
2. **Open the firewall** for web traffic only. Never open port 3000.
   ```powershell
   New-NetFirewallRule -DisplayName "HTTP (Caddy)"  -Direction Inbound -Protocol TCP -LocalPort 80  -Action Allow
   New-NetFirewallRule -DisplayName "HTTPS (Caddy)" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
   New-NetFirewallRule -DisplayName "HTTP/3 (Caddy)" -Direction Inbound -Protocol UDP -LocalPort 443 -Action Allow
   ```
3. **Free ports 80 and 443.** If IIS or another web server is installed, stop it or remove its 80/443 bindings:
   ```powershell
   Get-NetTCPConnection -LocalPort 80,443 -State Listen -ErrorAction SilentlyContinue |
     Select-Object LocalPort, OwningProcess, @{n="Process";e={(Get-Process -Id $_.OwningProcess).ProcessName}}
   # If IIS (w3wp/System) owns them:  Stop-Service W3SVC; Set-Service W3SVC -StartupType Disabled
   ```
4. **Enable long paths.** `node_modules` paths can exceed 260 characters:
   ```powershell
   Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled -Value 1
   ```
5. **Install Node.js 22 LTS** (x64 `.msi`) from <https://nodejs.org/en/download>. Accept the defaults; you don't need the "Tools for native modules" option. Then open a **new** PowerShell window and check:
   ```powershell
   node -v      # v22.x
   npm -v
   ```
6. **Install pnpm** at the exact version the repository pins:
   ```powershell
   npm install -g pnpm@11.25.0
   pnpm -v      # 11.25.0
   ```
7. **Install Git for Windows** from <https://git-scm.com/download/win> and check it with `git --version`.
8. **Create the folders:**
   ```powershell
   New-Item -ItemType Directory -Force C:\sites, C:\SkyVoiceData\settings, C:\SkyVoiceData\backups, C:\SkyVoiceData\logs, C:\caddy\logs, C:\tools | Out-Null
   ```
9. **Create a low-privilege service account** for the website, so the app never runs as Administrator or SYSTEM:
   ```powershell
   $pw = Read-Host -AsSecureString "Password for the skyvoice service account"
   New-LocalUser -Name "svc-skyvoice" -Password $pw -PasswordNeverExpires -UserMayNotChangePassword -Description "Runs the Sky Voice website"
   ```
   Keep this password in your password manager; NSSM needs it in step 8. On a domain-joined server you can use a domain service account instead.
10. *(Recommended)* Exclude the code folder from real-time antivirus scanning to speed up installs and builds: `Add-MpPreference -ExclusionPath C:\sites\skyvoicelanguages`.

---

## 4. Get the code onto the server

The repository is private. Use **one** of these:

- **Fine-grained personal access token (simplest).** GitHub → Settings → Developer settings → Fine-grained tokens → limit it to this repository with **Contents: Read-only**. Git will ask for it on the first clone; Git Credential Manager stores it.
- **Deploy key.** Generate an SSH key on the server (`ssh-keygen -t ed25519`) and add the public key under the repository's **Settings → Deploy keys**, read-only. Then clone the `git@github.com:` URL.

```powershell
cd C:\sites
git clone https://github.com/BharathKumar-c/skyvoicelanguages.git
cd C:\sites\skyvoicelanguages
git checkout main          # or the branch/tag you are releasing, e.g. feat/visual-assets-integration
```

> Never copy your development `apps/web/.env.local` to the server. It contains a development-only admin password. The server gets its own file in step 6.

---

## 5. Install dependencies

From the **repository root**:

```powershell
cd C:\sites\skyvoicelanguages
pnpm install --frozen-lockfile
```

- `--frozen-lockfile` installs exactly the versions in `pnpm-lock.yaml`. The project uses `"latest"` version ranges in `package.json`, so this flag is what keeps the server on the same, tested versions.
- The install runs the build scripts allowed in `pnpm-workspace.yaml` (`sharp`, `esbuild`, `unrs-resolver`). If pnpm reports that a build script was **ignored**, run `pnpm rebuild sharp`.
- Development tools (TypeScript, Tailwind, Vitest, Playwright) are installed too: the build needs some of them. The Playwright *browsers* are **not** downloaded and aren't needed on the server.

---

## 6. Configure environment variables (server secrets)

All secrets go in **one file**: `C:\sites\skyvoicelanguages\apps\web\.env.local`.
- Both `next build` and `next start` load it.
- It is git-ignored, so `git pull` never overwrites it.
- **Never put secrets in the admin panel or in chat.**

### 6.1 Generate the admin login

```powershell
cd C:\sites\skyvoicelanguages
pnpm --filter @skyvoice/web admin:hash-password
```

Type a strong password (12+ characters) twice. The script prints two lines, `ADMIN_PASSWORD_HASH=scrypt:…` and `ADMIN_SESSION_SECRET=…`. Copy both into the file below.

### 6.2 Choose the email sender for form notifications

**Option A — Gmail** (any Gmail account with 2-Step Verification):
1. Open <https://myaccount.google.com/security> and turn on 2-Step Verification.
2. Open <https://myaccount.google.com/apppasswords> and create an app password named "Sky Voice website".
3. Copy the 16-character code **without spaces**. Your normal Gmail password will **not** work and must not be used.
4. Use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=<the Gmail address>`, `SMTP_PASS=<app password>`.
5. Gmail can only send *from* that Gmail address (or a verified alias). Leave `NOTIFY_EMAIL_FROM` empty or use `Sky Voice website <that address>`.

**Option B — Hostinger Email** (if you have a mailbox such as `website@skyvoicelanguages.com`):
- Use `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER=<full mailbox address>`, `SMTP_PASS=<that mailbox's password>`.
- Use a dedicated mailbox just for the website.
- Hostinger manages SPF/DKIM for its own mail, which helps deliverability.

### 6.3 Create the file

```powershell
notepad C:\sites\skyvoicelanguages\apps\web\.env.local
```

```dotenv
# ---------- Admin panel (/admin) ----------
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=scrypt:PASTE_FROM_6.1
ADMIN_SESSION_SECRET=PASTE_FROM_6.1

# ---------- Persistent storage for Website Settings ----------
# Outside the code folder, so deployments never touch it.
SETTINGS_FILE=C:\SkyVoiceData\settings\site-settings.json

# ---------- Email delivery for both forms ----------
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.address@gmail.com
SMTP_PASS=abcdefghijklmnop
# Recipient(s). Can also be set (and overridden) in Admin → Integrations → "Send submissions to".
NOTIFY_EMAIL_TO=team@skyvoicelanguages.com
# Optional sender display, e.g. Sky Voice website <your.address@gmail.com>
NOTIFY_EMAIL_FROM=

# ---------- Optional: webhooks (CRM, Google Sheets, Zapier/Make) ----------
ASSESSMENT_LEAD_WEBHOOK_URL=
ASSESSMENT_LEAD_WEBHOOK_TOKEN=
CONTACT_ENQUIRY_WEBHOOK_URL=
CONTACT_ENQUIRY_WEBHOOK_TOKEN=

# ---------- Optional: WhatsApp automation (prepared; sending not yet implemented) ----------
WATI_API_TOKEN=
```

**Rules for this file**
- **Do not** set `ADMIN_PASSWORD` here. Production ignores it; the hash is what counts.
- A value containing `$` must be written as `\$`: Next.js expands `$NAME` sequences. The generated hash and secret never contain `$`.
- `NEXT_PUBLIC_*` video variables are no longer needed; set video links in **Admin → Website content → Videos**. If you do set `NEXT_PUBLIC_*` values, rebuild afterwards, because they are fixed at build time.
- **Every change to this file needs a service restart** (step 8) to take effect. A change that affects pages generated at build time (for example `SETTINGS_FILE`) also needs a rebuild.

### 6.4 Lock the file down

```powershell
$f = "C:\sites\skyvoicelanguages\apps\web\.env.local"
icacls $f /inheritance:r /grant:r "Administrators:F" "SYSTEM:F" "svc-skyvoice:R"
```

---

## 7. Persistent storage for the admin panel, and folder permissions

Admin → Website Settings saves everything to `SETTINGS_FILE` (`C:\SkyVoiceData\settings\site-settings.json`).
- The file is created on the **first save**. Until then the site shows built-in defaults.
- Each save first copies the old file to `site-settings.json.bak`, then replaces it atomically.

Grant the service account exactly the access it needs:

```powershell
# Read the code
icacls C:\sites\skyvoicelanguages /grant "svc-skyvoice:(OI)(CI)RX" /T /Q
# Write settings and logs
icacls C:\SkyVoiceData\settings /grant "svc-skyvoice:(OI)(CI)M"
icacls C:\SkyVoiceData\logs     /grant "svc-skyvoice:(OI)(CI)M"
```

The `.next` folder is created by the build in step 8, and you grant write access to it there. Pages are regenerated into it after each admin save.

**Daily backup of the settings file** (keeps 30 days):

```powershell
@'
$src = "C:\SkyVoiceData\settings\site-settings.json"
$dst = "C:\SkyVoiceData\backups"
if (Test-Path $src) { Copy-Item $src (Join-Path $dst ("site-settings-{0:yyyyMMdd-HHmm}.json" -f (Get-Date))) }
Get-ChildItem $dst -Filter "site-settings-*.json" | Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) | Remove-Item
'@ | Set-Content C:\SkyVoiceData\backup-settings.ps1 -Encoding UTF8

$action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\SkyVoiceData\backup-settings.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "SkyVoice settings backup" -Action $action -Trigger $trigger -User "SYSTEM" -RunLevel Highest
```

Also copy `C:\SkyVoiceData\backups` off the server regularly, e.g. to OneDrive, Azure Blob storage, or another machine.

**Restore:** stop the service, copy a backup over `site-settings.json`, start the service, and save once in the admin panel. The save refreshes every page.

---

## 8. Production build and the Windows service

### 8.1 Build

```powershell
cd C:\sites\skyvoicelanguages
pnpm build
```

- Expect `✓ Compiled successfully`, then a route list that includes `/free-ielts-assessment`, `/about`, `/contact`, `/admin/settings`, `/api/leads` and `/api/enquiries`, with no errors.
- The build reads `.env.local`, so prerendered pages already include any saved settings.

Then give the service account write access to the build output:

```powershell
icacls C:\sites\skyvoicelanguages\apps\web\.next /grant "svc-skyvoice:(OI)(CI)M" /T /Q
```

Quick manual test before creating the service (Ctrl+C to stop):

```powershell
cd C:\sites\skyvoicelanguages\apps\web
node node_modules\next\dist\bin\next start -H 127.0.0.1 -p 3000
# in a second window:
(Invoke-WebRequest http://127.0.0.1:3000/free-ielts-assessment -UseBasicParsing).StatusCode   # 200
```

`-H 127.0.0.1` makes Next listen on localhost only, so the internet can reach it only through Caddy.

### 8.2 Install NSSM (service wrapper)

Download **NSSM 2.24** from <https://nssm.cc/download> and copy `win64\nssm.exe` to `C:\tools\nssm\nssm.exe`.

### 8.3 Create the `skyvoice-web` service

The service calls `node.exe` directly rather than `pnpm`, so stopping the service stops Next cleanly.

```powershell
$nssm = "C:\tools\nssm\nssm.exe"
& $nssm install skyvoice-web "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next start -H 127.0.0.1 -p 3000"
& $nssm set skyvoice-web AppDirectory "C:\sites\skyvoicelanguages\apps\web"
& $nssm set skyvoice-web DisplayName "Sky Voice website (Next.js)"
& $nssm set skyvoice-web Start SERVICE_AUTO_START
& $nssm set skyvoice-web AppStdout "C:\SkyVoiceData\logs\skyvoice-web.out.log"
& $nssm set skyvoice-web AppStderr "C:\SkyVoiceData\logs\skyvoice-web.err.log"
& $nssm set skyvoice-web AppRotateFiles 1
& $nssm set skyvoice-web AppRotateOnline 1
& $nssm set skyvoice-web AppRotateBytes 10485760
& $nssm set skyvoice-web AppExit Default Restart
& $nssm set skyvoice-web AppRestartDelay 5000
& $nssm set skyvoice-web ObjectName ".\svc-skyvoice" "THE_SERVICE_ACCOUNT_PASSWORD"
& $nssm start skyvoice-web
```

NSSM grants the account the *Log on as a service* right automatically. If the service won't start, open `services.msc` → **Sky Voice website** → **Log On** and re-enter the password.

Check it:

```powershell
& $nssm status skyvoice-web                                     # SERVICE_RUNNING
Get-Content C:\SkyVoiceData\logs\skyvoice-web.out.log -Tail 5   # "✓ Ready in …"
(Invoke-WebRequest http://127.0.0.1:3000/about -UseBasicParsing).StatusCode   # 200
```

---

## 9. Reverse proxy and HTTPS with Caddy

1. Download the **Windows amd64** `caddy.exe` from <https://caddyserver.com/download> into `C:\caddy\`.
2. Create `C:\caddy\Caddyfile`:

   ```caddyfile
   {
       # Let's Encrypt account / expiry notices
       email you@example.com
   }

   skyvoicelanguages.com {
       encode zstd gzip

       # Caddy passes the original Host and sets X-Forwarded-For/-Proto/-Host
       # itself (it ignores values sent by clients). The app relies on this for
       # the admin CSRF check and the form rate limiter.
       reverse_proxy 127.0.0.1:3000

       log {
           output file C:/caddy/logs/access.log {
               roll_size 20MiB
               roll_keep 10
           }
       }
   }

   # Send www to the main domain (the site's canonical URLs use the bare domain).
   www.skyvoicelanguages.com {
       redir https://skyvoicelanguages.com{uri} permanent
   }
   ```

   Plain `http://` requests are redirected to `https://` automatically.

3. Check the configuration, then install Caddy as a service:

   ```powershell
   cd C:\caddy
   .\caddy.exe validate --config C:\caddy\Caddyfile
   & C:\tools\nssm\nssm.exe install caddy "C:\caddy\caddy.exe" "run --config C:\caddy\Caddyfile"
   & C:\tools\nssm\nssm.exe set caddy AppDirectory "C:\caddy"
   & C:\tools\nssm\nssm.exe set caddy AppStdout "C:\caddy\logs\caddy.log"
   & C:\tools\nssm\nssm.exe set caddy AppStderr "C:\caddy\logs\caddy.log"
   & C:\tools\nssm\nssm.exe set caddy Start SERVICE_AUTO_START
   & C:\tools\nssm\nssm.exe start caddy
   ```

   Caddy runs as SYSTEM. That is needed to bind ports 80/443, and it keeps the certificates under the SYSTEM profile.

4. Watch it get the certificates. **DNS from step 2 must already point here.**
   ```powershell
   Get-Content C:\caddy\logs\caddy.log -Tail 30 -Wait
   ```
   Look for `certificate obtained successfully` for both host names. Typical failures:
   - DNS not propagated yet, or ports 80/443 blocked by a cloud firewall or router.
   - Another program is on port 80.
   - An `AAAA` record points somewhere else.
5. After any Caddyfile change, run `& C:\tools\nssm\nssm.exe restart caddy`.

*(Optional, once everything works for a few days)* Add HSTS inside the `skyvoicelanguages.com { }` block:
`header Strict-Transport-Security "max-age=31536000"`. After this, browsers refuse plain HTTP for a year, so only add it once HTTPS is stable.

---

## 10. First login and initial settings

1. Open **https://skyvoicelanguages.com/admin** and sign in as `admin` with the password from step 6.1.
2. **Company tab:** confirm the domain is `https://skyvoicelanguages.com`.
3. **Contact tab:** phone, WhatsApp, email, address and hours.
4. **Courses & fees tab:** confirm the packages and fees.
5. **Integrations tab:**
   - Check **"Send submissions to"**.
   - The status list should show **SMTP email delivery: Configured** and **Admin password stored as a hash: Configured**.
6. Click **Save settings**. Expect *"Settings saved. The website now shows the new details."*
7. Check that `C:\SkyVoiceData\settings\site-settings.json` now exists.

---

## 11. Testing checklist

Tick each item. Use a phone on mobile data as well as your PC, so you test from outside your own network.

### 11.1 Domain, HTTPS and pages

```powershell
curl.exe -sI http://skyvoicelanguages.com          | Select-String "HTTP/|Location"   # 308 → https://
curl.exe -sI https://www.skyvoicelanguages.com     | Select-String "HTTP/|Location"   # 301 → https://skyvoicelanguages.com/
curl.exe -sI https://skyvoicelanguages.com         | Select-String "HTTP/|Location"   # 307 → /free-ielts-assessment
foreach ($p in "/free-ielts-assessment","/about","/contact","/privacy","/terms","/sitemap.xml","/robots.txt") {
  "{0,-24} {1}" -f $p, (Invoke-WebRequest "https://skyvoicelanguages.com$p" -UseBasicParsing).StatusCode   # all 200
}
curl.exe -s -o NUL -w "%{http_code}`n" https://skyvoicelanguages.com/mascot-demo    # 404 (dev-only page hidden)
curl.exe -s -o NUL -w "%{http_code}`n" https://skyvoicelanguages.com/does-not-exist # 404
```

- [ ] The browser shows a padlock; the certificate is issued by Let's Encrypt for `skyvoicelanguages.com`.
- [ ] Menu **Home · Fees · FAQ · About Us · Contact Us** works. From Fees, **Home** scrolls smoothly back to the top.
- [ ] The pages look right at phone, tablet and desktop widths.
- [ ] From another machine, `http://<server-ip>:3000` does **not** connect (the app is reachable only through Caddy).

### 11.2 Admin panel

- [ ] `https://skyvoicelanguages.com/admin/settings` while signed out redirects to the login page.
- [ ] A wrong password shows *"That username and password do not match."* More than 5 sign-in attempts from one IP within 15 minutes shows *"Too many sign-in attempts. Wait 15 minutes and try again."*
- [ ] Change the hero headline (Website content tab) and save. The home page shows the change on reload. Change it back and save again.
- [ ] Restart the service (`nssm restart skyvoice-web`) and reload the admin panel. Your saved values are still there, because they're stored in `C:\SkyVoiceData\settings`.
- [ ] **Sign out** returns you to the login page.

### 11.3 Email path check (before using the forms)

```powershell
Test-NetConnection smtp.gmail.com -Port 465        # or smtp.hostinger.com; TcpTestSucceeded : True
```

If it is `False`, outbound port 465 is blocked by your provider or firewall. Ask them to allow it.

### 11.4 Book My Free Assessment form (`/api/leads`)

1. Open `https://skyvoicelanguages.com/free-ielts-assessment`. In the hero form, enter name **"TEST – please ignore"**, a WhatsApp number such as `+91 98765 43210`, a city, IELTS type and target band, then click **Book my free assessment**.
2. **Expected in the browser:** you are taken to `/thank-you?submitted=1` (*"Your IELTS roadmap starts here."*).
3. **Expected in the inbox** (`NOTIFY_EMAIL_TO`, or the admin's "Send submissions to"), within about a minute:
   - Subject: **`Free assessment request: TEST – please ignore (<city>)`**
   - Body: a table with Name, WhatsApp, City, IELTS type, Target band, Page, any UTM values, and Submitted time.
   - Check the **Spam** folder the first time. If it's there, mark it *Not spam*.
4. Repeat once from the **closing form** at the bottom of the page.
5. Check that validation still works: submit with an empty name, and you should see *"Enter your full name."* with no request sent.

### 11.5 Contact Us form (`/api/enquiries`)

1. Open `https://skyvoicelanguages.com/contact`. Fill in name, **a real email address you can read**, mobile number, a topic and a message, then click **Send enquiry**.
2. **Expected in the browser:** a green message, *"Thank you. Your enquiry has been sent and the team will reply soon."*, and the form clears.
3. **Expected in the inbox:**
   - Subject **`Website enquiry: <topic> from <name>`**.
   - Click **Reply**. The reply must be addressed to the visitor's email (the app sets `Reply-To`), not to the sending account.
4. Validation: an invalid email should show *"Enter a valid email address."*

### 11.6 What a form error means

The browser message tells you which layer failed; then check the app's error log:

```powershell
Get-Content C:\SkyVoiceData\logs\skyvoice-web.err.log -Tail 30
Get-Content C:\SkyVoiceData\logs\skyvoice-web.out.log -Tail 30
```

| What you see | HTTP status | Cause | Fix |
|---|---|---|---|
| "Online booking is temporarily unavailable…" / "The enquiry form is temporarily unavailable…" | 503 | **No delivery channel configured.** The SMTP variables are missing or incomplete (all of `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` and a recipient are required), and there's no webhook | Fix `.env.local` and/or the Admin recipient, then `nssm restart skyvoice-web` |
| "We could not send your request/enquiry. Please try again shortly." | 502 | A configured channel failed. The log shows e.g. `[Free assessment request] email delivery failed: Invalid login: 535-5.7.8 …` | **535 / EAUTH:** wrong user or app password, or a normal Gmail password was used. **ETIMEDOUT / ECONNECTION:** port 465 blocked (11.3). **Sender rejected:** `NOTIFY_EMAIL_FROM` isn't an address the account may send as |
| "Too many attempts. Please wait a few minutes and try again." | 429 | Rate limit: 5 submissions per 10 minutes per visitor IP (resets on service restart) | Wait, or restart the service while testing |
| "Please review the highlighted form details." | 400 | The server rejected the input | Correct the fields |
| "We could not reach the server…" | — | The browser couldn't reach the site | Check that Caddy and `skyvoice-web` are running |

> If **every** visitor gets 429 at once, the proxy is not passing the real client IP, so all visitors share one limit. Caddy as configured above passes it correctly.

---

## 12. Deploying updates

```powershell
cd C:\sites\skyvoicelanguages
git pull
pnpm install --frozen-lockfile
& C:\tools\nssm\nssm.exe stop skyvoice-web
pnpm build
icacls C:\sites\skyvoicelanguages\apps\web\.next /grant "svc-skyvoice:(OI)(CI)M" /T /Q
& C:\tools\nssm\nssm.exe start skyvoice-web
```

- Downtime is about the length of the build (1–2 minutes). Stopping first avoids replacing files that the running server is using.
- `apps/web/.env.local` and `C:\SkyVoiceData\settings` are untouched by updates.
- **Rollback:** `git log --oneline` → `git checkout <previous-commit>`, then repeat the install/build/restart steps.
- After an update, quickly repeat checks 11.1 and one form test.

---

## 13. Security and maintenance checklist

- [ ] Only ports 80/443 are open. RDP is restricted to your IP (or reached via VPN), with a strong Administrator password.
- [ ] Windows Update stays on. Update Node.js 22 point releases monthly; a `node -v` patch upgrade needs only a service restart.
- [ ] `apps/web/.env.local` is readable only by Administrators, SYSTEM and `svc-skyvoice`.
- [ ] The admin password is strong. To change it, re-run step 6.1, update `.env.local`, and restart the service.
- [ ] Settings backups run daily and a copy leaves the server.
- [ ] Rotate `ADMIN_SESSION_SECRET` if you suspect a leak. This signs everyone out.
- [ ] Look at `C:\SkyVoiceData\logs` and `C:\caddy\logs` occasionally. Caddy renews certificates automatically, about 30 days before they expire.
- [ ] No `install.cmd` on the server. It was removed from the repository; see section 0.
- [ ] Before enabling **Analytics** in the admin panel, decide on cookie consent (India's DPDP Act).

---

## Appendix A — Service commands

```powershell
$nssm = "C:\tools\nssm\nssm.exe"
& $nssm status  skyvoice-web      # or caddy
& $nssm restart skyvoice-web
& $nssm stop    skyvoice-web
& $nssm edit    skyvoice-web      # GUI editor for the service settings
Get-Content C:\SkyVoiceData\logs\skyvoice-web.out.log -Tail 50 -Wait
```

## Appendix B — Using IIS instead of Caddy

Only if company policy requires IIS. You'll need:
- the IIS role;
- **URL Rewrite 2.1** and **Application Request Routing 3.0**;
- **win-acme** (<https://www.win-acme.com>) for Let's Encrypt certificates.

These settings are **required** for this app:

1. **ARR → Server Proxy Settings:** enable the proxy and **untick "Reverse rewrite host in response headers"**.
2. **Preserve the public host:** run `%windir%\system32\inetsrv\appcmd.exe set config -section:system.webServer/proxy -preserveHostHeader:true /commit:apphost`. Without this, admin **Save** fails the Server Actions origin check.
3. **Overwrite `X-Forwarded-For` with the real client IP.** ARR *appends* to any value the client sends, which lets visitors bypass the rate limit.
   - Allow the server variable `HTTP_X_FORWARDED_FOR` (URL Rewrite → View Server Variables).
   - In the rewrite rule, set it to `{REMOTE_ADDR}`.
4. **Rewrite rule:** match `(.*)` → `http://127.0.0.1:3000/{R:1}`, plus an HTTP→HTTPS redirect rule and a `www` → apex redirect.
5. Bind the site to `skyvoicelanguages.com` and `www.skyvoicelanguages.com` on ports 80 and 443. Run win-acme to issue the certificate and enable automatic renewal.

Everything else in this guide — the Node service, env file, storage and tests — stays the same.

## Appendix C — Files and settings this guide relies on (for maintainers)

| Concern | Source in the repo |
|---|---|
| Scripts | `package.json` (root: `build`), `apps/web/package.json` (`start`, `admin:hash-password`) |
| Package manager and native builds | `package.json` → `packageManager: pnpm@11.25.0`; `pnpm-workspace.yaml` → `allowBuilds` |
| Env variable reference | `apps/web/.env.example` |
| Form APIs | `apps/web/src/app/api/leads/route.ts`, `apps/web/src/app/api/enquiries/route.ts`, `apps/web/src/lib/delivery/deliver.ts` |
| Rate limiter (`X-Forwarded-For`) | `apps/web/src/lib/rate-limit.ts` |
| Admin auth and cookie | `apps/web/src/lib/admin/auth.ts`, `apps/web/src/app/admin/actions.ts` |
| Settings storage (`SETTINGS_FILE`) | `apps/web/src/lib/settings/store.ts` |
| Security headers | `apps/web/next.config.ts` |
