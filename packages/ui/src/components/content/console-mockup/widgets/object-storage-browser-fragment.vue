<script setup lang="ts">
  import { computed } from 'vue'

  import SplitButton from '../../../action/split-button/split-button.vue'
  import DataTable from '../../../data/data-table/data-table.vue'
  import Input from '../../../input/input/input.vue'
  import Breadcrumb from '../../../navigation/breadcrumb/breadcrumb.vue'
  import Avatar from '../../avatar/avatar.vue'
  import Card from '../../card/card.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'ObjectStorageBrowserFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the assets folder is opened while it is, and left after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const BUCKET = 'site-assets'
  const MODIFIED = '4 months ago'
  const AUTHORS = ['JD', 'JS', 'AM', 'SL']

  const COLUMNS = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 as const },
    { accessorKey: 'size', header: 'Size' },
    { accessorKey: 'lastModified', header: 'Last modified' }
  ]

  const ADD_TO_FILES = [
    { label: 'Upload file', value: 'upload', icon: 'az az-upload' },
    { label: 'Add folder', value: 'folder', icon: 'az az-folder-plus' }
  ]

  type Kind = 'parent' | 'folder' | 'file'

  interface Entry {
    name: string
    kind: Kind
    size: string
    icon: string
  }

  const folder = (name: string): Entry => ({
    name,
    kind: 'folder',
    size: '-',
    icon: 'az az-folder'
  })
  const file = (name: string, size: string, icon: string): Entry => ({
    name,
    kind: 'file',
    size,
    icon
  })

  const ROOT: Entry[] = [
    folder('assets/'),
    folder('images/'),
    file('favicon.ico', '15 KB', 'az az-image'),
    file('index.html', '2.1 KB', 'az az-code'),
    file('manifest.json', '412 B', 'az az-database'),
    file('robots.txt', '64 B', 'az az-file')
  ]

  const ASSETS: Entry[] = [
    { name: '..', kind: 'parent', size: '-', icon: 'az az-folder-open' },
    file('index-B7xq2k1d.js', '148.2 KB', 'az az-code'),
    file('index-Cm4r9zLp.css', '21.6 KB', 'az az-code'),
    file('logo-9aW3eT0c.svg', '3.2 KB', 'az az-image'),
    file('vendor-D1f8sKqa.js', '412.9 KB', 'az az-code')
  ]

  const tableRows = (entries: Entry[]) => {
    let files = 0
    return entries.map((entry) => {
      const author = entry.kind === 'file' ? (AUTHORS[files++ % AUTHORS.length] ?? '') : ''
      return {
        ...entry,
        id: entry.name,
        lastModified: author ? MODIFIED : '',
        author
      }
    })
  }

  type EntryRow = ReturnType<typeof tableRows>[number]

  const cellValue = (cell?: Record<string, unknown>) => String(cell?.['value'] ?? '')
  const cellRow = (cell?: Record<string, unknown>) => cell?.['row'] as EntryRow

  const ROOT_ROWS = tableRows(ROOT)
  const ASSETS_ROWS = tableRows(ASSETS)

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    opened: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'row-images/', x: 0.7, y: 0.6 }
  const ROW: MockupCursorTarget = { key: 'row-assets/', x: 0.5, y: 0.6 }
  const INSIDE: MockupCursorTarget = { key: 'row-..', x: 0.7, y: 0.6 }

  const REST = { cursor: IDLE, press: false, opened: false }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: ROW, forward: 160, back: 420 },
    { ...REST, cursor: ROW, press: true, forward: 620, back: 160 },
    { ...REST, cursor: ROW, press: true, opened: true, forward: 140, back: 220 },
    { ...REST, cursor: INSIDE, opened: true, forward: 360, back: 260 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const rows = computed(() => (frame.value.opened ? ASSETS_ROWS : ROOT_ROWS))

  const crumbs = computed(() =>
    frame.value.opened
      ? [
          { label: BUCKET, href: '0' },
          { label: 'assets/', href: '1' }
        ]
      : [{ label: BUCKET, href: '0' }]
  )
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:78%]"
    :active="active"
    :width="520"
    :mobile-width="460"
    stage-class="py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Alex"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem :order="0">
      <Card :padded="false">
        <template #default>
          <DataTable
            :data="rows"
            :columns="COLUMNS"
            row-key="id"
            :bordered="false"
          >
            <template #toolbar>
              <div class="flex w-full flex-col gap-(--spacing-sm)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="az az-object-storage shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 truncate text-heading-2xs text-(--text-default)">
                    {{ BUCKET }}
                  </span>
                </div>

                <Input
                  model-value=""
                  size="large"
                  placeholder="Search in folder"
                  aria-label="Search in folder"
                  class="w-full"
                >
                  <template #leading>
                    <i
                      class="az az-search"
                      aria-hidden="true"
                    />
                  </template>
                </Input>

                <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                  <Breadcrumb
                    :items="crumbs"
                    class="min-w-0"
                  />
                  <span class="flex shrink-0">
                    <SplitButton
                      label="Add to files"
                      icon="az az-plus"
                      variant="primary"
                      size="medium"
                      :items="ADD_TO_FILES"
                    />
                  </span>
                </div>
              </div>
            </template>

            <template #cell-name="cell">
              <div
                :data-cursor="`row-${cellValue(cell)}`"
                class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
              >
                <i
                  :data-type="cellRow(cell).kind"
                  :class="cellRow(cell).icon"
                  class="shrink-0 text-body-lg text-(--text-muted) data-[kind=folder]:text-(--text-link)"
                  aria-hidden="true"
                />
                <span class="truncate">{{ cellValue(cell) }}</span>
              </div>
            </template>

            <template #cell-size="cell">
              <span class="text-(--text-muted)">{{ cellValue(cell) }}</span>
            </template>

            <template #cell-lastModified="cell">
              <div
                v-if="cellValue(cell)"
                class="flex min-w-0 items-center gap-(--spacing-xs)"
              >
                <Avatar
                  :label="cellRow(cell).author"
                  size="small"
                  variant="square"
                />
                <span class="truncate text-body-sm text-(--text-muted)">{{ cellValue(cell) }}</span>
              </div>
            </template>
          </DataTable>
        </template>
      </Card>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
