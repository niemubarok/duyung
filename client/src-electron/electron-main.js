import { ipcMain, app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
const platform = process.platform || os.platform();

import { initialize, enable } from "@electron/remote/main";
import { log } from "console";
initialize();
let mainWindow;

// needed in case process is undefined under Linux

function createWindow() {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    // width: 1000,
    // height: 600,
    fullscreen: true,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      sandbox: false,
    },
  });

  ipcMain.on("download-pdf", async (event, arrayBuffer, filename) => {
    const directoryPath = path.join(os.homedir(), "struk");
    try {
      const fsp = fs.promises;
      await fsp.mkdir(directoryPath, { recursive: true });
      const filePath = path.join(directoryPath, filename);
      const buffer = Buffer.from(arrayBuffer);
      await fsp.writeFile(filePath, buffer);
      console.log("File written successfully");
    } catch (err) {
      console.log("Error writing file", err);
    }
  });

  enable(mainWindow.webContents);

  mainWindow.webContents.session.on(
    "select-hid-device",
    (event, details, callback) => {
      // Add events to handle devices being added or removed before the callback on
      // `select-hid-device` is called.
      mainWindow.webContents.session.on("hid-device-added", (event, device) => {
        console.log("hid-device-added FIRED WITH", device);
        // Optionally update details.deviceList
      });

      mainWindow.webContents.session.on(
        "hid-device-removed",
        (event, device) => {
          console.log("hid-device-removed FIRED WITH", device);
          // Optionally update details.deviceList
        }
      );

      event.preventDefault();
      if (details.deviceList && details.deviceList.length > 0) {
        callback(details.deviceList[0].deviceId);
      }
    }
  );

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "hid" && details.securityOrigin === "file:///") {
        return true;
      }
    }
  );

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "hid" && details.origin === "file://") {
      return true;
    }
  });

  // let grantedDeviceThroughPermHandler;
  mainWindow.webPreferences = {
    crossOrigin: "none",
  };

  // mainWindow.webContents.session.on(
  //   "select-usb-device",
  //   (event, details, callback) => {
  //     // Add events to handle devices being added or removed before the callback on
  //     // `select-usb-device` is called.
  //     mainWindow.webContents.session.on("usb-device-added", (event, device) => {
  //       console.log("usb-device-added FIRED WITH", device);
  //       // Optionally update details.deviceList
  //     });

  //     mainWindow.webContents.session.on(
  //       "usb-device-removed",
  //       (event, device) => {
  //         console.log("usb-device-removed FIRED WITH", device);
  //         // Optionally update details.deviceList
  //       }
  //     );

  //     event.preventDefault();
  //     if (details.deviceList && details.deviceList.length > 0) {
  //       const deviceToReturn = details.deviceList.find((device) => {
  //         return (
  //           !grantedDeviceThroughPermHandler ||
  //           device.deviceId !== grantedDeviceThroughPermHandler.deviceId
  //         );
  //       });
  //       if (deviceToReturn) {
  //         callback(deviceToReturn.deviceId);
  //       } else {
  //         callback();
  //       }
  //     }
  //   }
  // );

  // mainWindow.webContents.session.setPermissionCheckHandler(
  //   (webContents, permission, requestingOrigin, details) => {
  //     console.log("permission", permission);
  //     if (permission === "usb" && details.securityOrigin === "file:///") {
  //       return true;
  //     }
  //   }
  // );

  // mainWindow.webContents.session.setDevicePermissionHandler((details) => {
  //   if (details.deviceType === "usb") {
  //     if (!grantedDeviceThroughPermHandler) {
  //       console.log("details", details.device);
  //       grantedDeviceThroughPermHandler = details.device;
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // });

  // mainWindow.webContents.session.setUSBProtectedClassesHandler((details) => {
  //   return details.protectedClasses.filter((usbClass) => {
  //     // Exclude classes except for audio classes
  //     return usbClass.indexOf("audio") === -1;
  //   });
  // });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    // mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
