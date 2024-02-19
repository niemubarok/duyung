<template>
  <div>
    <button @click="generatePDF">Generate PDF</button>
    <button @click="$router.push('/')">Ticketing</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ls from "localstorage-slim";

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

const namaPerusahaan = ref("Nama Perusahaan"); // Ganti dengan nama perusahaan yang sesuai
const transaksi = ref({
  diskon: 0,
  no_transaksi: "2024/02/01/00026",
  totalAfterDiskon: 35000,
  totalBayar: 35000,
  transaksi: [
    {
      deskripsi: "-",
      hari: "weekday",
      id_wahana: "1",
      jenis: "Tiket Masuk",
      nama: "Admin",
      tarif: 20000,
      total_bayar: 20000,
    },
  ],
});

import JsBarcode from "jsbarcode";

const generateBarcode = (text) => {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { displayValue: false, format: "CODE128" });
  return canvas.toDataURL("image/png");
};

const generatePDF = () => {
  const pdf = new jsPDF({
    unit: "mm",
    format: [80, 150],
    plugins: [jsPDF.autoTable],
  });

  const pageWidth = pdf.internal.pageSize.width;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(namaPerusahaan.value, pdf.internal.pageSize.width / 2, 3, {
    align: "center",
  });

  pdf.setFont("helvetica");
  pdf.setFontSize(13);

  if (transaksi.value.namaPaket) {
    pdf.text(transaksi.value.namaPaket, pdf.internal.pageSize.width / 2, 8, {
      align: "center",
    });
  } else {
    pdf.text(
      transaksi.value.transaksi[0].jenis,
      pdf.internal.pageSize.width / 2,
      8,
      {
        align: "center",
      }
    );
  }

  pdf.setFontSize(5);

  const petugas = ls.get("petugas").nama;
  const waktu = new Date().toLocaleString("id-ID");
  const no_transaksi = transaksi.value.no_transaksi;

  pdf.text(`${waktu}`, 5, 8, { align: "left" });

  pdf.text(`petugas: ${petugas}`, 5, 11, { align: "left" });
  pdf.text(no_transaksi, pageWidth - 5, 11, { align: "right" });

  pdf.line(5, 12, pdf.internal.pageSize.width - 5, 12); // Draw a line at y = 12 mm from the left margin to the right margin
  const headers = {
    wahana: "Wahana",
    qty: "Qty",
    harga: "Harga",
    ceklis: "Ceklis",
  };

  console.log("transaksi", transaksi);

  const rows = Object.values(transaksi.value.transaksi).map((item) => [
    `${
      item.jenis?.toLowerCase() === "tiket wahana" || item.jenis === undefined
        ? item.nama
        : item.nama + " - " + item.deskripsi
    }`, // Ganti dengan data sesuai kebutuhan, contoh: item.nama,
    item.jenis?.toLowerCase() === "tiket wahana" || item.jenis === undefined
      ? item.qty
      : "",
    item.jenis?.toLowerCase() === "tiket wahana" || item.jenis === undefined
      ? formatCurrency(item.total_bayar)
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

  pdf.autoTable(autoTableOptions);

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
  const totalValue = `${formatCurrency(transaksi.value.totalBayar)}`;
  const diskonText = "Diskon";
  const diskonTextValue = `${formatCurrency(transaksi.value.diskon)}`;
  const totalBayarText = "Total Bayar";
  const totalBayarValue = `${formatCurrency(transaksi.value.totalAfterDiskon)}`;

  pdf.setFont("helvetica");
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

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);

  //RP
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 5, {
    align: "right",
    styles: { "text-decoration": "line-through" },
  });
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 9, {
    align: "right",
  });
  pdf.setFontSize(10);
  pdf.text("Rp", pageWidth - 40, pdf.autoTable.previous.finalY + 14, {
    align: "right",
  });

  //value
  pdf.text(totalValue, pageWidth - 25, pdf.autoTable.previous.finalY + 5, {
    align: "right",
  });

  if (transaksi.value.diskon > 0) {
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

  pdf.setFontSize(7);
  pdf.text(
    "Terimakasih atas kunjungan anda",
    pdf.internal.pageSize.width / 2,
    pdf.autoTable.previous.finalY + 20, // Adjust vertical position based on QR code size
    { align: "center" }
  );

  // Generate barcode

  const barcodeData = generateBarcode("no_transaksi", { width: 2, height: 50 });
  // Add barcode to PDF
  if (barcodeData) {
    const barcodeImage = new Image();
    barcodeImage.src = barcodeData;
    console.log("barcodedata", barcodeData);
    barcodeImage.onload = () => {
      const barcodeWidth = 70; // Increased width for better clarity
      const barcodeHeight = 20; // Increased height for better clarity
      const xPosition = (pageWidth - barcodeWidth) / 2;
      const yPosition = pdf.autoTable.previous.finalY + 22;
      pdf.addImage(
        barcodeImage,
        "PNG",
        xPosition,
        yPosition,
        barcodeWidth,
        barcodeHeight
      );
      // pdf.save(filePath); // Save the PDF after adding the barcode image
      const pdfOutput = pdf.output("blob");
      const filePath = `./tes1.pdf`;

      const reader = new FileReader();
      reader.onload = function () {
        const buffer = this.result;
        window.electron.downloadPDF(buffer, filePath);
      };
      reader.readAsArrayBuffer(pdfOutput);
    };
  }
};

// Create a Blob from the PDF Stream

const barcodeData = ref("");

const testPrint = () => {
  window.electron.printWithElectronPosPrinter();
};

const tesGenerate = () => {
  ipcRenderer.send("generateBarcode", "yourBarcodeText");

  // Tanggapi hasilnya
  ipcRenderer.on("barcodeData", (event, data) => {
    barcodeData.value = data;
    console.log(data);
  });
};
</script>
