import Store from "electron-store";
import log from "electron-log";
import { EventEmitter } from "events";
import { classes } from "./classes";

const legacyStore = new Store();

export class AppSettings extends EventEmitter {
  /**
   * @type {Store}
   */
  static settings = undefined;

  constructor() {
    super();

    if (AppSettings.settings) return;
    AppSettings.settings = new Store({ name: "app-settings", schema });

    this.#migrateLegacyStore();
  }

  #migrateLegacyStore() {
    const migrated = legacyStore.get("migrated");

    if (!migrated) {
      log.info("Migrating legacy settings");
      legacyStore.set("migrated", true);

      const legacySettings = legacyStore.get("settings");
      const legacyWindows = legacyStore.get("windows");

      if (legacySettings)
        AppSettings.settings.set("settings", JSON.parse(legacySettings));
      if (legacyWindows) AppSettings.settings.set("windows", legacyWindows);
    }
  }

  get(key) {
    return AppSettings.settings.get(key);
  }

  set(key, value) {
    if (value === undefined || value === null) {
      AppSettings.settings.reset(key);
    } else {
      AppSettings.settings.set(key, value);
    }
    const actualKey = key.split(".").pop();

    this.emit("change", { key: actualKey, value });
  }
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
          classes: {
            type: "object",
            default: classes,
          },
        },
      },
    },
  },
};
