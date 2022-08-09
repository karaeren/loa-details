import Store from "electron-store";
import log from "electron-log";
import { cloneDeep, merge } from "lodash";
import { EventEmitter } from "events";
import { classes } from "./classes";

const legacyStore = new Store();

export class AppSettings extends EventEmitter {
  static settings = undefined;

  constructor() {
    super();

    if (AppSettings.settings) return;
    AppSettings.settings = new Store({ name: "app-settings", schema });
  }

  get(key) {
    return AppSettings.settings.get(key);
  }

  set(key, value) {
    if (value === undefined || value === null) {
      AppSettings.settings.delete(key);
    } else {
      AppSettings.settings.set(key, value);
    }
    const actualKey = key.split(".").pop();

    this.emit("change", { key: actualKey, value });
  }
}

export function getSettings() {
  let appSettings = cloneDeep(defaultSettings);

  try {
    let settingsStr = legacyStore.get("settings");

    if (typeof settingsStr === "object")
      appSettings = merge(appSettings, cloneDeep(settingsStr));
    else if (typeof settingsStr === "string")
      merge(appSettings, JSON.parse(settingsStr));

    log.info("Found and applied settings.");
  } catch (e) {
    log.info("Setting retrieval failed: " + e);
  }

  return appSettings;
}

export function saveSettings(settings) {
  if (typeof settings === "object")
    legacyStore.set("settings", JSON.stringify(settings));
  else legacyStore.set("settings", settings);

  log.info(`Saved settings: ${settings}`);
}

const schema = {
  windows: {
    type: "object",
    properties: {
      main: {
        type: "object",
        properties: {
          X: {
            type: "number",
            default: 0,
          },
          Y: {
            type: "number",
            default: 0,
          },
          height: {
            type: "number",
            default: 614,
          },
          width: {
            type: "number",
            default: 974,
          },
          zoomFactor: {
            type: "number",
            default: 1,
          },
        },
      },
      damage_meter: {
        type: "object",
        properties: {
          X: {
            type: "number",
            default: 0,
          },
          Y: {
            type: "number",
            default: 0,
          },
          height: {
            type: "number",
            default: 200,
          },
          width: {
            type: "number",
            default: 512,
          },
          zoomFactor: {
            type: "number",
            default: 1,
          },
        },
      },
    },
  },
  settings: {
    type: "object",
    properties: {
      appVersion: {
        type: "string",
        default: "",
      },
      general: {
        type: "object",
        properties: {
          startMainHidden: {
            type: "boolean",
            default: false,
          },
          startMainMinimized: {
            type: "boolean",
            default: false,
          },
          closeToSystemTray: {
            type: "boolean",
            default: true,
          },
          useWinpcap: {
            type: "boolean",
            default: false,
          },
          saveScreenshots: {
            type: "boolean",
            default: true,
          },
          server: {
            type: "string",
            default: "steam",
          },
          customLogPath: {
            default: undefined,
          },
        },
      },
      shortcuts: {
        type: "object",
        properties: {
          minimizeDamageMeter: {
            type: "object",
            properties: {
              value: {
                type: "string",
                default: "CommandOrControl+Down",
              },
              defaultValue: {
                type: "string",
                default: "CommandOrControl+Down",
              },
            },
            default: {
              value: "CommandOrControl+Down",
              defaultValue: "CommandOrControl+Down",
            },
          },
          resetSession: {
            type: "object",
            properties: {
              value: {
                type: "string",
                default: "CommandOrControl+Up",
              },
              defaultValue: {
                type: "string",
                default: "CommandOrControl+Up",
              },
            },
            default: {
              value: "CommandOrControl+Up",
              defaultValue: "CommandOrControl+Up",
            },
          },
          pauseDamageMeter: {
            type: "object",
            properties: {
              value: {
                type: "string",
                default: "CommandOrControl+Right",
              },
              defaultValue: {
                type: "string",
                default: "CommandOrControl+Right",
              },
            },
            default: {
              value: "CommandOrControl+Right",
              defaultValue: "CommandOrControl+Right",
            },
          },
        },
      },
      uploads: {
        type: "object",
        properties: {
          includeRegion: {
            type: "boolean",
            default: false,
          },
          uploadUnlisted: {
            type: "boolean",
            default: true,
          },
          uploadLogs: {
            type: "boolean",
            default: false,
          },
          uploadKey: {
            type: "string",
            default: "",
          },
          api: {
            type: "string",
            default: "https://api.lail.ai",
          },
          uploadEndpoint: {
            type: "string",
            default: "/logs/upload",
          },
          site: {
            type: "string",
            default: "https://lail.ai",
          },
          openOnUpload: {
            type: "boolean",
            default: true,
          },
        },
      },
      damageMeter: {
        type: "object",
        properties: {
          functionality: {
            type: "object",
            properties: {
              dontResetOnZoneChange: {
                type: "boolean",
                default: false,
              },
              removeOverkillDamage: {
                type: "boolean",
                default: true,
              },
              pauseOnPhaseTransition: {
                type: "boolean",
                default: true,
              },
              resetAfterPhaseTransition: {
                type: "boolean",
                default: true,
              },
              autoMinimize: {
                type: "boolean",
                default: false,
              },
              autoMinimizeTimer: {
                type: "number",
                default: 60,
              },
              minimizeToTaskbar: {
                type: "boolean",
                default: false,
              },
              nameDisplay: {
                type: "string",
                default: "name+class",
              },
              nameDisplayV2: {
                type: "string",
                default: "name+gear+class",
              },
            },
          },
          design: {
            type: "object",
            properties: {
              compactDesign: {
                type: "boolean",
                default: false,
              },
              pinUserToTop: {
                type: "boolean",
                default: false,
              },
              opacity: {
                type: "number",
                default: 0.9,
              },
            },
          },
          header: {
            type: "object",
            properties: {
              damage: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Damage",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              dps: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "DPS",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              tank: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Tanked",
                  },
                  enabled: {
                    type: "boolean",
                    default: false,
                  },
                },
              },
            },
          },
          tabs: {
            type: "object",
            properties: {
              damage: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Damage/Tanked",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              deathTime: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Death Time",
                  },
                  enabled: {
                    type: "boolean",
                    default: false,
                  },
                },
              },
              damagePercent: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "D% (Damage Percent)",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              dps: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "DPS/TPS",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              critRate: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Crit Rate",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              faRate: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Front Attack Rate",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              baRate: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Back Attack Rate",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              counterCount: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Counter Count",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              maxDmg: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Skill View / Max Damage",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              avgDmg: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Skill View / Avg Damage",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              totalHits: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Skill View / Total Hits",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
              hpm: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    default: "Skill View / Hits per Minute",
                  },
                  enabled: {
                    type: "boolean",
                    default: true,
                  },
                },
              },
            },
          },
        },
      },
      classes: {
        type: "object",
        default: classes,
      },
    },
  },
};

