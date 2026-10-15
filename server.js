/**
 * Production HTTP Server for Isuru Gems Next.js Application
 * 
 * Used for Hostinger Cloud/VPS and PM2 deployments.
 * Starts the server directly via `node server.js` (or `npm run serve`).
 * 
 * NOTE: The build step is handled separately via `npm run start` (which runs `next build`).
 * This file is purely the runtime launcher.
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const path = require("path");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

// Check if standalone build with copied static assets exists
const standalonePath = path.join(__dirname, ".next", "standalone");
const standaloneServerPath = path.join(standalonePath, "server.js");
const standaloneStaticPath = path.join(standalonePath, ".next", "static");

if (fs.existsSync(standaloneServerPath) && fs.existsSync(standaloneStaticPath)) {
  // If standalone server bundle is present and fully prepared, delegate directly
  require(standaloneServerPath);
} else {
  // Standard Next.js server launcher (serves from the fresh .next directory produced by next build)
  const app = next({ dev, hostname, port, dir: __dirname });
  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      const server = createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true);
          await handle(req, res, parsedUrl);
        } catch (err) {
          console.error("Error occurred handling request:", req.url, err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });

      server.listen(port, hostname, (err) => {
        if (err) {
          console.error("> Failed to start server:", err);
          process.exit(1);
        }
        console.log(`> Isuru Gems production server listening on http://${hostname}:${port}`);
      });

      const handleShutdown = (signal) => {
        console.log(`> Received ${signal}. Shutting down gracefully...`);
        server.close(() => {
          console.log("> HTTP server closed.");
          process.exit(0);
        });
      };

      process.on("SIGINT", () => handleShutdown("SIGINT"));
      process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    })
    .catch((err) => {
      console.error("> Error preparing Next.js application:", err);
      process.exit(1);
    });
}
