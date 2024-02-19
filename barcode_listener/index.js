import HID from "node-hid";
import { SerialPort } from "serialport";
import { promises as fs } from "fs";
import readline from "readline";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { config as dotenvConfig } from "dotenv";
import axios from "axios";
import usb from "usb";
import BarcodeScanner from "native-barcode-scanner";
import playSound from "play-sound";
import {Howl, Howler} from 'howler';
import { exec } from 'child_process'

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

// async function selectHIDDevice(forcePrompt = false) {
//   let devices = usb.getDeviceList();
//   let selectedDevice;

//   try {
//     const stats = await fs.stat(deviceConfigPath);
//     if (!forcePrompt && stats.isFile()) {
//       let savedConfig = JSON.parse(
//         await fs.readFile(deviceConfigPath, "utf-8")
//       );
//       if (savedConfig.HIDDevicePath) {
//         console.log(`Using saved HID device: ${savedConfig.HIDDevicePath}`);
//         selectedDevice = devices.find(
//           (device) =>
//             device.deviceDescriptor.iProduct === savedConfig.HIDDevicePath
//         );
//         if (!selectedDevice) {
//           console.log(
//             "Saved HID device not found, prompting for device selection..."
//           );
//         } else {
//           return selectedDevice;
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error checking device config:", error);
//   }

//   if (devices.length === 0) {
//     console.log("No HID devices found.");
//     return null;
//   }

//   console.log("Available HID devices:");
//   devices.forEach((device, index) => {
//     console.log(device);
//     console.log(
//       `${index + 1}. Path: ${device.deviceDescriptor.iProduct}, Manufacturer: ${
//         device.deviceDescriptor.iManufacturer
//       }, Product: ${device.deviceDescriptor.iProduct}`
//     );
//   });

//   const selectedIndex = await promptUser(
//     "Enter the number of the HID device you want to use: "
//   );
//   selectedDevice = devices[selectedIndex - 1];
//   return selectedDevice;
// }

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

async function playAudio() {
  const audio = playSound();
  const soundFilePath = "./silahkanmasuk.mp3";
  try {
    const playProcess = audio.play(soundFilePath, (error) => {
      if (error) {
        console.error(`Error playing sound: ${error.message}`);
      }

      // setTimeout(()=>{
      //   exec('taskkill /im wmplayer.exe', (err, stdout, stderr) => {
      //     if (err) {
      //       console.error(`Error executing CLI command: ${err.message}`);
      //     }
      //     // Handle success or other outcomes as needed
      //   });
      // },2000)
     
    });
  
    playProcess.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Audio play exited with code ${code}`);
      }
     
    });
  
    // Execute the CLI command to kill the Windows Media Player process
    
    
  } catch (err) {
    console.error(`Error playing sound: ${err}`);
  }
  
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
    // Play sound after successful write
    playAudio();

    // Close port after successful write
    serialPort.close((err) => {
      if (err) {
        console.error("Error closing serial port: ", err.message);
      } else {
        console.log("Serial port closed successfully.");
      }
    });
  });
}

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

async function makeAPIRequest(dataBarcode) {
  console.log("formatNumber(dataBarcode)", formatNumber(dataBarcode));
  try {
    const response = await axios.post(API_URL, {
      // barcode: "2024/01/29/00002",
      barcode: formatNumber(dataBarcode),
    });
    console.log("response.data", response.data);
    if (response.status === 200) {
      console.log(response.data);
      await openGate();
    } else {
      return;
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}

function listenToHIDDevice(deviceInfo) {
  const options = {
    devicePrefix: "",
  };
  const scanner = new BarcodeScanner(options);
  let keys = [];
  // Add a global listener
  scanner.on("code", (data) => {
    // const keyCode = data[2];
    // if (keyCode === 0) return; // Ignore jika keyCode adalah 0 (no key pressed)

    // const key = keyMap[keyCode];
    // if (!key) {
    //   console.log(`Unknown key code: ${keyCode}`);
    //   return;
    // }

    // keys.push(data);

    // if (data === "Enter") {
    console.log(`Key pressed: ${data}`);
    makeAPIRequest(data);
    // keys = [];
    // }
    // Implementasikan logika Anda di sini, misalnya mengirim data ke API atau menampilkannya di konsol
  });
}

async function saveDeviceConfig(serialPath) {
  try {
    let config = {
      // HIDDevicePath: hidDevicePath,
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
  // playAudio();

  // return;
  // await makeAPIRequest("2024/01/29/00002");
  //await openGate()
  //return;

  // Remove the listener
  //

  // return
  let forcePrompt = process.argv.includes("--reset");

  // const selectedHIDDevice = await selectHIDDevice(forcePrompt);
  // if (!selectedHIDDevice) {
  //   console.log("HID device selection failed or was cancelled.");
  //   return;
  // }

  const serialPath = await selectSerialDevice(forcePrompt);
  if (!serialPath) {
    console.log("Serial device selection failed or was cancelled.");
    return;
  }

  // Simpan konfigurasi ke file
  await saveDeviceConfig(serialPath);

  listenToHIDDevice();
}

main().catch(console.error);
