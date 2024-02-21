import { contextBridge, ipcRenderer } from "electron";
import ls from "localstorage-slim";
import {
  print as printUnix,
  getPrinters as getUnixPrinters,
  getDefaultPrinter as getUnixDefaultPrinter,
} from "unix-print";
import { print as printWindows } from "pdf-to-printer"; // Replace 'windows-print' with the actual package for Windows printing

import {
  getPrinters as getWindowsPrinters,
  getDefaultPrinter as getWindowsDefaultPrinter,
} from "pdf-to-printer";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode";

// const print = process.platform === "win32" ? printWindows : printUnix;

const formatCurrency = (amount) => {
  // Pemisah ribuan
  const separator = ".";

  // Konversi ke bilangan bulat
  const integerPart = Math.round(amount);

  // Format angka sebagai string
  let formattedAmount = integerPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // Tambahkan simbol mata uang dan hapus desimal
  formattedAmount = formattedAmount;

  return formattedAmount;
};

const fs = require("fs");
const path = require("path");
const os = require("os");
const directoryPath = path.join(os.homedir(), "struk");
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
const filePath = path.join(directoryPath, "struk.pdf");

const generateBarcode = (text) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { displayValue: false, format: "CODE128" });
  return canvas.toDataURL("image/png");
};

export const generatePDF = (transaksi, namaPrinter) => {
  // console.log("transaksi", JSON.parse(transaksi.transaksi));
  // return;

  const jenisTiket = JSON.parse(transaksi.transaksi)[0].jenis
    ? JSON.parse(transaksi.transaksi)[0].jenis
    : "Tiket Masuk";

  const pdf = new jsPDF({
    unit: "mm",
    format: [80, 150],
    // plugins: [autoTable],
  });

  const pageWidth = pdf.internal.pageSize.width;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(process.env.NAMA_PERUSAHAAN, pdf.internal.pageSize.width / 2, 5, {
    align: "center",
  });

  

  pdf.setFontSize(5);

  const petugas = ls.get("petugas").nama;
  const waktu = new Date().toLocaleString("id-ID").replace(/\./g, ":");
  const no_transaksi = transaksi.no_transaksi;

  // pdf.text(`${waktu}`, 5, 8, { align: "left" });

  pdf.text(`petugas: ${petugas}`, 5, 11, { align: "left" });
  pdf.text(waktu, pageWidth - 5, 11, { align: "right" });

  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12); // Draw a line at y = 12 mm from the left margin to the right margin
  pdf.setFont("helvetica");
  pdf.setFontSize(13);

  if (transaksi.namaPaket && transaksi.namaPaket !== null) {
    pdf.text(transaksi.namaPaket, pdf.internal.pageSize.width / 2, 17, {
      align: "center",
    });
  } else {
    pdf.text(jenisTiket, pdf.internal.pageSize.width / 2, 17, {
      align: "center",
    });
  }
  
  pdf.setFontSize(7);
  pdf.text(
    ".:: Terimakasih atas kunjungan anda ::.",
    pdf.internal.pageSize.width / 2,
    5 + 35, // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.text(
    "                             ",
    pdf.internal.pageSize.width / 2,
    5 + 37, // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.text(
    "                             ",
    pdf.internal.pageSize.width / 2,
    5 + 39, // Adjust vertical position based on QR code size
    { align: "center" }
  );

  pdf.line(
    15,
    5 + 32,
    pdf.internal.pageSize.width - 5,
    5 + 32
  );

  pdf.text(
    "Scan Barcode Di Pintu Masuk",
    pdf.internal.pageSize.width / 2,
    5 + 20, // Adjust vertical position based on QR code size
    { align: "center" }
  );

  const barcodeData = generateBarcode(no_transaksi?.replace(/\//g, ""));
  // Add barcode to PDF
  if (barcodeData) {
    const barcodeImage = new Image();
    barcodeImage.src = barcodeData;
    barcodeImage.onload = () => {
      const barcodeWidth = 45; // Increased width for better clarity
      const barcodeHeight = 10; // Increased height for better clarity
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
      const filePath = `struk.pdf`;

      const reader = new FileReader();
      reader.onload = function () {
        const buffer = this.result;
        downloadPDF(buffer, filePath);
        print(namaPrinter);
      };
      reader.readAsArrayBuffer(pdfOutput);
    };
    // return true;
  }
};

async function print(namaPrinter) {
  // getWindowsPrinters().then(console.log);
  // return
  console.log("print", namaPrinter);
  const printerOption = {
    printer: namaPrinter,
  };

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);

    const printResult =
      process.platform === "win32"
        ? await printWindows(filePath, printerOption.printer)
        : await printUnix(filePath, printerOption.printer);

    console.log(printResult);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error during printing: ${errorMessage}`);
  }
}

// async function printTiket() {
//   generatePDF
// }

async function getPrinters() {
  // let namaPrinter = ""
  if (process.platform === "win32") {
    return getWindowsPrinters().then((printers) => {
      return printers.map((each) => each.printer);
    });
  } else {
    return getUnixPrinters().then((printers) => {
      return printers.map((each) => each.printer);
    });
  }
}

const getHomeDir = () => os.homedir();
const downloadPDF = (pdf, filename) =>
  ipcRenderer.send("download-pdf", pdf, filename);

contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print,
  createPDFStruk: generatePDF,
  // printTiket,
  getPrinters,
  getHomeDir,
  // printWithElectronPosPrinter,
  downloadPDF,

  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
