# Hostinger Deployment Guide for Isuru Gems

This guide walks you through deploying the **Isuru Gems** Next.js eCommerce application to Hostinger.

---

## 📦 What's Inside the Deployment Archive (`isuru-gems-hostinger-deploy.zip`)

The deployment zip is a clean deployment package configured specifically for Hostinger's build and runtime pipeline:
- `server.js` — The production Node.js HTTP server runtime launcher
- `src/` & `public/` — Application source code and static assets (gemstones, logos, UI)
- `package.json` — Pre-configured with:
  - `"build": "next build --webpack"` (Webpack production build; avoids Hostinger Turbopack PostCSS worker crashes)
  - `"start": "node server.js"` (Starts the production HTTP server)
  - `"serve": "node server.js"` (Alternative runtime server launcher)
- `ecosystem.config.cjs` — PM2 process manager configuration (runs `node server.js` directly)
- `.htaccess.example` — Reverse proxy configuration for Apache / LiteSpeed web servers
- `.env.example` — Template with all required Supabase and API environment variables
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` — Build configuration files

> [!IMPORTANT]
> **Clean Linux install**: The uploaded archive intentionally excludes `.next/` and `node_modules/`. Use Node.js `22.x` and run `npm ci` on the Linux host before `npm run build`; this installs the exact dependency versions in `package-lock.json`, including the matching native binaries. If deploying over an existing application directory, remove its old `node_modules/` and `.next/` first.

---

## ⚙️ Architecture: Build Step vs Runtime Launcher

Understanding how Hostinger processes the application:

1. **Build Step (`npm run build` -> `next build --webpack`)**:
   - Hostinger's deployment pipeline runs `npm run build` as its build command.
   - Next.js compiles with Webpack (not Turbopack), creates the production standalone bundle in `.next/`, and **exits with code 0**.

2. **Runtime Launcher (`node server.js` or `npm run start`)**:
   - Once the build succeeds, Hostinger's LiteSpeed node engine (`lsnode.js`) or PM2 launches the HTTP server using `node server.js` directly (or `npm run start`).
   - `server.js` sets `__NEXT_PRIVATE_STANDALONE_CONFIG` and uses Next.js's native `startServer` API. This completely eliminates runtime Webpack dependency checks that caused `Cannot find module 'next/dist/compiled/webpack/webpack-lib'`.

---

## 🚀 Option 1: Deploying via Hostinger hPanel (Node.js Application / Web Apps)

*(Recommended for Hostinger Cloud, Business, or plans with Node.js Web Apps)*

### Step 1: Upload the Files
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** > click **Manage** next to your domain (`isuruceylon.com`).
3. If using **Web Applications / Node.js Web Apps**:
   - Click **Redeploy** or upload the new `isuru-gems-hostinger-deploy.zip`.
4. If using **File Manager**:
   - Navigate to the application root directory.
   - Upload and extract `isuru-gems-hostinger-deploy.zip`.

### Step 2: Configure Node.js in hPanel
1. In hPanel, navigate to **Websites** > **Dashboard** or **Node.js**:
   - **Node.js version:** `22.x`.
   - **Application mode:** `Production`.
   - **Application startup file:** `server.js`.
2. In the **Environment variables** section, add your production keys:
   - `NODE_ENV` = `production`
   - `PORT` = Leave unset if Hostinger assigns dynamic ports, or set to `3000`.
   - `NEXT_PUBLIC_SITE_URL` = `https://isuruceylon.com`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your_supabase_service_role_key`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   *(Alternatively, create a file named `.env` in the folder alongside `server.js` with these values)*.
3. If the deployment settings expose install and build commands, use `npm ci` and `npm run build` respectively. If they do not, ensure the platform's install step uses `package-lock.json` and performs a clean install; remove any existing `node_modules/` and `.next/` before redeploying over an existing application directory.
4. Click **Redeploy** (or Start / Restart Application).
5. Visit your domain in the browser to verify the site is live.

---

## ⚡ Option 2: Deploying on Hostinger VPS (SSH & PM2)

*(Recommended for Hostinger VPS with Ubuntu/Debian)*

### Step 1: Upload and Extract
```bash
# Upload isuru-gems-hostinger-deploy.zip to /var/www/isuru-gems
mkdir -p /var/www/isuru-gems
cd /var/www/isuru-gems
unzip isuru-gems-hostinger-deploy.zip
```

### Step 2: Install Dependencies & Run Build Step
```bash
npm ci
npm run build # Compiles the Next.js standalone application into .next/
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
nano .env
# Fill in your Supabase & Gemini keys, then save (Ctrl+O, Enter, Ctrl+X)
```

### Step 4: Start Runtime with PM2
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the application with PM2 (runs node server.js directly)
pm2 start ecosystem.config.cjs

# Save PM2 state for automatic restarts on server reboot
pm2 save
pm2 startup
```

### Step 5: Configure Nginx Reverse Proxy (VPS)
Add this to your Nginx site configuration (e.g., `/etc/nginx/sites-available/isuru-gems`):
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Then issue an SSL certificate with Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔑 Required Environment Variables Summary

| Variable | Description |
|---|---|
| `NODE_ENV` | Must be `production` |
| `PORT` | Web server port (defaults to `3000` or Hostinger-assigned port) |
| `NEXT_PUBLIC_SITE_URL` | Your public domain (e.g., `https://isurugems.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Supabase service role key (for server actions/admin) |
| `GEMINI_API_KEY` | Google Gemini API key (for AI features) |

---

## ❓ Frequently Asked Questions & Troubleshooting

### Build fails inside Turbopack while processing `globals.css` (PostCSS child process exit 0)
- **Cause**: Next.js 16 defaults to Turbopack for `next build`. On Hostinger, Turbopack's PostCSS worker often fails to spawn (`node process exited before we could connect`), which surfaces as a fatal error on `src/app/globals.css`. Stale cross-OS `node_modules` can make this worse.
- **Fix** (already applied in this package):
  1. Build with Webpack: `"build": "next build --webpack"` in `package.json`.
  2. Keep CSS toolchain packages (`@tailwindcss/postcss`, `tailwindcss`, `postcss`, `lightningcss`) in `dependencies` so they install even when `NODE_ENV=production`.
  3. The deployment archive excludes `node_modules` and `.next`. Remove any stale copies on the server, then redeploy / `npm ci` with Node.js `22.x`.

### Where can I check logs if something doesn't load?
- **In hPanel:** In the Node.js manager, click the **Logs** tab or check `stderr.log` / `stdout.log` in your application root directory.
- **In VPS:** Run `pm2 logs isuru-gems`.
