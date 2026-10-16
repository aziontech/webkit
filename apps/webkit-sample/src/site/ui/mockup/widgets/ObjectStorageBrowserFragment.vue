<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import SplitButton from '@aziontech/webkit/split-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { authorAt } from '../../../../shared/lib/people'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ObjectStorageBrowserFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the assets folder is opened while it is, and left after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const BUCKET = 'edgeflow-site-assets'
  const MODIFIED = '4 months ago'

  const COLUMNS = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 as const },
    { accessorKey: 'size', header: 'Size' },
    { accessorKey: 'lastModified', header: 'Last Modified' }
  ]

  const ADD_TO_FILES = [
    { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
    { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
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
    icon: 'pi pi-folder'
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
    file('favicon.ico', '15 KB', 'pi pi-image'),
    file('index.html', '2.1 KB', 'pi pi-code'),
    file('manifest.json', '412 B', 'pi pi-database'),
    file('robots.txt', '64 B', 'pi pi-file')
  ]

  const ASSETS: Entry[] = [
    { name: '..', kind: 'parent', size: '-', icon: 'pi pi-folder-open' },
    file('index-B7xq2k1d.js', '148.2 KB', 'pi pi-code'),
    file('index-Cm4r9zLp.css', '21.6 KB', 'pi pi-code'),
    file('logo-9aW3eT0c.svg', '3.2 KB', 'pi pi-image'),
    file('vendor-D1f8sKqa.js', '412.9 KB', 'pi pi-code')
  ]

  const tableRows = (entries: Entry[]) => {
    let files = 0
    return entries.map((entry) => {
      const person = entry.kind === 'file' ? authorAt(files++) : null
      return {
        ...entry,
        id: entry.name,
        lastModified: person ? MODIFIED : '',
        author: person?.name ?? '',
        avatar: person?.avatar ?? ''
      }
    })
  }

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

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
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
    if (reduced) {
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
      <MockupPart :order="0">
        <CardBox :padded="false">
          <template #content>
            <TableRoot
              :data="rows"
              :columns="COLUMNS"
              row-key="id"
              :border="false"
            >
              <template #toolbar>
                <div class="flex w-full flex-col gap-(--spacing-sm)">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-edge-storage shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate text-heading-xxs text-(--text-default)">
                      {{ BUCKET }}
                    </span>
                  </div>

                  <InputText
                    model-value=""
                    size="large"
                    placeholder="Search in folder"
                    aria-label="Search in folder"
                    class="w-full"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </InputText>

                  <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                    <Breadcrumb
                      :items="crumbs"
                      class="min-w-0"
                    />
                    <span class="flex shrink-0">
                      <SplitButton
                        label="Add to files"
                        icon="pi pi-plus"
                        kind="primary"
                        size="medium"
                        :model="ADD_TO_FILES"
                      />
                    </span>
                  </div>
                </div>
              </template>

              <template #cell-name="{ value, row }">
                <div
                  :data-cursor="`row-${value}`"
                  class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
                >
                  <i
                    :data-kind="row.kind"
                    :class="row.icon"
                    class="shrink-0 text-body-lg text-(--text-muted) data-[kind=folder]:text-(--text-link)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ value }}</span>
                </div>
              </template>

              <template #cell-size="{ value }">
                <span class="text-(--text-muted)">{{ value }}</span>
              </template>

              <template #cell-lastModified="{ value, row }">
                <div
                  v-if="value"
                  class="flex min-w-0 items-center gap-(--spacing-xs)"
                >
                  <Avatar
                    :src="String(row.avatar)"
                    :alt="String(row.author)"
                    :label="String(row.author)"
                    size="small"
                    kind="square"
                  />
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                </div>
              </template>
            </TableRoot>
          </template>
        </CardBox>
      </MockupPart>

      <MockupCursor
        name="Rafael"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
