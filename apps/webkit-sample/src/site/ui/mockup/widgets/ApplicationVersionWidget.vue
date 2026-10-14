<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Tag from '@aziontech/webkit/tag'
  import type { TextureMaterialKind } from '@aziontech/webkit/texture-material'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup, { type ShellMockupFade } from '../ShellMockup.vue'

  defineOptions({ name: 'ApplicationVersionWidget' })

  /** Tabs of the application version editor the mockup can show. */
  export type ApplicationVersionTab =
    'main-settings' | 'cache-settings' | 'device-groups' | 'functions' | 'rules-engine'

  interface Props {
    /** Tab of the version editor on show. */
    tab?: ApplicationVersionTab
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Texture the frame is grounded with. */
    texture?: TextureMaterialKind
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    tab: 'main-settings',
    fade: 'none',
    texture: 'none',
    active: true
  })

  interface TableColumn {
    key: string
    label: string
    width: string
  }

  interface TableRow {
    key: string
    group?: boolean
    status?: boolean
    cells: Record<string, string>
  }

  const EDITOR = 'user-956415@example.com'

  const TABS = [
    { value: 'main-settings', label: 'Main Settings' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'device-groups', label: 'Device Groups' },
    { value: 'functions', label: 'Functions' },
    { value: 'rules-engine', label: 'Rules Engine' }
  ]

  const MODULES = [
    {
      key: 'accelerator',
      label: 'Application Accelerator',
      description: 'Optimize protocols and manage dynamic content delivery.',
      locked: ''
    },
    {
      key: 'cache',
      label: 'Cache',
      description: 'Customize advanced cache settings.',
      locked: 'Automatically enabled in all accounts.'
    },
    {
      key: 'functions',
      label: 'Functions',
      description: 'Build ultra-low latency functions that run on the edge.',
      locked: ''
    },
    {
      key: 'image-processor',
      label: 'Image Processor',
      description: 'Enable dynamic image editing options.',
      locked: ''
    }
  ]

  const TABLES: Record<string, { columns: TableColumn[]; rows: TableRow[] }> = {
    'cache-settings': {
      columns: [
        { key: 'name', label: 'Name', width: '300px' },
        { key: 'browser', label: 'Browser Cache', width: '463px' },
        { key: 'cache', label: 'Cache', width: '1fr' }
      ],
      rows: [
        {
          key: 'qa-p-cache',
          cells: {
            name: 'qa-p-cache',
            browser: 'Override Cache Settings',
            cache: 'Override Cache Settings'
          }
        },
        {
          key: 'qa-p-cache2',
          cells: {
            name: 'qa-p-cache2',
            browser: 'Honor Origin Cache Headers',
            cache: 'Override Cache Settings'
          }
        }
      ]
    },
    'device-groups': {
      columns: [
        { key: 'name', label: 'Name', width: '300px' },
        { key: 'id', label: 'ID', width: '344px' },
        { key: 'userAgent', label: 'User Agent', width: '1fr' }
      ],
      rows: [
        {
          key: 'qaMobile',
          cells: { name: 'qaMobile', id: '8793', userAgent: '(?i)(Mobile|Android)' }
        }
      ]
    },
    functions: {
      columns: [
        { key: 'name', label: 'Name', width: '412px' },
        { key: 'fn', label: 'Function', width: '341px' },
        { key: 'editor', label: 'Last Editor', width: '210px' },
        { key: 'modified', label: 'Last Modified', width: '1fr' }
      ],
      rows: [
        {
          key: 'qa-p-fi',
          cells: {
            name: 'qa-p-fi',
            fn: 'qa-p-fn',
            editor: EDITOR,
            modified: 'Sep 24, 2026, 01:18:38 AM'
          }
        },
        {
          key: 'qa-p-fi2',
          cells: {
            name: 'qa-p-fi2',
            fn: 'qa-p-fn',
            editor: EDITOR,
            modified: 'Sep 24, 2026, 01:19:21 AM'
          }
        }
      ]
    },
    'rules-engine': {
      columns: [
        { key: 'name', label: 'Name', width: '234px' },
        { key: 'status', label: 'Status', width: '144px' },
        { key: 'description', label: 'Description', width: '193px' },
        { key: 'editor', label: 'Last Editor', width: '390px' },
        { key: 'modified', label: 'Last Modified', width: '1fr' }
      ],
      rows: [
        { key: 'request', group: true, cells: { name: 'Request' } },
        ...[
          'qa-p-main',
          'qa-p-fn',
          'qa-p-dg',
          'qa-p-deny',
          'qa-p-nc',
          'qa-p-301',
          'qa-p-302',
          'qa-p-sto',
          'qa-p-https',
          'qa-p-cookies'
        ].map((name) => ({
          key: name,
          status: true,
          cells: {
            name,
            status: 'Active',
            description: '-',
            editor: EDITOR,
            modified: 'Sep 24, 2026, 02:33:43 AM'
          }
        }))
      ]
    }
  }

  const gridOf = (columns: TableColumn[]) => ({
    gridTemplateColumns: columns.map((column) => column.width).join(' ')
  })
