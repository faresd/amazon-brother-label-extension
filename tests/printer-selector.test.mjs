import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const context = { globalThis: {} };
vm.runInNewContext(await readFile(new URL("../printer-selector.js", import.meta.url), "utf8"), context);
const selector = context.globalThis.CheaplyPrinterSelector;

test("recognizes replacement printer names for the same model", () => {
  assert.equal(selector.modelKey("Brother QL-700 (Copy 1)"), "ql-700");
  assert.deepEqual(
    Array.from(selector.sameModelPrinters(["Brother QL-800", "Brother QL-700 (Copy 1)"], "Brother QL-700")),
    ["Brother QL-700 (Copy 1)"]
  );
});

test("falls back from an offline original to an online replacement", async () => {
  const result = await selector.selectPrinter(
    ["Brother QL-700", "Brother QL-700 (Copie 1)"],
    "Brother QL-700",
    async (name) => ({ online: name.includes("Copie"), supported: true, errorCode: 0 })
  );
  assert.equal(result.printerName, "Brother QL-700 (Copie 1)");
});

test("rejects a different Brother model", async () => {
  await assert.rejects(
    selector.selectPrinter(["Brother QL-800"], "Brother QL-700", async () => ({ online: true })),
    /No installed QL-700 printer/
  );
});
