<script setup lang="ts">
  import { computed, ref } from 'vue'

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
    class="flex h-full min-h-0 w-full justify-center gap-(--spacing-xl) overflow-hidden bg-(--bg-canvas) px-(--spacing-lg) lg:px-14"
  >
    <main
      ref="scroller"
      class="h-full w-full max-w-(--container-2xl) min-w-0 overflow-y-auto overscroll-contain py-(--spacing-xl) 2xl:max-w-(--container-3xl)"
    >
      <DocPageHeader
        :title="pageTitle"
        :description="pageDescription"
        :last-updated="pageUpdated"
        :breadcrumb="breadcrumb"
        :copyable="copyable"
        :source="source"
      />
      <div
        ref="body"
        class="pt-(--spacing-xs)"
      >
        <DocProse>
          <slot>
            <DocMarkdown :source="source" />
          </slot>
        </DocProse>
      </div>
      <div class="pt-(--spacing-xxl)">
        <DocPagination
          :previous="previous"
          :next="next"
        />
      </div>
    </main>
    <aside
      v-if="showToc && headings.length"
      class="hidden h-full w-[225px] shrink-0 overflow-y-auto overscroll-contain py-(--spacing-xl) lg:block"
    >
      <DocOnThisPage
        :items="headings"
        :active-id="activeId"
        :groups="tocGroups"
        @select="goToHeading"
      />
    </aside>
  </div>
</template>
