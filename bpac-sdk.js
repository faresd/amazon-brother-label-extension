var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/types.ts
var PrintOptionFlag = /* @__PURE__ */ ((PrintOptionFlag2) => {
  PrintOptionFlag2[PrintOptionFlag2["autoCut"] = 1] = "autoCut";
  PrintOptionFlag2[PrintOptionFlag2["cutPause"] = 1] = "cutPause";
  PrintOptionFlag2[PrintOptionFlag2["cutMark"] = 2] = "cutMark";
  PrintOptionFlag2[PrintOptionFlag2["halfCut"] = 512] = "halfCut";
  PrintOptionFlag2[PrintOptionFlag2["chainPrint"] = 1024] = "chainPrint";
  PrintOptionFlag2[PrintOptionFlag2["tailCut"] = 2048] = "tailCut";
  PrintOptionFlag2[PrintOptionFlag2["specialTape"] = 524288] = "specialTape";
  PrintOptionFlag2[PrintOptionFlag2["cutAtEnd"] = 67108864] = "cutAtEnd";
  PrintOptionFlag2[PrintOptionFlag2["noCut"] = 268435456] = "noCut";
  PrintOptionFlag2[PrintOptionFlag2["mirroring"] = 4] = "mirroring";
  PrintOptionFlag2[PrintOptionFlag2["quality"] = 65536] = "quality";
  PrintOptionFlag2[PrintOptionFlag2["highSpeed"] = 16777216] = "highSpeed";
  PrintOptionFlag2[PrintOptionFlag2["highResolution"] = 33554432] = "highResolution";
  PrintOptionFlag2[PrintOptionFlag2["color"] = 8] = "color";
  PrintOptionFlag2[PrintOptionFlag2["mono"] = 268435456] = "mono";
  return PrintOptionFlag2;
})(PrintOptionFlag || {});

