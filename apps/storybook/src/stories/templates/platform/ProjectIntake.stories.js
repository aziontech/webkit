import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import Spinner from '@aziontech/webkit/spinner'
import TextureMaterial from '@aziontech/webkit/texture-material'
import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const text = (value) => `'${value.replaceAll("'", "\\'")}'`

const objectLiteral = (item) =>
  `  { ${Object.entries(item)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? text(value) : String(value)}`)
    .join(', ')} }`

const declare = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const components = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  IconButton,
  Spinner,
  TextureMaterial
}

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

const INITIALIZING_TEMPLATE = `<div class="relative h-dvh [contain:layout]">
  <div
    class="animate-fade-in motion-reduce:animate-none fixed inset-0 z-(--z-input-overlay) flex flex-col items-center justify-center gap-(--spacing-xl) bg-(--bg-canvas) p-(--spacing-xl)"
    role="status"
    aria-live="polite"
  >
    <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
      <Spinner class="size-6 text-(--primary)" />
      <h1 class="text-heading-lg text-(--text-default)">Initializing…</h1>
      <p class="text-body-sm text-(--text-muted)">Setting up your deployment…</p>
    </header>

    <div
      :data-overflowing="files.length > 6 || null"
      class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-xxs) overflow-hidden data-[overflowing]:max-h-80 data-[overflowing]:[mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
    >
      <div
        v-for="file in files"
        :key="file.path"
        class="flex items-center gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs)"
      >
        <span
          class="min-w-0 truncate font-(family-name:--font-code) text-body-xs text-(--text-default)"
          :title="file.path"
        >
          {{ file.path }}
        </span>
        <span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
          {{ file.size }}
        </span>
        <span class="ml-auto shrink-0 text-body-xs text-(--text-muted)">Waiting</span>
      </div>
    </div>

    <p class="text-body-xs text-(--text-muted)">5 files, 8.17 KB</p>
  </div>
</div>`

const BREADCRUMB = [{ label: 'Drop', current: true }]

const DROP_PAGE_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  '',
  declare('breadcrumb', BREADCRUMB)
]

const DROP_PAGE_TEMPLATE = `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
  <GlobalHeader aria-label="Azion Console">
    <GlobalHeader.Left>
      <IconButton icon="pi pi-chevron-left" aria-label="Back to Home" kind="outlined" size="small" />
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand kind="default" size="small" />
        </a>
      </GlobalHeader.Brand>
      <Breadcrumb :items="breadcrumb" />
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <button
        type="button"
        aria-label="Account settings"
        class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Avatar label="myemail@azion.com" size="medium" kind="square" />
      </button>
    </GlobalHeader.Right>
  </GlobalHeader>

  <main class="animate-page-enter motion-reduce:animate-none flex min-w-0 flex-1 flex-col overflow-auto">
    <div class="layout-boundary flex flex-1 flex-col justify-center">
      <section
        class="relative isolate flex flex-col items-center justify-center gap-(--spacing-lg) overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-default) px-(--spacing-lg) py-(--spacing-xxl) text-center transition-colors duration-150 ease-out [--texture-ink:color-mix(in_srgb,var(--text-default)_10%,transparent)] motion-reduce:transition-none data-[dragging]:border-(--border-selected) data-[dragging]:bg-(--bg-surface)"
      >
        <TextureMaterial />

        <span
          class="relative flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
        >
          <i class="pi pi-cloud-upload text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
        </span>

        <div class="relative flex max-w-(--container-md) flex-col gap-(--spacing-xs)">
          <h1 class="text-heading-lg text-(--text-default)">Drop your project</h1>
          <p class="text-pretty text-body-md text-(--text-muted)">
            Drag a folder here and Azion detects the framework, builds it, and gives you a live
            URL. No repository, no configuration.
          </p>
        </div>

        <div class="relative flex flex-wrap items-center justify-center gap-(--spacing-xs)">
          <Button label="Choose a folder" kind="primary" size="large" />
          <Button label="Choose a file" kind="secondary" size="large" />
        </div>
      </section>
    </div>
  </main>
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
          'The surfaces a project passes through when it is dropped on the console: the Drop page at `/drop`, the dashed drop target that fills the page while a folder hovers over it, and the full-screen Initializing overlay that lists the received files with a Spinner while the deployment is set up. Home, the empty Home, the Creation Center and the Application detail page render the drop target (the Application page swaps the copy for “Azion builds a new version of webkit-sample-vue, then you choose where it goes live.”); Home, the empty Home, the Creation Center and the Drop page render Initializing over themselves. Built from `GlobalHeader`, `Breadcrumb`, `TextureMaterial`, `Button`, `Spinner`, Vue’s Transition and plain elements on theme tokens.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const DropPage = {
  render: () => ({
    components,
    setup: () => ({ breadcrumb: BREADCRUMB }),
    template: DROP_PAGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Drop page at `/drop`: the focused creation header with Back to Home and a single Drop crumb, then a dashed panel over the texture with the upload glyph, the prompt and the Choose a folder and Choose a file buttons.'
      },
      source: { code: toSfc(DROP_PAGE_IMPORTS, DROP_PAGE_TEMPLATE) }
    }
  }
}

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
          'The Initializing overlay right after a drop, held inside a layout-contained frame here so it does not cover the docs page: a primary Spinner over the heading, one row per received file with its size and a Waiting status, and the manifest summary underneath.'
      },
      source: { code: toSfc(INITIALIZING_IMPORTS, INITIALIZING_TEMPLATE) }
    }
  }
}
