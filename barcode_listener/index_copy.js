// index.js

import { devices as _devices, HID as _HID } from "node-hid";
import { SerialPort } from "serialport";
import { getNumberWithPrompt } from "simple-prompt-promise";
import axios from "axios";
import dotenv from "dotenv";
import { promises as fs } from "fs";
import { dirname, join } from "path";

import { fileURLToPath } from "url";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const deviceConfigPath = join(__dirname, "deviceConfig.json");
const API_URL = process.env.API_URL; // Get API URL from .env

function formatNumber(number) {
  // Konversi angka ke string untuk memudahkan pemrosesan
  let str = number.toString();

  // Memisahkan string ke dalam komponen yang diinginkan
  let year = str.substring(0, 4);
  let month = str.substring(4, 6);
  let day = str.substring(6, 8);
  let rest = str.substring(8);

  // Menggabungkan komponen dengan pemisah '/'
  let formatted = `${year}/${month}/${day}/${rest}`;

  return formatted;
}

const keyMap = {
  4: "a",
  5: "b",
  6: "c",
  7: "d",
  8: "e",
  9: "f",
  10: "g",
  11: "h",
  12: "i",
  13: "j",
  14: "k",
  15: "l",
  16: "m",
  17: "n",
  18: "o",
  19: "p",
  20: "q",
  21: "r",
  22: "s",
  23: "t",
  24: "u",
  25: "v",
  26: "w",
  27: "x",
  28: "y",
  29: "z",
  30: "1",
  31: "2",
  32: "3",
  33: "4",
  34: "5",
  35: "6",
  36: "7",
  37: "8",
  38: "9",
  39: "0",
  40: "Enter",
  41: "Escape",
  42: "Backspace",
  43: "Tab",
  44: "Space",
  45: "-",
  46: "=",
  47: "[",
  48: "]",
  49: "\\",
  51: ";",
  52: "'",
  53: "`",
  54: ",",
  55: ".",
  56: "/",
  // Tambahkan lebih banyak sesuai kebutuhan
};

let serialPath = "";
async function selectHIDDevice() {
  const devices = _devices();
  if (devices.length === 0) {
    console.log("No HID devices found.");
    return null;
  }

  console.log("Available HID devices:");
  devices.forEach((device, index) => {
    console.log(
      `${index + 1}. Path: ${device.path}, Name: ${device.pnpId}, Product: ${
        device.product
      }`
    );
  });

  const selectedDeviceIndex = await getNumberWithPrompt(
    "Pilih device yang ingin digunakan: ",
    {
      validation: (input) =>
        (input >= 1 && input <= devices.length) || "Input Salah",
      range: [1, devices.length],
      canCancel: false,
    }
  );

  if (selectedDeviceIndex >= 1 && selectedDeviceIndex <= devices.length) {
    return devices[selectedDeviceIndex - 1];
  } else {
    console.log("Input Salah");
    return null;
  }
}

async function selectSerialDevice() {
  const serialDevices = await SerialPort.list();
  if (serialDevices.length === 0) {
    console.log("No serial devices found.");
    return;
  }

  console.log("Available serial devices:");
  serialDevices.forEach((device, index) => {
    console.log(
      `${index + 1}. ${device.path} -- ${
        device.manufacturer || "Unknown Manufacturer"
      } -- ${device.serialNumber || "No Serial"}`
    );
  });

  const selectedDeviceIndex = await getNumberWithPrompt(
    "Enter the number of the device you want to use: ",
    {
      validation: (input) =>
        (input >= 1 && input <= serialDevices.length) || "Input Salah",
      range: [1, serialDevices.length],
      canCancel: false,
    }
  );

  if (selectedDeviceIndex >= 1 && selectedDeviceIndex <= serialDevices.length) {
    const selectedDevice = serialDevices[selectedDeviceIndex - 1];
    console.log("Selected serial device:", selectedDevice);
    serialPath = selectedDevice.path; // Mengembalikan path dari perangkat serial yang dipilih
    return selectedDevice.path;
  } else {
    console.log("Invalid selection.");
    return null;
  }
}

function listenToDevice(deviceInfo) {
  const device = new _HID(deviceInfo.path);
  console.log(`Listening to device: ${deviceInfo.path}`);

  let keys = [];

  device.on("data", (data) => {
    const keyCode = data[2];
    if (keyCode === 0) return; // Ignore jika keyCode adalah 0 (no key pressed)

    const key = keyMap[keyCode];
    if (!key) {
      console.log(`Unknown key code: ${keyCode}`);
      return;
    }

    // console.log(`Key pressed: ${key}`);
    keys.push(key);

    if (key === "Enter") {
      makeAPIRequest(keys.join(""));
      keys = [];
    }
    // Implementasikan logika Anda di sini, misalnya mengirim data ke API atau menampilkannya di konsol
  });

  device.on("error", (err) => {
    console.error(`Device error on ${deviceInfo.path}:`, err);
  });
}

async function openGate() {
  const deviceConfig = JSON.parse(await fs.readFile(deviceConfigPath, "utf-8"));
  const serialPath = deviceConfig.serialPath;

  const serialPort = new SerialPort(
    {
      path: serialPath,
      baudRate: 9600,
    },
    (err) => {
      if (err) {
        return console.error("Error opening serial port: ", err.message);
      }
    }
  );

  serialPort.on("error", function (err) {
    console.error("SerialPort Error: ", err);
  });

  serialPort.write(process.env.OUTPUT_CODE_ON, (err) => {
    if (err) {
      console.error("Error writing to serial port: ", err.message);
      return;
    }
    // Menutup port setelah penulisan berhasil
    serialPort.close((err) => {
      if (err) {
        console.error("Error closing serial port: ", err.message);
      } else {
        console.log("Serial port closed successfully.");
      }
    });
  });

  // setTimeout(() => {
  //   serialPort.write(process.env.OUTPUT_CODE_OFF);
  // }, 500);
}

async function makeAPIRequest(dataBarcode) {
  await openGate()

  // try {
  //   Ganti URL dengan endpoint API yang sesuai2233445767676

  // const response = await axios.post(process.env.URL_BACKEND, {
  //   // barcode: "2024/01/29/00002",
  //   barcode: dataBarcode,
  // });

  // if (response.data.status === 200) {
  // console.log(response.data.message);

  //   }

  //   // console.log("Data from API:", response.data);
  // } catch (error) {
  //   console.error("Error fetching data from API:", error);
  // }
}

async function main() {
  const selectedHIDDevice = await selectHIDDevice();
  if (!selectedHIDDevice) {
    console.log("HID device selection failed or was cancelled.");
    return;
  }

  const serialPath = await selectSerialDevice();
  if (!serialPath) {
    console.log("Serial device selection failed or was cancelled.");
    return;
  }

  listenToDevice(selectedHIDDevice);
}

main();