</script>

<template>
  <ShellMockup
    shell="legacy"
    :fade="fade"
    :texture="texture"
    :active="active"
    :width="1440"
  >
    <div class="flex h-full flex-col">
      <MockupPart :order="0">
        <div class="flex min-h-16 items-center justify-between px-(--spacing-xl) pt-(--spacing-md)">
          <nav
            aria-label="Breadcrumb"
            class="flex items-center gap-(--spacing-xs) text-body-lg font-medium"
          >
            <span class="px-0.5 text-(--text-muted)">Applications</span>
            <i
              class="pi pi-angle-right text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="px-0.5 text-(--text-default)">qa-p-app</span>
            <i
              class="pi pi-angle-right text-body-sm text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="px-0.5 text-(--text-default)">A7TEE0XR</span>
          </nav>
          <div class="flex items-center gap-(--spacing-sm)">
            <span class="text-body-xs text-(--text-muted)">
              Created Sep 24, 2026 · by {{ EDITOR }}
            </span>
            <Tag
              label="Ready"
              severity="success"
              size="small"
              icon="pi pi-circle-fill"
            />
          </div>
        </div>
      </MockupPart>

      <MockupPart :order="1">
        <div class="flex items-center gap-(--spacing-xs) px-(--spacing-xl) pt-(--spacing-md)">
          <span
            v-for="item in TABS"
            :key="item.value"
            :data-active="item.value === tab || null"
            class="inline-flex h-8 items-center rounded-(--shape-elements) px-3 text-body-sm font-semibold text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance data-active:bg-(--bg-contrast) data-active:font-bold data-active:text-(--text-contrast) motion-reduce:transition-none"
          >
            {{ item.label }}
          </span>
        </div>
      </MockupPart>

      <div class="relative min-h-0 flex-1 overflow-hidden px-(--spacing-xl) pt-(--spacing-md)">
        <Transition
          mode="out-in"
          enter-active-class="animate-fade-in motion-reduce:animate-none"
        >
          <div
            :key="tab"
            class="flex flex-col gap-(--spacing-md)"
          >
            <template v-if="tab === 'main-settings'">
              <fieldset
                class="m-0 flex min-w-0 gap-16 rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-14"
              >
                <div class="flex w-107.5 shrink-0 flex-col gap-(--spacing-xs)">
                  <div class="text-heading-md font-medium text-(--text-default)">General</div>
                  <div class="text-body-sm text-(--text-muted)">
                    Create an Application to deliver your content from the edge.
                  </div>
                </div>
                <div class="flex w-full max-w-lg flex-col gap-(--spacing-xs)">
                  <Label
                    label="Name"
                    required
                  />
                  <InputText
                    model-value="qa-p-app"
                    size="medium"
                    aria-label="Name"
                    disabled
                  />
                  <HelperText
                    label="Give a unique and descriptive name to identify the Application."
                  />
                </div>
              </fieldset>

              <fieldset
                class="m-0 flex min-w-0 gap-16 rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-14"
              >
                <div class="flex w-107.5 shrink-0 flex-col gap-(--spacing-xs)">
                  <div class="text-heading-md font-medium text-(--text-default)">Modules</div>
                  <div class="text-body-sm text-(--text-muted)">
                    Activate modules to extend the configuration possibilities of the Application.
                    Some modules require subscription.
                  </div>
                </div>
                <div class="flex w-full max-w-3xl flex-col gap-(--spacing-sm)">
                  <span class="text-label-lg text-(--text-default)">Default Modules</span>
                  <div
                    v-for="module in MODULES"
                    :key="module.key"
                    class="flex items-start gap-(--spacing-sm) rounded-(--shape-elements) border border-[color-mix(in_srgb,var(--primary)_32%,transparent)] bg-(--bg-surface-raised) p-(--spacing-md)"
                  >
                    <span
                      class="mt-0.5 flex h-5 w-9 shrink-0 items-center justify-end rounded-full bg-[color-mix(in_srgb,var(--primary)_40%,transparent)] px-0.5"
                    >
                      <span class="size-4 rounded-full bg-(--text-muted)" />
                    </span>
                    <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-label-lg text-(--text-default)">{{ module.label }}</span>
                      <span class="text-body-sm text-(--text-muted)">{{ module.description }}</span>
                      <span
                        v-if="module.locked"
                        class="mt-1 inline-flex w-fit items-center gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) px-2 py-1 text-body-xs text-(--text-default)"
                      >
                        <i
                          class="pi pi-lock text-body-xs"
                          aria-hidden="true"
                        />
                        {{ module.locked }}
                      </span>
                    </span>
                  </div>
                  <span class="mt-(--spacing-sm) text-label-lg text-(--text-default)">
                    Subscription modules
                  </span>
                  <span class="inline-flex w-fit">
                    <Button
                      label="Contact sales"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-shopping-cart"
                    />
                  </span>
                </div>
              </fieldset>
            </template>

            <div
              v-else
              class="overflow-hidden rounded-(--shape-elements) border border-(--border-default)"
            >
              <div
                class="flex items-center gap-(--spacing-xs) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-sm)"
              >
                <div class="w-77">
                  <InputText
                    model-value=""
                    size="medium"
                    placeholder="Search keywords..."
                    aria-label="Search keywords"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </InputText>
                </div>
                <span class="ml-auto inline-flex gap-(--spacing-xs)">
                  <IconButton
                    icon="pi pi-refresh"
                    kind="outlined"
                    size="medium"
                    aria-label="Refresh"
                  />
                  <IconButton
                    icon="pi pi-download"
                    kind="outlined"
                    size="medium"
                    aria-label="Export"
                  />
                  <IconButton
                    icon="ai ai-column"
                    kind="outlined"
                    size="medium"
                    aria-label="Columns"
                  />
                </span>
              </div>

              <div
                :style="gridOf(TABLES[tab].columns)"
                class="grid h-11 items-center bg-(--bg-surface-raised) text-body-sm font-semibold text-(--text-default)"
              >
                <span
                  v-for="column in TABLES[tab].columns"
                  :key="column.key"
                  class="px-3.5"
                  >{{ column.label }}</span
                >
              </div>

              <div
                v-for="row in TABLES[tab].rows"
                :key="row.key"
                :style="gridOf(TABLES[tab].columns)"
                class="grid h-11 items-center border-t border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-default)"
              >
                <template v-if="row.group">
                  <span class="inline-flex items-center gap-(--spacing-xs) px-3.5 font-medium">
                    <i
                      class="pi pi-chevron-down text-body-xs"
                      aria-hidden="true"
                    />
                    {{ row.cells.name }}
                  </span>
                </template>
                <template v-else>
                  <span
                    v-for="column in TABLES[tab].columns"
                    :key="column.key"
                    class="truncate px-3.5"
                  >
                    <Tag
                      v-if="row.status && column.key === 'status'"
                      :label="row.cells.status"
                      severity="success"
                      size="small"
                    />
                    <template v-else>{{ row.cells[column.key] }}</template>
                  </span>
                </template>
              </div>

              <div
                class="flex h-12 items-center justify-between border-t border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) text-body-xs text-(--text-muted)"
              >
                <span
                  >Showing 1 to {{ TABLES[tab].rows.length }} of
                  {{ TABLES[tab].rows.length }} entries</span
                >
                <span class="inline-flex items-center gap-(--spacing-sm)">
                  <i
                    class="pi pi-angle-double-left"
                    aria-hidden="true"
                  />
                  <i
                    class="pi pi-angle-left"
                    aria-hidden="true"
                  />
                  <span
                    class="inline-flex h-8 w-9 items-center justify-center rounded-(--shape-elements) bg-(--bg-hover) text-(--text-default)"
                    >1</span
                  >
                  <i
                    class="pi pi-angle-right"
                    aria-hidden="true"
                  />
                  <i
                    class="pi pi-angle-double-right"
                    aria-hidden="true"
                  />
                  <span
                    class="inline-flex h-8 w-16 items-center justify-between rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) text-(--text-default)"
                  >
                    50
                    <i
                      class="pi pi-chevron-down"
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    class="inline-flex h-8 w-9 items-center justify-center rounded-(--shape-elements) bg-(--bg-hover) text-(--text-default)"
                    >1</span
                  >
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <MockupPart :order="2">
        <div
          class="flex items-center gap-(--spacing-md) border-t border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xl) py-(--spacing-md)"
        >
          <span
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-(--shape-elements) bg-(--bg-canvas)"
          >
            <i
              class="pi pi-check-circle text-body-lg text-(--text-muted)"
              aria-hidden="true"
            />
          </span>
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <span
              class="flex items-center gap-(--spacing-xs) text-body-sm font-medium text-(--text-default)"
            >
              Viewing a Ready version
              <Tag
                label="Ready"
                severity="success"
                size="small"
                icon="pi pi-circle-fill"
              />
              <span
                class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) px-2 py-0.5 text-body-xs text-(--text-muted)"
              >
                <i
                  class="pi pi-lock text-body-xs"
                  aria-hidden="true"
                />
                Read Only
              </span>
            </span>
            <span class="text-body-xs text-(--text-muted)">
              This version is read-only. Create a new version to make changes, or deploy it to go
              live.
            </span>
          </div>
          <span class="ml-auto inline-flex shrink-0 items-center gap-(--spacing-sm)">
            <Button
              label="New Version"
              kind="outlined"
              size="small"
              icon="pi pi-plus"
            />
            <Button
              label="Deploy"
              kind="primary"
              size="small"
              icon="pi pi-cloud-upload"
            />
          </span>
        </div>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