// TODO: find a better way to handle this
const defaultSettings = {
  appVersion: "",
  general: {
    startMainHidden: false,
    startMainMinimized: false,
    closeToSystemTray: true,
    useWinpcap: false,
    saveScreenshots: true,
    server: "steam",
    customLogPath: null,
  },
  shortcuts: {
    minimizeDamageMeter: {
      value: "CommandOrControl+Down",
      defaultValue: "CommandOrControl+Down",
    },
    resetSession: {
      value: "CommandOrControl+Up",
      defaultValue: "CommandOrControl+Up",
    },
    pauseDamageMeter: {
      value: "CommandOrControl+Right",
      defaultValue: "CommandOrControl+Right",
    },
  },
  uploads: {
    uploadLogs: false,
    uploadKey: "",
    apiUrl: process.env.UPLOADS_API_URL,
    uploadEndpoint: "/logs/upload",
    loginUrl: process.env.UPLOADS_LOGIN_URL,
    region: "",
    server: "",
    openOnUpload: false,
    recentSessions: [],
  },
  damageMeter: {
    functionality: {
      dontResetOnZoneChange: false,
      removeOverkillDamage: true,
      pauseOnPhaseTransition: true,
      resetAfterPhaseTransition: true,
      autoMinimize: false,
      autoMinimizeTimer: 60,
      minimizeToTaskbar: false,
      nameDisplay: "name+class",
      nameDisplayV2: "name+gear+class",
    },
    design: {
      compactDesign: false,
      pinUserToTop: false,
      opacity: 0.9,
    },
    header: {
      damage: {
        name: "Damage",
        enabled: true,
      },
      dps: {
        name: "DPS",
        enabled: true,
      },
      tank: {
        name: "Tanked",
        enabled: false,
      },
    },
    tabs: {
      damage: {
        name: "Damage/Tanked",
        enabled: true,
      },
      deathTime: {
        name: "Death Time",
        enabled: false,
      },
      damagePercent: {
        name: "D% (Damage Percent)",
        enabled: true,
      },
      dps: {
        name: "DPS/TPS",
        enabled: true,
      },
      critRate: {
        name: "Crit Rate",
        enabled: true,
      },
      faRate: {
        name: "Front Attack Rate",
        enabled: true,
      },
      baRate: {
        name: "Back Attack Rate",
        enabled: true,
      },
      counterCount: {
        name: "Counter Count",
        enabled: true,
      },
      maxDmg: {
        name: "Skill View / Max Damage",
        enabled: true,
      },
      avgDmg: {
        name: "Skill View / Average Damage",
        enabled: true,
      },
      totalHits: {
        name: "Skill View / Total Hits",
        enabled: true,
      },
      hpm: {
        name: "Skill View / Hits per Minute",
        enabled: true,
      },
    },
    classes: {},
  },
  logs: {
    minimumSessionDurationInMinutes: 1,
    minimumEncounterDurationInMinutes: 0.5,
    minimumDurationInMinutes: 0.0,
    splitOnPhaseTransition: true,
  },
};
