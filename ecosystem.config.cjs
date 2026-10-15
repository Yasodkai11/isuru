/**
 * PM2 Process Manager Configuration for Hostinger VPS / Cloud
 * 
 * IMPORTANT:
 * - This runtime launcher executes `server.js` directly with Node.js (`node server.js`).
 * - Do NOT use `npm run start` to launch the runtime process, because `npm run start`
 *   is configured as the one-time build step (`next build`) in package.json.
 */

module.exports = {
  apps: [
    {
      name: "isuru-gems",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
