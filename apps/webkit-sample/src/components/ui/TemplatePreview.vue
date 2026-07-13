<script setup>
import { computed } from "vue";

// Template preview card: a thumbnail, the title/description, and the Git source
// it clones from. Renders as a link when `href` is set, otherwise a plain card.
const props = defineProps({
  title: { type: String, default: "Template Title" },
  description: { type: String, default: "Template Description" },
  thumbnail: { type: String, default: "" },
  source: { type: String, default: "github" }, // github | gitlab
  repoOwner: { type: String, default: "aziontech" },
  repoPath: { type: String, default: "templates/nextjs" },
  href: { type: String, default: "" },
});

const sourceIcon = computed(() =>
  props.source === "gitlab" ? "pi-gitlab" : "pi-github",
);

const isLink = computed(() => Boolean(props.href));
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    :href="isLink ? href : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noopener' : undefined"
    class="flex w-full items-stretch gap-[var(--spacing-md)] overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-sm)] no-underline"
  >
    <!-- Preview thumbnail -->
    <div
      class="flex max-w-[192px] flex-1 flex-col items-center justify-center self-stretch"
    >
      <div
        class="relative h-[120px] w-full overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)]"
      >
        <img
          v-if="thumbnail"
          :src="thumbnail"
          alt=""
          class="absolute inset-0 size-full rounded-[var(--shape-elements)] object-cover"
        />
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center bg-[var(--bg-surface-raised)] text-[var(--text-muted)]"
          aria-hidden="true"
        >
          <i class="pi pi-image text-[1.5rem] leading-none opacity-60" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      class="flex min-w-0 flex-1 flex-col items-start justify-between self-stretch"
    >
      <!-- Title + description -->
      <div class="flex w-full min-w-0 flex-col overflow-hidden">
        <span class="flex items-center gap-[var(--spacing-xs)]">
          <span class="truncate text-heading-xxs text-[var(--text-default)]">
            {{ title }}
          </span>
          <i
            v-if="isLink"
            class="pi pi-external-link text-[length:inherit] leading-none text-[var(--text-muted)]"
            aria-hidden="true"
          />
        </span>
        <span class="text-body-xs text-[var(--text-muted)]">
          {{ description }}
        </span>
      </div>

      <!-- Source info -->
      <div class="flex w-full flex-col gap-[var(--spacing-xxs)]">
        <span class="truncate text-body-xxs text-[var(--text-muted)]">
          Cloning from {{ source === "gitlab" ? "GitLab" : "Github" }}
        </span>
        <div class="flex items-center gap-[var(--spacing-md)]">
          <span
            class="flex h-5 items-center gap-[var(--spacing-xxs)] text-label-sm text-[var(--text-default)]"
          >
            <i
              :class="['pi', sourceIcon]"
              class="text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoOwner }}
          </span>
          <span
            class="flex h-5 items-center gap-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]"
          >
            <i
              class="pi pi-folder text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoPath }}
          </span>
        </div>
      </div>
    </div>
  </component>
</template>
