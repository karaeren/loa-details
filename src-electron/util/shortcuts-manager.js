const { app, globalShortcut, dialog } = require("electron");
import EventEmitter from "events";
import log from "electron-log";
import { AppSettings } from "./app-settings";

export const shortcutEventEmitter = new EventEmitter();

/**
 * @param {AppSettings} appSettings
 */
export function updateShortcuts(appSettings) {
  globalShortcut.unregisterAll();
  initializeShortcuts(appSettings);
}

/**
 * @param {AppSettings} appSettings
 */
export function initializeShortcuts(appSettings) {
  appSettings.get("settings.shortcuts.minimizeDamageMeter");
  appSettings.get("settings.shortcuts.resetSession");
  appSettings.get("settings.shortcuts.pauseDamageMeter");
  const shortcuts = appSettings.get("settings.shortcuts");

  for (let key in shortcuts) {
    const shortcut = appSettings.get("settings.shortcuts." + key);
    const ret = globalShortcut.register(shortcut.value, () => {
      shortcutEventEmitter.emit("shortcut", {
        key: shortcut,
        action: key,
      });

      log.debug(`Shortcut ${shortcut} pressed`);
    });

    if (!ret) {
      dialog.showErrorBox(
        "Shortcut registration failed",
        "Couldn't register the shortcut: CommandOrControl+X+Y, it's probably being used by another program. You can change that shortcut in the settings. You can still use LOA Details."
      );
    }
  }
}

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
