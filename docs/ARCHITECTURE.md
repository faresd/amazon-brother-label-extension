# Architecture

Amazon Brother Package Label is a Manifest V3 extension with no backend and no remote code.

1. `parser.js` extracts the visible order ID, purchase date, destination, phone, Amazon account, product shortcut, and quantity from the signed-in Seller Central page.
2. `content.js` adds the package-label action, presents a review dialog, and maps reviewed values to named P-touch template objects.
3. `bpac-sdk.js` talks to Brother's separately installed official b-PAC browser/native component.
4. `address 62mm bottom code128.lbx` is the source P-touch template. The Windows setup copies it to a stable public location that b-PAC can open.
5. No recipient data leaves the computer. Extension settings remain in `chrome.storage.local`; one-time print jobs remain in session storage only.

The Chrome Web Store ZIP contains extension runtime files only. The local ZIP additionally contains the Windows template setup and documentation. Brother software is not redistributed.
