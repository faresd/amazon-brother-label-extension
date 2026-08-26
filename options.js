"use strict";

const TEMPLATE_PATH = "C:\\Users\\Public\\Documents\\Chlabs\\AmazonBrotherPackageLabel\\address-62mm-bottom-code128.lbx";

const DEFAULTS = {
  qrText: "",
  channel: "ch\ndcs",
  templatePath: TEMPLATE_PATH,
  printerName: "Brother QL-700"
};

async function load() {
  const settings = await chrome.storage.local.get(DEFAULTS);
  document.getElementById("qrText").value = settings.qrText;
  document.getElementById("channel").value = settings.channel.replace(/\n/g, " ");
  document.getElementById("templatePath").value = settings.templatePath;
  document.getElementById("printerName").value = settings.printerName;
}

document.getElementById("settings").addEventListener("submit", async (event) => {
  event.preventDefault();
  await chrome.storage.local.set({
    qrText: document.getElementById("qrText").value.trim(),
    channel: document.getElementById("channel").value.trim().replace(/\s+/g, "\n"),
    templatePath: document.getElementById("templatePath").value.trim(),
    printerName: document.getElementById("printerName").value.trim()
  });
  const status = document.getElementById("status");
  status.textContent = "Saved";
  setTimeout(() => { status.textContent = ""; }, 1800);
});

load();
