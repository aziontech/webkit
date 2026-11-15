<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import SplitButton from '../../../actions/split-button/split-button.vue'
  import DataTable from '../../../data/data-table/data-table.vue'
  import Input from '../../../inputs/input/input.vue'
  import Breadcrumb from '../../../navigation/breadcrumb/breadcrumb.vue'
  import Avatar from '../../avatar/avatar.vue'
  import Card from '../../card/card.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import ShellMockup from '../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'ObjectStorageBrowserFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the assets folder is opened while it is, and left after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const BUCKET = 'site-assets'
  const MODIFIED = '4 months ago'
  const AUTHORS = ['JA', 'SR', 'AM', 'CL']

  const COLUMNS = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 as const },
    { accessorKey: 'size', header: 'Size' },
    { accessorKey: 'lastModified', header: 'Last Modified' }
  ]

  const ADD_TO_FILES = [
    { label: 'Upload file', value: 'upload', icon: 'ai ai-upload' },
    { label: 'Add folder', value: 'folder', icon: 'ai ai-folder-plus' }
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
    icon: 'ai ai-folder'
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
    file('favicon.ico', '15 KB', 'ai ai-image'),
    file('index.html', '2.1 KB', 'ai ai-code'),
    file('manifest.json', '412 B', 'ai ai-database'),
    file('robots.txt', '64 B', 'ai ai-file')
  ]

  const ASSETS: Entry[] = [
    { name: '..', kind: 'parent', size: '-', icon: 'ai ai-folder-open' },
    file('index-B7xq2k1d.js', '148.2 KB', 'ai ai-code'),
    file('index-Cm4r9zLp.css', '21.6 KB', 'ai ai-code'),
    file('logo-9aW3eT0c.svg', '3.2 KB', 'ai ai-image'),
    file('vendor-D1f8sKqa.js', '412.9 KB', 'ai ai-code')
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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hovered || !canHover.value)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const rows = computed(() => (frame.value.opened ? ASSETS_ROWS : ROOT_ROWS))

  const crumbs = computed(() =>
    frame.value.opened
      ? [
          { label: BUCKET, href: '0' },
          { label: 'assets/', href: '1' }
        ]
      : [{ label: BUCKET, href: '0' }]
  )

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced.value || !canHover.value) {
      step.value = target
      return
    }
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:78%]"
    :chrome="false"
    :active="active"
    :width="520"
    :mobile-width="460"
  >
    <div
      ref="stage"
      class="relative py-(--spacing-xs)"
    >
      <ShellMockupPart :order="0">
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
                      class="ai ai-edge-storage shrink-0 text-body-lg text-(--text-muted)"
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
                        class="ai ai-search"
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
                        icon="ai ai-plus"
                        kind="primary"
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
                    :data-kind="cellRow(cell).kind"
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
                    kind="square"
                  />
                  <span class="truncate text-body-sm text-(--text-muted)">{{
                    cellValue(cell)
                  }}</span>
                </div>
              </template>
            </DataTable>
          </template>
        </Card>
      </ShellMockupPart>

      <MockupCursor
        name="Alex"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
