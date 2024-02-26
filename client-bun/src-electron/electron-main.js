import { ipcMain, app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "node:url";

import { initialize, enable } from "@electron/remote/main/index.js";
import { log } from "console";

const platform = process.platform || os.platform();
initialize();
let mainWindow;

const currentDir = fileURLToPath(new URL(".", import.meta.url));

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, "icons/icon.png"), // tray icon
    // width: 1000,
    // height: 600,
    fullscreen: true,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          "electron-preload" + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION
        )
      ),
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
      event.reply("download-pdf-reply", true);
    } catch (err) {
      console.log("Error writing file", err);
      event.reply("download-pdf-reply", false);
    }
  });

  enable(mainWindow.webContents);

  mainWindow.webPreferences = {
    crossOrigin: "none",
  };

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL);
  } else {
    mainWindow.loadFile("index.html");
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
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
