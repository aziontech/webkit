<script setup>
  // Routed docs example: "Agent Setup", the page a reader lands on to connect their AI
  // coding agent to Azion. It uses the same shell and the same rail as the MDX reading
  // page — the difference is only in how its BODY is authored (see DocsAgentSetup).
  //
  // The rail is the layer's own: `DocOnThisPage` is presentation only, because the PAGE
  // owns the scroll container. So this view supplies the two things it cannot know —
  // `useScrollSpy` for which heading is in view, `scrollToHeading` for how to reach one
  // inside the column that actually scrolls — and hands the same reach function to every
  // heading's own anchor with `provideHeadingNav`, so a rail row and a heading link land
  // identically.
  //
  // The outline comes from `AGENT_SETUP_TOC`, the one list the page's own headings are
  // built from, so the rail cannot name a section the page does not have.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'
  import DocCta from '@aziontech/webkit-docs/doc-cta'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { scrollToHeading } from '@aziontech/webkit-docs/heading-scroll'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  import DocsAgentSetup from '../components/DocsAgentSetup.vue'
  import DocsLayout from '../components/DocsLayout.vue'
  import { AGENT_SETUP_TOC, agentSetupMarkdown } from '../lib/docs-agent-setup.js'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'
  import { docsRailGroups } from '../lib/docs-rail-groups.js'

  const HEADINGS = AGENT_SETUP_TOC

  // The rail's other half — the repository and the community, the same on every page —
  // with the edit link addressed to THIS page's markdown in the docs repository.
  const RAIL_GROUPS = docsRailGroups('src/content/docs/en/pages/start/agent-setup.mdx')

  const body = ref(null)
  const { activeId } = useScrollSpy(
    body,
    computed(() => HEADINGS)
  )

  // The shell's `<main>` is the scroll container — the docs top bar and both rails are
  // fixed around it — so it, not the window, is what gets scrolled.
  const scroller = () => body.value?.closest('main') ?? null

  const goToHeading = (event, item) => scrollToHeading(scroller(), body.value, item.id, event)

  provideHeadingNav(goToHeading)

  // THE RAIL STARTS AT THE PAGE'S TITLE, not at the top of its column — the outline is a
  // peer of the prose, so it opens level with the h1 it is an outline OF rather than level
  // with the page bar, where it would read as part of the breadcrumb. Measured rather than
  // typed: the distance is the page bar plus the masthead's opening step, neither of which
  // this view owns, and both change with the breakpoint.
  const rail = ref(null)
  const railOffset = ref(0)

  const railStyle = computed(() => ({ paddingTop: `${railOffset.value}px` }))

  /** Distance from the top of a scroll container's content to `element`. */
  const offsetWithin = (container, element) =>
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop

  const alignRail = () => {
    const heading = body.value?.querySelector('h1')
    const main = scroller()
    const column = rail.value?.parentElement
    if (!heading || !main || !column) return
    railOffset.value = Math.max(
      0,
      Math.round(offsetWithin(main, heading) - offsetWithin(column, rail.value))
    )
  }

  let observer = null

  onMounted(async () => {
    await nextTick()
    alignRail()
    if (typeof globalThis.ResizeObserver === 'function' && body.value) {
      observer = new globalThis.ResizeObserver(() => alignRail())
      observer.observe(body.value)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  // Reading order through the Start section, matching the rail's own order.
  const PREVIOUS = { title: 'Getting Started', href: '/site/docs' }
  const NEXT = { title: 'First deploy', href: '/site/docs/first-deploy' }

  const CRUMBS = [
    { label: 'Documentation', href: '/site/docs' },
    { label: 'Start', href: '/site/docs' },
    { label: 'Agent Setup', current: true }
  ]

  // The page is composed rather than written, so its markdown is BUILT from the same data
  // the body renders (see docs-agent-setup.js) — not typed out a second time to rot.
  const {
    actions: PAGE_ACTIONS,
    label: copyLabel,
    icon: copyIcon,
    copyPage,
    onPageAction
  } = useDocsPageActions(agentSetupMarkdown)
</script>

<template>
  <DocsLayout>
    <template #page-bar>
      <!-- Full trail from `md` up, the current page alone below it: the trail wraps
           rather than truncates, and a two-line trail would double a bar that is pinned
           for the whole scroll. -->
      <Breadcrumb
        :items="CRUMBS"
        class="hidden min-w-0 flex-1 md:inline-flex"
      />
      <Breadcrumb
        :items="CRUMBS.slice(-1)"
        class="min-w-0 flex-1 md:hidden"
      />
      <SplitButton
        :label="copyLabel"
        :icon="copyIcon"
        :model="PAGE_ACTIONS"
        kind="outlined"
        size="small"
        class="shrink-0"
        @click="copyPage"
        @item-click="onPageAction"
      />
    </template>

    <div ref="body">
      <DocsAgentSetup
        :previous="PREVIOUS"
        :next="NEXT"
      />
    </div>

    <template #toc>
      <!-- Outline, then the complementary groups, then — at the FOOT of the column —
           the offer. The rail serves the page before it asks for anything, so the one
           commercial block on the screen is both the last thing in the order and the
           furthest thing from the reader's eye when they arrive. The wrapper claims
           the whole column (`flex-1`) so `mt-auto` has room to push against; the gap
           stays the floor between the two, for the case where a long outline fills it. -->
      <div
        ref="rail"
        :style="railStyle"
        class="flex flex-1 flex-col gap-(--spacing-xl)"
      >
        <DocOnThisPage
          :items="HEADINGS"
          :active-id="activeId"
          :groups="RAIL_GROUPS"
          @select="goToHeading"
        />
        <DocCta
          class="mt-auto"
          label="Connect your agent and deploy your first application for free. No credit card required."
          primary-href="https://console.azion.com/signup"
          secondary-label="See our plans"
          secondary-href="https://www.azion.com/en/pricing/"
        />
      </div>
    </template>
  </DocsLayout>
</template>
