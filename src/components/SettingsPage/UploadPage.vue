<template>
  <q-list>
    <q-item-label header>Log Uploads</q-item-label>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox v-model="settingsStore.settings.uploads.openOnUpload" />
      </q-item-section>

      <q-item-section>
        <q-item-label>Open On Upload</q-item-label>
        <q-item-label caption>
          Automatically open the uploaded encounter in your default browser.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox v-model="settingsStore.settings.uploads.uploadUnlisted" />
      </q-item-section>

      <q-item-section>
        <q-item-label>Private Uploads</q-item-label>
        <q-item-label caption>
          Upload your encounters as unlisted. Unlisted encounters can only be
          viewed with a link.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section side top>
        <q-checkbox v-model="settingsStore.settings.uploads.includeRegion" />
      </q-item-section>

      <q-item-section>
        <q-item-label
          >Include Game Region
          <q-badge color="blue">
            {{
              settingsStore.settings.general.server.replace(/./, (c) =>
                c.toUpperCase()
              )
            }}
          </q-badge>
        </q-item-label>
        <q-item-label caption>
          Include your game region in the upload. This value is taken
          automatically based on your current logger configuration.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item
      tag="label"
      :disable="settingsStore.settings.uploads.uploadKey.length !== 32"
    >
      <q-item-section side top>
        <q-checkbox
          :disable="settingsStore.settings.uploads.uploadKey.length !== 32"
          v-model="settingsStore.settings.uploads.uploadLogs"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>Upload Logged Encounters</q-item-label>
        <q-item-label caption>
          Enable to upload your encounters to the web. Requires the "Upload Key"
          to be set.
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item tag="label">
      <q-item-section left>
        <q-item-label>Upload Key</q-item-label>
        <q-item-label caption>
          An API key is required to upload logged encounters.<br />
          Login at
          <span
            @click="openSite(settingsStore.settings.uploads.site)"
            class="text-primary"
            style="cursor: pointer"
            >{{ settingsStore.settings.uploads.site }}</span
          >
          to get one.
        </q-item-label>
      </q-item-section>
      <q-item-section right>
        <q-input
          v-model="uploadKey"
          :type="isPwd ? 'password' : 'text'"
          label="API Key"
          clearable
          @clear="uploadKey = ''"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-separator spaced />

    <q-item tag="label">
      <q-item-section side top>
        <q-btn
          unelevated
          color="negative"
          :label="`${showAdvanced ? 'Hide' : 'Show'} Advanced`"
          @click="showAdvanced = !showAdvanced"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>For users self-hosting logs</q-item-label>
        <q-item-label caption>
          Modifying any of the settings here may break uploads - careful!
        </q-item-label>
      </q-item-section>
    </q-item>

    <div v-if="showAdvanced" style="margin-top: 25px !important">
      <q-item tag="label" :clickable="false">
        <q-item-section left>
          <q-item-label>Upload Server&nbsp; </q-item-label>
          <q-item-label caption> URL to API server. </q-item-label>
        </q-item-section>
        <q-item-section right>
          <q-input
            v-model="settingsStore.settings.uploads.api"
            type="text"
            label="Upload Server"
            clearable
            clear-icon="refresh"
            @clear="resetUrl('api')"
          >
          </q-input>
        </q-item-section>
      </q-item>

      <q-item tag="label" :clickable="false">
        <q-item-section left>
          <q-item-label>Upload Endpoint&nbsp; </q-item-label>
          <q-item-label caption>
            Endpoint for log uploads on API.
          </q-item-label>
        </q-item-section>
        <q-item-section right>
          <q-input
            v-model="settingsStore.settings.uploads.uploadEndpoint"
            type="text"
            label="Endpoint"
            clearable
            clear-icon="refresh"
            @clear="resetUrl('endpoint')"
          >
          </q-input>
        </q-item-section>
      </q-item>

      <q-item tag="label" :clickable="false">
        <q-item-section left>
          <q-item-label>Frontend&nbsp; </q-item-label>
          <q-item-label caption> URL to frontend. </q-item-label>
        </q-item-section>
        <q-item-section right>
          <q-input
            v-model="settingsStore.settings.uploads.site"
            type="text"
            label="Frontend"
            clearable
            clear-icon="refresh"
            @clear="resetUrl('site')"
          >
          </q-input>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useSettingsStore } from "src/stores/settings";
const settingsStore = useSettingsStore();

const isPwd = ref(true);
const uploadKey = ref("");
const showAdvanced = ref(false);

watch(uploadKey, (newVal, oldVal) => {
  settingsStore.settings.uploads.uploadKey = newVal;
  if (newVal.length !== 32) settingsStore.settings.uploads.uploadLogs = false;
});

onMounted(() => {
  uploadKey.value = settingsStore.settings.uploads.uploadKey;
});

function resetUrl(type) {
  switch (type) {
    case "api":
      settingsStore.settings.uploads.api = process.env.UPLOADS_API_URL;
      break;
    case "site":
      settingsStore.settings.uploads.site = process.env.UPLOADS_LOGIN_URL;
      break;
    case "endpoint":
      settingsStore.settings.uploads.uploadEndpoint =
        process.env.UPLOADS_ENDPOINT;
      break;
  }
}

function openSite(url) {
  window.messageApi.send("window-to-main", {
    message: "open-link",
    value: url,
  });
}
</script>
