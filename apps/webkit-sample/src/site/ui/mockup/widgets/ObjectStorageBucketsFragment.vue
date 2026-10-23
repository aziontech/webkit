<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ObjectStorageBucketsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a search narrows the bucket list while it is, and clears after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const COLUMNS = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 as const },
    { accessorKey: 'access', header: 'Access' },
    { accessorKey: 'objects', header: 'Objects' },
    { accessorKey: 'size', header: 'Size' }
  ]

  const BUCKETS = [
    {
      id: 'webkit-storybook-dev',
      name: 'webkit-storybook-dev',
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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])

  const rows = computed(() =>
    BUCKETS.filter((bucket) => bucket.name.includes(frame.value.search.toLowerCase()))
  )

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
    class="[--mockup-fade-start:82%]"
    :chrome="false"
    :active="active"
    :width="560"
    :mobile-width="500"
  >
    <div class="flex flex-col gap-(--spacing-sm) py-(--spacing-xs)">
      <MockupPart :order="0">
        <span
          :data-focused="frame.focused || null"
          class="flex rounded-(--shape-elements) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-focused:ring-2 data-focused:ring-offset-2 motion-reduce:transition-none"
        >
          <InputText
            :model-value="frame.search"
            size="medium"
            placeholder="Search buckets"
            aria-label="Search buckets"
            class="w-full"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </span>
      </MockupPart>

      <MockupPart :order="1">
        <CardBox :padded="false">
          <template #content>
            <TableRoot
              :data="rows"
              :columns="COLUMNS"
              row-key="id"
              paginated
              :page-size="8"
              :border="false"
            >
              <template #cell-name="{ value }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="ai ai-edge-storage shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ value }}</span>
                </div>
              </template>

              <template #cell-access="{ value }">
                <Tag
                  :label="String(value)"
                  :severity="value === 'Public' ? 'success' : 'secondary'"
                  size="medium"
                />
              </template>
            </TableRoot>
          </template>
        </CardBox>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
