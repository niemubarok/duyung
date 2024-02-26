var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src-electron/electron-preload.js
var electron_preload_exports = {};
__export(electron_preload_exports, {
  generatePDF: () => generatePDF
});
module.exports = __toCommonJS(electron_preload_exports);
var import_electron = require("electron");
var import_localstorage_slim = __toESM(require("localstorage-slim"), 1);
var import_unix_print = require("unix-print");
var import_pdf_to_printer = require("pdf-to-printer");
var import_pdf_to_printer2 = require("pdf-to-printer");
var import_jspdf = __toESM(require("jspdf"), 1);
var import_jspdf_autotable = __toESM(require("jspdf-autotable"), 1);
var import_jsbarcode = __toESM(require("jsbarcode"), 1);
var import_console = require("console");
var fs = require("fs");
var path = require("path");
var os = require("os");
var directoryPath = path.join(os.homedir(), "struk");
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
var generateBarcode = (text) => {
  const canvas = document.createElement("canvas");
  (0, import_jsbarcode.default)(canvas, text, { displayValue: false, format: "CODE128" });
  return canvas.toDataURL("image/png");
};
var generatePDF = (no_transaksi, tiket) => {
  const data = JSON.parse(tiket);
  const pdf = new import_jspdf.default({
    unit: "mm",
    format: [80, 150],
    plugins: [import_jspdf_autotable.default]
  });
  const pageWidth = pdf.internal.pageSize.width;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("PUTRI DUYUNG", pdf.internal.pageSize.width / 2, 5, {
    align: "center"
  });
  pdf.setFontSize(5);
  const petugas = import_localstorage_slim.default.get("petugas").nama;
  const waktu = (/* @__PURE__ */ new Date()).toLocaleString("id-ID").replace(/\./g, ":");
  pdf.text(`petugas: ${petugas}`, 5, 11, { align: "left" });
  pdf.text(waktu, pageWidth - 5, 11, { align: "right" });
  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12);
  pdf.setFont("helvetica");
  pdf.setFontSize(13);
  pdf.text(data.nama, pdf.internal.pageSize.width / 2, 17, {
    align: "center"
  });
  pdf.setFontSize(7);
  pdf.text(
    ".:: Terimakasih atas kunjungan anda ::.",
    pdf.internal.pageSize.width / 2,
    5 + 35,
    // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.text(
    "                             ",
    pdf.internal.pageSize.width / 2,
    5 + 37,
    // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.text(
    "                             ",
    pdf.internal.pageSize.width / 2,
    5 + 39,
    // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.line(5, 5 + 32, pdf.internal.pageSize.width - 5, 5 + 32);
  pdf.text(
    "Scan Barcode Di Pintu Masuk",
    pdf.internal.pageSize.width / 2,
    5 + 20,
    // Adjust vertical position based on QR code size
    { align: "center" }
  );
  const barcodeData = generateBarcode(no_transaksi == null ? void 0 : no_transaksi.replace(/\//g, ""));
  if (barcodeData) {
    const barcodeImage = new Image();
    barcodeImage.src = barcodeData;
    barcodeImage.onload = () => {
      const barcodeWidth = 45;
      const barcodeHeight = 10;
      const xPosition = (pageWidth - barcodeWidth) / 2;
      const yPosition = 5 + 21;
      pdf.addImage(
        barcodeImage,
        "PNG",
        xPosition,
        yPosition,
        barcodeWidth,
        barcodeHeight
      );
      const pdfOutput = pdf.output("blob");
      const namaFile = data.nama + ".pdf";
      const reader = new FileReader();
      reader.onload = async function() {
        const buffer = this.result;
        const isDownloaded = await downloadPDF(buffer, namaFile);
        if (isDownloaded) {
          fs.promises.access(path.join(directoryPath, namaFile), fs.constants.F_OK).then(async () => await print(namaFile, data.qty)).catch((error) => console.error(`File does not exist: ${error}`));
        }
      };
      reader.readAsArrayBuffer(pdfOutput);
    };
  }
};
async function print(namaFile, qty) {
  const namaPrinter = import_localstorage_slim.default.get("namaPrinter");
  const options = [`-n ${qty}`];
  const filePath = path.join(directoryPath, namaFile);
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    const printResult = process.platform === "win32" ? await (0, import_pdf_to_printer.print)(filePath, namaPrinter, options) : await (0, import_unix_print.print)(filePath, namaPrinter, options);
    console.log(printResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error during printing: ${errorMessage}`);
  }
}
async function getPrinters() {
  if (process.platform === "win32") {
    return (0, import_pdf_to_printer2.getPrinters)().then((printers) => {
      return printers.map((each) => each.printer);
    });
  } else {
    return (0, import_unix_print.getPrinters)().then((printers) => {
      return printers.map((each) => each.printer);
    });
  }
}
var getHomeDir = () => os.homedir();
var downloadPDF = async (pdf, filename) => {
  return new Promise((resolve, reject) => {
    import_electron.ipcRenderer.send("download-pdf", pdf, filename);
    import_electron.ipcRenderer.once("download-pdf-reply", (event, status, error) => {
      if (status) {
        (0, import_console.log)("PDF downloaded successfully");
        resolve(true);
      } else {
        (0, import_console.log)("Failed to download PDF:", error);
        reject(false);
      }
    });
  });
};
import_electron.contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print,
  createPDFStruk: generatePDF,
  // printTiket,
  getPrinters,
  getHomeDir,
  // printWithElectronPosPrinter,
  downloadPDF
  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generatePDF
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLXByZWxvYWQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSBcImVsZWN0cm9uXCI7XHJcbmltcG9ydCBscyBmcm9tIFwibG9jYWxzdG9yYWdlLXNsaW1cIjtcclxuaW1wb3J0IHtcclxuICBwcmludCBhcyBwcmludFVuaXgsXHJcbiAgZ2V0UHJpbnRlcnMgYXMgZ2V0VW5peFByaW50ZXJzLFxyXG4gIGdldERlZmF1bHRQcmludGVyIGFzIGdldFVuaXhEZWZhdWx0UHJpbnRlcixcclxufSBmcm9tIFwidW5peC1wcmludFwiO1xyXG5pbXBvcnQgeyBwcmludCBhcyBwcmludFdpbmRvd3MgfSBmcm9tIFwicGRmLXRvLXByaW50ZXJcIjsgLy8gUmVwbGFjZSAnd2luZG93cy1wcmludCcgd2l0aCB0aGUgYWN0dWFsIHBhY2thZ2UgZm9yIFdpbmRvd3MgcHJpbnRpbmdcclxuXHJcbmltcG9ydCB7XHJcbiAgZ2V0UHJpbnRlcnMgYXMgZ2V0V2luZG93c1ByaW50ZXJzLFxyXG4gIGdldERlZmF1bHRQcmludGVyIGFzIGdldFdpbmRvd3NEZWZhdWx0UHJpbnRlcixcclxufSBmcm9tIFwicGRmLXRvLXByaW50ZXJcIjtcclxuXHJcbmltcG9ydCBqc1BERiBmcm9tIFwianNwZGZcIjtcclxuaW1wb3J0IGF1dG9UYWJsZSBmcm9tIFwianNwZGYtYXV0b3RhYmxlXCI7XHJcbmltcG9ydCBKc0JhcmNvZGUgZnJvbSBcImpzYmFyY29kZVwiO1xyXG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiY29uc29sZVwiO1xyXG5cclxuLy8gY29uc3QgcHJpbnQgPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBwcmludFdpbmRvd3MgOiBwcmludFVuaXg7XHJcblxyXG5jb25zdCBmb3JtYXRDdXJyZW5jeSA9IChhbW91bnQpID0+IHtcclxuICAvLyBQZW1pc2FoIHJpYnVhblxyXG4gIGNvbnN0IHNlcGFyYXRvciA9IFwiLlwiO1xyXG5cclxuICAvLyBLb252ZXJzaSBrZSBiaWxhbmdhbiBidWxhdFxyXG4gIGNvbnN0IGludGVnZXJQYXJ0ID0gTWF0aC5yb3VuZChhbW91bnQpO1xyXG5cclxuICAvLyBGb3JtYXQgYW5na2Egc2ViYWdhaSBzdHJpbmdcclxuICBsZXQgZm9ybWF0dGVkQW1vdW50ID0gaW50ZWdlclBhcnRcclxuICAgIC50b1N0cmluZygpXHJcbiAgICAucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgc2VwYXJhdG9yKTtcclxuXHJcbiAgLy8gVGFtYmFoa2FuIHNpbWJvbCBtYXRhIHVhbmcgZGFuIGhhcHVzIGRlc2ltYWxcclxuICBmb3JtYXR0ZWRBbW91bnQgPSBmb3JtYXR0ZWRBbW91bnQ7XHJcblxyXG4gIHJldHVybiBmb3JtYXR0ZWRBbW91bnQ7XHJcbn07XHJcblxyXG5jb25zdCBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xyXG5jb25zdCBvcyA9IHJlcXVpcmUoXCJvc1wiKTtcclxuY29uc3QgZGlyZWN0b3J5UGF0aCA9IHBhdGguam9pbihvcy5ob21lZGlyKCksIFwic3RydWtcIik7XHJcbmlmICghZnMuZXhpc3RzU3luYyhkaXJlY3RvcnlQYXRoKSkge1xyXG4gIGZzLm1rZGlyU3luYyhkaXJlY3RvcnlQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcclxufVxyXG4vLyBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnlQYXRoLCBcInN0cnVrLnBkZlwiKTtcclxuXHJcbmNvbnN0IGdlbmVyYXRlQmFyY29kZSA9ICh0ZXh0KSA9PiB7XHJcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICBKc0JhcmNvZGUoY2FudmFzLCB0ZXh0LCB7IGRpc3BsYXlWYWx1ZTogZmFsc2UsIGZvcm1hdDogXCJDT0RFMTI4XCIgfSk7XHJcbiAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVQREYgPSAobm9fdHJhbnNha3NpLCB0aWtldCkgPT4ge1xyXG4gIC8vIGNvbnNvbGUubG9nKFwidHJhbnNha3NpXCIsIEpTT04ucGFyc2UoZGF0YSkpO1xyXG4gIC8vIHJldHVybjtcclxuXHJcbiAgLy8gY29uc3QgamVuaXNUaWtldCA9IEpTT04ucGFyc2UoZGF0YS50cmFuc2Frc2kpWzBdLmplbmlzXHJcbiAgLy8gICA/IEpTT04ucGFyc2UoZGF0YS50cmFuc2Frc2kpWzBdLmplbmlzXHJcbiAgLy8gICA6IFwiVGlrZXQgTWFzdWtcIjtcclxuXHJcbiAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UodGlrZXQpO1xyXG5cclxuICBjb25zdCBwZGYgPSBuZXcganNQREYoe1xyXG4gICAgdW5pdDogXCJtbVwiLFxyXG4gICAgZm9ybWF0OiBbODAsIDE1MF0sXHJcbiAgICBwbHVnaW5zOiBbYXV0b1RhYmxlXSxcclxuICB9KTtcclxuXHJcbiAgY29uc3QgcGFnZVdpZHRoID0gcGRmLmludGVybmFsLnBhZ2VTaXplLndpZHRoO1xyXG4gIHBkZi5zZXRGb250KFwiaGVsdmV0aWNhXCIsIFwiYm9sZFwiKTtcclxuICBwZGYuc2V0Rm9udFNpemUoMTApO1xyXG4gIHBkZi50ZXh0KHByb2Nlc3MuZW52Lk5BTUFfUEVSVVNBSEFBTiwgcGRmLmludGVybmFsLnBhZ2VTaXplLndpZHRoIC8gMiwgNSwge1xyXG4gICAgYWxpZ246IFwiY2VudGVyXCIsXHJcbiAgfSk7XHJcblxyXG4gIHBkZi5zZXRGb250U2l6ZSg1KTtcclxuXHJcbiAgY29uc3QgcGV0dWdhcyA9IGxzLmdldChcInBldHVnYXNcIikubmFtYTtcclxuICBjb25zdCB3YWt0dSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoXCJpZC1JRFwiKS5yZXBsYWNlKC9cXC4vZywgXCI6XCIpO1xyXG4gIC8vIGNvbnN0IG5vX3RyYW5zYWtzaSA9IGRhdGEubm9fdHJhbnNha3NpO1xyXG5cclxuICAvLyBwZGYudGV4dChgJHt3YWt0dX1gLCA1LCA4LCB7IGFsaWduOiBcImxlZnRcIiB9KTtcclxuXHJcbiAgcGRmLnRleHQoYHBldHVnYXM6ICR7cGV0dWdhc31gLCA1LCAxMSwgeyBhbGlnbjogXCJsZWZ0XCIgfSk7XHJcbiAgcGRmLnRleHQod2FrdHUsIHBhZ2VXaWR0aCAtIDUsIDExLCB7IGFsaWduOiBcInJpZ2h0XCIgfSk7XHJcblxyXG4gIHBkZi5saW5lKDUsIDEyLCBwZGYuaW50ZXJuYWwucGFnZVNpemUud2lkdGggLSA1LCAxMik7IC8vIERyYXcgYSBsaW5lIGF0IHkgPSAxMiBtbSBmcm9tIHRoZSBsZWZ0IG1hcmdpbiB0byB0aGUgcmlnaHQgbWFyZ2luXHJcbiAgcGRmLnNldEZvbnQoXCJoZWx2ZXRpY2FcIik7XHJcbiAgcGRmLnNldEZvbnRTaXplKDEzKTtcclxuXHJcbiAgcGRmLnRleHQoZGF0YS5uYW1hLCBwZGYuaW50ZXJuYWwucGFnZVNpemUud2lkdGggLyAyLCAxNywge1xyXG4gICAgYWxpZ246IFwiY2VudGVyXCIsXHJcbiAgfSk7XHJcbiAgLy8gaWYgKGRhdGEubmFtYVBha2V0ICYmIGRhdGEubmFtYVBha2V0ICE9PSBudWxsKSB7XHJcbiAgLy8gfSBlbHNlIHtcclxuICAvLyAgIHBkZi50ZXh0KGplbmlzVGlrZXQsIHBkZi5pbnRlcm5hbC5wYWdlU2l6ZS53aWR0aCAvIDIsIDE3LCB7XHJcbiAgLy8gICAgIGFsaWduOiBcImNlbnRlclwiLFxyXG4gIC8vICAgfSk7XHJcbiAgLy8gfVxyXG5cclxuICBwZGYuc2V0Rm9udFNpemUoNyk7XHJcbiAgcGRmLnRleHQoXHJcbiAgICBcIi46OiBUZXJpbWFrYXNpaCBhdGFzIGt1bmp1bmdhbiBhbmRhIDo6LlwiLFxyXG4gICAgcGRmLmludGVybmFsLnBhZ2VTaXplLndpZHRoIC8gMixcclxuICAgIDUgKyAzNSwgLy8gQWRqdXN0IHZlcnRpY2FsIHBvc2l0aW9uIGJhc2VkIG9uIFFSIGNvZGUgc2l6ZVxyXG4gICAgeyBhbGlnbjogXCJjZW50ZXJcIiB9XHJcbiAgKTtcclxuICBwZGYudGV4dChcclxuICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIixcclxuICAgIHBkZi5pbnRlcm5hbC5wYWdlU2l6ZS53aWR0aCAvIDIsXHJcbiAgICA1ICsgMzcsIC8vIEFkanVzdCB2ZXJ0aWNhbCBwb3NpdGlvbiBiYXNlZCBvbiBRUiBjb2RlIHNpemVcclxuICAgIHsgYWxpZ246IFwiY2VudGVyXCIgfVxyXG4gICk7XHJcbiAgcGRmLnRleHQoXHJcbiAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIsXHJcbiAgICBwZGYuaW50ZXJuYWwucGFnZVNpemUud2lkdGggLyAyLFxyXG4gICAgNSArIDM5LCAvLyBBZGp1c3QgdmVydGljYWwgcG9zaXRpb24gYmFzZWQgb24gUVIgY29kZSBzaXplXHJcbiAgICB7IGFsaWduOiBcImNlbnRlclwiIH1cclxuICApO1xyXG5cclxuICBwZGYubGluZSg1LCA1ICsgMzIsIHBkZi5pbnRlcm5hbC5wYWdlU2l6ZS53aWR0aCAtIDUsIDUgKyAzMik7XHJcblxyXG4gIHBkZi50ZXh0KFxyXG4gICAgXCJTY2FuIEJhcmNvZGUgRGkgUGludHUgTWFzdWtcIixcclxuICAgIHBkZi5pbnRlcm5hbC5wYWdlU2l6ZS53aWR0aCAvIDIsXHJcbiAgICA1ICsgMjAsIC8vIEFkanVzdCB2ZXJ0aWNhbCBwb3NpdGlvbiBiYXNlZCBvbiBRUiBjb2RlIHNpemVcclxuICAgIHsgYWxpZ246IFwiY2VudGVyXCIgfVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IGJhcmNvZGVEYXRhID0gZ2VuZXJhdGVCYXJjb2RlKG5vX3RyYW5zYWtzaT8ucmVwbGFjZSgvXFwvL2csIFwiXCIpKTtcclxuICAvLyBBZGQgYmFyY29kZSB0byBQREZcclxuICBpZiAoYmFyY29kZURhdGEpIHtcclxuICAgIGNvbnN0IGJhcmNvZGVJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgYmFyY29kZUltYWdlLnNyYyA9IGJhcmNvZGVEYXRhO1xyXG4gICAgYmFyY29kZUltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgY29uc3QgYmFyY29kZVdpZHRoID0gNDU7IC8vIEluY3JlYXNlZCB3aWR0aCBmb3IgYmV0dGVyIGNsYXJpdHlcclxuICAgICAgY29uc3QgYmFyY29kZUhlaWdodCA9IDEwOyAvLyBJbmNyZWFzZWQgaGVpZ2h0IGZvciBiZXR0ZXIgY2xhcml0eVxyXG4gICAgICBjb25zdCB4UG9zaXRpb24gPSAocGFnZVdpZHRoIC0gYmFyY29kZVdpZHRoKSAvIDI7XHJcbiAgICAgIGNvbnN0IHlQb3NpdGlvbiA9IDUgKyAyMTtcclxuICAgICAgcGRmLmFkZEltYWdlKFxyXG4gICAgICAgIGJhcmNvZGVJbWFnZSxcclxuICAgICAgICBcIlBOR1wiLFxyXG4gICAgICAgIHhQb3NpdGlvbixcclxuICAgICAgICB5UG9zaXRpb24sXHJcbiAgICAgICAgYmFyY29kZVdpZHRoLFxyXG4gICAgICAgIGJhcmNvZGVIZWlnaHRcclxuICAgICAgKTtcclxuICAgICAgY29uc3QgcGRmT3V0cHV0ID0gcGRmLm91dHB1dChcImJsb2JcIik7XHJcbiAgICAgIGNvbnN0IG5hbWFGaWxlID0gZGF0YS5uYW1hICsgXCIucGRmXCI7XHJcblxyXG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICByZWFkZXIub25sb2FkID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMucmVzdWx0O1xyXG4gICAgICAgIGNvbnN0IGlzRG93bmxvYWRlZCA9IGF3YWl0IGRvd25sb2FkUERGKGJ1ZmZlciwgbmFtYUZpbGUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZG93bmxvYWRcIiwgZG93bmxvYWQpO1xyXG5cclxuICAgICAgICBpZiAoaXNEb3dubG9hZGVkKSB7XHJcbiAgICAgICAgICBmcy5wcm9taXNlc1xyXG4gICAgICAgICAgICAuYWNjZXNzKHBhdGguam9pbihkaXJlY3RvcnlQYXRoLCBuYW1hRmlsZSksIGZzLmNvbnN0YW50cy5GX09LKVxyXG4gICAgICAgICAgICAudGhlbihhc3luYyAoKSA9PiBhd2FpdCBwcmludChuYW1hRmlsZSwgZGF0YS5xdHkpKVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmVycm9yKGBGaWxlIGRvZXMgbm90IGV4aXN0OiAke2Vycm9yfWApKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihwZGZPdXRwdXQpO1xyXG4gICAgfTtcclxuICAgIC8vIHJldHVybiB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByaW50KG5hbWFGaWxlLCBxdHkpIHtcclxuICAvLyBnZXRXaW5kb3dzUHJpbnRlcnMoKS50aGVuKGNvbnNvbGUubG9nKTtcclxuICAvLyByZXR1cm5cclxuICBjb25zdCBuYW1hUHJpbnRlciA9IGxzLmdldChcIm5hbWFQcmludGVyXCIpO1xyXG4gIGNvbnN0IG9wdGlvbnMgPSBbYC1uICR7cXR5fWBdO1xyXG4gIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeVBhdGgsIG5hbWFGaWxlKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IGZzLnByb21pc2VzLmFjY2VzcyhmaWxlUGF0aCwgZnMuY29uc3RhbnRzLkZfT0spO1xyXG5cclxuICAgIGNvbnN0IHByaW50UmVzdWx0ID1cclxuICAgICAgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiXHJcbiAgICAgICAgPyBhd2FpdCBwcmludFdpbmRvd3MoZmlsZVBhdGgsIG5hbWFQcmludGVyLCBvcHRpb25zKVxyXG4gICAgICAgIDogYXdhaXQgcHJpbnRVbml4KGZpbGVQYXRoLCBuYW1hUHJpbnRlciwgb3B0aW9ucyk7XHJcblxyXG4gICAgY29uc29sZS5sb2cocHJpbnRSZXN1bHQpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPVxyXG4gICAgICBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiVW5rbm93biBlcnJvclwiO1xyXG4gICAgY29uc29sZS5lcnJvcihgRXJyb3IgZHVyaW5nIHByaW50aW5nOiAke2Vycm9yTWVzc2FnZX1gKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGFzeW5jIGZ1bmN0aW9uIHByaW50VGlrZXQoKSB7XHJcbi8vICAgZ2VuZXJhdGVQREZcclxuLy8gfVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJpbnRlcnMoKSB7XHJcbiAgLy8gbGV0IG5hbWFQcmludGVyID0gXCJcIlxyXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcclxuICAgIHJldHVybiBnZXRXaW5kb3dzUHJpbnRlcnMoKS50aGVuKChwcmludGVycykgPT4ge1xyXG4gICAgICByZXR1cm4gcHJpbnRlcnMubWFwKChlYWNoKSA9PiBlYWNoLnByaW50ZXIpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBnZXRVbml4UHJpbnRlcnMoKS50aGVuKChwcmludGVycykgPT4ge1xyXG4gICAgICByZXR1cm4gcHJpbnRlcnMubWFwKChlYWNoKSA9PiBlYWNoLnByaW50ZXIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBnZXRIb21lRGlyID0gKCkgPT4gb3MuaG9tZWRpcigpO1xyXG5jb25zdCBkb3dubG9hZFBERiA9IGFzeW5jIChwZGYsIGZpbGVuYW1lKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGlwY1JlbmRlcmVyLnNlbmQoXCJkb3dubG9hZC1wZGZcIiwgcGRmLCBmaWxlbmFtZSk7XHJcbiAgICBpcGNSZW5kZXJlci5vbmNlKFwiZG93bmxvYWQtcGRmLXJlcGx5XCIsIChldmVudCwgc3RhdHVzLCBlcnJvcikgPT4ge1xyXG4gICAgICAvLyBsb2coc3RhdHVzKTtcclxuICAgICAgaWYgKHN0YXR1cykge1xyXG4gICAgICAgIGxvZyhcIlBERiBkb3dubG9hZGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZyhcIkZhaWxlZCB0byBkb3dubG9hZCBQREY6XCIsIGVycm9yKTtcclxuICAgICAgICByZWplY3QoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoXCJlbGVjdHJvblwiLCB7XHJcbiAgLy8gc2VyaWFscG9ydDogY3JlYXRlU2VyaWFsUG9ydCxcclxuICBwcmludCxcclxuICBjcmVhdGVQREZTdHJ1azogZ2VuZXJhdGVQREYsXHJcbiAgLy8gcHJpbnRUaWtldCxcclxuICBnZXRQcmludGVycyxcclxuICBnZXRIb21lRGlyLFxyXG4gIC8vIHByaW50V2l0aEVsZWN0cm9uUG9zUHJpbnRlcixcclxuICBkb3dubG9hZFBERixcclxuXHJcbiAgLy8gZGV0ZWN0TGljZW5zZVBsYXRlQXJlYTogZGV0ZWN0TGljZW5zZVBsYXRlQXJlYSxcclxuICAvLyBnZXRTZXJpYWxQb3J0TGlzdDogZ2V0U2VyaWFsUG9ydExpc3QsXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFBMkM7QUFDM0MsK0JBQWU7QUFDZix3QkFJTztBQUNQLDRCQUFzQztBQUV0QyxJQUFBQSx5QkFHTztBQUVQLG1CQUFrQjtBQUNsQiw2QkFBc0I7QUFDdEIsdUJBQXNCO0FBQ3RCLHFCQUFvQjtBQXNCcEIsSUFBTSxLQUFLLFFBQVEsSUFBSTtBQUN2QixJ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QTBCLFlBQVksRUFBRTtBQUFBLEVBQ3hEO0FBQ0Y7QUFNQSxlQUFlLGNBQWM7QUFFM0IsTUFBSSxRQUFRLGFBQWEsU0FBUztBQUNoQyxlQUFPLHVCQUFBQyxhQUFtQixFQUFFLEtBQUssQ0FBQyxhQUFhO0FBQzdDLGFBQU8sU0FBUyxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU87QUFBQSxJQUM1QyxDQUFDO0FBQUEsRUFDSCxPQUFPO0FBQ0wsZUFBTyxrQkFBQUMsYUFBZ0IsRUFBRSxLQUFLLENBQUMsYUFBYTtBQUMxQyxhQUFPLFNBQVMsSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPO0FBQUEsSUFDNUMsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVBLElBQU0sYUFBYSxNQUFNLEdBQUcsUUFBUTtBQUNwQyxJQUFNLGNBQWMsT0FBTyxLQUFLLGFBQWE7QUFDM0MsU0FBTyxJQUFJLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFDdEMsZ0NBQVksS0FBSyxnQkFBZ0IsS0FBSyxRQUFRO0FBQzlDLGdDQUFZLEtBQUssc0JBQXNCLENBQUMsT0FBTyxRQUFRLFVBQVU7QUFFL0QsVUFBSSxRQUFRO0FBQ1YsZ0NBQUksNkJBQTZCO0FBQ2pDLGdCQUFRLElBQUk7QUFBQSxNQUNkLE9BQU87QUFDTCxnQ0FBSSwyQkFBMkIsS0FBSztBQUNwQyxlQUFPLEtBQUs7QUFBQSxNQUNkO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxDQUFDO0FBQ0g7QUFFQSw4QkFBYyxrQkFBa0IsWUFBWTtBQUFBO0FBQUEsRUFFMUM7QUFBQSxFQUNBLGdCQUFnQjtBQUFBO0FBQUEsRUFFaEI7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUVBO0FBQUE7QUFBQTtBQUlGLENBQUM7IiwKICAibmFtZXMiOiBbImltcG9ydF9wZGZfdG9fcHJpbnRlciIsICJKc0JhcmNvZGUiLCAianNQREYiLCAiYXV0b1RhYmxlIiwgImxzIiwgInByaW50V2luZG93cyIsICJwcmludFVuaXgiLCAiZ2V0V2luZG93c1ByaW50ZXJzIiwgImdldFVuaXhQcmludGVycyJdCn0K
