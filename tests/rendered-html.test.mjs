import assert from "node:assert/strict";
import { access, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the FAMA presentation shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>What Do You See in a Melon\? \| FAMA<\/title>/i);
  assert.match(html, /FAMA · DIGITAL EXPERIENCE/);
  assert.match(html, /What do you see/);
  assert.match(html, /01<!-- --> \/ <!-- -->07/);
  assert.match(html, /aria-label="Interactive 3D rock melon model"/);
  assert.match(html, /src="about:blank" title="MAHA finale video"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("production assets are bundled and source-heavy formats are excluded", async () => {
  const assets = new URL("../dist/client/assets/", import.meta.url);
  const model = await stat(new URL("earls-favourite-melon.glb", assets));
  const poster = await stat(new URL("maha-2026-poster.webp", assets));

  assert.ok(model.size < 9 * 1024 * 1024, "optimised melon GLB should stay below 9 MB");
  assert.ok(poster.size < 250 * 1024, "MAHA poster WebP should stay below 250 KB");
  await Promise.all([
    access(new URL("game-tap-fruits.webp", assets)),
    access(new URL("game-grab-fruits.webp", assets)),
    access(new URL("game-buy-sell.webp", assets)),
    access(new URL("doa-melon-data.csv", assets)),
    access(new URL("malaysia-states.geojson", assets)),
  ]);
  await assert.rejects(access(new URL("maha-2026-poster.png", assets)));
  await assert.rejects(access(new URL("game-tap-fruits.png", assets)));
});
