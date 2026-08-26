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
  import { computed, ref } from 'vue'

  import DocsAgentSetup from '../components/DocsAgentSetup.vue'
  import DocsLayout from '../components/DocsLayout.vue'
  import { AGENT_SETUP_TOC, agentSetupMarkdown } from '../lib/docs-agent-setup.js'
  import { useDocsCrumbNav } from '../lib/docs-crumb-nav.js'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'
  import { docsPageChrome } from '../lib/docs-pages.js'
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

  // A crumb is a real anchor, so the plain left click has to be taken into the app's own
  // router — otherwise stepping back up the trail reloads the whole SPA. Same split the
  // rail makes: modified clicks stay the browser's.
  const onCrumbNavigate = useDocsCrumbNav()

  // Trail and reading order come from the RAIL, like every MDX page's do (see
  // docs-pages.js). Typed out here they went stale the moment the tree changed: the trail
  // still said `Start` after that segment was retitled `Getting Started`, and `previous`
  // still called the home "Getting Started" after the rail stopped doing so.
  const CHROME = docsPageChrome('/site/docs/agent-setup')

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
      <!-- ONE Breadcrumb, and the DESIGN SYSTEM makes it responsive. Below 768 it renders
           the first crumb, an overflow dropdown holding the middle of the trail, and the
           current page — every step still reachable, in the width a phone has.

           It used to be TWO instances: the full trail from `md` up, and `crumbs.slice(-1)`
           below it. That threw the trail away exactly where the rail is also hidden, so a
           reader on a phone had the name of the page they were already on and no way back
           up — and it bypassed the collapse this component already ships. -->
      <!-- OPTICALLY COMPENSATED: the crumb is a hover pill with `px-(--spacing-xs)`, so
           left alone its LABEL starts 8px inside the column edge while the title below is
           flush with it — the trail reads indented against the whole page. The negative
           margin is exactly the pill's own padding, so the ink lands on the column edge
           and the hover surface keeps its 8px, bleeding into the gutter where there is
           nothing to collide with. -->
      <Breadcrumb
        :items="CHROME.crumbs"
        class="-ml-(--spacing-xs) min-w-0 flex-1"
        @navigate="onCrumbNavigate"
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
        :previous="CHROME.previous"
        :next="CHROME.next"
      />
    </div>

    <template #toc>
      <!-- Outline, then the complementary groups, then — at the FOOT of the column —
           the offer. The rail serves the page before it asks for anything, so the one
           commercial block on the screen is both the last thing in the order and the
           furthest thing from the reader's eye when they arrive. The wrapper claims
           the whole column (`flex-1`) so `mt-auto` has room to push against; the gap
           stays the floor between the two, for the case where a long outline fills it. -->
      <div class="flex flex-1 flex-col gap-(--spacing-xl)">
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
