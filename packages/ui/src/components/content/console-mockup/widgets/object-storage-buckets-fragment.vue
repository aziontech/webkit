<script setup lang="ts">
  import { computed } from 'vue'

  import DataTable from '../../../data/data-table/data-table.vue'
  import Input from '../../../input/input/input.vue'
  import Card from '../../card/card.vue'
  import Tag from '../../tag/tag.vue'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'ObjectStorageBucketsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a search narrows the bucket list while it is, and clears after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const COLUMNS = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 as const },
    { accessorKey: 'access', header: 'Access' },
    { accessorKey: 'objects', header: 'Objects' },
    { accessorKey: 'size', header: 'Size' }
  ]

  const BUCKETS = [
    {
      id: 'azion-ui-docs-dev',
      name: 'azion-ui-docs-dev',
      access: 'Public',
      objects: 128,
      size: '412.6 MB'
    },
    {
      id: 'azion-assets-prod',
      name: 'azion-assets-prod',
      access: 'Public',
      objects: 4210,
      size: '18.4 GB'
    },
    { id: 'user-uploads', name: 'user-uploads', access: 'Private', objects: 902, size: '2.1 GB' }
  ]

  const cellValue = (cell?: Record<string, unknown>) => String(cell?.['value'] ?? '')

  interface Frame {
    focused: boolean
    search: string
    forward: number
    back: number
  }

  const typed = (search: string, forward: number) => ({
    focused: true,
    search,
    forward,
    back: 70
  })

  const FRAMES: Frame[] = [
    { focused: false, search: '', forward: 0, back: 0 },
    { focused: true, search: '', forward: 260, back: 200 },
    typed('a', 320),
    typed('as', 120),
    typed('ass', 120),
    typed('asse', 120),
    typed('asset', 120),
    typed('assets', 120),
    { focused: false, search: 'assets', forward: 620, back: 220 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const rows = computed(() =>
    BUCKETS.filter((bucket) => bucket.name.includes(frame.value.search.toLowerCase()))
  )

  const FIELD_RING_CLASS =
    'flex rounded-(--shape-control) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-focused:ring-2 data-focused:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:82%]"
    :active="active"
    :width="560"
    :mobile-width="500"
  >
    <div class="flex flex-col gap-(--spacing-sm) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <span
          :data-focused="frame.focused || null"
          :class="FIELD_RING_CLASS"
        >
          <Input
            :model-value="frame.search"
            size="medium"
            placeholder="Search buckets"
            aria-label="Search buckets"
            class="w-full"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </span>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <Card :padded="false">
          <template #default>
            <DataTable
              :data="rows"
              :columns="COLUMNS"
              row-key="id"
              paginated
              :page-size="8"
              :bordered="false"
            >
              <template #cell-name="cell">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="az az-object-storage shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ cellValue(cell) }}</span>
                </div>
              </template>

              <template #cell-access="cell">
                <Tag
                  :label="cellValue(cell)"
                  :severity="cellValue(cell) === 'Public' ? 'success' : 'neutral'"
                  size="medium"
                />
              </template>
            </DataTable>
          </template>
        </Card>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
