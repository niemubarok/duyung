// src-electron/electron-main.js
import { ipcMain, app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "node:url";
import { initialize, enable } from "@electron/remote/main/index.js";
var platform = process.platform || os.platform();
initialize();
var mainWindow;
var currentDir = fileURLToPath(new URL(".", import.meta.url));
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, "icons/icon.png"),
    // tray icon
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
          "/home/devtunus/DATA/HUSNI/PROJECT/2024/DUYUNG/client-bun/.quasar/dev-electron/preload",
          "electron-preload.cjs"
        )
      ),
      sandbox: false
    }
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
    crossOrigin: "none"
  };
  if (true) {
    mainWindow.loadURL("http://localhost:9300");
  } else {
    mainWindow.loadFile("index.html");
  }
  if (true) {
    mainWindow.webContents.openDevTools();
  } else {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGlwY01haW4sIGFwcCwgQnJvd3NlcldpbmRvdyB9IGZyb20gXCJlbGVjdHJvblwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XHJcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiO1xyXG5cclxuaW1wb3J0IHsgaW5pdGlhbGl6ZSwgZW5hYmxlIH0gZnJvbSBcIkBlbGVjdHJvbi9yZW1vdGUvbWFpbi9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiY29uc29sZVwiO1xyXG5cclxuY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIHx8IG9zLnBsYXRmb3JtKCk7XHJcbmluaXRpYWxpemUoKTtcclxubGV0IG1haW5XaW5kb3c7XHJcblxyXG5jb25zdCBjdXJyZW50RGlyID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLlwiLCBpbXBvcnQubWV0YS51cmwpKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcclxuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgaWNvbjogcGF0aC5yZXNvbHZlKGN1cnJlbnREaXIsIFwiaWNvbnMvaWNvbi5wbmdcIiksIC8vIHRyYXkgaWNvblxyXG4gICAgLy8gd2lkdGg6IDEwMDAsXHJcbiAgICAvLyBoZWlnaHQ6IDYwMCxcclxuICAgIGZ1bGxzY3JlZW46IHRydWUsXHJcbiAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcclxuICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXHJcbiAgICAgIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly92Mi5xdWFzYXIuZGV2L3F1YXNhci1jbGktdml0ZS9kZXZlbG9waW5nLWVsZWN0cm9uLWFwcHMvZWxlY3Ryb24tcHJlbG9hZC1zY3JpcHRcclxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKFxyXG4gICAgICAgIGN1cnJlbnREaXIsXHJcbiAgICAgICAgcGF0aC5qb2luKFxyXG4gICAgICAgICAgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQURfRk9MREVSLFxyXG4gICAgICAgICAgXCJlbGVjdHJvbi1wcmVsb2FkXCIgKyBwcm9jZXNzLmVudi5RVUFTQVJfRUxFQ1RST05fUFJFTE9BRF9FWFRFTlNJT05cclxuICAgICAgICApXHJcbiAgICAgICksXHJcbiAgICAgIHNhbmRib3g6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbiAgaXBjTWFpbi5vbihcImRvd25sb2FkLXBkZlwiLCBhc3luYyAoZXZlbnQsIGFycmF5QnVmZmVyLCBmaWxlbmFtZSkgPT4ge1xyXG4gICAgY29uc3QgZGlyZWN0b3J5UGF0aCA9IHBhdGguam9pbihvcy5ob21lZGlyKCksIFwic3RydWtcIik7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmc3AgPSBmcy5wcm9taXNlcztcclxuICAgICAgYXdhaXQgZnNwLm1rZGlyKGRpcmVjdG9yeVBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xyXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnlQYXRoLCBmaWxlbmFtZSk7XHJcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyKTtcclxuICAgICAgYXdhaXQgZnNwLndyaXRlRmlsZShmaWxlUGF0aCwgYnVmZmVyKTtcclxuICAgICAgZXZlbnQucmVwbHkoXCJkb3dubG9hZC1wZGYtcmVwbHlcIiwgdHJ1ZSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJFcnJvciB3cml0aW5nIGZpbGVcIiwgZXJyKTtcclxuICAgICAgZXZlbnQucmVwbHkoXCJkb3dubG9hZC1wZGYtcmVwbHlcIiwgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBlbmFibGUobWFpbldpbmRvdy53ZWJDb250ZW50cyk7XHJcblxyXG4gIG1haW5XaW5kb3cud2ViUHJlZmVyZW5jZXMgPSB7XHJcbiAgICBjcm9zc09yaWdpbjogXCJub25lXCIsXHJcbiAgfTtcclxuXHJcbiAgaWYgKHByb2Nlc3MuZW52LkRFVikge1xyXG4gICAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBtYWluV2luZG93LmxvYWRGaWxlKFwiaW5kZXguaHRtbFwiKTtcclxuICB9XHJcblxyXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpIHtcclxuICAgIC8vIGlmIG9uIERFViBvciBQcm9kdWN0aW9uIHdpdGggZGVidWcgZW5hYmxlZFxyXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gd2UncmUgb24gcHJvZHVjdGlvbjsgbm8gYWNjZXNzIHRvIGRldnRvb2xzIHBsc1xyXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PiB7XHJcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBtYWluV2luZG93Lm9uKFwiY2xvc2VkXCIsICgpID0+IHtcclxuICAgIG1haW5XaW5kb3cgPSBudWxsO1xyXG4gIH0pO1xyXG59XHJcbmFwcC53aGVuUmVhZHkoKS50aGVuKGNyZWF0ZVdpbmRvdyk7XHJcblxyXG5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCAoKSA9PiB7XHJcbiAgaWYgKHBsYXRmb3JtICE9PSBcImRhcndpblwiKSB7XHJcbiAgICBhcHAucXVpdCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9PiB7XHJcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcclxuICAgIGNyZWF0ZVdpbmRvdygpO1xyXG4gIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLFNBQVMsS0FBSyxxQkFBcUI7QUFDNUMsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sUUFBUTtBQUNmLE9BQU8sUUFBUTtBQUNmLFNBQVMscUJBQXFCO0FBRTlCLFNBQVMsWUFBWSxjQUFjO0FBR25DLElBQU0sV0FBVyxRQUFRLFlBQVksR0FBRyxTQUFTO0FBQ2pELFdBQVc7QUFDWCxJQUFJO0FBRUosSUFBTSxhQUFhLGNBQWMsSUFBSSxJQUFJLEtBQUssWUFBWSxHQUFHLENBQUM7QUFFOUQsU0FBUyxlQUFlO0FBQ3RCLGVBQWEsSUFBSSxjQUFjO0FBQUEsSUFDN0IsTUFBTSxLQUFLLFFBQVEsWUFBWSxnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUcvQyxZQUFZO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxNQUNkLGtCQUFrQjtBQUFBO0FBQUEsTUFFbEIsU0FBUyxLQUFLO0FBQUEsUUFDWjtBQUFBLFFBQ0EsS0FBSztBQUFBLFVBQ0g7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRixDQUFDO0FBRUQsVUFBUSxHQUFHLGdCQUFnQixPQUFPLE9BQU8sYUFBYSxhQUFhO0FBQ2pFLFVBQU0sZ0JBQWdCLEtBQUssS0FBSyxHQUFHLFFBQVEsR0FBRyxPQUFPO0FBQ3JELFFBQUk7QUFDRixZQUFNLE1BQU0sR0FBRztBQUNmLFlBQU0sSUFBSSxNQUFNLGVBQWUsRUFBRSxXQUFXLEtBQUssQ0FBQztBQUNsRCxZQUFNLFdBQVcsS0FBSyxLQUFLLGVBQWUsUUFBUTtBQUNsRCxZQUFNLFNBQVMsT0FBTyxLQUFLLFdBQVc7QUFDdEMsWUFBTSxJQUFJLFVBQVUsVUFBVSxNQUFNO0FBQ3BDLFlBQU0sTUFBTSxzQkFBc0IsSUFBSTtBQUFBLElBQ3hDLFNBQVMsS0FBSztBQUNaLGNBQVEsSUFBSSxzQkFBc0IsR0FBRztBQUNyQyxZQUFNLE1BQU0sc0JBQXNCLEtBQUs7QUFBQSxJQUN6QztBQUFBLEVBQ0YsQ0FBQztBQUVELFNBQU8sV0FBVyxXQUFXO0FBRTdCLGFBQVcsaUJBQWlCO0FBQUEsSUFDMUIsYUFBYTtBQUFBLEVBQ2Y7QUFFQSxNQUFJLE1BQWlCO0FBQ25CLGVBQVcsUUFBUSx1QkFBbUI7QUFBQSxFQUN4QyxPQUFPO0FBQ0wsZUFBVyxTQUFTLFlBQVk7QUFBQSxFQUNsQztBQUVBLE1BQUksTUFBdUI7QUFFekIsZUFBVyxZQUFZLGFBQWE7QUFBQSxFQUN0QyxPQUFPO0FBRUwsZUFBVyxZQUFZLEdBQUcsbUJBQW1CLE1BQU07QUFDakQsaUJBQVcsWUFBWSxjQUFjO0FBQUEsSUFDdkMsQ0FBQztBQUFBLEVBQ0g7QUFFQSxhQUFXLEdBQUcsVUFBVSxNQUFNO0FBQzVCLGlCQUFhO0FBQUEsRUFDZixDQUFDO0FBQ0g7QUFDQSxJQUFJLFVBQVUsRUFBRSxLQUFLLFlBQVk7QUFFakMsSUFBSSxHQUFHLHFCQUFxQixNQUFNO0FBQ2hDLE1BQUksYUFBYSxVQUFVO0FBQ3pCLFFBQUksS0FBSztBQUFBLEVBQ1g7QUFDRixDQUFDO0FBRUQsSUFBSSxHQUFHLFlBQVksTUFBTTtBQUN2QixNQUFJLGVBQWUsTUFBTTtBQUN2QixpQkFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