// src/helpers.ts
var normalizePath = (pathStr) => {
  let normalized = pathStr.replace(/\\/g, "/");
  normalized = normalized.replace(/\/\/+/g, "/");
  if (normalized !== "/" && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
};
var getAbsolutePath = (basePath, filePathOrFileName) => {
  if (!filePathOrFileName) {
    throw new Error("File path or file name cannot be empty.");
  }
  if (filePathOrFileName.startsWith("/") || /^[a-zA-Z]:\\/.test(filePathOrFileName)) {
    return normalizePath(filePathOrFileName);
  }
  if (!basePath) {
    throw new Error("Please set basePath or provide the full path.");
  }
  const normalizedBasePath = normalizePath(basePath);
  const ensuredBasePath = normalizedBasePath.endsWith("/") || normalizedBasePath.endsWith("\\") ? normalizedBasePath : normalizedBasePath + "/";
  const absolutePath = ensuredBasePath + filePathOrFileName;
  return normalizePath(absolutePath);
};
var getExportType = (fileExt) => {
  switch (fileExt) {
    case ".lbx":
      return 1;
    case ".lbl":
      return 2;
    case ".lbi":
      return 3;
    case ".bmp":
      return 4;
    case ".paf":
      return 5;
    default:
      throw new BpacError(`Invalid extension. Expected ".lbx, .lbl, .lbi, .bmp, .paf". Received: ${fileExt}.`, `getExportType(${fileExt})`);
  }
};
var getStartPrintOptions = (options) => {
  let combinedHex = 0;
  Object.entries(options).forEach(([key, value]) => {
    if (value === true && PrintOptionFlag[key] !== void 0) {
      combinedHex |= PrintOptionFlag[key];
    }
  });
  return combinedHex;
};
var getFileExtension = (filePathOrFileName) => {
  if (typeof filePathOrFileName !== "string" || !filePathOrFileName.trim()) {
    throw new Error("filePathOrFileName must be a non-empty string.");
  }
  const baseName = filePathOrFileName.split(/[\\/]/).pop() || "";
  const lastDotIdx = baseName.lastIndexOf(".");
  if (lastDotIdx <= 0 || lastDotIdx === baseName.length - 1) {
    throw new Error("No file extension found.");
  }
  const extension = baseName.slice(lastDotIdx).toLowerCase();
  return extension;
};
var BpacError = class extends Error {
  constructor(message, context) {
    super(message);
    this.name = "BpacError";
    this.context = context;
  }
};
var handleVendorError = (error, context) => {
  let message = `An unexpected error occurred in ${context}.`;
  if (typeof error === "string") {
    if (error.includes("Can't connect to b-PAC")) {
      message = "Cannot connect to b-PAC. Ensure the Brother printer service is running and the printer is connected.";
    } else {
      message = `b-PAC error: ${error}`;
    }
  }
  if (error instanceof Error && error.message) {
    message = error.message.includes("Can't connect to b-PAC") ? "Cannot connect to b-PAC. Ensure the Brother printer service is running and the printer is connected." : error.message;
  }
  throw new BpacError(message, context);
};
var assertSameOrigin = (templatePath) => {
  try {
    const url = new URL(templatePath);
    const sameOrigin = url.protocol === window.location.protocol && url.hostname === window.location.hostname && (url.port || "") === (window.location.port || "");
    if (!sameOrigin) {
      console.warn(`Cross-origin templatePath blocked: "${templatePath}". Remote template URLs must be hosted on the same origin to avoid CORS issues.`);
    }
  } catch {
    return;
  }
};

// src/vendor/bpac-3.4.014.js
var n = n || {};
n.appendMessage = (n2) => {
  const t2 = new CustomEvent("bpac_send", { detail: n2 });
  document.dispatchEvent(t2);
};
var t = "Can't connect to b-PAC";
var IObject = class {
  constructor(n2) {
    this.p_ = n2;
  }
  GetAttribute(i) {
    const r = "IObject::GetAttribute", u = { method: r, p: this.p_, kind: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : f2.detail.ret == false ? n2() : n2(f2.detail.attribute);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  GetData(i) {
    const r = "IObject::GetData", u = { method: r, p: this.p_, kind: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : f2.detail.ret == false ? n2() : n2(f2.detail.data);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  GetFontBold() {
    const i = "IObject::GetFontBold", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetFontEffect() {
    const i = "IObject::GetFontEffect", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.effect);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetFontItalics() {
    const i = "IObject::GetFontItalics", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetFontMaxPoint() {
    const i = "IObject::GetFontMaxPoint", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.point);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetFontName() {
    const i = "IObject::GetFontName", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetFontStrikeout() {
    const i = "IObject::GetFontStrikeout", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetFontUnderline() {
    const i = "IObject::GetFontUnderline", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  SetAlign(i, r) {
    const u = "IObject::SetAlign", f = { method: u, p: this.p_, horizontal: i, vertical: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  SetAttribute(i, r) {
    const u = "IObject::SetAttribute", f = { method: u, p: this.p_, kind: i, attribute: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  SetData(i, r, u) {
    let e;
    const o = Object.prototype.toString.call(r).slice(8, -1);
    e = o === "Date" ? r.getTime() / 1e3 : r;
    const f = "IObject::SetData", s = { method: f, p: this.p_, kind: i, data: e, param: u }, h = new Promise((n2, i2) => {
      const r2 = (u2) => {
        document.removeEventListener(f, r2), u2.detail.connect == false ? i2(t) : n2(u2.detail.ret);
      };
      document.addEventListener(f, r2);
    });
    return n.appendMessage(s), h;
  }
  SetFontBold(i) {
    const r = "IObject::SetFontBold", u = { method: r, p: this.p_, bold: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetFontEffect(i) {
    const r = "IObject::SetFontEffect", u = { method: r, p: this.p_, effect: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetFontItalics(i) {
    const r = "IObject::SetFontItalics", u = { method: r, p: this.p_, italics: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetFontMaxPoint(i) {
    const r = "IObject::SetFontMaxPoint", u = { method: r, p: this.p_, point: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetFontName(i) {
    const r = "IObject::SetFontName", u = { method: r, p: this.p_, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetFontStrikeout(i) {
    const r = "IObject::SetFontStrikeout", u = { method: r, p: this.p_, strikeout: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetFontUnderline(i) {
    const r = "IObject::SetFontUnderline", u = { method: r, p: this.p_, underline: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  SetPosition(i, r, u, f) {
    const e = "IObject::SetPosition", o = { method: e, p: this.p_, x: i, y: r, width: u, height: f }, s = new Promise((n2, i2) => {
      const r2 = (u2) => {
        document.removeEventListener(e, r2), u2.detail.connect == false ? i2(t) : n2(u2.detail.ret);
      };
      document.addEventListener(e, r2);
    });
    return n.appendMessage(o), s;
  }
  SetSelection(i, r) {
    const u = "IObject::SetPosition", f = { method: u, p: this.p_, start: i, end: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  get Height() {
    const i = "IObject::GetHeight", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.height);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set Height(t2) {
    const i = { method: "IObject::SetHeight", p: this.p_, height: t2 };
    n.appendMessage(i);
  }
  get HorizontalAlign() {
    const i = "IObject::GetHorizontalAlign", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.align);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set HorizontalAlign(t2) {
    const i = { method: "IObject::SetHorizontalAlign", p: this.p_, align: t2 };
    n.appendMessage(i);
  }
  get Name() {
    const i = "IObject::GetName", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set Name(t2) {
    const i = { method: "IObject::SetName", p: this.p_, name: t2 };
    n.appendMessage(i);
  }
  get Orientation() {
    const i = "IObject::GetOrientation", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.orientation);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set Orientation(t2) {
    const i = { method: "IObject::SetOrientation", p: this.p_, orientation: t2 };
    n.appendMessage(i);
  }
  get SelectionEnd() {
    const i = "IObject::GetSelectionEnd", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.selection);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set SelectionEnd(t2) {
    const i = { method: "IObject::SetSelectionEnd", p: this.p_, selection: t2 };
    n.appendMessage(i);
  }
  get SelectionStart() {
    const i = "IObject::GetSelectionStart", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.selection);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set SelectionStart(t2) {
    const i = {
      method: "IObject::SetSelectionStart",
      p: this.p_,
      selection: t2
    };
    n.appendMessage(i);
  }
  get Text() {
    const i = "IObject::GetText", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.text);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set Text(t2) {
    const i = { method: "IObject::SetText", p: this.p_, text: t2 };
    n.appendMessage(i);
  }
  get Type() {
    const i = "IObject::GetType", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.type);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  get VerticalAlign() {
    const i = "IObject::GetVerticalAlign", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.align);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set VerticalAlign(t2) {
    const i = { method: "IObject::SetVerticalAlign", p: this.p_, align: t2 };
    n.appendMessage(i);
  }
  get Width() {
    const i = "IObject::GetWidth", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.width);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set Width(t2) {
    const i = { method: "IObject::SetWidth", p: this.p_, width: t2 };
    n.appendMessage(i);
  }
  get X() {
    const i = "IObject::GetX", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.X);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set X(t2) {
    const i = { method: "IObject::SetX", p: this.p_, X: t2 };
    n.appendMessage(i);
  }
  get Y() {
    const i = "IObject::GetY", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.Y);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  set Y(t2) {
    const i = { method: "IObject::SetY", p: this.p_, Y: t2 };
    n.appendMessage(i);
  }
};
var IObjects = class {
  constructor(n2) {
    this.p_ = n2;
  }
  GetItem(i) {
    const r = "IObjects::GetItem", u = { method: r, p: this.p_, index: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        if (document.removeEventListener(r, u2), f2.detail.connect == false)
          i2(t);
        else if (f2.detail.ret == false) n2();
        else if (f2.detail.p >= 0) {
          const t2 = new IObject(f2.detail.p);
          n2(t2);
        } else i2();
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  GetCount() {
    const i = "IObjects::GetCount", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.count);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetIndex(i) {
    const r = "IObjects::GetIndex", u = { method: r, p: this.p_, obj: i.p_ }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : f2.detail.ret == false ? n2() : n2(f2.detail.index);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  GetIndexByName(i, r) {
    const u = "IObjects::GetIndexByName", f = { method: u, p: this.p_, name: i, indexBgn: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : f2.detail.ret == false ? n2() : n2(f2.detail.index);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  Insert(i, r, u, f, e, o, s) {
    const h = "IObjects::Insert", c = {
      method: h,
      p: this.p_,
      index: i,
      type: r,
      X: u,
      Y: f,
      width: e,
      height: o,
      option: s
    }, l = new Promise((n2, i2) => {
      const r2 = (u2) => {
        if (document.removeEventListener(h, r2), u2.detail.connect == false)
          i2(t);
        else if (u2.detail.ret == false) n2();
        else if (u2.detail.p >= 0) {
          const t2 = new IObject(u2.detail.p);
          n2(t2);
        } else i2();
      };
      document.addEventListener(h, r2);
    });
    return n.appendMessage(c), l;
  }
  Remove(i) {
    const r = "IObjects::Remove", u = { method: r, p: this.p_, index: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  get Count() {
    return this.GetCount();
  }
};
var IPrinter = class {
  constructor(n2) {
    this.p_ = n2;
  }
  GetInstalledPrinters() {
    const i = "IPrinter::GetInstalledPrinters", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.printers);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetMediaId() {
    const i = "IPrinter::GetMediaId", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.id);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetMediaName() {
    const i = "IPrinter::GetMediaName", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetPrintedTapeLength() {
    const i = "IPrinter::GetPrintedTapeLength", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.length);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetSupportedMediaIds() {
    const i = "IPrinter::GetSupportedMediaIds", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.mediaIds);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  GetSupportedMediaNames() {
    const i = "IPrinter::GetSupportedMediaNames", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.mediaNames);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  IsMediaIdSupported(i) {
    const r = "IPrinter::IsMediaIdSupported", u = { method: r, p: this.p_, id: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  IsMediaNameSupported(i) {
    const r = "IPrinter::IsMediaNameSupported", u = { method: r, p: this.p_, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  IsPrinterOnline(i) {
    const r = "IPrinter::IsPrinterOnline", u = { method: r, p: this.p_, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  IsPrinterSupported(i) {
    const r = "IPrinter::IsPrinterSupported", u = { method: r, p: this.p_, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  get ErrorCode() {
    const i = "IPrinter::GetErrorCode", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.errorCode);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  get ErrorString() {
    const i = "IPrinter::GetErrorString", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.errorString);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  get Name() {
    const i = "IPrinter::GetName", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  get PortName() {
    const i = "IPrinter::GetPortName", r = { method: i, p: this.p_ }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.port);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
};
var IDocument = class _IDocument {
  static get Width() {
    return _IDocument.GetWidth();
  }
  static get Length() {
    return _IDocument.GetLength();
  }
  static set Length(n2) {
    _IDocument.SetLength(n2);
  }
  static get CurrentSheet() {
    return _IDocument.GetCurrentSheet();
  }
  static set CurrentSheet(n2) {
    _IDocument.SetCurrentSheet(n2);
  }
  static get CutLineCount() {
    return _IDocument.GetCutLineCount();
  }
  static get CutLines() {
    return _IDocument.GetCutLines();
  }
  static get ErrorCode() {
    return _IDocument.GetErrorCode();
  }
  static get MarginBottom() {
    return _IDocument.GetMarginBottom();
  }
  static set MarginBottom(n2) {
    return _IDocument.SetMarginBottom(n2);
  }
  static get MarginLeft() {
    return _IDocument.GetMarginLeft();
  }
  static set MarginLeft(n2) {
    return _IDocument.SetMarginLeft(n2);
  }
  static get MarginRight() {
    return _IDocument.GetMarginRight();
  }
  static set MarginRight(n2) {
    return _IDocument.SetMarginRight(n2);
  }
  static get MarginTop() {
    return _IDocument.GetMarginTop();
  }
  static set MarginTop(n2) {
    return _IDocument.SetMarginTop(n2);
  }
  static get Objects() {
    return _IDocument.GetObjects();
  }
  static get Orientation() {
    return _IDocument.GetOrientation();
  }
  static get Printer() {
    return _IDocument.GetPrinter();
  }
  static get SheetNames() {
    return _IDocument.GetSheetNames();
  }
  static Open(i) {
    const r = "IDocument::Open", u = { method: r, filePath: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static DoPrint(i, r) {
    const u = "IDocument::DoPrint", f = { method: u, dwOption: i, szOption: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static StartPrint(i, r) {
    const u = "IDocument::StartPrint", f = { method: u, docName: i, option: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static PrintOut(i, r) {
    const u = "IDocument::PrintOut", f = { method: u, copyCount: i, option: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static EndPrint() {
    const i = "IDocument::EndPrint", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetImageData(i, r, u) {
    const f = "IDocument::GetImageData", e = { method: f, type: i, width: r, height: u }, o = new Promise((n2, i2) => {
      const r2 = (u2) => {
        document.removeEventListener(f, r2), u2.detail.ret == true && u2.detail.connect == true ? n2(u2.detail.image) : i2(t);
      };
      document.addEventListener(f, r2);
    });
    return n.appendMessage(e), o;
  }
  static GetObjectsCount() {
    const i = "IDocument::GetObjectsCount", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == true && f.detail.connect == true ? n2(f.detail.count) : r2(t);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetIndexByName(i, r) {
    const u = "IDocument::GetIndexByName", f = { method: u, name: i, indexBgn: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : f2.detail.ret == true ? n2(f2.detail.index) : n2();
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static GetObject(i) {
    const r = "IDocument::GetObject", u = { method: r, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        if (document.removeEventListener(r, u2), f2.detail.connect == false)
          i2(t);
        else if (f2.detail.ret == false) n2();
        else if (f2.detail.p >= 0) {
          const t2 = new IObject(f2.detail.p);
          n2(t2);
        } else i2();
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetObjects(i) {
    const r = "IDocument::GetObjects", u = { method: r, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        if (document.removeEventListener(r, u2), f2.detail.ret == false || f2.detail.connect == false)
          i2(t);
        else if (f2.detail.p >= 0) {
          const t2 = new IObjects(f2.detail.p);
          n2(t2);
        } else i2();
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetBarcodeIndex(i) {
    const r = "IDocument::GetBarcodeIndex", u = { method: r, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : f2.detail.ret == false ? n2() : n2(f2.detail.index);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetMediaId() {
    const i = "IDocument::GetMediaId", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.id);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetMediaName() {
    const i = "IDocument::GetMediaName", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetPrinterName() {
    const i = "IDocument::GetPrinterName", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetText(i) {
    const r = "IDocument::GetText", u = { method: r, index: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.ret == false || f2.detail.connect == false ? i2(t) : n2(f2.detail.text);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetTextCount() {
    const i = "IDocument::GetTextCount", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.count);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetTextIndex(i) {
    const r = "IDocument::GetTextIndex", u = { method: r, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : f2.detail.ret == false ? n2() : n2(f2.detail.index);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetPrinter() {
    const i = "IDocument::GetPrinter", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        if (document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false)
          r2(t);
        else if (f.detail.p >= 0) {
          const t2 = new IPrinter(f.detail.p);
          n2(t2);
        } else r2();
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetText(i, r) {
    const u = "IDocument::SetText", f = { method: u, index: i, text: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static SetBarcodeData(i, r) {
    const u = "IDocument::SetBarcodeData", f = { method: u, index: i, text: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static SetMarginLeftRight(i, r) {
    const u = "IDocument::SetMarginLeftRight", f = { method: u, left: i, right: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static SetMediaById(i, r) {
    const u = "IDocument::SetMediaById", f = { method: u, id: i, fit: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static SetMediaByName(i, r) {
    const u = "IDocument::SetMediaByName", f = { method: u, name: i, fit: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static SetPrinter(i, r) {
    const u = "IDocument::SetPrinter", f = { method: u, name: i, fit: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static GetCurrentSheet() {
    const i = "IDocument::GetCurrentSheet", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.name);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetCurrentSheet(i) {
    const r = "IDocument::SetCurrentSheet", u = { method: r, name: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetCutLineCount() {
    const i = "IDocument::GetCutLineCount", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.count);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetCutLines() {
    const i = "IDocument::GetCutLines", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : f.detail.ret == false ? n2() : n2(f.detail.cutlines);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetErrorCode() {
    const i = "IDocument::GetErrorCode", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.errorCode);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetMarginBottom() {
    const i = "IDocument::GetMarginBottom", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.margin);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetMarginBottom(i) {
    const r = "IDocument::SetMarginBottom", u = { method: r, margin: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetMarginLeft() {
    const i = "IDocument::GetMarginLeft", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.margin);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetMarginLeft(i) {
    const r = "IDocument::SetMarginLeft", u = { method: r, margin: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetMarginRight() {
    const i = "IDocument::GetMarginRight", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.margin);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetMarginRight(i) {
    const r = "IDocument::SetMarginRight", u = { method: r, margin: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetMarginTop() {
    const i = "IDocument::GetMarginTop", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.margin);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetMarginTop(i) {
    const r = "IDocument::SetMarginTop", u = { method: r, margin: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false || f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static GetOrientation() {
    const i = "IDocument::GetOrientation", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.orientation);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetSheetNames() {
    const i = "IDocument::GetSheetNames", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.names);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetWidth() {
    const i = "IDocument::GetWidth", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.width);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static GetLength() {
    const i = "IDocument::GetLength", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.ret == false || f.detail.connect == false ? r2(t) : n2(f.detail.length);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SetLength(i) {
    const r = "IDocument::SetLength", u = { method: r, length: i }, f = new Promise((n2, i2) => {
      const u2 = (f2) => {
        document.removeEventListener(r, u2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(r, u2);
    });
    return n.appendMessage(u), f;
  }
  static Save() {
    const i = "IDocument::Save", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
  static SaveAs(i, r) {
    const u = "IDocument::SaveAs", f = { method: u, type: i, filePath: r }, e = new Promise((n2, i2) => {
      const r2 = (f2) => {
        document.removeEventListener(u, r2), f2.detail.connect == false ? i2(t) : n2(f2.detail.ret);
      };
      document.addEventListener(u, r2);
    });
    return n.appendMessage(f), e;
  }
  static Export(i, r, u) {
    const f = "IDocument::Export", e = { method: f, type: i, filePath: r, dpi: u }, o = new Promise((n2, i2) => {
      const r2 = (u2) => {
        document.removeEventListener(f, r2), u2.detail.connect == false ? i2(t) : n2(u2.detail.ret);
      };
      document.addEventListener(f, r2);
    });
    return n.appendMessage(e), o;
  }
  static Close() {
    const i = "IDocument::Close", r = { method: i }, u = new Promise((n2, r2) => {
      const u2 = (f) => {
        document.removeEventListener(i, u2), f.detail.connect == false ? r2(t) : n2(f.detail.ret);
      };
      document.addEventListener(i, u2);
    });
    return n.appendMessage(r), u;
  }
};

// src/adapter.ts
var Doc = IDocument;
var openTemplate = async (path) => {
  if (!path || typeof path !== "string" || path.trim() === "") {
    throw new Error("Template path must be a non-empty string.");
  }
  try {
    const isOpen = await Doc.Open(path);
    if (!isOpen) {
      throw new Error(
        `Failed to open the template at ${path}. Please ensure the file exists, is accessible, and is served from the same origin to avoid CORS issues.`
      );
    }
  } catch (error) {
    handleVendorError(error, `openTemplate(path=${path})`);
  }
};
var setPrinter = async (printerName, fitPage) => {
  try {
    if (!printerName) {
      throw new Error("Printer name is undefined.");
    }
    if (typeof fitPage !== "boolean") {
      throw new TypeError("fitPage must be a typeof Boolean");
    }
    const fitPageVariant = fitPage ? -1 : 0;
    const isSet = await Doc.SetPrinter(printerName, fitPageVariant);
    if (!isSet) {
      throw new Error("Failed to set printer.");
    }
  } catch (error) {
    await closeTemplate();
    handleVendorError(error, `setPrinter(printerName=${printerName}, fitPage=${fitPage})`);
  }
};
var setMedia = async (mediaName, fitPage) => {
  if (!mediaName) return;
  try {
    if (typeof fitPage !== "boolean") {
      throw new TypeError("fitPage must be a typeof Boolean");
    }
    const fitPageVariant = fitPage ? -1 : 0;
    const isSet = await Doc.SetMediaByName(mediaName, fitPageVariant);
    if (!isSet) {
      throw new Error(`Failed to select Brother media ${mediaName}.`);
    }
  } catch (error) {
    await closeTemplate();
    handleVendorError(error, `setMedia(mediaName=${mediaName}, fitPage=${fitPage})`);
  }
};
var printerStatus = async () => {
  try {
    const printer = await Doc.GetPrinter();
    if (printer) {
      const printerName = await printer.Name;
      return {
        printerName,
        documentMedia: await Doc.GetMediaName(),
        online: await printer.IsPrinterOnline(printerName),
        supported: await printer.IsPrinterSupported(printerName),
        errorCode: await printer.ErrorCode,
        errorString: await printer.ErrorString,
        currentMedia: await printer.GetMediaName(),
        supportedMedia: await printer.GetSupportedMediaNames()
      };
    }
    return {
      printerName: null,
      documentMedia: null,
      online: null,
      supported: null,
      errorCode: null,
      errorString: "Printer object not found.",
      currentMedia: null,
      supportedMedia: null
    };
  } catch (error) {
    let errorMessage = "Error retrieving printer status.";
    if (error instanceof Error && error.message) {
      errorMessage += ` Details: ${error.message}`;
    }
    const errorStatus = {
      printerName: null,
      documentMedia: null,
      online: null,
      supported: null,
      errorCode: null,
      errorString: errorMessage,
      currentMedia: null,
      supportedMedia: null
    };
    return errorStatus;
  }
};
var closeTemplate = async () => {
  try {
    const isClosed = await Doc.Close();
    if (!isClosed) {
      throw new Error("Failed to close the template file.");
    }
  } catch (error) {
    handleVendorError(error, "closeTemplate()");
  }
};
var startPrint = async (printName, bitmask) => {
  if (typeof printName !== "string" || printName.trim() === "") {
    throw new TypeError("printName must be a non-empty string.");
  }
  if (typeof bitmask !== "number") {
    throw new TypeError("bitmask must be a number.");
  }
  try {
    const isStarted = await Doc.StartPrint(printName, bitmask);
    if (!isStarted) {
      throw new Error("Failed to start the print process.");
    }
  } catch (error) {
    await closeTemplate();
    handleVendorError(error, `startPrint(printName=${printName}, bitmask=${bitmask})`);
  }
};
var printOut = async (copies) => {
  try {
    let parsed = Number(copies);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error(
        `Failed to print: invalid "copies" value. Expected a positive integer, but received ${copies} (type: ${typeof copies}).`
      );
    }
    const isPrinted = await Doc.PrintOut(parsed, 0);
    if (!isPrinted) {
      throw new Error("Failed to print, please verify the printer name is correct for the template.");
    }
  } catch (error) {
    await closeTemplate();
    handleVendorError(error, `printOut(copies=${copies})`);
  }
};
var endPrint = async () => {
  try {
    const isEnded = await Doc.EndPrint();
    if (!isEnded) {
      throw new Error("Bpac has failed to end the print process. Attempting to close template.");
    }
  } catch (error) {
    await closeTemplate();
    handleVendorError(error, "endPrint()");
  }
};
var imageData = async (width, height) => {
  try {
    const data = await Doc.GetImageData(4, width, height);
    if (data === null || data === void 0) {
      throw new Error("Doc.GetImageData returned null or undefined.");
    }
    return data.toString();
  } catch (error) {
    return handleVendorError(error, `imageData(width=${width}, height=${height})`);
  }
};
var getPrinterName = async () => {
  try {
    const printerName = await Doc.GetPrinterName();
    if (typeof printerName !== "string" || printerName.trim() === "") {
      throw new Error("Doc.GetPrinterName returned an invalid or empty string.");
    }
    return printerName;
  } catch (error) {
    return handleVendorError(error, "getPrinterName()");
  }
};
var getPrinters = async () => {
  try {
    const printerObject = await Doc.GetPrinter();
    if (!printerObject) {
      throw new Error("Doc.GetPrinter returned null or undefined.");
    }
    const printers = await printerObject.GetInstalledPrinters();
    if (!Array.isArray(printers)) {
      throw new Error(
        `Unexpected data type returned from printerObject.GetInstalledPrinters: ${typeof printers}`
      );
    }
    return printers;
  } catch (error) {
    return handleVendorError(error, "getPrinters()");
  }
};
var exportDocument = async (type, filePath, dpi = 0) => {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    throw new TypeError("filePath must be a non-empty string.");
  }
  if (typeof dpi !== "number") {
    throw new TypeError("dpi must be a number.");
  }
  try {
    const isExported = await Doc.Export(type, filePath, dpi);
    if (!isExported) {
      throw new Error(`Failed to export document to '${filePath}'.`);
    }
  } catch (error) {
    handleVendorError(error, `exportDocument(type=${type}, filePath='${filePath}', dpi=${dpi})`);
  }
};
var populateObjectsInTemplate = async (data, ignoreMissingKeys) => {
  try {
    if (Array.isArray(data)) {
      throw new Error(
        'Failed to populate template objects: expected a non-null object for "data", but received an Array.'
      );
    }
    if (!data || typeof data !== "object") {
      throw new Error(
        `Failed to populate template objects: expected a non-null object for "data", but received ${JSON.stringify(data)} (type: ${typeof data}).`
      );
    }
    for (const key of Object.keys(data)) {
      const value = data[key];
      const obj = await Doc.GetObject(key);
      if (!obj) {
        if (ignoreMissingKeys) {
          continue;
        } else {
          throw new Error(`Template object with key "${key}" could not be found. Check that the template contains this object before populating.`);
        }
      }
      const type = await obj.Type;
      switch (type) {
        case 0 /* Text */:
          obj.Text = value;
          break;
        case 2 /* Image */:
          await obj.SetData(0, value, 4);
          break;
        case 3 /* DateTime */:
          await obj.SetData(0, value, null);
          break;
        case 1 /* Barcode */:
          const barcodeIndex = await Doc.GetBarcodeIndex(key);
          await Doc.SetBarcodeData(barcodeIndex, value);
          break;
        case 4 /* ClipArt */:
          await obj.SetData(0, value, 0);
          break;
        default:
          throw new Error(`Unrecognized object type (${type}) for template key "${key}". Ensure the template only contains supported types: Text, Image, DateTime, Barcode, or ClipArt.`);
      }
    }
  } catch (error) {
    await closeTemplate();
    let safeData;
    try {
      safeData = JSON.stringify(data);
    } catch {
      safeData = String(data);
    }
    handleVendorError(error, `populateObjectsInTemplate(data=${safeData})`);
  }
};

// src/BrotherSdk.ts
var _observer, _ready, _BrotherSDK_static, initialize_fn;
var _BrotherSDK = class _BrotherSDK {
  /**
       * **BPAC-JS Class Object**
       *
       * Create a new instance of this class to interact with the Brother SDK
       * in JavaScript. This object facilitates communication and integration
       * with the SDK functionalities.
       * @param {BrotherSDKOptions} options
       * @param {String} options.templatePath
          * Specifies the path to the template file.
          * Supported path formats:
          * - Windows: C:\\\path\\\to\\\your\\\template.lbx
          * - UNC: \\\server\share\template.lbx
          * - Unix: /home/templates/template.lbx
          * - Remote URL: https://yourserver.com/templates/label.lbx
  
      ⚠️ Important:
      When working with remote URLs, the file must be hosted on the **same origin** as your webpage to avoid to CORS issues.
       * @param {String} [options.exportDir = ""]
       * The path for exporting generated assets.
       * - Win path: C:\\\path\\\to\\\your\\\
       * - Unix path: /home/pictures/
       * @param {String} [options.printer = undefined]
       * The name of the printer used for printing. Specify the printer name, not the path.
       * - Example: "Brother QL-820NWB"
       * @static
       * Use the static method `getPrinterList()` to retrieve an array of installed Brother printers.
       * Each item in the array represents an available printer.
       * @example
       * const printers = await BrotherSdk.getPrinterList();
       * console.log("Available printers:", printers);
       */
  constructor({ templatePath, exportDir, printer, media }) {
    var _a;
    assertSameOrigin(templatePath);
    this.templatePath = templatePath;
    this.exportDir = exportDir;
    this.printer = printer;
    this.media = media;
    __privateMethod(_a = _BrotherSDK, _BrotherSDK_static, initialize_fn).call(_a);
  }
  async getPrinterStatus() {
    await _BrotherSDK.printerIsReady();
    await openTemplate(this.templatePath);
    await setPrinter(this.printer, false);
    await setMedia(this.media, false);
    const statusObject = await printerStatus();
    await closeTemplate();
    return statusObject;
  }
  /**
   * **Method for Printing a Label (Single or Batch)**
   *
   * Asynchronously prints one or multiple labels using the specified configurations.
   *
   * This function supports both **single-object** and **batch printing**.
   * - If a single `TemplateData` object is passed, it prints one label.
   * - If an array of `TemplateData` objects is passed, it prints multiple labels in sequence.
   *
   * Note: Flags are valid only with those models that support each function.
   * The setting is invalid with models that do not support a function, 
   * even if a flag is set.
   *
   * @param {TemplateData | TemplateData[]} data
   * A **single object** or **an array of objects** containing key-value pairs.
   * Each key represents an object ID, and the corresponding value is the text
   * to be set on that object.
   *
   * @param {PrintOptions} [options]
   * Optional configuration object.
   *
   * @param {Number} [options.copies = 1]
   * Number of copies to print.
   *
   * @param {String} [options.printName = "BPAC-JS Document"]
   * Print document name.
   *
   * @param {boolean} [options.autoCut = false]
   * Auto cut is applied.
   *
   * @param {boolean} [options.cutPause = false]
   * Pause to cut is applied. Valid only with models not supporting the auto cut function.
   *
   * @param {boolean} [options.cutMark = false]
   * Cut mark is inserted. Valid only with models not supporting the auto cut function.
   *
   * @param {boolean} [options.halfCut = false]
   * Executes half cut.
   *
   * @param {boolean} [options.chainPrint = false]
   * Continuous printing is performed. The final label is not cut, but when the next
   * labels are output, the preceding blank is cut in line with the cut option setting.
   *
   * @param {boolean} [options.tailCut = false]
   * Whenever a label is output, the trailing end of the form is forcibly cut to
   * leave a leading blank for the next label output.
   *
   * @param {boolean} [options.specialTape = false]
   * No cutting is performed when printing on special tape.
   * Valid only with PT-2430PC.
   *
   * @param {boolean} [options.cutAtEnd = false]
   * "Cut at end" is performed.
   *
   * @param {boolean} [options.noCut = false]
   * No cutting is performed. Valid only with models supporting cut functions.
   *
   * @param {boolean} [options.mirroring = false]
   * Executes mirror printing.
   *
   * @param {boolean} [options.quality = false]
   * Fine-quality printing is performed.
   *
   * @param {boolean} [options.highSpeed = false]
   * High-speed printing is performed.
   *
   * @param {boolean} [options.highResolution = false]
   * High-resolution printing is performed.
   *
   * @param {boolean} [options.color = false]
   * Color printing is performed.
   *
   * @param {boolean} [options.mono = false]
   * Monochrome printing is performed. Valid only with models supporting
   * the color printing function.
   *
   * @param {boolean} [options.fitPage = false]
   * Specify whether to adjust the size and position of objects in the template in accordance
   * with layout changes resulting from media changes. If set to true, adjustments
   * will be made; otherwise, if set to false or undefined, no adjustments will be applied.
   * 
   * @param {boolean} [options.ignoreMissingKeys = false]
   *  If `true`, any keys in `data` that do not match objects in the template
   *  will be silently ignored.  
   *  If `false`, an error will be thrown when `data` contains keys that do not
   *  correspond to any object in the template.
   * 
   * @returns {Promise<boolean>}
   * Resolves to `true` when printing completes successfully.
   *
   * **Usage Examples**
   *
   * **Single Print**
   * ```typescript
   * await printer.print({ text: "Label 1", barcode: "12345" }, { copies: 2 });
   * ```
   *
   * **Batch Print**
   * ```typescript
   * await printer.print([
   *     { text: "Label 1", barcode: "12345" },
   *     { text: "Label 2", barcode: "67890" }
   * ], { copies: 2 });
   * ```
   */
  async print(data, options) {
    const {
      copies = 1,
      printName = "BPAC-JS Document",
      fitPage = false,
      ignoreMissingKeys = false,
      ...rest
    } = options || {};
    await _BrotherSDK.printerIsReady();
    const bitwiseOpts = getStartPrintOptions(rest);
    const dataArray = Array.isArray(data) ? data : [data];
    await openTemplate(this.templatePath);
    await setPrinter(this.printer, fitPage);
    await setMedia(this.media, fitPage);
    for (const item of dataArray) {
      await populateObjectsInTemplate(item, ignoreMissingKeys);
      await startPrint(printName, bitwiseOpts);
      await printOut(copies);
    }
    await endPrint();
    await closeTemplate();
    return true;
  }
  /**
   * **Method For Retrieving The Label's Image Data**
   *
   * Asynchronously retrieves and returns Base64-encoded image data for a label.
   *
   * @param {TemplateData} data
   * An object containing key-value pairs, where each key represents an object ID,
   * and the corresponding value is the text to be set on that object.
   * @param {ImageOptions} options
   * Optional
   * @param {number} [options.height = 0]
   * If the vertical size (dpi) of the image to be acquired is specified as 0, it
   * becomes a size that maintains the aspect ratio based on width.
   * @param {number} [options.width = 0]
   * Horizontal size (dpi) of the image to be acquired. If 0 is specified,
   * it becomes a size that maintains the aspect ratio based on height.
   * @param {boolean} [options.ignoreMissingKeys = false]
   *  If `true`, any keys in `data` that do not match objects in the template
   *  will be silently ignored.  
   *  If `false`, an error will be thrown when `data` contains keys that do not
   *  correspond to any object in the template.
   * @returns {Promise<string>}
   * A promise that resolves to a Base64 encoded string representing the image data.
   */
  async getImageData(data, options) {
    const {
      width = 0,
      height = 0,
      ignoreMissingKeys = false
    } = options || {};
    await _BrotherSDK.printerIsReady();
    await openTemplate(this.templatePath);
    await setPrinter(this.printer, false);
    await setMedia(this.media, false);
    await populateObjectsInTemplate(data, ignoreMissingKeys);
    const base64EncodedPNG = await imageData(width, height);
    await closeTemplate();
    return base64EncodedPNG;
  }
  /**
   * **Retrieve The Printer's Name**
   *
   * Asynchronously retrieves the printers name for the current context.
   *
   * @returns {Promise<string>}
   * A promise that resolves with the name of the printer.
   *
   */
  async getPrinterName() {
    await _BrotherSDK.printerIsReady();
    await openTemplate(this.templatePath);
    const printerName = await getPrinterName();
    await closeTemplate();
    return printerName;
  }
  /**
   * **Export Label To File**
   *
   * Asynchronously populate & export a copy of the file in various formats.
   *
   * @param {Object} data
   * An object containing key-value pairs, where each key represents
   * an object ID, and the corresponding value is the text to be set on that object.
   * @param {String} [filePathOrFileName = ""]
   * Provide a file name or absolute path.
   * - e.g. = "myLabel.lbx" will be stored in the exportDir path provided.
   * - e.g. = "C:/Templates/myLabel.lbx" will override the exportDir.
   * - Supported file types = .lbx | .lbl | .lbi | .bmp | .paf
   * @param {ExportOptions} options
   * Optional
   * @param {Number} [options.resolution = 0]
   *  Provide a resolution in dpi used for the conversion into bitmap format.
   *  Specifies the resolution of the output device.
   *  (Screen: 72 or 96; output to SC-2000: 600)
   *  If a value of 0 is specified, the printer resolution is used.
   *  The resolution param is only valid for .lbi and .bmp extensions.
   *  @param {boolean} [options.ignoreMissingKeys = false]
   *  If `true`, any keys in `data` that do not match objects in the template
   *  will be silently ignored.  
   *  If `false`, an error will be thrown when `data` contains keys that do not
   *  correspond to any object in the template.
   */
  async export(data, filePathOrFileName, options) {
    const {
      resolution = 0,
      ignoreMissingKeys = false
    } = options || {};
    const fileExt = getFileExtension(filePathOrFileName);
    const fileType = getExportType(fileExt);
    const path = getAbsolutePath(
      this.exportDir,
      filePathOrFileName
    );
    await _BrotherSDK.printerIsReady();
    await openTemplate(this.templatePath);
    await populateObjectsInTemplate(data, ignoreMissingKeys);
    await exportDocument(fileType, path, resolution);
    await closeTemplate();
    return true;
  }
  /**
   * **Get List Of Installed Printers**
   *
   * asynchronously retrieves the list of installed printers compatible with the bpac SDK.
   *
   * @returns {Promise<string[]>}
   * a promise that resolves to an array of installed printers
   * compatible with the 'bpac' SDK.
   *
   */
  static async getPrinterList() {
    await _BrotherSDK.printerIsReady();
    const printers = await getPrinters();
    return printers;
  }
  static async printerIsReady(timeout = 2e3) {
    if (__privateGet(_BrotherSDK, _ready)) {
      return;
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (__privateGet(_BrotherSDK, _ready)) {
          resolve();
        } else {
          reject(
            new BpacError(
              `Printer initialization failed: Unable to establish communication within ${timeout} ms. Verify that the b-PAC extension is installed, active, and that the printer is connected.`,
              `PrinterIsReady(timeout=${timeout})`
            )
          );
        }
      }, timeout);
    });
  }
};
_observer = new WeakMap();
_ready = new WeakMap();
_BrotherSDK_static = new WeakSet();
initialize_fn = function() {
  const targetNode = document.body;
  const className = "bpac-extension-installed";
  if (__privateGet(_BrotherSDK, _ready)) {
    return;
  }
  if (__privateGet(_BrotherSDK, _observer)) {
    return;
  }
  if (targetNode.classList.contains(className)) {
    __privateSet(_BrotherSDK, _ready, true);
    return;
  }
  __privateSet(_BrotherSDK, _observer, new MutationObserver(() => {
    if (targetNode.classList.contains(className)) {
      __privateSet(_BrotherSDK, _ready, true);
      __privateGet(_BrotherSDK, _observer)?.disconnect();
      __privateSet(_BrotherSDK, _observer, null);
    }
  }));
  __privateGet(_BrotherSDK, _observer).observe(targetNode, {
    attributes: true,
    attributeFilter: ["class"]
  });
};
__privateAdd(_BrotherSDK, _BrotherSDK_static);
// One mutation observer, regardless of instances.
__privateAdd(_BrotherSDK, _observer, null);
__privateAdd(_BrotherSDK, _ready, false);
var BrotherSDK = _BrotherSDK;

// src/index.ts
var index_default = BrotherSDK;
export {
  BrotherSDK,
  index_default as default
};
//# sourceMappingURL=index.js.map
