<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { buildRail, measureRail, RAIL_INDENT, RAIL_STROKE } from './toc-rail'

  /**
   * "On this page" rail. The rail is one svg path and the active marker a dash
   * cut from that same path, so it travels along the bends and cannot drift out
   * of register. Complementary groups are separate nav landmarks, not entries.
   */
  defineOptions({ name: 'DocOnThisPage', inheritAttrs: false })

  /** One entry in the rail. */
  export type DocTocItem = {
    /** The heading's anchor id. */
    id: string
    /** The visible heading text. */
    text: string
    /** Heading level; 3 and deeper indent under the preceding level 2. */
    depth: number
  }

  /** One link in a complementary group below the outline. */
  export type DocTocLink = {
    /** The visible link text. */
    label: string
    /** Where the link goes. */
    href: string
    /** Leading icon class, e.g. a `pi pi-github` glyph. */
    icon?: string
  }

  /** A complementary group: its overline and its links. */
  export type DocTocGroup = {
    /** The group's overline label. */
    label: string
    /** The group's links, in the order they should read. */
    links: DocTocLink[]
  }

  interface Props {
    /** The headings, in document order. */
    items?: DocTocItem[]
    /** The id of the heading currently in view. */
    activeId?: string
    /** The rail's own heading. */
    title?: string
    /** Complementary groups rendered below the outline, in order. */
    groups?: DocTocGroup[]
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    activeId: '',
    title: 'On this page',
    groups: () => []
  })

  const emit = defineEmits<{
    /** Fired when a rail entry is activated. */
    select: [event: MouseEvent, item: DocTocItem]
  }>()

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(
    () => (attrs['data-testid'] as string) ?? 'documentation-doc-on-this-page'
  )

  /** Whether a complementary link leaves the documentation (opens in a new tab). */
  const isExternal = (href: string) => /^[a-z]+:/i.test(href) || href.startsWith('//')

  const listRef = ref<HTMLElement | null>(null)
  const probeRef = ref<SVGPathElement | null>(null)
  const entryRefs = ref<HTMLElement[]>([])

  // One element moves between entries (instead of per-entry hover backgrounds), so
  // the highlight morphs down the outline like the NavigationMenu selector.
  const highlight = ref({ top: 0, left: 0, width: 0, height: 0 })
  const highlighting = ref(false)
  const highlightIndex = ref(-1)

  const highlightStyle = computed(() => ({
    top: `${highlight.value.top}px`,
    left: `${highlight.value.left}px`,
    width: `${highlight.value.width}px`,
    height: `${highlight.value.height}px`,
    opacity: highlighting.value ? '1' : '0'
  }))

  /** Move the highlight onto the entry at `index`, measuring its anchor box. */
  function moveHighlight(index: number) {
    const list = listRef.value
    const anchor = entryRefs.value[index]?.querySelector('a')
    if (!list || !anchor) return
    const listBox = list.getBoundingClientRect()
    const box = anchor.getBoundingClientRect()
    highlight.value = {
      top: box.top - listBox.top,
      left: box.left - listBox.left,
      width: box.width,
      height: box.height
    }
    highlighting.value = true
    highlightIndex.value = index
  }

  /** Hide the highlight only when the pointer leaves the list itself, not between entries. */
  function handleListLeave(event: PointerEvent) {
    const related = event.relatedTarget as Node | null
    if (related && listRef.value?.contains(related)) return
    highlighting.value = false
  }

  const path = ref('')
  const height = ref(0)
  const spans = ref<Array<{ start: number; end: number }>>([])
  const total = ref(0)

  /** Deepest level present, so the rail reserves exactly the width it needs. */
  const railWidth = computed(() => {
    const deepest = props.items.reduce((max, item) => Math.max(max, item.depth), 2)
    return (deepest - 2) * RAIL_INDENT + RAIL_STROKE
  })

  const activeIndex = computed(() => props.items.findIndex((item) => item.id === props.activeId))

  /**
   * The active dash: dasharray sets the lit length, dashoffset where along the
   * path it starts — transitioning both is what makes the marker travel.
   */
  const marker = computed(() => {
    const span = spans.value[activeIndex.value]
    if (!span || !total.value)
      return { strokeDasharray: `0 ${total.value || 1}`, strokeDashoffset: '0' }
    return {
      strokeDasharray: `${span.end - span.start} ${total.value}`,
      strokeDashoffset: `${-span.start}`
    }
  })

  /**
   * Re-measure the entries and rebuild the path: on mount, outline change, and
   * resize — a narrow rail wraps a heading onto two lines, moving every band below.
   */
  function remeasure() {
    const list = listRef.value
    const probe = probeRef.value
    if (!list || !probe || !props.items.length) {
      path.value = ''
      return
    }
    const listTop = list.getBoundingClientRect().top
    // Function refs keep entries from a longer previous outline; trim to the
    // current items, or the length check below would freeze the rail.
    entryRefs.value.length = props.items.length
    const bands = entryRefs.value.filter(Boolean).map((element, index) => {
      const box = element.getBoundingClientRect()
      return {
        top: box.top - listTop,
        bottom: box.bottom - listTop,
        depth: props.items[index]?.depth ?? 2
      }
    })
    if (bands.length !== props.items.length) return

    const { commands, boundaries } = buildRail(bands)
    const measured = measureRail(probe, commands, boundaries)
    path.value = commands.join(' ')
    spans.value = measured.bands
    total.value = measured.total
    height.value = bands[bands.length - 1].bottom
    if (highlighting.value) moveHighlight(highlightIndex.value)
  }

  let observer: ResizeObserver | null = null

  onMounted(async () => {
    await nextTick()
    remeasure()
    if (typeof globalThis.ResizeObserver === 'function' && listRef.value) {
      observer = new globalThis.ResizeObserver(() => remeasure())
      observer.observe(listRef.value)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  watch(
    () => props.items,
    async () => {
      await nextTick()
      remeasure()
    }
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-lg)"
  >
    <nav
      :aria-label="title"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <!-- data-toc-title marks the rail's first line: the stable box a docs shell
           measures to align the rail against the page bar beside it. -->
      <p
        data-toc-title
        class="m-0 text-overline-xs text-(--text-muted)"
      >
        {{ title }}
      </p>

      <div class="relative">
        <svg
          v-show="path"
          class="pointer-events-none absolute top-0 left-0 overflow-visible"
          :width="railWidth"
          :height="height"
          aria-hidden="true"
        >
          <!-- Ruler: rendered but never painted, so measuring never flickers the rail. -->
          <path
            ref="probeRef"
            fill="none"
            stroke="none"
          />
          <path
            :d="path"
            :stroke-width="RAIL_STROKE"
            class="fill-none stroke-(--border-default)"
          />
          <path
            :data-testid="`${testId}__marker`"
            :d="path"
            :stroke-width="RAIL_STROKE"
            stroke-linecap="round"
            :style="marker"
            class="fill-none stroke-(--primary) transition-[stroke-dasharray,stroke-dashoffset] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          />
        </svg>

        <span
          aria-hidden="true"
          :data-testid="`${testId}__highlight`"
          :style="highlightStyle"
          class="pointer-events-none absolute z-0 rounded-(--shape-elements) bg-(--bg-hover) transition-[top,left,width,height,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        />

        <ul
          ref="listRef"
          class="relative m-0 flex list-none flex-col p-0 pl-[17px]"
          @pointerleave="handleListLeave"
        >
          <li
            v-for="(item, index) in items"
            :key="item.id"
            :ref="
              (element) => {
                if (element) entryRefs[index] = element as HTMLElement
              }
            "
            :data-depth="item.depth"
            :data-active="item.id === activeId || null"
            class="flex data-[depth=3]:pl-(--spacing-xs)"
            @pointerenter="moveHighlight(index)"
            @focusin="moveHighlight(index)"
          >
            <a
              :href="`#${item.id}`"
              :aria-current="item.id === activeId ? 'location' : undefined"
              :data-active="item.id === activeId || null"
              class="block w-full rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted) no-underline transition-colors duration-moderate-01 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) data-[active]:text-(--text-default) motion-reduce:transition-none"
              @click="emit('select', $event, item)"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <nav
      v-for="group in groups"
      :key="group.label"
      :aria-label="group.label"
      :data-testid="`${testId}__group`"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <p class="m-0 text-overline-xs text-(--text-muted)">{{ group.label }}</p>

      <ul class="m-0 flex list-none flex-col p-0">
        <li
          v-for="link in group.links"
          :key="link.href"
          class="flex"
        >
          <a
            :href="link.href"
            :target="isExternal(link.href) ? '_blank' : undefined"
            :rel="isExternal(link.href) ? 'noreferrer' : undefined"
            class="flex w-full items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted) no-underline transition-colors duration-moderate-01 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
          >
            <i
              v-if="link.icon"
              :class="link.icon"
              class="shrink-0"
              aria-hidden="true"
            />
            {{ link.label }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
