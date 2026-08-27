# Privacy policy

Effective date: August 27, 2026

Amazon Brother Package Label BETA has one purpose: to create an editable 62 mm
package label from the Amazon Seller Central order currently open in the
browser and print it through the locally installed Brother b-PAC component.

## Data handled

To populate a label, the extension reads only the information visible on the
current Amazon Seller Central order page. This can include the recipient name,
postal address, telephone number, Amazon order number, order date, product
model, quantity, and seller account name.

Optional sender QR text and label preferences are stored in the browser
profile using Chrome's local storage API. The extension does not store
recipient or order details after the current label workflow ends.

## Data use and transfer

Order and sender information is processed locally on the user's computer for
previewing and printing the requested label. QR generation also runs locally.

The extension does not:

- transmit order or sender data to the developer or to external servers;
- sell or transfer user data to third parties;
- use data for advertising, analytics, profiling, creditworthiness, or lending;
- use data for a purpose unrelated to printing the requested package label; or
- load or execute remote JavaScript or WebAssembly.

The Brother b-PAC browser component and Windows client are separate local
software supplied by Brother and are required to send the populated template
to the user's printer.

## Permissions

- `storage` saves optional sender QR text and label preferences in the local
  browser profile.
- Access to `https://sellercentral.amazon.fr/orders-v3/order/*` lets the
  extension read the visible order details needed to populate a label on the
  user-selected order page.

## Contact

Questions or requests can be filed at
<https://github.com/faresd/amazon-brother-label-extension/issues>.
