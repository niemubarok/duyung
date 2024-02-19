import HID from "node-hid";
import { SerialPort } from "serialport";
import { promises as fs } from "fs";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config as dotenvConfig } from "dotenv";
import axios from "axios";

// Load .env configurations
dotenvConfig();

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

// Paths and constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const deviceConfigPath = join(__dirname, "deviceConfig.json");
const API_URL = process.env.API_URL; // Get API URL from .env

// Tambahkan logika untuk membuat file deviceConfig.json jika belum ada
async function createDeviceConfigFileIfNotExists() {
  try {
    await fs.access(deviceConfigPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File doesn't exist, create it
      const initialConfig = { HIDDevicePath: null, serialPath: null };
      await fs.writeFile(
        deviceConfigPath,
        JSON.stringify(initialConfig, null, 2)
      );
      console.log("Created deviceConfig.json file.");
    }
  }
}

// Panggil fungsi untuk membuat file jika belum ada sebelum mencoba membacanya
await createDeviceConfigFileIfNotExists();

const promptUser = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(parseInt(answer, 10));
    });
  });

async function selectHIDDevice(forcePrompt = false) {
  let devices = HID.devices();
  let selectedDevice;

  try {
    const stats = await fs.stat(deviceConfigPath);
    if (!forcePrompt && stats.isFile()) {
      let savedConfig = JSON.parse(
        await fs.readFile(deviceConfigPath, "utf-8")
      );
      if (savedConfig.HIDDevicePath) {
        console.log(`Using saved HID device: ${savedConfig.HIDDevicePath}`);
        selectedDevice = devices.find(
          (device) => device.path === savedConfig.HIDDevicePath
        );
        if (!selectedDevice) {
          console.log(
            "Saved HID device not found, prompting for device selection..."
          );
        } else {
          return selectedDevice;
        }
      }
    }
  } catch (error) {
    console.error("Error checking device config:", error);
  }

  if (devices.length === 0) {
    console.log("No HID devices found.");
    return null;
  }

  console.log("Available HID devices:");
  devices.forEach((device, index) => {
    console.log(
      `${index + 1}. Path: ${device.path}, Manufacturer: ${
        device.manufacturer
      }, Product: ${device.product}`
    );
  });

  const selectedIndex = await promptUser(
    "Enter the number of the HID device you want to use: "
  );
  selectedDevice = devices[selectedIndex - 1];
  return selectedDevice;
}

async function selectSerialDevice(forcePrompt = false) {
  let serialDevices = await SerialPort.list();
  let selectedSerialPath = "";

  try {
    const stats = await fs.stat(deviceConfigPath);
    if (!forcePrompt && stats.isFile()) {
      let savedConfig = JSON.parse(
        await fs.readFile(deviceConfigPath, "utf-8")
      );
      if (savedConfig.serialPath) {
        console.log(`Using saved serial device: ${savedConfig.serialPath}`);
        selectedSerialPath = savedConfig.serialPath;
        return selectedSerialPath;
      }
    }
  } catch (error) {
    console.error("Error checking device config:", error);
  }

  if (serialDevices.length === 0) {
    console.log("No serial devices found.");
    return "";
  }

  console.log("Available serial devices:");
  serialDevices.forEach((device, index) => {
    console.log(`${index + 1}. ${device.path} ${device.pnpId || ""}`);
  });

  const selectedIndex = await promptUser(
    "Enter the number of the serial device you want to use: "
  );
  selectedSerialPath = serialDevices[selectedIndex - 1].path;
  return selectedSerialPath;
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
  // await openGate();
  try {
    //   //   Ganti URL dengan endpoint API yang sesuai2233445767676
    const response = await axios.post(API_URL, {
      // barcode: "2024/01/29/00002",
      barcode: dataBarcode,
    });
    if (response.data.status === 200) {
      console.log(response);
    }
    //   // console.log("Data from API:", response.data);
    // const serialPort = new SerialPort({
    //   path: serialPath,
    //   baudRate: 9600,
    // });
    // serialPort.write("*OUT1ON#");
    // setTimeout(() => {
    //   serialPort.write("*OUT1OFF#");
    // }, 2000);
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}

function listenToHIDDevice(deviceInfo) {
  const device = new HID.HID(deviceInfo.path);
  console.log(`Listening to HID device: ${deviceInfo.path}`);
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

async function saveDeviceConfig(hidDevicePath, serialPath) {
  try {
    let config = {
      HIDDevicePath: hidDevicePath,
      serialPath: serialPath,
    };
    await fs.writeFile(
      deviceConfigPath,
      JSON.stringify(config, null, 2),
      "utf-8"
    );
    console.log("Device configuration saved.");
  } catch (error) {
    console.error("Error saving device configuration:", error);
  }
}

async function main() {
  //await makeAPIRequest("2024/01/29/00002");
  //return;

  let forcePrompt = process.argv.includes("--reset");

  const selectedHIDDevice = await selectHIDDevice(forcePrompt);
  if (!selectedHIDDevice) {
    console.log("HID device selection failed or was cancelled.");
    return;
  }

  const serialPath = await selectSerialDevice(forcePrompt);
  if (!serialPath) {
    console.log("Serial device selection failed or was cancelled.");
    return;
  }

  // Simpan konfigurasi ke file
  await saveDeviceConfig(selectedHIDDevice.path, serialPath);

  listenToHIDDevice(selectedHIDDevice);
}

main().catch(console.error);
