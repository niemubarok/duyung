import { contextBridge, ipcRenderer } from "electron";
// import { PosPrinter } from "electron-pos-printer";
import { BrowserWindow } from "@electron/remote";

// import { PosPrinter } from "electron-pos-printer";

// const printOptions = {
//   preview: true,
//   margin: "0 0 0 0",
//   copies: 1,
//   printerName: "Virtual_PDF_Printer",
//   timeOutPerLine: 400,
//   pageSize: "80mm", // page size
// };

// const data = [
//   {
//     type: "image",
//     url: "https://randomuser.me/api/portraits/men/43.jpg", // file path
//     position: "center", // position of image: 'left' | 'center' | 'right'
//     width: "160px", // width of image in px; default: auto
//     height: "60px", // width of image in px; default: 50 or '50px'
//   },
//   {
//     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//     value: "SAMPLE HEADING",
//     style: { fontWeight: "700", textAlign: "center", fontSize: "24px" },
//   },
//   {
//     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//     value: "Secondary text",
//     style: {
//       textDecoration: "underline",
//       fontSize: "10px",
//       textAlign: "center",
//       color: "red",
//     },
//   },
//   {
//     type: "barCode",
//     value: "023456789010",
//     height: 40, // height of barcode, applicable only to bar and QR codes
//     width: 2, // width of barcode, applicable only to bar and QR codes
//     displayValue: true, // Display value below barcode
//     fontsize: 12,
//   },
//   {
//     type: "qrCode",
//     value: "https://github.com/Hubertformin/electron-pos-printer",
//     height: 55,
//     width: 55,
//     style: { margin: "10 20px 20 20px" },
//   },
//   {
//     type: "table",
//     // style the table
//     style: { border: "1px solid #ddd" },
//     // list of the columns to be rendered in the table header
//     tableHeader: ["Animal", "Age"],
//     // multi dimensional array depicting the rows and columns of the table body
//     tableBody: [
//       ["Cat", 2],
//       ["Dog", 4],
//       ["Horse", 12],
//       ["Pig", 4],
//     ],
//     // list of columns to be rendered in the table footer
//     tableFooter: ["Animal", "Age"],
//     // custom style for the table header
//     tableHeaderStyle: { backgroundColor: "#000", color: "white" },
//     // custom style for the table body
//     tableBodyStyle: { border: "0.5px solid #ddd" },
//     // custom style for the table footer
//     tableFooterStyle: { backgroundColor: "#000", color: "white" },
//   },
//   {
//     type: "table",
//     style: { border: "1px solid #ddd" }, // style the table
//     // list of the columns to be rendered in the table header
//     tableHeader: [
//       { type: "text", value: "People" },
//       { type: "image", path: path.join(__dirname, "icons/animal.png") },
//     ],
//     // multi-dimensional array depicting the rows and columns of the table body
//     tableBody: [
//       [
//         { type: "text", value: "Marcus" },
//         {
//           type: "image",
//           url: "https://randomuser.me/api/portraits/men/43.jpg",
//         },
//       ],
//       [
//         { type: "text", value: "Boris" },
//         {
//           type: "image",
//           url: "https://randomuser.me/api/portraits/men/41.jpg",
//         },
//       ],
//       [
//         { type: "text", value: "Andrew" },
//         {
//           type: "image",
//           url: "https://randomuser.me/api/portraits/men/23.jpg",
//         },
//       ],
//       [
//         { type: "text", value: "Tyresse" },
//         {
//           type: "image",
//           url: "https://randomuser.me/api/portraits/men/53.jpg",
//         },
//       ],
//     ],
//     // list of columns to be rendered in the table footer
//     tableFooter: [{ type: "text", value: "People" }, "Image"],
//     // custom style for the table header
//     tableHeaderStyle: { backgroundColor: "red", color: "white" },
//     // custom style for the table body
//     tableBodyStyle: { border: "0.5px solid #ddd" },
//     // custom style for the table footer
//     tableFooterStyle: { backgroundColor: "#000", color: "white" },
//   },
// ];

// const printWithElectronPosPrinter = () => {
//   console.log(PosPrinter);
//   // PosPrinter.print(data, options)
//   //   .then(console.log)
//   //   .catch((error) => {
//   //     console.error(error);
//   //   });
// };

