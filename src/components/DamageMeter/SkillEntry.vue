<template>
  <tr>
    <td class="td-skill-img">
      <img :src="getSkillImage(skill.id)" />
    </td>
    <td class="ellipsis">{{ getSkillName(skill) }}</td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.damage.enabled"
      class="text-center"
    >
      {{ abbreviatedDamage[0] }}
      <span class="ex">
        {{ abbreviatedDamage[1] }}
      </span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.damagePercent.enabled"
      class="text-center"
    >
      {{ skill.damagePercent }}<span class="ex">%</span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.dps.enabled"
      class="text-center"
    >
      {{ DPS[0] }}
      <span class="ex">
        {{ DPS[1] }}
      </span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.critRate.enabled"
      class="text-center"
    >
      {{
        skill.hits.total > 0
          ? ((skill.hits.crit / skill.hits.total) * 100).toFixed(1)
          : (0).toFixed(1)
      }}
      <span class="ex">%</span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.faRate.enabled"
      class="text-center"
    >
      {{
        skill.hits.total > 0
          ? ((skill.hits.frontAttack / skill.hits.total) * 100).toFixed(1)
          : (0).toFixed(1)
      }}
      <span class="ex">%</span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.baRate.enabled"
      class="text-center"
    >
      {{
        skill.hits.total > 0
          ? ((skill.hits.backAttack / skill.hits.total) * 100).toFixed(1)
          : (0).toFixed(1)
      }}
      <span class="ex">%</span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.maxDmg.enabled"
      class="text-center"
    >
      {{ maxDamage[0] }}
      <span class="ex">
        {{ maxDamage[1] }}
      </span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.avgDmg.enabled"
      class="text-center"
    >
      {{ avgDamage[0] }}
      <span class="ex">
        {{ avgDamage[1] }}
      </span>
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.totalHits.enabled"
      class="text-center"
    >
      {{ skill.hits.total }}
    </td>
    <td
      v-if="settingsStore.settings.damageMeter.tabs.hpm.enabled"
      class="text-center"
    >
      {{ HPM[0] }}
      <span class="ex">
        {{ HPM[1] }}
      </span>
    </td>
    <div
      class="player-bar"
      :style="`
              width:${skill.relativePercent}%;
              background:${settingsStore.getClassColor(className)};
              `"
    ></div>
  </tr>
</template>

<script setup>
import { computed } from "vue";
import { skills } from "src/constants/skills.js";
import { abbreviateNumber } from "src/util/number-helpers.js";
import { useSettingsStore } from "src/stores/settings";

const settingsStore = useSettingsStore();

const props = defineProps({
  skill: Object,
  className: String,
  fightDuration: Number,
});

const abbreviatedDamage = computed(() => {
  return abbreviateNumber(props.skill.totalDamage);
});

const DPS = computed(() => {
  return abbreviateNumber(
    (props.skill.totalDamage / (props.fightDuration / 1000)).toFixed(0)
  );
});

const HPM = computed(() => {
  return abbreviateNumber(
    (props.skill.hits.total / (props.fightDuration / 1000 / 60)).toFixed(1)
  );
});

const maxDamage = computed(() => {
  return abbreviateNumber(props.skill.maxDamage);
});

const avgDamage = computed(() => {
  if (props.skill.hits.total === 0)
    return abbreviateNumber(props.skill.totalDamage);
  return abbreviateNumber(props.skill.totalDamage / props.skill.hits.total);
});

function getSkillImage(id) {
  if (id > 99999) return getSkillImage(id / 10);
  const s = getSkill(id);
  if (id % 5 && !(s?.icon)) return getSkillImage(id - id % 5);

  if (s != null && skillHasIcon(s)) {
    return new URL(
      `../../assets/images/skills/${s.id}_${(s?.display ?? s.name).replace(":", "-")}.png`,
      import.meta.url
    ).href;
  }

  return new URL(`../../assets/images/skills/unknown.png`, import.meta.url)
    .href;
}

function getSkillName(skill) {
  const s = getSkill(skill.id);

  if (s != null) {
    if ('display' in s) return s.display;
  }
  return skill.name;
}

function skillHasIcon(s) {
    if (s.name.startsWith("Basic Attack") || s?.display?.startsWith("Basic Attack") || !(s?.icon ?? true))
      return false;
    return true;
  }
  function getSkill(id) {
    return skills.find((k) => k.id == id);
}
</script>
