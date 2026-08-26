import { readFile } from "node:fs/promises";

const required = ["CWS_PUBLISHER_ID", "CWS_EXTENSION_ID", "CWS_ACCESS_TOKEN", "CWS_PACKAGE"];
for (const name of required) if (!process.env[name]) throw new Error(`Missing ${name}`);

const publisher = encodeURIComponent(process.env.CWS_PUBLISHER_ID);
const item = encodeURIComponent(process.env.CWS_EXTENSION_ID);
const token = process.env.CWS_ACCESS_TOKEN;
const packageBytes = await readFile(process.env.CWS_PACKAGE);
const base = `https://chromewebstore.googleapis.com/v2/publishers/${publisher}/items/${item}`;
const uploadUrl = `https://chromewebstore.googleapis.com/upload/v2/publishers/${publisher}/items/${item}:upload`;

const upload = await request(uploadUrl, { method: "POST", body: packageBytes, headers: { "Content-Type": "application/zip" } });
console.log(`Uploaded ${upload.crxVersion || "new package"}: ${upload.uploadState || "accepted"}`);

if (process.env.CWS_SUBMIT_FOR_REVIEW === "true") {
  const published = await request(`${base}:publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  console.log(`Submitted for review: ${published.state || published.status || "accepted"}`);
}

async function request(url, options) {
  const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  return body;
}
