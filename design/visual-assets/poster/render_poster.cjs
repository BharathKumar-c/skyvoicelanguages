// Usage (from apps/web, with `pnpm dev` running):
//   node ../../design/visual-assets/poster/render_poster.cjs <playwright-module-path>
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.argv[2] || "playwright");
(async () => {
  const html = fs.readFileSync(path.join(__dirname, "service-video-poster.html"), "utf8");
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  await p.goto("http://localhost:3000/robots.txt");
  await p.setContent(html, { waitUntil: "networkidle" });
  await p.screenshot({ path: path.join(__dirname, "service-video-poster.png") });
  await b.close();
})();