// const getListPrinter = async () => {
//   let printWindow = BrowserWindow.getFocusedWindow();
//   let list = await printWindow.webContents.getPrintersAsync();
//   console.log("list of Printers", list);
// };

// getListPrinter();

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

const print = process.platform === "win32" ? printWindows : printUnix;

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
import { log } from "console";
import { platform } from "os";
const QRCode = require("qrcode");
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode";
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
  JsBarcode(canvas, text, { displayValue: true, format: "CODE128" });
  return canvas.toDataURL("image/png");
};

export const generatePDF = (transaksi, namaPrinter) => {
  console.log("transaksi", transaksi);
  // return;

  const jenisTiket = JSON.parse(transaksi.transaksi)[0].jenis
    ? JSON.parse(transaksi.transaksi)[0].jenis
    : "Tiket Satuan";

  const pdf = new jsPDF({
    unit: "mm",
    format: [80, 150],
    // plugins: [autoTable],
  });

  const pageWidth = pdf.internal.pageSize.width;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(process.env.NAMA_PERUSAHAAN, pdf.internal.pageSize.width / 2, 3, {
    align: "center",
  });

  pdf.setFont("helvetica");
  pdf.setFontSize(13);

  if (transaksi.namaPaket && transaksi.namaPaket !== null) {
    pdf.text(transaksi.namaPaket, pdf.internal.pageSize.width / 2, 8, {
      align: "center",
    });
  } else {
    pdf.text(jenisTiket, pdf.internal.pageSize.width / 2, 8, {
      align: "center",
    });
  }

  pdf.setFontSize(5);

  const petugas = ls.get("petugas").nama;
  const waktu = new Date().toLocaleString("id-ID").replace(/\./g, ":");
  const no_transaksi = transaksi.no_transaksi;

  // pdf.text(`${waktu}`, 5, 8, { align: "left" });

  pdf.text(`petugas: ${petugas}`, 5, 11, { align: "left" });
  pdf.text(waktu, pageWidth - 5, 11, { align: "right" });

  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12); // Draw a line at y = 12 mm from the left margin to the right margin
  const headers = {
    wahana: "Wahana",
    qty: transaksi.namaPaket && transaksi.namaPaket !== null ? "" : "Qty",
    harga: transaksi.namaPaket && transaksi.namaPaket !== null ? "" : "Harga",
    ceklis: "Ceklis",
  };

  const rows = Object.values(JSON.parse(transaksi.transaksi)).map((item) => [
    `${
      item.jenis?.toLowerCase() === "tiket wahana" ||
      (item?.deskripsi !== "-" && item.jenis?.toLowerCase() === "tiket wahana")
        ? // || item?.jenis === undefined
          item?.nama
        : item?.deskripsi === "-"
        ? item?.nama
        : item?.nama + " - " + item?.deskripsi
    }`, // Ganti dengan data sesuai kebutuhan, contoh: item?.nama,
    item?.jenis?.toLowerCase() === "tiket wahana" && !transaksi.namaPaket
      ? // || item?.jenis === undefined
        item?.qty
      : "",
    item?.jenis?.toLowerCase() === "tiket wahana" && !transaksi.namaPaket
      ? // || item?.jenis === undefined
        formatCurrency(item?.total_bayar)
      : "",
    ".............", // Ganti dengan data sesuai kebutuhan
  ]);

  const autoTableOptions = {
    startY: 13,
    head: [headers],
    body: rows,
    showFoot: "never",
    tableWidth: pdf.internal.pageSize.getWidth() - 5,
    margin: { left: 5, right: 10 },
    theme: "plain",

    didParseCell: (hookData) => {
      if (hookData.section === "head") {
        if (hookData.column.dataKey === "qty") {
          hookData.cell.styles.halign = "center";
        }
      }
    },
    headStyles: { halign: "left", cellWidth: "auto", fontSize: 8 },
    columnStyles: {
      0: { halign: "left", cellWidth: 30 },
      1: { halign: "center", cellWidth: "auto" },
      2: { halign: "left", cellWidth: "auto" },
      3: { halign: "left", cellWidth: "auto" },
    },
    styles: {
      fontSize: 12,
      cellPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      minCellHeight: 4,
      overflow: "linebreak",
    },
  };

  autoTable(pdf, autoTableOptions);

  // console.log(Object.values(transaksi));
  pdf.line(
    5,
    pdf.autoTable.previous.finalY + 2,
    pdf.internal.pageSize.width - 5,
    pdf.autoTable.previous.finalY + 2
  );

  // pdf.setFontSize(8);
  // const totalBayar = Object.values(transaksi).reduce(
  //   (total, item) => total + item.total_bayar,
  //   0
  // );
  // console.log(totalBayar);
  const totalText = `Total`;
  const totalValue = `${formatCurrency(transaksi.totalBayar)}`;
  const diskonText = "Diskon";
  const diskonTextValue = `${formatCurrency(transaksi.diskon)}`;
  const totalBayarText = "Total Bayar";
  const totalBayarValue = `${formatCurrency(transaksi.totalAfterDiskon)}`;

  // pdf.setFont("helvetica");
  pdf.setFontSize(8);
  pdf.text(totalText, 5, pdf.autoTable.previous.finalY + 5, {
    align: "left",
  });
  pdf.text(diskonText, 5, pdf.autoTable.previous.finalY + 9, {
    align: "left",
  });
  pdf.text(totalBayarText, 5, pdf.autoTable.previous.finalY + 14, {
    align: "left",
  });

  // pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);

  //RP
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 5, {
    align: "right",
    styles: { "text-decoration": "line-through" },
  });
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 9, {
    align: "right",
  });
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 14, {
    align: "right",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);

  //value
  pdf.text(totalValue, pageWidth - 25, pdf.autoTable.previous.finalY + 5, {
    align: "right",
  });

  if (transaksi.diskon > 0) {
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.3);
    pdf.line(
      pageWidth - 25,
      pdf.autoTable.previous.finalY + 4,
      pageWidth - 45,
      pdf.autoTable.previous.finalY + 4
    ); // Draw line through text
  }
  pdf.text(diskonTextValue, pageWidth - 25, pdf.autoTable.previous.finalY + 9, {
    align: "right",
  });
  pdf.setFontSize(10);
  pdf.text(
    totalBayarValue,
    pageWidth - 25,
    pdf.autoTable.previous.finalY + 14,
    {
      align: "right",
    }
  );

  pdf.line(
    5,
    pdf.autoTable.previous.finalY + 16,
    pdf.internal.pageSize.width - 5,
    pdf.autoTable.previous.finalY + 16
  );

  pdf.setFontSize(7);
  pdf.text(
    ".:: Terimakasih atas kunjungan anda ::.",
    pdf.internal.pageSize.width / 2,
    pdf.autoTable.previous.finalY + 35, // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.text(
    "                             ",
    pdf.internal.pageSize.width / 2,
    pdf.autoTable.previous.finalY + 37, // Adjust vertical position based on QR code size
    { align: "center" }
  );
  pdf.text(
    "                             ",
    pdf.internal.pageSize.width / 2,
    pdf.autoTable.previous.finalY + 39, // Adjust vertical position based on QR code size
    { align: "center" }
  );

  pdf.line(
    15,
    pdf.autoTable.previous.finalY + 32,
    pdf.internal.pageSize.width - 15,
    pdf.autoTable.previous.finalY + 32
  );

  pdf.text(
    "Scan Barcode Di Pintu Masuk",
    pdf.internal.pageSize.width / 2,
    pdf.autoTable.previous.finalY + 20, // Adjust vertical position based on QR code size
    { align: "center" }
  );

  // Generate barcode
  console.log(
    "no_transaksi?.replace(///g,'')",
    no_transaksi?.replace(/\//g, "")
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
      const yPosition = pdf.autoTable.previous.finalY + 21;
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
        printStruk(namaPrinter);
      };
      reader.readAsArrayBuffer(pdfOutput);
    };
    // return true;
  }
};
async function printStruk(namaPrinter) {
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

// const fs = require('fs');
// const ThermalPrinter = require("node-thermal-printer").printer;
// const Types = require("node-thermal-printer").types;

// async function printStruk(namaPrinter) {
//   console.log("print", namaPrinter);

//   let printer = new ThermalPrinter({
//     type: Types.EPSON,
//     interface: `tcp://${namaPrinter}:9100`,
//     options: {
//       timeout: 3000,
//     },
//     width: 48,
//     characterSet: "SLOVENIA",
//     removeSpecialCharacters: false,
//     lineCharacter: "=",
//   });

//   try {
//     await fs.promises.access(filePath, fs.constants.F_OK);

//     // Assuming filePath is a text file, we read it and print its content
//     const fileContent = fs.readFileSync(filePath, "utf8");
//     printer.println(fileContent);

//     // Add autocut command
//     printer.cut();

//     try {
//       let execute = printer.execute();
//       console.log("Print done!");
//     } catch (error) {
//       console.error("Print failed:", error);
//     }
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     console.error(`Error during printing: ${errorMessage}`);
//   }
// }

// async function printDirectlyToPrinter(printerName) {
//   // Membuat teks dengan format yang sesuai tata letak yang diinginkan

//   const { Printer, InMemory } = require("escpos-buffer");

//   const connection = new InMemory();
//   // console.log(connection);
//   // return;
//   const printer = await Printer.CONNECT(printerName, connection);

//   const data = {
//     nama_perusahaan: "Nama Perusahaan Anda",
//     nama_paket: "Paket A",
//     petugas: "Nama Petugas",
//     waktu: new Date().toLocaleString("id-ID"),
//     transaksi: {
//       transaksi: [
//         { nama: "Wahana 1", qty: 2, harga: 50000 },
//         { nama: "Wahana 2", qty: 1, harga: 75000 },
//       ],
//       totalBayar: 175000,
//       diskon: 25000,
//       totalAfterDiskon: 150000,
//     },
//   };

//   await printer.setColumns(56);
//   await printer.write("Nama Perusahaan: " + data.nama_perusahaan);
//   await printer.writeln("Nama Paket: " + data.nama_paket);
//   await printer.barcode(data.nama_paket, "CODE39", { width: 2, height: 100 });
//   await printer.writeln("Petugas: " + data.petugas);
//   await printer.writeln("Waktu: " + data.waktu);
//   await printer.writeln("---------------------------------------------");
//   await printer.writeln("Wahana    Qty    Harga    Ceklis");
//   await printer.writeln("---------------------------------------------");

//   data.transaksi.transaksi.forEach((item) => {
//     printer.writeln(
//       `${item.nama}    ${item.qty}    ${item.harga}    .............`
//     );
//   });

//   await printer.writeln("---------------------------------------------");
//   await printer.writeln(`Total: ${data.transaksi.totalBayar}`);
//   await printer.writeln(`Diskon: ${data.transaksi.diskon}`);
//   await printer.writeln(`Total Bayar: ${data.transaksi.totalAfterDiskon}`);
//   await printer.writeln("Terimakasih atas kunjungan Anda");
//   await printer.feed(6);
//   await printer.buzzer();
//   await printer.cutter();
//   await printer.drawer(Drawer.First);

//   // For buffered connection (output to stdout)
//   process.stdout.write(connection.buffer());
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

const HID = require("node-hid");

async function getHIDDevices() {
  return await HID.devicesAsync();
}

async function readDataFromHID(vid, pid) {
  const device = await HID.HIDAsync.open(vid, pid);

  return new Promise((resolve, reject) => {
    device.on("data", function (data) {
      console.log(data);
    });
    device.on("error", function (error) {
      console.log(error);
    });
  });
}

const getHomeDir = () => os.homedir();
const downloadPDF = (pdf, filename) =>
  ipcRenderer.send("download-pdf", pdf, filename);

contextBridge.exposeInMainWorld("electron", {
  // serialport: createSerialPort,
  print: printStruk,
  createPDFStruk: generatePDF,
  getPrinters,
  // printDirectlyToPrinter,
  getHIDDevices,
  readDataFromHID,
  getHomeDir,
  // printWithElectronPosPrinter,
  downloadPDF,

  // detectLicensePlateArea: detectLicensePlateArea,
  // getSerialPortList: getSerialPortList,
});
