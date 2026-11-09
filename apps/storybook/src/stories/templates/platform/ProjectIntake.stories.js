import Spinner from '@aziontech/webkit/spinner'
import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const text = (value) => `'${value.replaceAll("'", "\\'")}'`

const objectLiteral = (item) =>
  `  { ${Object.entries(item)
    .map(([key, value]) => `${key}: ${text(value)}`)
    .join(', ')} }`

const declare = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const components = { Spinner }

const DROP_ZONE_IMPORTS = ["import { ref } from 'vue'", '', 'const active = ref(true)']

const DROP_ZONE_TEMPLATE = `<main class="layout-boundary relative flex min-h-screen flex-col">
  <Transition
    enter-active-class="animate-fade-in motion-reduce:animate-none"
    leave-active-class="animate-fade-out motion-reduce:animate-none"
  >
    <div
      v-if="active"
      aria-hidden="true"
      class="pointer-events-none absolute inset-(--layout-boundary-inline) z-40 overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-canvas)"
    >
      <div
        class="sticky top-0 flex h-dvh max-h-full flex-col items-center justify-center gap-(--spacing-md) p-(--spacing-lg) text-center"
      >
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
        >
          <i class="pi pi-cloud-upload text-(--text-default)" aria-hidden="true" />
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
</main>`

const FILES = [
  { path: 'package.json', size: '1.2 KB' },
  { path: 'azion.config.js', size: '640 B' },
  { path: 'src/index.ts', size: '3.4 KB' },
  { path: 'src/routes/api.ts', size: '2.1 KB' },
  { path: 'public/index.html', size: '860 B' }
]

const INITIALIZING_IMPORTS = [
  "import Spinner from '@aziontech/webkit/spinner'",
  '',
  declare('files', FILES)
]

const INITIALIZING_TEMPLATE = `<div
  role="status"
  aria-live="polite"
  class="animate-fade-in motion-reduce:animate-none flex min-h-screen flex-col items-center justify-center gap-(--spacing-xl) bg-(--bg-canvas) p-(--spacing-xl)"
>
  <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
    <span class="flex size-6 text-(--primary) *:size-full" aria-hidden="true">
      <Spinner />
    </span>
    <h1 class="text-heading-lg text-(--text-default)">Initializing…</h1>
    <p class="text-body-sm text-(--text-muted)">Setting up your deployment…</p>
  </header>

  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-xxs) overflow-hidden">
    <div
      v-for="file in files"
      :key="file.path"
      class="flex items-center gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
    >
      <span class="min-w-0 truncate text-label-code-sm text-(--text-default)" :title="file.path">
        {{ file.path }}
      </span>
      <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">{{ file.size }}</span>
      <span class="ml-auto shrink-0 text-body-xs text-(--text-muted)">Waiting</span>
    </div>
  </div>

  <p class="text-body-xs text-(--text-muted)">5 files, 8.17 KB</p>
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
          'The two surfaces a project passes through when it is dragged onto the console: the dashed drop target that fills the page while a folder hovers over it, and the full-page Initializing screen that lists the received files with a Spinner while the deployment is set up. Home and the create flow render both from ProjectDropZone and ProjectInitializing. Built from Spinner, Vue’s Transition and plain elements on theme tokens.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const DropZone = {
  render: () => ({
    components,
    setup: () => ({ active: ref(true) }),
    template: DROP_ZONE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The drop target in its active state: a dashed selected border inset by the page boundary, an upload glyph in a raised frame, and the prompt copy centred in the viewport.'
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
          'The Initializing screen right after a drop: a primary Spinner over the heading, one row per received file with its size and a Waiting status, and the manifest summary underneath.'
      },
      source: { code: toSfc(INITIALIZING_IMPORTS, INITIALIZING_TEMPLATE) }
    }
  }
}
