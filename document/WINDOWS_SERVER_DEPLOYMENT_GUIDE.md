# Sky Voice Languages — Windows Server + IIS Deployment Guide

Host the Next.js website on your own Windows Server behind **IIS**, and serve it at **https://skyvoicelanguages.com** (domain registered with Hostinger).

Written against the code on `main` (19 Oct 2026): Next.js 16.4, Node.js 22, pnpm 11.25.0. The IIS configuration file is in the repo at **`deploy/iis/web.config`**.

---

## 1. Why your deployment failed (`ERR_UNSAFE_PORT`) — read this first

### 1.1 Root cause: port 87 is blocked by the browser

`http://192.168.15.40:87/` → **`ERR_UNSAFE_PORT`** is not an IIS, Node.js or Next.js error. **The browser refused to connect before sending any request.**

Chrome, Edge, Firefox and Safari keep a list of ports reserved for other protocols and block web pages on them. **Port 87 is on that list.** Your server may have been running perfectly; no browser will ever open a site on port 87.

This was reproduced while writing this guide: a test server on 127.0.0.1 answered on ports 8088, 8444 and 5000, but Chromium returned `net::ERR_UNSAFE_PORT` for **87**, 6000 and 10080.

**The fix:**
- **Production:** serve the site on the standard ports **80 (HTTP) and 443 (HTTPS)**. The domain then works with no port in the URL.
  - If another site on this server already uses port 80, that's fine. IIS can host many sites on port 80/443 at once, distinguished by **host name bindings** (`skyvoicelanguages.com`). That's why you never need an odd port like 87.
