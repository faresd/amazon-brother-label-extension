"use strict";

const DEFAULT_QR_TEXT = "";
const TEMPLATE_PATH = "C:\\Users\\Public\\Documents\\Chlabs\\AmazonBrotherPackageLabel\\address-62mm-bottom-code128.lbx";
const LEGACY_TEMPLATE_PATHS = new Set();

const DEFAULTS = {
  qrText: DEFAULT_QR_TEXT,
  channel: "ch\ndcs",
  templatePath: TEMPLATE_PATH,
  printerName: "Brother QL-700"
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const missing = {};
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    if (existing[key] === undefined) missing[key] = value;
  });
  if (LEGACY_TEMPLATE_PATHS.has(String(existing.templatePath || "").trim())) {
    missing.templatePath = TEMPLATE_PATH;
  }
  if (Object.keys(missing).length) await chrome.storage.local.set(missing);
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "GET_SETTINGS") {
    chrome.storage.local.get(DEFAULTS).then(async (settings) => {
      if (LEGACY_TEMPLATE_PATHS.has(String(settings.templatePath || "").trim())) {
        settings.templatePath = TEMPLATE_PATH;
        await chrome.storage.local.set({ templatePath: TEMPLATE_PATH });
      }
      sendResponse(settings);
    });
    return true;
  }

  if (message?.type === "OPEN_PRINT") {
    (async () => {
      const token = crypto.randomUUID();
      await chrome.storage.session.set({ [`job:${token}`]: message.data });
      await chrome.tabs.create({ url: chrome.runtime.getURL(`print.html?job=${encodeURIComponent(token)}`) });
      sendResponse({ ok: true });
    })().catch((error) => sendResponse({ ok: false, error: error.message }));
    return true;
  }

  if (message?.type === "CONSUME_JOB") {
    (async () => {
      const key = `job:${message.token}`;
      const stored = await chrome.storage.session.get(key);
      await chrome.storage.session.remove(key);
      sendResponse(stored[key] || null);
    })().catch(() => sendResponse(null));
    return true;
  }

  return false;
});
