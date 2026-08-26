import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(await readFile(new URL("../parser.js", import.meta.url), "utf8"), context);
const parser = context.globalThis.CheaplyLabelParser;

test("parses order number, purchase date, address, phone, model and quantity", () => {
  const result = parser.parse(`
CHRecycle
Order details
Order ID: # 305-3488148-3093158
Purchase date:
Wed, 26 Aug 2026, 18:09 MEST
Ship to
Emanuel Bennici
Fröbelweg 4
Neu-ulm
89233
Germany
Phone: +4915162560139
Order contents
SK Hynix 32 GB DDR4-2400
ASIN: B0762WP67R
Quantity: 4
`);
  assert.equal(result.orderId, "305-3488148-3093158");
  assert.equal(result.date, "26/08/2026");
  assert.equal(result.phone, "+4915162560139");
  assert.equal(result.quantity, 4);
  assert.match(result.productLabel, /x4$/);
  assert.match(result.address, /Fröbelweg 4/);
});

test("uses four model characters and omits x1", () => {
  assert.equal(parser.productLabelWithQuantity("Lenovo 40AF0135EU dock", 1), "lenovo 40af");
});
