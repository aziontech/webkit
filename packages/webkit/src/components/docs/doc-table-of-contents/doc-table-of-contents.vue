<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import { buildRail, measureRail, RAIL_INDENT, RAIL_STROKE } from './toc-rail'

  /**
   * "On this page" rail. The rail is one svg path and the active marker a dash
   * cut from that same path, so it travels along the bends and cannot drift out
   * of register. Complementary groups are separate nav landmarks, not entries.
   */
  defineOptions({ name: 'DocTableOfContents', inheritAttrs: false })

  /** One entry in the rail. */
  export type DocTableOfContentsItem = {
    /** The heading's anchor id. */
    id: string
    /** The visible heading text. */
    text: string
    /** Heading level; 3 and deeper indent under the preceding level 2. */
    depth: number
  }

  /** One link in a complementary group below the outline. */
  export type DocTableOfContentsLink = {
    /** The visible link text. */
    label: string
    /** Where the link goes. */
    href: string
    /** Leading icon class, e.g. a `az az-github` glyph. */
    icon?: string
  }

  /** A complementary group: its overline and its links. */
  export type DocTableOfContentsGroup = {
    /** The group's overline label. */
    label: string
    /** The group's links, in the order they should read. */
    links: DocTableOfContentsLink[]
  }

  export interface DocTableOfContentsProps {
    /** The headings, in document order. */
    items?: DocTableOfContentsItem[]
    /** The id of the heading currently in view. */
    activeId?: string
    /** The rail's own heading. Empty uses the locale catalog (`On this page`). */
    title?: string
    /** Complementary groups rendered below the outline, in order. */
    groups?: DocTableOfContentsGroup[]
  }

  const props = withDefaults(defineProps<DocTableOfContentsProps>(), {
    items: () => [],
    activeId: '',
    title: '',
    groups: () => []
  })

  const emit = defineEmits<{
    /** Fired when a rail entry is activated. */
    select: [event: MouseEvent, item: DocTableOfContentsItem]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ docTableOfContents: en.docTableOfContents, common: en.common })
  const railTitle = computed(() => props.title || t('docTableOfContents.title'))

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-table-of-contents')

  const isExternal = (href: string) => /^[a-z]+:/i.test(href) || href.startsWith('//')

  const listEl = ref<HTMLElement | null>(null)
  const probeEl = ref<SVGPathElement | null>(null)
  const entryEls = ref<HTMLElement[]>([])

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

  function moveHighlight(index: number) {
    const list = listEl.value
    const anchor = entryEls.value[index]?.querySelector('a')
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

  function onListLeave(event: PointerEvent) {
    const related = event.relatedTarget as Node | null
    if (related && listEl.value?.contains(related)) return
    highlighting.value = false
  }

  const path = ref('')
  const height = ref(0)
  const spans = ref<Array<{ start: number; end: number }>>([])
  const total = ref(0)

  const railWidth = computed(() => {
    const deepest = props.items.reduce((max, item) => Math.max(max, item.depth), 2)
    return (deepest - 2) * RAIL_INDENT + RAIL_STROKE
  })

  const activeIndex = computed(() => props.items.findIndex((item) => item.id === props.activeId))

  const marker = computed(() => {
    const span = spans.value[activeIndex.value]
    if (!span || !total.value)
      return { strokeDasharray: `0 ${total.value || 1}`, strokeDashoffset: '0' }
    return {
      strokeDasharray: `${span.end - span.start} ${total.value}`,
      strokeDashoffset: `${-span.start}`
    }
  })

  function remeasure() {
    const list = listEl.value
    const probe = probeEl.value
    if (!list || !probe || !props.items.length) {
      path.value = ''
      return
    }
    const listTop = list.getBoundingClientRect().top
    entryEls.value.length = props.items.length
    const bands = entryEls.value.filter(Boolean).map((element, index) => {
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
    if (typeof globalThis.ResizeObserver === 'function' && listEl.value) {
      observer = new globalThis.ResizeObserver(() => remeasure())
      observer.observe(listEl.value)
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

  const HIGHLIGHT_CLASS =
    'pointer-events-none absolute z-0 rounded-(--shape-control) bg-(--bg-hover) transition-[top,left,width,height,opacity] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none'

  const ITEM_LINK_CLASS =
    'block w-full rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) pointer-coarse:min-h-11 pointer-coarse:content-center text-label-sm text-(--text-muted) no-underline ' +
    'transition-colors duration-moderate-01 ' +
    'ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) ' +
    'data-[active]:text-(--text-default) ' +
    'motion-reduce:transition-none'

  const LINK_CLASS =
    'flex w-full items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) pointer-coarse:min-h-11 text-label-sm ' +
    'text-(--text-muted) no-underline transition-colors ' +
    'duration-moderate-01 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-lg)"
  >
    <nav
      :aria-label="railTitle"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <p
        data-toc-title
        class="m-0 text-overline-xs text-(--text-muted)"
      >
        {{ railTitle }}
      </p>

      <div class="relative">
        <svg
          v-show="path"
          class="pointer-events-none absolute top-0 start-0 overflow-visible rtl:-scale-x-100"
          :width="railWidth"
          :height="height"
          aria-hidden="true"
        >
          <path
            ref="probeEl"
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
          :class="HIGHLIGHT_CLASS"
        />

        <ul
          ref="listEl"
          class="relative m-0 flex list-none flex-col p-0 ps-[17px]"
          @pointerleave="onListLeave"
        >
          <li
            v-for="(item, index) in items"
            :key="item.id"
            :ref="
              (element) => {
                if (element) entryEls[index] = element as HTMLElement
              }
            "
            :data-depth="item.depth"
            :data-active="item.id === activeId || null"
            class="flex data-[depth=3]:ps-(--spacing-xs)"
            @pointerenter="moveHighlight(index)"
            @focusin="moveHighlight(index)"
          >
            <a
              :href="`#${item.id}`"
              :aria-current="item.id === activeId ? 'location' : undefined"
              :data-active="item.id === activeId || null"
              :class="ITEM_LINK_CLASS"
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
            :href="safeHref(link.href) ?? undefined"
            :target="isExternal(link.href) ? '_blank' : undefined"
            :rel="isExternal(link.href) ? 'noreferrer' : undefined"
            :class="LINK_CLASS"
          >
            <i
              v-if="link.icon"
              :class="link.icon"
              class="shrink-0"
              aria-hidden="true"
            />
            {{ link.label
            }}<span
              v-if="isExternal(link.href)"
              class="sr-only"
              >{{ ` ${t('common.newTab')}` }}</span
            >
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
