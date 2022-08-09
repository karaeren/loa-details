<template>
  <q-list>
    <q-item-label header>General</q-item-label>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox
          v-model="settingsStore.settings.general.startMainHidden"
          @update:model-value="changeStartMainHidden"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Start Main Window Hidden</q-item-label>
        <q-item-label caption>
          Hides the main window (this window) to system tray on startup, only
          the damage meter will be visible.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox
          v-model="settingsStore.settings.general.startMainMinimized"
          @update:model-value="changeStartMinimized"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Start Minimized</q-item-label>
        <q-item-label caption>
          Minimizes the main window (this window) on startup.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox
          v-model="settingsStore.settings.general.closeToSystemTray"
          @update:model-value="changeMinimizeToTray"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Minimize to Tray</q-item-label>
        <q-item-label caption>
          Hitting X will send main LOA Details window to system tray instead of
          closing the app.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox
          v-model="settingsStore.settings.general.useWinpcap"
          @update:model-value="changeUseWinpcap"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Use Winpcap</q-item-label>
        <q-item-label caption>
          Might fix packets not arriving. Program needs to be restarted after
          enabling.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox
          v-model="settingsStore.settings.general.saveScreenshots"
          @update:model-value="changeSaveScreenshots"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Save Screenshots</q-item-label>
        <q-item-label caption>
          If enabled, the screenshots taken in LOA Details will be saved as a
          file.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-item-label>Game Region</q-item-label>
        <q-item-label caption>
          Select the region you're playing on. Program needs to be restarted
          after changing.
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-select filled v-model="serverModel" :options="serverOptions" />
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section>
        <q-item-label>Custom Log Path</q-item-label>
        <q-item-label caption style="margin-bottom: 16px">
          You can select a custom log path to save logs to (instead of the
          default path in Documents folder). Program needs to be restarted to
          take effect.
        </q-item-label>
        <div>
          <q-btn
            unelevated
            color="orange"
            label="Select a Custom Path"
            style="margin-right: 16px"
            @click="selectCustomLogPath"
          />
          <q-btn
            unelevated
            color="blue"
            label="Reset Custom Path"
            @click="resetLogPath"
          />
          <div style="margin-top: 16px">Current path: {{ currentLogPath }}</div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useSettingsStore } from "src/stores/settings";
const settingsStore = useSettingsStore();

const serverOptions = ref([
  {
    label: "Steam (EU/NA/SA)",
    value: "steam",
  },
  {
    label: "Russia",
    value: "russia",
  },
  {
    label: "Korea",
    value: "korea",
  },
]);

function changeStartMainHidden(val) {
  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.startMainHidden",
    value: val,
    source: "main",
  });
}

function changeStartMinimized(val) {
  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.startMainMinimized",
    value: val,
    source: "main",
  });
}

function changeMinimizeToTray(val) {
  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.closeToSystemTray",
    value: val,
    source: "main",
  });
}

function changeUseWinpcap(val) {
  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.useWinpcap",
    value: val,
    source: "main",
  });
}

function changeSaveScreenshots(val) {
  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.saveScreenshots",
    value: val,
    source: "main",
  });
}

var serverModel = ref("");
watch(serverModel, (newVal, oldVal) => {
  settingsStore.settings.general.server = newVal.value;

  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.server",
    value: newVal.value,
    source: "main",
  });
});

const currentLogPath = ref("");
function selectCustomLogPath() {
  window.messageApi.send("window-to-main", {
    message: "select-log-path-folder",
  });
}
function resetLogPath() {
  settingsStore.settings.general.customLogPath = null;
  currentLogPath.value = "Documents/Lost Ark Logs (needs restart)";

  window.messageApi.send("window-to-main", {
    message: "change-setting",
    setting: "settings.general.customLogPath",
    value: undefined,
    source: "main",
  });
}

onMounted(() => {
  window.messageApi.receive("selected-log-path-folder", (newPath) => {
    settingsStore.settings.general.customLogPath = newPath;
    currentLogPath.value = newPath + " (needs restart)";
  });

  serverModel.value = serverOptions.value.find(
    (x) => x.value === settingsStore.settings.general.server
  );

  if (settingsStore.settings.general.customLogPath === null)
    currentLogPath.value = "Documents/Lost Ark Logs";
  else currentLogPath.value = settingsStore.settings.general.customLogPath;
});
</script>