- **Temporary internal testing by IP:** use a port browsers allow, such as **8088** (and **8444** for HTTPS testing). See the blocked-port list in [Appendix B](#appendix-b--browser-blocked-ports).

### 1.2 Two more problems you would have hit next (both tested)

These would have failed even on a good port. The guide below prevents both.

| Setup | Result (tested against this project's production build) | Prevented by |
|---|---|---|
| **IIS ARR proxy with default settings.** ARR replaces the `Host` header with the backend's (`127.0.0.1:3000`) | Admin **sign-in fails**. Next.js logs: *"`x-forwarded-host` … does not match `origin` … Invalid Server Actions request"*. Its built-in CSRF check compares the browser's site with the host it receives | `preserveHostHeader=true` plus an `X-Forwarded-Host` header (steps 9.2, 9.3 and 9.5) |
| **Admin over plain HTTP on an IP address** (e.g. `http://192.168.15.40:8088/admin`) | Sign-in seems to work, then **Save fails**: *"Your session has expired."* The admin session cookie is `Secure` in production, so the browser discards it on non-HTTPS pages | Use the admin panel only over **HTTPS** (step 10). Public pages and forms work over HTTP for testing |

### 1.3 IIS cannot run this app by itself

IIS does not execute Next.js. Pointing an IIS site at the project folder, the `.next` folder or `apps/web` will show errors or directory listings, never the site.

The correct setup, which this guide builds, has two parts:
1. **Node.js runs Next.js** as a Windows service on `127.0.0.1:3000`.
2. **IIS acts only as the front door**: host names, ports 80/443 and HTTPS. It forwards every request to Node through **URL Rewrite + Application Request Routing (ARR)**.

> Don't use `iisnode`. It is unmaintained and doesn't support this version of Next.js.

---

## 2. What you are deploying

| Item | In this project | What it means for deployment |
|---|---|---|
| App | `apps/web` in a pnpm monorepo (root `package.json` pins `pnpm@11.25.0`) | Install with pnpm from the **repo root** |
| Runtime | Next.js 16.4 needs Node ≥ 20.9; developed and tested on **Node 22** | Install Node.js **22 LTS (x64)** |
| Build | `pnpm build` (root) → `next build` in `apps/web` | Needs dev dependencies, so do a full install |
| Run | `next start` | Windows service `skyvoice-web` on `127.0.0.1:3000`, reachable only through IIS |
| Images | `sharp` (Windows x64 build allowed in `pnpm-workspace.yaml`) | Nothing extra to install |
| Forms | `POST /api/leads` (Book My Free Assessment), `POST /api/enquiries` (Contact Us) → SMTP email and/or webhook | **With neither configured, production returns 503** (deliberate) |
| Rate limit | 5 submissions per 10 minutes per IP, using `X-Forwarded-For` (`src/lib/rate-limit.ts`) | IIS must send the real client IP. The provided `web.config` does |
| Admin | `/admin`. Password-hash login; signed `HttpOnly` + `Secure` + `SameSite=Strict` cookie; saves via Server Actions | Needs **HTTPS** and the **public host forwarded** (section 1.2) |
| Settings storage | One JSON file at `SETTINGS_FILE`, written atomically with a `.bak` copy (`src/lib/settings/store.ts`) | Keep it outside the code folder, on a disk that persists, and back it up |
| Page cache | Public pages are prerendered; admin saves regenerate them into `apps/web/.next` | The service account needs **write access to `apps/web/.next`** |
| Config | `apps/web/.env.local`, read by `next build` and `next start` | Created from `deploy/production.env` (git-ignored) |

**Architecture**

```text
Visitor ──HTTP 80 / HTTPS 443──▶ IIS site "skyvoicelanguages"  (bindings: skyvoicelanguages.com, www.skyvoicelanguages.com)
                                  │  URL Rewrite + ARR, using deploy/iis/web.config
                                  │  keeps Host; adds X-Forwarded-For (client IP), X-Forwarded-Host, X-Forwarded-Proto
                                  ▼
                       Next.js on 127.0.0.1:3000  ← Windows service "skyvoice-web" (NSSM, runs as svc-skyvoice)
                                  │                 └─▶ SMTP (smtp.gmail.com:465 or smtp.hostinger.com:465)
                                  ▼
                 C:\SkyVoiceData\settings\site-settings.json  (admin settings, backed up daily)
```

**Paths used throughout** (change them if you like, but keep them consistent):

| Purpose | Path |
|---|---|
| Code (git checkout) | `C:\sites\skyvoicelanguages` |
| IIS site folder (holds only `web.config` and certificate challenge files) | `C:\inetpub\skyvoicelanguages` |
| Admin settings data | `C:\SkyVoiceData\settings` |
| Settings backups | `C:\SkyVoiceData\backups` |
| App logs | `C:\SkyVoiceData\logs` |
| Tools (NSSM, win-acme) | `C:\tools` |

---

## 3. Requirements checklist

- [ ] Windows Server 2019/2022/2025 x64, with 2+ vCPU, 4 GB+ RAM and 20 GB free disk.
- [ ] Administrator access (RDP).
- [ ] The server's LAN IP (yours is `192.168.15.40`) and the **public IP** of your internet connection.
- [ ] Your router/firewall can forward **public TCP 80 and 443 → 192.168.15.40:80 and :443** (NAT / port forwarding).
- [ ] Your internet provider doesn't block inbound 80/443. Some home/business lines do; ask if unsure.
- [ ] Outbound **TCP 465** allowed (form emails).
- [ ] Access to Hostinger hPanel for `skyvoicelanguages.com`.
- [ ] A sending mailbox: Gmail with 2-Step Verification (App Password), or a Hostinger Email mailbox.

---

## 4. DNS at Hostinger (start early — it can take time to propagate)

1. Find your **public** IP. On the server, run `Invoke-RestMethod https://api.ipify.org`.
   - `192.168.15.40` is a private LAN address; it can't go in DNS.
2. In **hPanel → Domains → skyvoicelanguages.com → DNS / Nameservers → DNS records**:

   | Type | Name | Points to | TTL |
   |---|---|---|---|
   | A | `@` | *your public IP* | 300 (raise to 3600 later) |
   | CNAME | `www` | `skyvoicelanguages.com` | 300 |

   - **Delete** other `A` records for `@`/`www` (Hostinger parking or Website Builder IPs). Also delete `AAAA` records unless your server really has public IPv6.
   - **Don't change** `MX`/`TXT`/mail records (they would break email).
   - If a `CAA` record exists, it must allow `letsencrypt.org`.
   - If the DNS tab is read-only, the domain uses other nameservers. Edit the records wherever those nameservers are managed.
3. **Port forwarding:** on your router/firewall, forward **TCP 80 → 192.168.15.40:80** and **TCP 443 → 192.168.15.40:443**.
4. Check DNS:
   ```powershell
   Resolve-DnsName skyvoicelanguages.com -Server 8.8.8.8 -Type A
   Resolve-DnsName www.skyvoicelanguages.com -Server 8.8.8.8
   ```

---

## 5. Prepare the server

Run everything in **PowerShell as Administrator**.

1. Install Windows updates, reboot, and check the time zone.
2. **Open the firewall** for web traffic:
   ```powershell
   New-NetFirewallRule -DisplayName "Web HTTP 80"   -Direction Inbound -Protocol TCP -LocalPort 80  -Action Allow
   New-NetFirewallRule -DisplayName "Web HTTPS 443" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
   # Temporary, for LAN testing by IP (remove in step 12):
   New-NetFirewallRule -DisplayName "SkyVoice test 8088" -Direction Inbound -Protocol TCP -LocalPort 8088,8444 -Action Allow
   ```
   Never open 3000; Next.js listens on localhost only.
3. **Enable long paths**, needed for `node_modules`:
   ```powershell
   Set-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name LongPathsEnabled -Value 1
   ```
4. **Node.js 22 LTS (x64 .msi)** from <https://nodejs.org/en/download>. Open a new PowerShell window and check `node -v` shows `v22.x`.
5. **pnpm (the version the repo pins):** `npm install -g pnpm@11.25.0`, then check `pnpm -v` shows `11.25.0`.
6. **Git for Windows** from <https://git-scm.com/download/win>.
7. **Folders:**
   ```powershell
   New-Item -ItemType Directory -Force C:\sites, C:\inetpub\skyvoicelanguages, C:\SkyVoiceData\settings, C:\SkyVoiceData\backups, C:\SkyVoiceData\logs, C:\tools\nssm, C:\tools\win-acme | Out-Null
   ```
8. **Service account** (the app never runs as Administrator):
   ```powershell
   $pw = Read-Host -AsSecureString "Password for svc-skyvoice"
   New-LocalUser -Name "svc-skyvoice" -Password $pw -PasswordNeverExpires -UserMayNotChangePassword -Description "Runs the Sky Voice website"
   ```
9. **Make sure port 3000 is free** for Next.js:
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
   ```
   If something else uses port 3000, choose another port, e.g. 3005. Use it in **both** step 8.3 (`-p 3005`) and `web.config` (`http://127.0.0.1:3005`).

---

## 6. Code and dependencies

```powershell
cd C:\sites
git clone https://github.com/BharathKumar-c/skyvoicelanguages.git
cd C:\sites\skyvoicelanguages
git checkout main
pnpm install --frozen-lockfile
```

- The repository is **public**, so no credentials are needed. If you make it private, use a read-only fine-grained token or a deploy key.
- `--frozen-lockfile` installs exactly the tested versions from `pnpm-lock.yaml`. `package.json` uses `"latest"` ranges, so this flag matters.
- If pnpm says a build script for `sharp` was ignored, run `pnpm rebuild sharp`.

> Don't copy your development `apps/web/.env.local` to the server. It contains a dev-only admin password.

---

## 7. Production environment file

The repo has a ready template at **`deploy/production.env`** on your development PC. It is git-ignored, so it isn't in the clone; copy it over RDP. It lists every variable the app reads, and `ADMIN_SESSION_SECRET` is already generated.

1. **Fill in the empty values** (on your PC or the server):
   - **Admin password hash:** run the command below and paste the printed `ADMIN_PASSWORD_HASH=…` line. Its new `ADMIN_SESSION_SECRET` line is optional; the file already has one.
     ```powershell
     cd C:\sites\skyvoicelanguages
     pnpm --filter @skyvoice/web admin:hash-password
     ```
   - **Email:**
     - `SMTP_USER`: the sending address.
     - `SMTP_PASS`:
       - **Gmail:** a 16-character App Password from <https://myaccount.google.com/apppasswords> (requires 2-Step Verification), with no spaces. Never use your normal Gmail password.
       - **Hostinger Email:** set `SMTP_HOST=smtp.hostinger.com`, `SMTP_USER` to the full mailbox address, and `SMTP_PASS` to that mailbox's password.
     - `NOTIFY_EMAIL_TO`: the inbox that receives form submissions.
   - These are already set correctly and can stay as they are: `SETTINGS_FILE=C:\SkyVoiceData\settings\site-settings.json`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `ADMIN_USERNAME=admin`.
2. **Place it** at `C:\sites\skyvoicelanguages\apps\web\.env.local`.
3. **Lock it down:**
   ```powershell
   icacls C:\sites\skyvoicelanguages\apps\web\.env.local /inheritance:r /grant:r "Administrators:F" "SYSTEM:F" "svc-skyvoice:R"
   ```

**Rules:**
- No `ADMIN_PASSWORD` in production (it's ignored there).
- Write a literal `$` as `\$`.
- Restart the service after every change.
- `NEXT_PUBLIC_*` values need a rebuild; you don't need them, because videos are set in the admin panel.
- **Never commit this file.** The repository is public.

---

## 8. Storage, build, and the Node.js service

### 8.1 Folder permissions and settings backups

```powershell
icacls C:\sites\skyvoicelanguages /grant "svc-skyvoice:(OI)(CI)RX" /T /Q
icacls C:\SkyVoiceData\settings  /grant "svc-skyvoice:(OI)(CI)M"
icacls C:\SkyVoiceData\logs      /grant "svc-skyvoice:(OI)(CI)M"
```

Admin → Website Settings saves to `C:\SkyVoiceData\settings\site-settings.json`. The file is created on the first save, and each save keeps the previous version as `.bak`. Back it up daily:

```powershell
@'
$src = "C:\SkyVoiceData\settings\site-settings.json"; $dst = "C:\SkyVoiceData\backups"
if (Test-Path $src) { Copy-Item $src (Join-Path $dst ("site-settings-{0:yyyyMMdd-HHmm}.json" -f (Get-Date))) }
Get-ChildItem $dst -Filter "site-settings-*.json" | Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) | Remove-Item
'@ | Set-Content C:\SkyVoiceData\backup-settings.ps1 -Encoding UTF8
Register-ScheduledTask -TaskName "SkyVoice settings backup" -User "SYSTEM" -RunLevel Highest `
  -Action (New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\SkyVoiceData\backup-settings.ps1") `
  -Trigger (New-ScheduledTaskTrigger -Daily -At 2am)
```

Copy `C:\SkyVoiceData\backups` off the server regularly.

### 8.2 Build

```powershell
cd C:\sites\skyvoicelanguages
pnpm build
icacls C:\sites\skyvoicelanguages\apps\web\.next /grant "svc-skyvoice:(OI)(CI)M" /T /Q
```

Expect `✓ Compiled successfully`, then a route list that includes `/free-ielts-assessment`, `/about`, `/contact`, `/admin/settings`, `/api/leads` and `/api/enquiries`.

### 8.3 Run Next.js as a Windows service (NSSM)

1. Download **NSSM 2.24** from <https://nssm.cc/download> and copy `win64\nssm.exe` to `C:\tools\nssm\`.
2. Create the service:

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
& $nssm set skyvoice-web ObjectName ".\svc-skyvoice" "THE_SVC_SKYVOICE_PASSWORD"
& $nssm start skyvoice-web
```

`-H 127.0.0.1` means only this server, and therefore only IIS, can reach Next.js. This start command was tested against the project's production build. It answered on 127.0.0.1 and refused connections from the network.

**Check that it's running:**

```powershell
& $nssm status skyvoice-web                                                # SERVICE_RUNNING
Get-Content C:\SkyVoiceData\logs\skyvoice-web.out.log -Tail 5              # "✓ Ready in …"
(Invoke-WebRequest http://127.0.0.1:3000/about -UseBasicParsing).StatusCode   # 200
```

**Don't continue until this returns 200.** If it fails, read `skyvoice-web.err.log`. Common causes: `.env.local` is missing, the build failed, or port 3000 is in use.

---

## 9. Configure IIS as the reverse proxy

### 9.1 Install IIS and the two required modules

```powershell
Install-WindowsFeature Web-Server, Web-Mgmt-Console, Web-Http-Redirect, Web-Http-Logging -IncludeManagementTools
```

Then download and install, **in this order**:
1. **URL Rewrite 2.1** (x64): <https://www.iis.net/downloads/microsoft/url-rewrite>
2. **Application Request Routing 3.0** (x64): <https://www.iis.net/downloads/microsoft/application-request-routing>

Close and reopen IIS Manager afterwards. **URL Rewrite** should appear under the server and the site, and **Application Request Routing Cache** under the server.

### 9.2 Enable the ARR proxy, with the settings this app requires

This is a server-level setting; run it once:

```powershell
$appcmd = "$env:windir\System32\inetsrv\appcmd.exe"
& $appcmd set config -section:system.webServer/proxy /enabled:"True" /preserveHostHeader:"True" /reverseRewriteHostInResponseHeaders:"False" /includePortInXForwardedFor:"False" /responseBufferLimit:"0" /commit:apphost
```

| Setting | Why |
|---|---|
| `enabled=True` | Turns ARR's proxy on. Without it, the rewrite rule can't forward to Node and you get 404s |
| `preserveHostHeader=True` | Next.js sees `skyvoicelanguages.com`, not `127.0.0.1:3000`. **Without it, admin sign-in fails** (section 1.2) |
| `reverseRewriteHostInResponseHeaders=False` | Leaves the app's own redirects untouched |
| `includePortInXForwardedFor=False` | Keeps the client IP as `1.2.3.4`, not `1.2.3.4:51234`, so the rate limiter counts per visitor rather than per connection |
| `responseBufferLimit=0` | Streams responses instead of buffering them; Next.js streams pages |

To do this in the GUI instead: IIS Manager → server node → **Application Request Routing Cache** → **Server Proxy Settings…** → tick *Enable proxy*. **Untick** *Reverse rewrite host in response headers* and *Include TCP port from client IP*, set *Response buffer threshold* to 0, and Apply. `preserveHostHeader` has no GUI checkbox, so run the `appcmd` line above anyway.

### 9.3 Allow the forwarded-header server variables

`web.config` sets three request headers, and IIS only allows that once they are whitelisted at server level:

```powershell
foreach ($v in "HTTP_X_FORWARDED_FOR","HTTP_X_FORWARDED_HOST","HTTP_X_FORWARDED_PROTO") {
  & $appcmd set config -section:system.webServer/rewrite/allowedServerVariables /+"[name='$v']" /commit:apphost
}
```

(If a variable is already listed, `appcmd` reports a duplicate. That's harmless.)

### 9.4 Create the application pool and site

```powershell
Import-Module WebAdministration

# A pool with no .NET: IIS only forwards requests, it runs no code for this site.
New-WebAppPool -Name "skyvoicelanguages"
Set-ItemProperty "IIS:\AppPools\skyvoicelanguages" -Name managedRuntimeVersion -Value ""

# The site, bound to the real host names on port 80 (other sites on port 80 are unaffected).
New-Website -Name "skyvoicelanguages" -PhysicalPath "C:\inetpub\skyvoicelanguages" `
  -ApplicationPool "skyvoicelanguages" -Port 80 -HostHeader "skyvoicelanguages.com"
New-WebBinding -Name "skyvoicelanguages" -Protocol http -Port 80 -HostHeader "www.skyvoicelanguages.com"

# TEMPORARY binding for LAN testing by IP, on a browser-safe port (removed in step 12).
New-WebBinding -Name "skyvoicelanguages" -Protocol http -Port 8088 -IPAddress "*"
```

If `New-Website` complains that the binding is in use, another site already has the same host name on port 80. Remove it from that site first.

### 9.5 Add the project's web.config

Copy **`deploy/iis/web.config`** from the repository into the site folder:

```powershell
Copy-Item C:\sites\skyvoicelanguages\deploy\iis\web.config C:\inetpub\skyvoicelanguages\web.config
iisreset /restart
```

What it does:

| Rule | Effect |
|---|---|
| 1. ACME challenge | Lets IIS serve Let's Encrypt validation files from the site folder (step 10) |
| 2. Redirect to HTTPS | **Disabled until HTTPS works** (step 10) |
| 3. Redirect www to apex | **Disabled until HTTPS works** (step 10) |
| 4. Proxy to Next.js | Forwards everything else to `http://127.0.0.1:3000`, keeping the original URL. Sets `X-Forwarded-For` to the real client IP, replacing any value the visitor sent; sets `X-Forwarded-Host` to the public host name and `X-Forwarded-Proto` to `http`/`https` |

It also turns off IIS compression for this site (Next.js already compresses) and removes the `X-Powered-By` header.

### 9.6 First test on the LAN (HTTP, port 8088)

From any PC on your network, open **http://192.168.15.40:8088/**.

- [ ] It redirects to `/free-ielts-assessment` and the page loads with styles and images.
- [ ] **About Us**, **Contact Us**, **Fees** and **FAQ** work.
- [ ] Both forms work over HTTP. See step 13 for full form testing; you can do it now if SMTP is configured.
- [ ] Expected limitation: the **admin panel** won't keep you signed in over plain HTTP (section 1.2). Test it after step 10.

To test the real host name before DNS points at the server, add a hosts-file entry **on your test PC** (not the server). Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator, add the line `192.168.15.40  skyvoicelanguages.com www.skyvoicelanguages.com`, then open `http://skyvoicelanguages.com/`. Remove the line afterwards.

If you see an IIS error page instead of the site, check [section 14](#14-troubleshooting).

---

## 10. HTTPS with Let's Encrypt (win-acme)

Prerequisites:
- DNS (step 4) resolves to your public IP.
- Ports 80/443 are forwarded to 192.168.15.40.
- `http://skyvoicelanguages.com/` loads from **outside** your network (e.g. a phone on mobile data).

1. Download **win-acme** (`win-acme.v2.x.x.x64.trimmed.zip`) from <https://www.win-acme.com> and extract it to `C:\tools\win-acme`.
2. Run it as Administrator: `C:\tools\win-acme\wacs.exe`.
   - Choose **N: Create certificate (default settings)**.
   - Pick the IIS site **skyvoicelanguages**.
   - Select **both** host names (`skyvoicelanguages.com`, `www.skyvoicelanguages.com`).
   - Accept the terms and enter your email.
3. win-acme validates through rule 1 of `web.config`, then:
   - adds **HTTPS bindings on port 443 (with SNI)** for both names;
   - creates a scheduled task that renews the certificate automatically.
4. Check **https://skyvoicelanguages.com/**. The padlock should show a certificate issued by Let's Encrypt.
5. **Turn on the redirects.** Edit `C:\inetpub\skyvoicelanguages\web.config` and change `enabled="false"` to `enabled="true"` on **"Redirect to HTTPS"** and **"Redirect www to apex"**, then save. IIS applies it immediately.
6. Check:
   ```powershell
   curl.exe -sI http://skyvoicelanguages.com      | Select-String "HTTP/|Location"   # 301 → https://skyvoicelanguages.com/
   curl.exe -sI https://www.skyvoicelanguages.com | Select-String "HTTP/|Location"   # 301 → https://skyvoicelanguages.com/
   curl.exe -sI https://skyvoicelanguages.com     | Select-String "HTTP/|Location"   # 307 → /free-ielts-assessment
   ```

*Optional, for admin testing on the LAN before public DNS works:*
1. IIS Manager → server → **Server Certificates** → **Create Self-Signed Certificate**.
2. Add an `https` binding on port **8444** to the site using that certificate.
3. Open `https://192.168.15.40:8444/admin` and accept the browser warning. The admin panel works there because the connection is HTTPS.

---

## 11. First admin login

1. Open **https://skyvoicelanguages.com/admin**. The username is `admin`; the password is the one you hashed in step 7.
2. **Company:** check that the domain is `https://skyvoicelanguages.com`.
3. Fill in **Contact** (phone, WhatsApp, email, address, hours) and check **Courses & fees**.
4. **Integrations:**
   - Set **"Send submissions to"**.
   - The status list should show **SMTP email delivery: Configured** and **Admin password stored as a hash: Configured**.
5. **Save settings**. Expect *"Settings saved. The website now shows the new details."* `C:\SkyVoiceData\settings\site-settings.json` now exists.

---

## 12. Clean up the temporary test access

Once the domain works over HTTPS:

```powershell
Remove-WebBinding -Name "skyvoicelanguages" -Port 8088 -Protocol http
Remove-WebBinding -Name "skyvoicelanguages" -Port 8444 -Protocol https -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "SkyVoice test 8088"
```

Also remove any hosts-file entries you added on test PCs.

---

## 13. Testing checklist

### 13.1 Site, links and HTTPS
- [ ] `https://skyvoicelanguages.com` shows the padlock. `http://` and `www` redirect to `https://skyvoicelanguages.com/`.
- [ ] `/free-ielts-assessment`, `/about`, `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt` all return 200.
  - `/mascot-demo` and `/does-not-exist` return 404 (the site's own 404 page, not IIS's).
- [ ] Menu **Home · Fees · FAQ · About Us · Contact Us** works. From Fees, **Home** scrolls smoothly to the top.
- [ ] Pages look right on a phone, a tablet and a desktop.
- [ ] From another PC, `http://192.168.15.40:3000` does **not** connect.

### 13.2 Admin panel (HTTPS only)
- [ ] Signed out, `/admin/settings` redirects to the login page.
- [ ] A wrong password shows *"That username and password do not match."*
  - More than 5 attempts per IP within 15 minutes shows *"Too many sign-in attempts…"*.
- [ ] Change the hero headline (Website content) and **Save**. The home page shows it on reload. Change it back.
- [ ] Run `nssm restart skyvoice-web` and reload the admin panel. Your values persist.
- [ ] **Sign out** returns you to the login page.

### 13.3 Email path

```powershell
Test-NetConnection smtp.gmail.com -Port 465     # or smtp.hostinger.com — TcpTestSucceeded : True
```

### 13.4 Book My Free Assessment (`/api/leads`)
1. On the home page, submit the hero form with name **"TEST – please ignore"**, a WhatsApp number such as `+91 98765 43210`, a city, a test type and a target band.
2. **Browser:** you land on `/thank-you?submitted=1` (*"Your IELTS roadmap starts here."*).
3. **Inbox:** an email with subject **`Free assessment request: TEST – please ignore (<city>)`**, containing a details table. Check Spam the first time.
4. Repeat with the form at the bottom of the page.
5. Submitting an empty name shows *"Enter your full name."*

### 13.5 Contact Us (`/api/enquiries`)
1. On `/contact`, submit with **a real email address you can read**.
2. **Browser:** *"Thank you. Your enquiry has been sent and the team will reply soon."*, and the form clears.
3. **Inbox:** an email with subject **`Website enquiry: <topic> from <name>`**. Clicking **Reply** addresses the visitor (`Reply-To`).
4. An invalid email shows *"Enter a valid email address."*

### 13.6 What form errors mean

| Browser message | Status | Cause | Fix |
|---|---|---|---|
| "Online booking is temporarily unavailable…" / "The enquiry form is temporarily unavailable…" | 503 | No delivery channel. The SMTP variables or recipient are missing (and there's no webhook) | Fix `.env.local` or Admin → Integrations, then `nssm restart skyvoice-web` |
| "We could not send your request/enquiry. Please try again shortly." | 502 | SMTP or webhook failed. The log shows e.g. `[Free assessment request] email delivery failed: Invalid login: 535…` | **535:** wrong user or app password. **ETIMEDOUT:** port 465 is blocked. **Sender rejected:** `NOTIFY_EMAIL_FROM` isn't allowed for that account |
| "Too many attempts. Please wait a few minutes…" | 429 | 5 submissions per 10 minutes per IP | Wait, or restart the service while testing. If **every** visitor gets this, the client IP isn't being forwarded; check 9.3 and 9.5 |
| "We could not reach the server…" | — | IIS or Node is down | Check the IIS site and `nssm status skyvoice-web` |

Logs: `Get-Content C:\SkyVoiceData\logs\skyvoice-web.err.log -Tail 30`

---

## 14. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| **`ERR_UNSAFE_PORT`** | Browser-blocked port, e.g. **87** | Use 80/443 with host-name bindings, or 8088/8444 for testing ([Appendix B](#appendix-b--browser-blocked-ports)) |
| `ERR_CONNECTION_REFUSED` / timeout on 80/443 | Firewall, router port forwarding, or the site isn't started | Check step 5 firewall rules and step 4 NAT. In IIS Manager, check the site is **Started** and the bindings are right |
| IIS **404** page | URL Rewrite or ARR proxy is not active, or `web.config` is missing | Steps 9.1, 9.2 and 9.5. Check `C:\inetpub\skyvoicelanguages\web.config` exists |
| IIS **500.19** | `web.config` uses the rewrite module but URL Rewrite isn't installed | Install URL Rewrite 2.1 (9.1) |
| IIS **500.50 URL Rewrite Module Error** | A server variable isn't allowed | Run step 9.3 |
| IIS **502.3 Bad Gateway** | Node isn't running on 127.0.0.1:3000 | `nssm status skyvoice-web`; read `skyvoice-web.err.log`; `Invoke-WebRequest http://127.0.0.1:3000/about` |
| Admin login loops, or log says **"Invalid Server Actions request"** | Host isn't preserved, or `X-Forwarded-Host` is missing | Re-run the 9.2 `appcmd` line (`preserveHostHeader:True`) and check 9.3 and 9.5 |
| Admin save says **"Your session has expired"** right after sign-in | Using the admin panel over plain HTTP | Use `https://` (step 10) |
| Admin save says *"The server could not store the settings"* | The service account can't write to the settings folder | Re-run the `icacls` commands in 8.1 |
| Saved settings don't appear on pages | The service account can't write to `.next` | Re-run the `.next` `icacls` command in 8.2 |
| win-acme validation fails | DNS isn't pointing here yet, port 80 isn't reachable from the internet, or rule 1 is missing | Test `http://skyvoicelanguages.com` from mobile data; wait for DNS; check `web.config` |
| Old version still showing after an update | The service wasn't restarted after the build | Step 15 |

---

## 15. Deploying updates

```powershell
cd C:\sites\skyvoicelanguages
git pull
pnpm install --frozen-lockfile
& C:\tools\nssm\nssm.exe stop skyvoice-web
pnpm build
icacls C:\sites\skyvoicelanguages\apps\web\.next /grant "svc-skyvoice:(OI)(CI)M" /T /Q
& C:\tools\nssm\nssm.exe start skyvoice-web
```

- If `deploy/iis/web.config` changed in the update, copy it to `C:\inetpub\skyvoicelanguages\` again, and **re-enable rules 2 and 3**: the repo copy ships them disabled.
- `.env.local` and `C:\SkyVoiceData` are never touched by updates.
- **Rollback:** `git checkout <previous-commit>`, then repeat the commands above.

---

## 16. Security checklist

- [ ] Only 80/443 are open publicly; the temporary 8088/8444 access is removed (step 12).
- [ ] RDP is limited to trusted IPs or a VPN.
- [ ] `.env.local` is readable only by Administrators, SYSTEM and `svc-skyvoice`, and is never committed (the repo is public).
- [ ] The admin password is strong. To change it: step 7 hash, update `.env.local`, restart the service.
- [ ] Settings backups run daily and a copy leaves the server.
- [ ] Windows Update and Node.js 22 patch releases are kept current (a Node patch only needs a service restart).
- [ ] Decide on cookie consent before enabling **Analytics** in the admin panel.

---

## Appendix A — Service commands

```powershell
$nssm = "C:\tools\nssm\nssm.exe"
& $nssm status skyvoice-web;  & $nssm restart skyvoice-web;  & $nssm stop skyvoice-web
Get-Content C:\SkyVoiceData\logs\skyvoice-web.out.log -Tail 50 -Wait
iisreset /restart          # restarts all of IIS (all sites)
```

## Appendix B — Browser-blocked ports

Chromium-based browsers (Chrome, Edge) refuse these ports with `ERR_UNSAFE_PORT`; Firefox and Safari block a similar list. **Never use them for a website.**

`1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 137, 139, 143, 161, 179, 389, 427, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 548, 554, 556, 563, 587, 601, 636, 989, 990, 993, 995, 1719, 1720, 1723, 2049, 3659, 4045, 4190, 5060, 5061, 6000, 6566, 6665–6669, 6679, 6697, 10080`

Safe choices: **80** and **443** for production. For temporary testing: **8088**, **8444**, 8000, 8081, 8443, 9000.

## Appendix C — Project files this guide relies on

| Concern | File |
|---|---|
| IIS reverse proxy rules | `deploy/iis/web.config` |
| Production env template (git-ignored) | `deploy/production.env` |
| Scripts | `package.json` (`build`), `apps/web/package.json` (`start`, `admin:hash-password`) |
| Package manager, native builds | `package.json` → `packageManager`, `pnpm-workspace.yaml` → `allowBuilds` |
| Form APIs and email | `apps/web/src/app/api/leads/route.ts`, `apps/web/src/app/api/enquiries/route.ts`, `apps/web/src/lib/delivery/deliver.ts` |
| Rate limiter (`X-Forwarded-For`) | `apps/web/src/lib/rate-limit.ts` |
| Admin auth and cookie | `apps/web/src/lib/admin/auth.ts`, `apps/web/src/app/admin/actions.ts` |
| Settings storage | `apps/web/src/lib/settings/store.ts` |
