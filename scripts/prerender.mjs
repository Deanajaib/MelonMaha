/**
 * Pre-render the single page to a static HTML file for Vercel deployment.
 * Starts the Vinext production server, fetches the rendered page,
 * rewrites local font paths, saves as dist/client/index.html, then exits.
 */
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 4173;
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "dist/client/index.html");

const server = spawn("npx", ["vinext", "start", "--port", String(PORT)], {
  cwd: ROOT,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: String(PORT), NODE_ENV: "production" },
});

let output = "";
server.stdout.on("data", (d) => (output += d.toString()));
server.stderr.on("data", (d) => (output += d.toString()));

const maxAttempts = 30;
let attempts = 0;

async function waitForServer() {
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const res = await fetch(`http://localhost:${PORT}/`);
      if (res.ok) {
        let html = await res.text();
        // Fix local filesystem font paths → production relative paths
        // Pattern: /absolute/path/to/.vinext/fonts/<family>/<file>.woff2
        // Replace: /_next/static/_vinext_fonts/<family>/<file>.woff2
        html = html.replace(
          /(?:url\(|href=")\/[^")\s]+?\/\.vinext\/fonts\/([^")\s]+?)(?:\)|")/g,
          (match, fontPath) => {
            const prefix = match.startsWith("url(") ? "url(" : 'href="';
            const suffix = match.startsWith("url(") ? ")" : '"';
            return `${prefix}/_next/static/_vinext_fonts/${fontPath}${suffix}`;
          }
        );
        writeFileSync(OUT, html, "utf-8");
        console.log(`Pre-rendered page saved to dist/client/index.html (${(html.length / 1024).toFixed(1)} KB)`);
        server.kill();
        process.exit(0);
      }
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.error("Server did not start within 30 seconds");
  console.error(output);
  server.kill();
  process.exit(1);
}

waitForServer();
