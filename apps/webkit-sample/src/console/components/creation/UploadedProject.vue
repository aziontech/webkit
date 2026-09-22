<script setup>
  // WHAT THE READER DROPPED, shown back to them, and the one question a drop leaves open.
  //
  // A deploy that starts from a template knows what it is deploying — the catalog entry is
  // the contract, and the form below it fills in that template's own settings. A deploy
  // that starts from a DROP knows nothing of the kind: the reader handed over a pile of
  // files off their own machine, and the only honest thing the form can do first is say
  // which ones arrived. Without that the screen asked for a project name over a blank
  // panel reading "this project needs no additional settings", which is true and useless —
  // it is the one screen in the flow where the reader cannot see the thing being deployed.
  //
  // ── THE ROOT IS THE QUESTION, NOT A SETTING ──
  //
  // It is asked only when nothing else can answer it — a drop with no framework we
  // recognize and no `index.html` to fall back on: a lone screenshot, a PDF, three pages
  // none of which is an index. A detected framework has already answered it, whether by
  // building or by BEING the `index.html` that made the question go away. The predicate
  // for that sits next to the reader that produces the files
  // (../../lib/behavior/project-upload.js) and argues itself there.
  import { computed } from 'vue'

  import { picksRootFile, topLevel } from '../../lib/behavior/project-upload'
  import { formatBytes, formatManifest } from '../../lib/format/bytes'
  import { fileGlyph } from '../../lib/format/file-glyph'
  import SelectField from '../form/SelectField.vue'

  const props = defineProps({
    /** Every file read off the drop: `{ path, name, size }`, already sorted. */
    files: { type: Array, default: () => [] },
    /** Whether the walk stopped before the project did. */
    truncated: { type: Boolean, default: false },
    /**
     * The build preset the project deploys as — the page's state, since the field that
     * sets it sits in the page's own field row. Any value means the root is decided.
     */
    framework: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  })

  /** The file served at `/`. Only meaningful while `picksRoot`. */
  const root = defineModel({ type: String, default: '' })

  const summary = computed(() => formatManifest(props.files, props.truncated))

  // Nothing is built, so one of these files has to be the site's front door. The same
  // predicate gates the Deploy button on the page above (../../lib/behavior/project-upload.js),
  // so the picker cannot be drawn without being required, or required without being drawn.
  //
  // `framework` is the preset the reader currently has SELECTED in the row above, not the
  // one the drop was read as, so answering that question withdraws this one: a reader who
  // names a framework has said the site is built, and being asked which of their source
  // files answers `GET /` right after is the form arguing with the answer it was just
  // given.
  const picksRoot = computed(() => picksRootFile(props))

  const rootOptions = computed(() =>
    topLevel(props.files).map((file) => ({ label: file.name, value: file.name }))
  )
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-lg)">
    <!-- The listing. A plain block box, not a flex column: a `max-h` scroll box built out
         of flex children squashes the rows to fit instead of scrolling them. -->
    <div
      class="overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
    >
      <div class="flex items-center gap-(--spacing-sm) p-(--spacing-sm)">
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
        >
          <i
            class="pi pi-folder-open text-[1rem] leading-none text-(--text-default)"
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
            class="shrink-0 text-[0.875rem] leading-none text-(--text-muted)"
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

    <!-- NOT marked `required`, though the deploy is gated on it. The picker opens on the
         drop's own best answer and its option list is the drop itself, so there is no
         state in which it is empty and nothing for a required marker to warn about — and
         a required SelectField paints its helper amber, which would turn a plain sentence
         about what the choice does into a warning about a choice already made. -->
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
