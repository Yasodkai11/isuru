# Hostinger Deployment Guide for Isuru Gems

This guide walks you through deploying the **Isuru Gems** Next.js eCommerce application to Hostinger.

---

## 📦 What's Inside the Deployment Archive (`isuru-gems-hostinger-deploy.zip`)

The deployment zip is a clean deployment package configured specifically for Hostinger's build and runtime pipeline:
- `server.js` — The production Node.js HTTP server runtime launcher
- `src/` & `public/` — Application source code and static assets (gemstones, logos, UI)
- `package.json` — Pre-configured with:
  - `"start": "next build"` (The platform's one-time build step)
  - `"serve": "node server.js"` (The runtime server launcher)
- `ecosystem.config.cjs` — PM2 process manager configuration (runs `node server.js` directly)
- `.htaccess.example` — Reverse proxy configuration for Apache / LiteSpeed web servers
- `.env.example` — Template with all required Supabase and API environment variables
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` — Build configuration files

> [!IMPORTANT]
> **No Stale `.next` Directory**: The uploaded archive intentionally excludes `.next/` and `node_modules/`. When Hostinger deploys, it runs `npm install` and executes `npm run start` (`next build`) to compile a completely fresh, native `.next/` build directly on Hostinger's Linux environment.

---

## ⚙️ Architecture: Build Step vs Runtime Launcher

Understanding how Hostinger processes the application prevents deployment timeouts:

1. **Build Step (`npm run start` -> `next build`)**:
   - Hostinger's deployment pipeline runs `npm run start` as its build command.
   - Because `start` is set to `next build`, Next.js compiles the project, creates the `.next/` directory, and **exits with code 0**.
   - It does *not* launch a persistent server during the build phase.

2. **Runtime Launcher (`node server.js`)**:
   - Once the build succeeds, Hostinger / PM2 launches the persistent HTTP server using `node server.js` directly (or `npm run serve`).
   - The runtime launcher MUST NOT use `npm run start`.

---

## 🚀 Option 1: Deploying via Hostinger hPanel (Node.js Application)

*(Recommended for Hostinger Cloud, Business, or plans with the Node.js selector)*

### Step 1: Upload the Files
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** > click **Manage** next to your domain.
3. Open **Files** > **File Manager**.
4. Navigate to your website's root directory:
   - Usually `public_html` (or a dedicated application folder like `isuru-gems/`).
   - *Tip:* Ensure the destination folder is clean before extracting.
5. Click **Upload** (top right) and select `isuru-gems-hostinger-deploy.zip`.
6. Right-click the uploaded `.zip` file in File Manager and click **Extract**.
7. Delete or archive the `.zip` file once extracted.

### Step 2: Configure Node.js in hPanel
1. In hPanel, navigate to **Advanced** > **Node.js** (or search for **Node.js** in the search bar).
2. Click **Create Application** (or edit existing):
   - **Node.js version:** Select `20.x` (or `18.x`).
   - **Application mode:** `Production`.
   - **Application root:** Point to the folder where you extracted the files (e.g. `public_html`).
   - **Application startup file:** `server.js` *(Starts the app directly with node server.js)*.
3. In the **Environment variables** section, add your production keys:
   - `NODE_ENV` = `production`
   - `PORT` = Leave unset if Hostinger assigns dynamic ports, or set to `3000`.
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your_supabase_service_role_key`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   *(Alternatively, create a file named `.env` in the folder alongside `server.js` with these values)*.
4. Click **Install Dependencies** (runs `npm install`).
5. Run the build step (or trigger deployment):
   - If Hostinger has a build trigger or terminal, run `npm run start` (which executes `next build` and exits).
6. Click **Start / Restart Application**.
7. Visit your domain in the browser to verify the site is live.

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
npm run start # Executes "next build" and exits cleanly producing .next/
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

### Why was my deployment timing out previously after 15 minutes?
Many platforms execute `npm run start` as their automated build phase. If `package.json` had `start: "node server.js"`, it launched a long-running HTTP server during the build phase that never exited, causing the platform build runner to hit the 15-minute timeout. Setting `"start": "next build"` ensures the build step compiles the application and exits cleanly, while `"serve": "node server.js"` and `ecosystem.config.cjs` launch the runtime server separately.

### Where can I check logs if something doesn't load?
- **In hPanel:** In the Node.js manager, click the **Logs** tab or check `stderr.log` / `stdout.log` in your application root directory.
- **In VPS:** Run `pm2 logs isuru-gems`.
