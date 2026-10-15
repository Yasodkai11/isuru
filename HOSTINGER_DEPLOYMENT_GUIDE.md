# Hostinger Deployment Guide for Isuru Gems (Next.js Standalone)

This guide walks you through deploying the **Isuru Gems** Next.js eCommerce application to Hostinger.

---

## 📦 What's Inside the Zip File (`isuru-gems-hostinger-deploy.zip`)

The deployment zip contains a pre-built **Next.js Standalone** bundle. This is the official Next.js recommended format for self-hosting:
- `server.js` — The production Node.js server entry point
- `.next/` — Production build assets, server routes, and static bundles (`.next/static/`)
- `public/` — Gem imagery, logos, icons, and static assets
- `node_modules/` — Minimal bundled production dependencies
- `package.json` — Pre-configured with `"start": "node server.js"`
- `ecosystem.config.cjs` — PM2 configuration (for VPS / Cloud hosting)
- `.htaccess.example` — Reverse proxy snippet for Apache / LiteSpeed (if required)
- `.env.example` — Reference list of required environment variables

---

## 🚀 Option 1: Deploying via Hostinger hPanel (Node.js Application)

*(Recommended for Hostinger Cloud, Business, or plans with the Node.js selector)*

### Step 1: Upload the Files
1. Log in to your **Hostinger hPanel**.
2. Go to **Websites** > click **Manage** next to your domain.
3. Open **Files** > **File Manager**.
4. Navigate to your website's root directory:
   - Usually `public_html` (or a dedicated application folder like `app/` or `isuru-gems/`).
   - *Tip:* If you put it in a subfolder or root, ensure the directory is clean.
5. Click **Upload** (top right) and select `isuru-gems-hostinger-deploy.zip`.
6. Right-click the uploaded `.zip` file in File Manager and click **Extract**.
7. Delete the `.zip` file once extracted.

### Step 2: Configure Node.js in hPanel
1. In hPanel, use the search bar or navigate to **Advanced** > **Node.js** (or **Web Applications** > **Node.js**).
2. Click **Create Application** (or edit existing):
   - **Node.js version:** Select `20.x` (or `18.x`).
   - **Application mode:** `Production`.
   - **Application root:** Point to the folder where you extracted the files (e.g. `public_html`).
   - **Application startup file:** `server.js`.
   - The uploaded ZIP is already built. For a source checkout, run `npm run build` during the build phase; start the app only in the runtime phase.
3. In the **Environment variables** section, add your production keys:
   - `NODE_ENV` = `production`
   - `PORT` = leave unset when Hostinger assigns the application port; do not hard-code `3000` in that case.
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
   - `SUPABASE_SERVICE_ROLE_KEY` = `your_supabase_service_role_key`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   *(Alternatively, create a file named `.env` in the folder alongside `server.js` with these values)*.
4. Click **Save** and then **Start / Restart Application**.
5. Visit your domain in the browser to verify the site is live.

---

## ⚡ Option 2: Deploying on Hostinger VPS (SSH & PM2)

*(Recommended for Hostinger VPS with Ubuntu/Debian)*

### Step 1: Upload and Extract
```bash
# Upload isuru-gems-hostinger-deploy.zip via SCP/SFTP or File Manager to /var/www/isuru-gems
mkdir -p /var/www/isuru-gems
cd /var/www/isuru-gems
unzip isuru-gems-hostinger-deploy.zip
```

### Step 2: Set Environment Variables
```bash
cp .env.example .env
nano .env
# Fill in your Supabase & Gemini keys and save (Ctrl+O, Enter, Ctrl+X)
```

### Step 3: Install Linux Native Binaries (if needed)
Next.js standalone uses `sharp` for image optimization. If running directly on a Linux VPS:
```bash
npm install --os=linux --cpu=x64 sharp
```

### Step 4: Start with PM2
```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the application using the included PM2 configuration
pm2 start ecosystem.config.cjs

# Make PM2 restart automatically on server reboot
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
| `PORT` | Web server port; the standalone server uses Hostinger's assigned value, or defaults to `3000` when unset |
| `NEXT_PUBLIC_SITE_URL` | Your public domain (e.g., `https://isurugems.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Supabase service role key (for server actions/admin) |
| `GEMINI_API_KEY` | Google Gemini API key (for AI features) |

---

## ❓ Frequently Asked Questions

### Why does Next.js need Node.js hosting on Hostinger?
Isuru Gems is a dynamic eCommerce platform that utilizes Next.js Server Actions (`src/actions`), Supabase authentication/SSR, and dynamic server-side logic. Unlike basic static HTML websites, dynamic Next.js features require a lightweight Node.js runtime to process requests, manage secure cookies, and communicate with database APIs.

### Where can I check logs if something doesn't load?
- **In hPanel:** In the Node.js manager, click the **Logs** tab or check `stderr.log` / `stdout.log` in your application root directory.
- **In VPS:** Run `pm2 logs isuru-gems`.
