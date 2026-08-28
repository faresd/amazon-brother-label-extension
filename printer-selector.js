(function exposePrinterSelector(scope) {
  "use strict";

  function modelKey(name) {
    const match = String(name || "").match(/\b(?:brother\s+)?(ql|pt|td|rj|pj|mw|vc)-?\s*(\d{3,4}[a-z0-9-]*)\b/i);
    return match ? `${match[1].toLowerCase()}-${match[2].toLowerCase()}` : "";
  }

  function sameModelPrinters(printers, configuredName) {
    const expectedModel = modelKey(configuredName);
    if (!expectedModel) throw new Error(`Cannot determine the Brother model from "${configuredName}".`);

    return [...new Set((printers || []).map((name) => String(name || "").trim()).filter(Boolean))]
      .filter((name) => modelKey(name) === expectedModel)
      .sort((left, right) => {
        const leftExact = left.toLowerCase() === String(configuredName).trim().toLowerCase();
        const rightExact = right.toLowerCase() === String(configuredName).trim().toLowerCase();
        return Number(rightExact) - Number(leftExact);
      });
  }

  async function selectPrinter(printers, configuredName, inspect) {
    const candidates = sameModelPrinters(printers, configuredName);
    const expectedModel = modelKey(configuredName).toUpperCase();
    if (!candidates.length) {
      throw new Error(`No installed ${expectedModel} printer was found in Brother b-PAC.`);
    }

    const failures = [];
    for (const printerName of candidates) {
      try {
        const status = await inspect(printerName);
        if (status.supported === false) throw new Error("not supported by Brother b-PAC");
        if (status.online === false) throw new Error("offline");
        if (status.errorCode && status.errorCode !== 0) {
          throw new Error(status.errorString || `Brother printer error ${status.errorCode}`);
        }
        return { printerName, status };
      } catch (error) {
        failures.push(`${printerName}: ${error?.message || error}`);
      }
    }

    throw new Error(`Installed ${expectedModel} printer(s) are unavailable. ${failures.join("; ")}`);
  }

  scope.CheaplyPrinterSelector = Object.freeze({ modelKey, sameModelPrinters, selectPrinter });
})(globalThis);
