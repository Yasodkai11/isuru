# Hostinger Deployment Guide for Isuru Gems

This guide walks you through deploying the **Isuru Gems** Next.js eCommerce application to Hostinger.

---

## 📦 What's Inside the Deployment Archive (`isuru-gems-hostinger-deploy.zip`)

The deployment zip is a clean deployment package configured specifically for Hostinger's build and runtime pipeline:
- `server.js` — The production Node.js HTTP server runtime launcher
- `src/` & `public/` — Application source code and static assets (gemstones, logos, UI)
- `package.json` — Pre-configured with:
  - `"build": "next build"` (Compiles the application into production standalone bundle)
  - `"start": "node server.js"` (Starts the production HTTP server)
  - `"serve": "node server.js"` (Alternative runtime server launcher)
- `ecosystem.config.cjs` — PM2 process manager configuration (runs `node server.js` directly)
- `.htaccess.example` — Reverse proxy configuration for Apache / LiteSpeed web servers
- `.env.example` — Template with all required Supabase and API environment variables
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` — Build configuration files

> [!IMPORTANT]
> **No Stale `.next` Directory**: The uploaded archive intentionally excludes `.next/` and `node_modules/`. When Hostinger deploys, it runs `npm install` and executes `npm run build` (`next build`) to compile a completely fresh, native `.next/` build directly on Hostinger's Linux environment.

---

## ⚙️ Architecture: Build Step vs Runtime Launcher

Understanding how Hostinger processes the application:

1. **Build Step (`npm run build` -> `next build`)**:
   - Hostinger's deployment pipeline runs `npm run build` as its build command.
   - Next.js compiles the project, creates the production standalone bundle in `.next/`, and **exits with code 0**.

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
   - **Node.js version:** `20.x` or `22.x`.
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
3. Click **Redeploy** (or Start / Restart Application).
4. Visit your domain in the browser to verify the site is live.

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
npm install
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
- **Cause**: Occurs if `node_modules` from a different OS (e.g. Windows) was included in the upload, causing native binary mismatches (such as `lightningcss`), or if the CSS toolchain packages are out of sync.
- **Fix**:
  1. The deployment archive (`isuru-gems-hostinger-deploy.zip`) excludes `node_modules` and `.next`.
  2. The server must run `npm install` on Linux so native binaries (`lightningcss`, `sharp`) match the Linux architecture.
  3. Ensure `postcss.config.mjs` references only `@tailwindcss/postcss`.

### Where can I check logs if something doesn't load?
- **In hPanel:** In the Node.js manager, click the **Logs** tab or check `stderr.log` / `stdout.log` in your application root directory.
- **In VPS:** Run `pm2 logs isuru-gems`.
