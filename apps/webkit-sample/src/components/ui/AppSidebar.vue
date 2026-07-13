<script setup>
// The app's standard left rail: a Sidebar whose bottom content (avatar + user
// name + overflow menu + theme switcher) is baked in as the default across
// pages. Pages supply their own nav via the default slot and an optional
// header via the `header` slot.
import Avatar from "@aziontech/webkit/avatar";
import IconButton from "@aziontech/webkit/icon-button";
import Sidebar from "@aziontech/webkit/sidebar";
import ThemeSwitcher from "@aziontech/webkit/theme-switcher";
import { computed } from "vue";

import { useTheme } from "../../theme.js";

const props = defineProps({
  // Signed-in user's email; the footer shows the local part as the display name.
  user: { type: String, default: "myemail@azion.com" },
  ariaLabel: { type: String, default: "Sidebar" },
});

// Fired when the footer's overflow (⋮) button is activated, so the host page
// can open an account menu, sign out, etc.
const emit = defineEmits(["overflow"]);

const { theme } = useTheme();
const userName = computed(() => props.user.split("@")[0]);
</script>

<template>
  <aside class="w-[320px] shrink-0">
    <Sidebar :aria-label="ariaLabel">
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>

      <slot />

      <template #footer>
        <div class="flex items-center gap-[var(--spacing-xs)]">
          <Avatar :label="user" size="small" kind="square" />
          <span
            class="min-w-0 flex-1 truncate text-label-sm text-[var(--text-default)]"
          >
            {{ userName }}
          </span>
          <IconButton
            icon="pi pi-ellipsis-v"
            aria-label="Account menu"
            kind="outlined"
            size="small"
            @click="emit('overflow', $event)"
          />
          <ThemeSwitcher v-model:value="theme" aria-label="Theme" />
        </div>
      </template>
    </Sidebar>
  </aside>
</template>
