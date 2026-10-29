<script setup lang="ts">
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'

  interface Props {
    items?: unknown[]
    noun?: string
    icon?: string
    wrap?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    noun: 'items',
    icon: '',
    wrap: false
  })

  const rowRef = ref<HTMLElement | null>(null)
  const iconRef = ref<HTMLElement | null>(null)
  const measureRef = ref<HTMLElement | null>(null)
  const badgeRef = ref<HTMLElement | null>(null)

  const fitCount = ref(props.items.length)

  const shown = computed(() => props.items.slice(0, Math.max(1, fitCount.value)))
  const hiddenCount = computed(() => Math.max(0, props.items.length - Math.max(1, fitCount.value)))
  const summary = computed(() => `${props.items.length} ${props.noun}`)

  const measure = () => {
    const row = rowRef.value
    const ruler = measureRef.value
    if (props.wrap) {
      fitCount.value = props.items.length
      return
    }
    if (!row || !ruler) return
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0
    const iconWidth = iconRef.value ? iconRef.value.offsetWidth + gap : 0
    const available = row.clientWidth - iconWidth
    const ends = [...ruler.querySelectorAll('[data-item]')].map(
      (node) => (node as HTMLElement).offsetLeft + (node as HTMLElement).offsetWidth
    )
    if (!ends.length || ends[ends.length - 1] <= available) {
      fitCount.value = props.items.length
      return
    }
    const badgeWidth = (badgeRef.value?.offsetWidth ?? 0) + gap
    let count = 0
    while (count < ends.length && ends[count] + badgeWidth <= available) count += 1
    fitCount.value = Math.max(1, count)
  }

  let observer: ResizeObserver | null = null

  onMounted(() => {
    if (!rowRef.value) return
    observer = new ResizeObserver(measure)
    observer.observe(rowRef.value)
    measure()
  })

  watch(
    () => props.items,
    async () => {
      fitCount.value = props.items.length
      await nextTick()
      measure()
    }
  )

  onScopeDispose(() => observer?.disconnect())
</script>

<template>
  <span
    v-if="!items.length"
    class="text-body-sm text-(--text-muted)"
    >—</span
  >

  <span
    v-else
    ref="rowRef"
    class="relative flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <i
      v-if="icon"
      ref="iconRef"
      :class="icon"
      class="shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <span
      :data-wrap="wrap || null"
      class="flex min-w-0 items-center gap-(--spacing-xxs) data-wrap:flex-1 data-wrap:flex-wrap data-wrap:py-(--spacing-xxs) data-wrap:contain-inline-size"
    >
      <Tag
        v-for="(item, index) in shown"
        :key="index"
        severity="secondary"
        size="medium"
        rounded
        class="min-w-0 max-w-full"
      >
        <span class="min-w-0 truncate">{{ item }}</span>
      </Tag>
    </span>

    <span
      class="pointer-events-none invisible absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
    <span
      ref="measureRef"
      class="flex w-max items-center gap-(--spacing-xxs) whitespace-nowrap"
    >
      <span
        v-for="(item, index) in items"
        :key="index"
        data-item
        class="inline-flex"
      >
        <Tag
          :label="String(item)"
          severity="secondary"
          size="medium"
          rounded
        />
      </span>
      <span
        ref="badgeRef"
        class="inline-flex"
      >
        <Tag
          :label="`+${items.length}`"
          severity="secondary"
          size="small"
        />
      </span>
    </span>
    </span>

    <Popover
      v-if="hiddenCount"
      placement="bottom-start"
      width="small"
    >
      <Popover.Trigger @click.stop>
        <Tooltip :text="`Show all ${summary}`">
          <Tag
            :label="`+${hiddenCount}`"
            :aria-label="`Show all ${summary}`"
            severity="secondary"
            size="small"
            class="shrink-0 cursor-pointer"
          />
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content @click.stop>
        <div
          class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
        >
          <p class="text-label-sm text-(--text-muted)">
            {{ summary }}
          </p>
        </div>

        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <span
            v-for="(item, index) in items"
            :key="index"
            class="block truncate rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
            >{{ item }}</span
          >
        </div>
      </Popover.Content>
    </Popover>
  </span>
</template>
