<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Input from '../../../input/input/input.vue'
  import type { TextureVariant } from '../../../marketing/texture/texture.vue'
  import Tag from '../../tag/tag.vue'
  import ConsoleMockupShell, {
    type ConsoleMockupShellFade
  } from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'

  defineOptions({ name: 'ApplicationVersionWidget' })

  export type ConsoleMockupApplicationVersionTab =
    'main-settings' | 'cache-settings' | 'device-groups' | 'functions' | 'rules-engine'

  interface Props {
    /** Tab of the version editor on show. */
    tab?: ConsoleMockupApplicationVersionTab
    /** Edge the mockup fades out along. */
    fade?: ConsoleMockupShellFade
    /** Texture the frame is grounded with. */
    texture?: TextureVariant
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
      description: 'Build low-latency functions that run close to users.',
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
  <ConsoleMockupShell
    shell="legacy"
    :fade="fade"
    :texture="texture"
    :active="active"
    :width="1440"
  >
    <div class="flex h-full flex-col">
      <ConsoleMockupShellItem :order="0">
        <div class="flex min-h-16 items-center justify-between px-(--spacing-xl) pt-(--spacing-md)">
          <nav
            aria-label="Breadcrumb"
            class="flex items-center gap-(--spacing-xs) text-body-lg font-medium"
          >
            <span class="px-0.5 text-(--text-muted)">Applications</span>
            <i
              class="ai ai-chevron-right text-body-sm text-(--text-muted) rtl:-scale-x-100"
              aria-hidden="true"
            />
            <span class="px-0.5 text-(--text-default)">qa-p-app</span>
            <i
              class="ai ai-chevron-right text-body-sm text-(--text-muted) rtl:-scale-x-100"
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
              icon="ai ai-circle-fill"
            />
          </div>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <div class="flex items-center gap-(--spacing-xs) px-(--spacing-xl) pt-(--spacing-md)">
          <span
            v-for="item in TABS"
            :key="item.value"
            :data-active="item.value === tab || null"
            class="inline-flex h-8 items-center rounded-(--shape-control) px-3 text-body-sm font-semibold text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance data-active:bg-(--bg-contrast) data-active:font-bold data-active:text-(--text-contrast) motion-reduce:transition-none"
          >
            {{ item.label }}
          </span>
        </div>
      </ConsoleMockupShellItem>

      <div class="relative min-h-0 flex-1 overflow-hidden px-(--spacing-xl) pt-(--spacing-md)">
        <Transition
          mode="out-in"
          enter-from-class="opacity-0"
          enter-active-class="transition-opacity duration-moderate-02 ease-in-out motion-reduce:transition-none"
        >
          <div
            :key="tab"
            class="flex flex-col gap-(--spacing-md)"
          >
            <template v-if="tab === 'main-settings'">
              <fieldset
                class="m-0 flex min-w-0 gap-16 rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-14"
              >
                <div class="flex w-107.5 shrink-0 flex-col gap-(--spacing-xs)">
                  <div class="text-heading-md font-medium text-(--text-default)">General</div>
                  <div class="text-body-sm text-(--text-muted)">
                    Create an Application to deliver your content close to users.
                  </div>
                </div>
                <div class="flex w-full max-w-lg flex-col gap-(--spacing-xs)">
                  <FieldLabel required>Name</FieldLabel>
                  <Input
                    model-value="qa-p-app"
                    size="medium"
                    aria-label="Name"
                    disabled
                  />
                  <FieldDescription
                    >Give a unique and descriptive name to identify the
                    Application.</FieldDescription
                  >
                </div>
              </fieldset>

              <fieldset
                class="m-0 flex min-w-0 gap-16 rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-14"
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
                    class="flex items-start gap-(--spacing-sm) rounded-(--shape-control) border border-[color-mix(in_srgb,var(--primary)_32%,transparent)] bg-(--bg-surface-raised) p-(--spacing-md)"
                  >
                    <LegacySwitch
                      checked
                      disabled
                      class="mt-0.5"
                    />
                    <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                      <span class="text-label-lg text-(--text-default)">{{ module.label }}</span>
                      <span class="text-body-sm text-(--text-muted)">{{ module.description }}</span>
                      <span
                        v-if="module.locked"
                        class="mt-1 inline-flex w-fit items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-default) px-2 py-1 text-body-xs text-(--text-default)"
                      >
                        <i
                          class="ai ai-lock text-body-xs"
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
                      variant="outline"
                      size="medium"
                      icon="ai ai-shopping-cart"
                    />
                  </span>
                </div>
              </fieldset>
            </template>

            <div
              v-else
              class="overflow-hidden rounded-(--shape-control) border border-(--border-default)"
            >
              <div
                class="flex items-center gap-(--spacing-xs) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-sm)"
              >
                <div class="w-77">
                  <Input
                    model-value=""
                    size="medium"
                    placeholder="Search keywords..."
                    aria-label="Search keywords"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
                <span class="ms-auto inline-flex gap-(--spacing-xs)">
                  <IconButton
                    icon="ai ai-refresh"
                    variant="outline"
                    size="medium"
                    ariaLabel="Refresh"
                  />
                  <IconButton
                    icon="ai ai-download"
                    variant="outline"
                    size="medium"
                    ariaLabel="Export"
                  />
                  <IconButton
                    icon="ai ai-column"
                    variant="outline"
                    size="medium"
                    ariaLabel="Columns"
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
                      class="ai ai-chevron-down text-body-xs"
                      aria-hidden="true"
                    />
                    {{ row.cells['name'] }}
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
                      :label="row.cells['status']"
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
                    class="ai ai-chevrons-left rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                  <i
                    class="ai ai-chevron-left rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                  <span
                    class="inline-flex h-8 w-9 items-center justify-center rounded-(--shape-control) bg-(--bg-hover) text-(--text-default)"
                    >1</span
                  >
                  <i
                    class="ai ai-chevron-right rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                  <i
                    class="ai ai-chevrons-right rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                  <span
                    class="inline-flex h-8 w-16 items-center justify-between rounded-(--shape-control) border border-(--border-default) px-(--spacing-xs) text-(--text-default)"
                  >
                    50
                    <i
                      class="ai ai-chevron-down"
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    class="inline-flex h-8 w-9 items-center justify-center rounded-(--shape-control) bg-(--bg-hover) text-(--text-default)"
                    >1</span
                  >
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <ConsoleMockupShellItem :order="2">
        <div
          class="flex items-center gap-(--spacing-md) border-t border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xl) py-(--spacing-md)"
        >
          <span
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--bg-canvas)"
          >
            <i
              class="ai ai-circle-check text-body-lg text-(--text-muted)"
              aria-hidden="true"
            />
          </span>
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <span
              class="flex items-center gap-(--spacing-xs) text-body-sm font-medium text-(--text-default)"
            >
              Viewing a Ready version
              <Tag
                label="Ready"
                severity="success"
                size="small"
                icon="ai ai-circle-fill"
              />
              <span
                class="inline-flex items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-default) px-2 py-0.5 text-body-xs text-(--text-muted)"
              >
                <i
                  class="ai ai-lock text-body-xs"
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
          <span class="ms-auto inline-flex shrink-0 items-center gap-(--spacing-sm)">
            <Button
              label="New Version"
              variant="outline"
              size="small"
              icon="ai ai-plus"
            />
            <Button
              label="Deploy"
              variant="primary"
              size="small"
              icon="ai ai-cloud-upload"
            />
          </span>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>
