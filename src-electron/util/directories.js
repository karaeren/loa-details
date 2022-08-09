const platformFolders = require("platform-folders");
const fs = require("fs");
const path = require("path");
const { AppSettings } = require("./app-settings");

const appSettings = new AppSettings();
const customPath = appSettings.get("settings.general.customLogPath");

const documentsFolder = platformFolders.getDocumentsFolder();

export const mainFolder =
  customPath === undefined || customPath === null
    ? path.join(documentsFolder, "Lost Ark Logs")
    : customPath;

if (!fs.existsSync(mainFolder)) {
  fs.mkdirSync(mainFolder);
}

export const parsedLogFolder = path.join(mainFolder, "parsed");
if (!fs.existsSync(parsedLogFolder)) {
  fs.mkdirSync(parsedLogFolder);
}

export const screenshotsFolder = path.join(mainFolder, "screenshots");
if (!fs.existsSync(screenshotsFolder)) {
  fs.mkdirSync(screenshotsFolder);
}
