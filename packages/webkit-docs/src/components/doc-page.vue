<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { provideHeadingNav } from '../lib/heading-nav'
  import { scrollToHeading } from '../lib/heading-scroll'
  import { collectHeadings, parseMdx } from '../lib/mdx'
  import { useScrollSpy } from '../lib/use-scroll-spy'
  import DocMarkdown from './doc-markdown.vue'
  import DocOnThisPage from './doc-on-this-page.vue'
  import DocPageHeader from './doc-page-header.vue'
  import DocPagination from './doc-pagination.vue'
  import DocProse from './doc-prose.vue'

  /**
   * A complete documentation page: masthead, body, previous / next, and the
   * "On this page" rail — laid out on the docs.azion.com measures (a 768px
   * column of prose beside a 225px rail).
   *
   * Give it `source` and it renders an MDX file end to end, deriving the title,
   * the deck and the rail from that one file. Give it the default slot instead
   * and it becomes the shell around hand-composed Vue.
   *
   * THE PAGE IS SPACED BY THE SAME SECTION STEP ITS PROSE USES: 56 to open, 48
   * to close (`pt-14` / `pb-12`, flat at every width — see `DocProse`). So the
   * column opens on 56 above the masthead, the body opens on 56 under it (the
   * masthead is a section, and the first thing after it starts a new one), the
   * previous/next pair is separated from the last section by the closing 48,
   * and the column ends on 48. The rail takes the same pair so its first entry
   * stays level with the title it annotates.
   */
  defineOptions({ name: 'DocPage' })

  interface Props {
    /** The page's MDX source. Frontmatter supplies the title and deck. */
    source?: string
    /** Title override; defaults to the frontmatter's. */
    title?: string
    /** Deck override; defaults to the frontmatter's. */
    description?: string
    /** Last-updated override; defaults to the frontmatter's `lastUpdated`. */
    lastUpdated?: string
    /** Ancestor trail, current page last. */
    breadcrumb?: Array<{ label: string; href?: string }>
    /** The page before this one. */
    previous?: { title: string; href: string } | null
    /** The page after this one. */
    next?: { title: string; href: string } | null
    /** Shows the Copy Page control in the masthead. */
    copyable?: boolean
    /** Shows the "On this page" rail. */
    showToc?: boolean
    /** Complementary groups below the rail's outline (repository, community). */
    tocGroups?: Array<{
      label: string
      links: Array<{ label: string; href: string; icon?: string }>
    }>
  }

  const props = withDefaults(defineProps<Props>(), {
    source: '',
    title: '',
    description: '',
    lastUpdated: '',
    breadcrumb: () => [],
    previous: null,
    next: null,
    copyable: true,
    showToc: true,
    tocGroups: () => []
  })

  defineSlots<{
    /** Hand-composed body, used instead of `source`. */
    default(): unknown
  }>()

  const body = ref<HTMLElement | null>(null)
  const scroller = ref<HTMLElement | null>(null)
  const header = ref<{ $el?: HTMLElement } | null>(null)

  /**
   * How far the rail is pushed down so it starts level with the page title.
   *
   * The rail is a peer of the PROSE, not of the breadcrumb above it: read from
   * the top of the masthead, "On this page" sits beside the trail and looks like
   * part of it. Starting it at the title's own line puts the outline beside the
   * thing it is an outline OF.
   *
   * The offset is measured, not hard-coded, because what sits above the title is
   * conditional — a page with no breadcrumb has nothing to clear, and a trail
   * that wraps has more. It lives inside the rail's scroll container, so it
   * collapses as the reader scrolls the rail instead of holding a permanent gap.
   */
  const railOffset = ref(0)

  const parsed = computed(() => parseMdx(props.source))
  const headings = computed(() => (props.source ? parsed.value.headings : collectHeadings([])))
  const pageTitle = computed(() => props.title || parsed.value.frontmatter.title || '')
  const pageDescription = computed(
    () => props.description || parsed.value.frontmatter.description || ''
  )
  const pageUpdated = computed(
    () => props.lastUpdated || parsed.value.frontmatter.lastUpdated || ''
  )

  const { activeId } = useScrollSpy(body, headings)

  const railStyle = computed(() => ({ paddingTop: `${railOffset.value}px` }))

  /** Re-measure where the title starts inside the masthead. */
  function alignRail() {
    const root = header.value?.$el
    const heading = root?.querySelector('h1')
    if (!root || !heading) {
      railOffset.value = 0
      return
    }
    railOffset.value = Math.round(
      heading.getBoundingClientRect().top - root.getBoundingClientRect().top
    )
  }

  let observer: ResizeObserver | null = null

  onMounted(async () => {
    await nextTick()
    alignRail()
    const root = header.value?.$el
    if (typeof globalThis.ResizeObserver === 'function' && root) {
      observer = new globalThis.ResizeObserver(() => alignRail())
      observer.observe(root)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  watch([pageTitle, () => props.breadcrumb, () => props.copyable], async () => {
    await nextTick()
    alignRail()
  })

  /** Take the reader to a heading, in the column that actually scrolls. */
  function goToHeading(event: MouseEvent, item: { id: string }) {
    scrollToHeading(scroller.value, body.value, item.id, event)
  }

  /**
   * Take the reader to a heading they clicked in the prose itself.
   *
   * `DocMarkdown` renders every heading as a real link to its own id — copyable,
   * keyboard-reachable, right-clickable — and asks the page how to follow it,
   * because the page is what owns the scroll container. So a heading and its
   * rail entry land the same way, and a modified click (new tab, copy link
   * address) is left to the browser.
   */
  provideHeadingNav((event: MouseEvent, item: { id: string }) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    goToHeading(event, item)
  })
</script>

<template>
  <div
    data-testid="doc-page"
    class="flex h-full min-h-0 w-full justify-center gap-(--spacing-xl) overflow-hidden bg-(--bg-canvas) px-(--layout-boundary-inline)"
  >
    <main
      ref="scroller"
      class="h-full w-full max-w-(--container-2xl) min-w-0 overflow-y-auto overscroll-contain pt-14 pb-12 2xl:max-w-(--container-3xl)"
    >
      <!-- The masthead closes on a rule, and the page is what draws it: the rule is
           the edge of the reading region, so it belongs to whatever element spans it.
           Here the column and the region are the same box, so the wrapper is bare. -->
      <div class="border-b border-(--border-default)">
        <DocPageHeader
          ref="header"
          :title="pageTitle"
          :description="pageDescription"
          :last-updated="pageUpdated"
          :breadcrumb="breadcrumb"
          :copyable="copyable"
          :source="source"
        />
      </div>
      <div
        ref="body"
        class="pt-14"
      >
        <DocProse>
          <slot>
            <DocMarkdown :source="source" />
          </slot>
        </DocProse>
      </div>
      <div class="pt-12">
        <DocPagination
          :previous="previous"
          :next="next"
        />
      </div>
    </main>
    <aside
      v-if="showToc && headings.length"
      class="hidden h-full w-[225px] shrink-0 overflow-y-auto overscroll-contain pt-14 pb-12 lg:block"
    >
      <div :style="railStyle">
        <DocOnThisPage
          :items="headings"
          :active-id="activeId"
          :groups="tocGroups"
          @select="goToHeading"
        />
      </div>
    </aside>
  </div>
</template>
