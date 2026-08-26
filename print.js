(async function () {
  "use strict";

  const error = document.getElementById("error");

  function showError(message) {
    error.hidden = false;
    error.textContent = message;
  }

  function measureMillimetresPerPixel() {
    const ruler = document.createElement("div");
    Object.assign(ruler.style, {
      position: "fixed",
      visibility: "hidden",
      width: "100mm"
    });
    document.body.appendChild(ruler);
    const millimetresPerPixel = 100 / ruler.getBoundingClientRect().width;
    ruler.remove();
    return millimetresPerPixel;
  }

  function setContentBasedPageLength(destination) {
    const probe = destination.cloneNode(true);
    Object.assign(probe.style, {
      height: "auto",
      left: "-10000px",
      maxHeight: "none",
      maxWidth: "none",
      overflow: "visible",
      position: "fixed",
      top: "0",
      transform: "none",
      visibility: "hidden",
      whiteSpace: "pre",
      width: "max-content"
    });
    document.body.appendChild(probe);

    const textLength = probe.getBoundingClientRect().width * measureMillimetresPerPixel();
    probe.remove();

    // The QR/channel block currently ends at 80.5 mm. Longer address lines extend
    // the roll instead of being shrunk or clipped. Round up to the nearest 0.5 mm.
    const fixedContentEnd = 82.5;
    const destinationTop = 16.2;
    const trailingSpace = 4.5;
    const pageLength = Math.ceil(Math.max(
      fixedContentEnd,
      destinationTop + textLength + trailingSpace
    ) * 2) / 2;
    const destinationLength = pageLength - 19.7;

    document.documentElement.style.setProperty("--page-length", `${pageLength}mm`);
    document.documentElement.style.setProperty("--destination-length", `${destinationLength}mm`);

    const pageStyle = document.createElement("style");
    pageStyle.textContent = `@media print { @page { margin: 0; size: 62mm ${pageLength}mm; } }`;
    document.head.appendChild(pageStyle);
  }

  const token = new URLSearchParams(location.search).get("job");
  if (!token) {
    showError("No print job was supplied. Return to Seller Central and click Print package label again.");
    return;
  }

  const job = await chrome.runtime.sendMessage({ type: "CONSUME_JOB", token });
  if (!job) {
    showError("This print job has expired. Return to Seller Central and create it again.");
    return;
  }

  document.getElementById("date").textContent = job.date || "";
  document.getElementById("channel").textContent = job.channel || "";
  const destination = document.getElementById("destination");
  destination.textContent = [job.destination, job.phone].filter(Boolean).join("\n");

  if (job.qrText) {
    try {
      const qr = qrcode(0, "M");
      qr.addData(job.qrText, "Byte");
      qr.make();
      document.getElementById("qr").innerHTML = qr.createImgTag(4, 0);
    } catch (qrError) {
      showError(`The QR code could not be generated: ${qrError.message}`);
    }
  }

  setContentBasedPageLength(destination);
  document.getElementById("print-again").addEventListener("click", () => window.print());
  document.getElementById("close-tab").addEventListener("click", () => window.close());

  if (job.autoPrint !== false) {
    try { await document.querySelector(".logo").decode(); } catch (_) { /* BMP may decode before this call. */ }
    setTimeout(() => window.print(), 350);
  }
})();
