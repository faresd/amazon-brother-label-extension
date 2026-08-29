# Architecture

Amazon Brother Package Label BETA is a Manifest V3 extension with no remotely hosted executable code. Amazon printing remains fully local. Shopify printing uses the authenticated CHLabs Shipping Bridge only to create an encrypted, short-lived handoff; the local extension still owns all Brother access.

1. `parser.js` extracts the visible order ID, purchase date, destination, phone, Amazon account, product shortcut, and quantity from the signed-in Seller Central page.
2. `content.js` adds the package-label action, presents a review dialog, and maps reviewed values to named P-touch template objects.
3. `bpac-sdk.js` talks to Brother's separately installed official b-PAC browser/native component.
4. `address 62mm bottom code128.lbx` is the source P-touch template. The Windows setup copies it to a stable public location that b-PAC can open.
5. Amazon recipient data never leaves the computer. Extension settings remain in `chrome.storage.local`; one-time Amazon print jobs remain in session storage only.
6. The Shopify Admin action sends reviewed label fields to the authenticated bridge API. The API stores them encrypted for at most two minutes and returns a single-use token in a URL fragment.
7. `shopify-handoff.js` removes that fragment from browser history immediately, consumes the job once, combines it with the profile-local sender QR setting, selects an online replacement of the configured Brother model, verifies 62 mm media, and prints at maximum quality.
8. Shopify credentials never enter the local extension, and the Shopify frontend never receives native-printer access.

The Chrome Web Store ZIP contains extension runtime files only. The local ZIP additionally contains the Windows template setup and documentation. Brother software is not redistributed.
