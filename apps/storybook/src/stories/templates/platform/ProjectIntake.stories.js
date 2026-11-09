import CardBox from '@aziontech/webkit/card-box'
import Spinner from '@aziontech/webkit/spinner'
import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const components = { CardBox, Spinner }

const FILES = [
  { path: 'package.json', size: '1.2 KB', state: 'done' },
  { path: 'azion.config.js', size: '640 B', state: 'done' },
  { path: 'src/index.ts', size: '3.4 KB', state: 'running' },
  { path: 'src/routes/api.ts', size: '2.1 KB', state: 'pending' },
  { path: 'public/index.html', size: '860 B', state: 'pending' }
]

const text = (value) => `'${value.replaceAll("'", "\\'")}'`

const DROP_ZONE_IMPORTS = ["import { ref } from 'vue'", '', 'const active = ref(true)']

const DROP_ZONE_TEMPLATE = `<div class="relative flex min-h-dvh flex-col">
  <Transition
    enter-active-class="animate-fade-in motion-reduce:animate-none"
    leave-active-class="animate-fade-out motion-reduce:animate-none"
  >
    <div
      v-if="active"
      aria-hidden="true"
      class="pointer-events-none absolute inset-[var(--drop-zone-inset,0)] z-40 overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-canvas) [--drop-zone-inset:var(--layout-boundary-inline)]"
    >
      <div
        class="sticky top-0 flex h-dvh max-h-full flex-col items-center justify-center gap-(--spacing-md) p-(--spacing-lg) text-center"
      >
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
        >
          <i class="pi pi-cloud-upload text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
        </span>
        <div class="flex max-w-(--container-md) flex-col gap-(--spacing-xxs)">
          <p class="text-heading-xs text-(--text-default)">Drop your project to deploy it</p>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            A project folder, or the files inside one. Azion reads what it is built with.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</div>`

const INITIALIZING_IMPORTS = [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Spinner from '@aziontech/webkit/spinner'",
  '',
  'const files = [',
  ...FILES.map(
    (file, index) =>
      `  { path: ${text(file.path)}, size: ${text(file.size)}, state: ${text(file.state)} }${index < FILES.length - 1 ? ',' : ''}`
  ),
  ']'
]

const INITIALIZING_TEMPLATE = `<div class="relative h-dvh [contain:layout]">
  <div
    class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-input-overlay) flex flex-col items-center justify-center gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
    role="status"
    aria-live="polite"
  >
    <header class="flex flex-col items-center gap-(--spacing-xxs) text-center">
      <h1 class="text-heading-sm text-(--text-default)">Initializing</h1>
      <p class="text-body-sm text-(--text-muted)">Setting up your deployment. 2 of 5 files.</p>
    </header>

    <CardBox :padded="false" class="w-full max-w-(--container-md)">
      <template #content>
        <ol class="flex flex-col">
          <li
            v-for="file in files"
            :key="file.path"
            class="flex min-h-10 items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) last:border-b-0"
          >
            <span class="flex size-5 shrink-0 items-center justify-center">
              <i v-if="file.state === 'done'" class="pi pi-check-circle text-(--success-contrast)" aria-hidden="true" />
              <Spinner v-else-if="file.state === 'running'" class="size-4 text-(--text-default)" />
              <span v-else class="size-3.5 rounded-full border border-dashed border-(--border-default)" />
            </span>
            <span
              :data-state="file.state"
              class="min-w-0 truncate text-label-code-md text-(--text-default) data-[state=pending]:text-(--text-muted)"
              :title="file.path"
            >
              {{ file.path }}
            </span>
            <span class="ml-auto shrink-0 text-label-sm tabular-nums text-(--text-muted)">{{ file.size }}</span>
          </li>
        </ol>
      </template>
    </CardBox>

    <p class="text-body-xs text-(--text-muted)">5 files, 8.17 KB</p>
  </div>
</div>`

const meta = {
  title: 'Templates/Platform/States/ProjectIntake',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The surfaces a project passes through when it is dropped on the console: the dashed drop target that fills the page while a folder hovers over it, then the full-screen Initializing overlay that reads like the deploy logs: one row per received file as a step, its status glyph (a check once uploaded, a Spinner while it runs, a dashed ring while queued), the path and its size, advancing row by row, over the upload summary. Home, the empty Home, the Creation Center and the Application detail page render the drop target (the Application page swaps the copy for “Azion builds a new version of webkit-sample-vue, then you choose where it goes live.”); Home, the empty Home and the Creation Center render Initializing over themselves. Built from `CardBox`, `Spinner`, Vue’s Transition and plain elements on theme tokens, with the step-row anatomy of the DeploymentLogs template.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const DropZone = {
  render: () => ({
    setup: () => ({ active: ref(true) }),
    template: DROP_ZONE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The drop target in its active state: a dashed selected border inset by the page boundary through `--drop-zone-inset`, an upload glyph in a raised frame, and the prompt copy centred in the viewport.'
      },
      source: { code: toSfc(DROP_ZONE_IMPORTS, DROP_ZONE_TEMPLATE) }
    }
  }
}

export const Initializing = {
  render: () => ({
    components,
    setup: () => ({ files: FILES }),
    template: INITIALIZING_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Initializing overlay mid-upload, held inside a layout-contained frame here so it does not cover the docs page: two files uploaded, the third running, two queued, each row a step with its status glyph, path and size.'
      },
      source: { code: toSfc(INITIALIZING_IMPORTS, INITIALIZING_TEMPLATE) }
    }
  }
}
