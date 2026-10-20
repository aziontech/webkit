<script setup lang="ts">
  import { computed } from 'vue'

  import { picksRootFile, topLevel } from '../../lib/behavior/project-upload'
  import { formatBytes, formatManifest } from '../../lib/format/bytes'
  import { fileGlyph } from '../../lib/format/file-glyph'
  import SelectField from '../form/SelectField.vue'

  interface Props {
    files?: unknown[]
    truncated?: boolean
    framework?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    files: () => [],
    truncated: false,
    framework: '',
    disabled: false
  })

  const root = defineModel({ type: String, default: '' })

  const summary = computed(() => formatManifest(props.files, props.truncated))

  const picksRoot = computed(() => picksRootFile(props))

  const rootOptions = computed(() =>
    topLevel(props.files).map((file) => ({ label: file.name, value: file.name }))
  )
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-lg)">
    <div
      class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
    >
      <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
        >
          <i
            class="pi pi-folder-open text-body-md leading-none text-(--text-default)"
            aria-hidden="true"
          />
        </span>
        <span class="text-label-md text-(--text-default)">{{ summary }}</span>
      </div>

      <ul
        v-if="files.length"
        class="max-h-56 list-none overflow-auto overscroll-contain border-t border-(--border-muted) p-0"
      >
        <li
          v-for="file in files"
          :key="file.path"
          class="flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <i
            :class="fileGlyph(file.name)"
            class="shrink-0 text-body-sm leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <span
            class="min-w-0 flex-1 truncate font-(family-name:--font-code) text-body-xs text-(--text-default)"
            :title="file.path"
          >
            {{ file.path }}
          </span>
          <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
            {{ formatBytes(file.size) }}
          </span>
        </li>
      </ul>
    </div>

    <SelectField
      v-if="picksRoot"
      v-model="root"
      label="Root (/)"
      placeholder="Select a file"
      helper-text="This file is served at your site's root."
      :options="rootOptions"
      :disabled="disabled"
    />
  </div>
</template>
