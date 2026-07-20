<script setup>
import Avatar from "@aziontech/webkit/avatar";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed } from "vue";

import { relativeTime } from "../../lib/relative-time";

// Reusable "Last Modified" cell: the modifier's avatar + a relative timestamp
// ("3 days ago"). The name lives on the avatar's tooltip, so a separate author
// column is unnecessary. See .agents/skills/tables/SKILL.md.
const props = defineProps({
  /** Person who made the change — a name ("Maria Silva") or email ("maria.silva@azion.com"). */
  author: { type: String, default: "" },
  /** Optional avatar photo URL. Falls back to the author's initials when unset or the image fails to load. */
  avatarSrc: { type: String, default: "" },
  /** Absolute timestamp of the change (Date or any string `new Date()` parses). */
  date: { type: [String, Date], default: "" },
});

// Emails and dotted handles → a readable name ("maria.silva@azion.com" → "Maria Silva").
const displayName = computed(() => {
  const raw = props.author.trim();
  if (!raw) return "";
  const local = raw.includes("@") ? raw.slice(0, raw.indexOf("@")) : raw;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

const relative = computed(() => relativeTime(props.date));
</script>

<template>
  <div
    v-if="displayName || relative"
    class="flex min-w-0 items-center gap-[var(--spacing-xs)]"
  >
    <Tooltip v-if="displayName" :text="displayName">
      <Avatar
        :src="avatarSrc || undefined"
        :alt="displayName"
        :label="displayName"
        size="small"
        kind="square"
      />
    </Tooltip>
    <span class="truncate text-body-sm text-[var(--text-muted)]">{{ relative }}</span>
  </div>
</template>
