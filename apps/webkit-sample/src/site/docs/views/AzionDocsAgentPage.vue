<script setup>
  // The routed setup page for ONE agent — `/site/docs/agent-setup/<slug>`, seven pages from
  // one route and one view, the same way every `.mdx` page comes from one route and
  // `AzionDocsPage`.
  //
  // The wiring is that view's, for the same reasons: the rail's `DocOnThisPage` is
  // presentation only, because the PAGE owns the scroll container, so this view supplies the
  // two things it cannot know — `useScrollSpy` for which heading is in view, and
  // `scrollToHeading` for how to reach one inside the column that actually scrolls — and
  // hands the same reach function to every heading's own anchor with `provideHeadingNav`, so
  // a rail row and a heading link land identically.
  //
  // The outline is `AGENT_PAGE_TOC`, one list for all seven pages, because all seven pages
  // have the same sections in the same order (see DocsAgentPage). The trail and the
  // previous/next pair are DERIVED FROM THE RAIL like every other docs page's (see
  // docs-pages.js): `docs-nav.js` generates one row per agent from the same `AGENTS` list
  // this page reads, so the tree cannot name a tool that has no page and the reading order
  // walks the seven in the order the index offers them.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'
  import DocCta from '@aziontech/webkit-docs/doc-cta'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { scrollToHeading } from '@aziontech/webkit-docs/heading-scroll'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import DocsAgentPage from '../components/DocsAgentPage.vue'
  import DocsLayout from '../components/DocsLayout.vue'
  import { AGENT_PAGE_TOC, agentPageMarkdown } from '../lib/docs-agent-pages.js'
  import { agentBySlug } from '../lib/docs-agent-setup.js'
  import { useDocsCrumbNav } from '../lib/docs-crumb-nav.js'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'
  import { docsPageChrome } from '../lib/docs-pages.js'
  import { docsRailGroups } from '../lib/docs-rail-groups.js'

  const route = useRoute()

  // The router refuses a slug with no agent behind it (see site.routes.js), so this is
  // always a row of `AGENTS` — but the fallback keeps a hand-typed URL from throwing during
  // the tick before the guard redirects.
  const slug = computed(() => String(route.params.agent ?? ''))
  const agent = computed(() => agentBySlug(slug.value) ?? null)

  const chrome = computed(() => docsPageChrome(route.path))

  // The rail's other half — the repository and the community, the same on every page — with
  // the edit link addressed to THIS page's markdown in the docs repository.
  const railGroups = computed(() =>
    docsRailGroups(`src/content/docs/en/pages/start/agent-setup/${slug.value}.mdx`)
  )

  const body = ref(null)
  const { activeId } = useScrollSpy(
    body,
    computed(() => AGENT_PAGE_TOC)
  )

  // The shell's `<main>` is the scroll container — the docs top bar and both rails are fixed
  // around it — so it, not the window, is what gets scrolled.
  const scroller = () => body.value?.closest('main') ?? null

  const goToHeading = (event, item) => scrollToHeading(scroller(), body.value, item.id, event)

  provideHeadingNav(goToHeading)

  // A crumb is a real anchor, so the plain left click has to be taken into the app's own
  // router — otherwise stepping back up the trail reloads the whole SPA. Same split the
  // rail makes: modified clicks stay the browser's.
  const onCrumbNavigate = useDocsCrumbNav()

  // The page is composed rather than written, so its markdown is BUILT from the same data
  // the body renders (see docs-agent-pages.js) — not typed out a second time to rot.
  const {
    actions: PAGE_ACTIONS,
    label: copyLabel,
    icon: copyIcon,
    copyPage,
    onPageAction
  } = useDocsPageActions(() => (agent.value ? agentPageMarkdown(agent.value) : ''))
</script>

<template>
  <!-- Keyed on the slug so a move between two agent pages REMOUNTS rather than re-renders.
       The body element, the scroll-spy observer and the heading nav are all bound to one
       page's DOM; re-rendering in place would leave the spy watching headings that have
       been replaced and the reader halfway down the previous tool's scroll — and the
       closing "Other agents" grid makes that move a common one. -->
  <DocsLayout :key="slug">
    <template #page-bar>
      <!-- ONE Breadcrumb, and the DESIGN SYSTEM makes it responsive. Below 768 it renders
           the first crumb, an overflow dropdown holding the middle of the trail, and the
           current page — every step still reachable, in the width a phone has.

           It used to be TWO instances: the full trail from `md` up, and `crumbs.slice(-1)`
           below it. That threw the trail away exactly where the rail is also hidden, so a
           reader on a phone had the name of the page they were already on and no way back
           up — and it bypassed the collapse this component already ships. -->
      <!-- OPTICALLY COMPENSATED: the crumb is a hover pill with `px-(--spacing-xs)`, so left
           alone its LABEL starts 8px inside the column edge while the title below is flush
           with it — the trail reads indented against the whole page. The negative margin is
           exactly the pill's own padding, so the ink lands on the column edge and the hover
           surface keeps its 8px, bleeding into the gutter where there is nothing to collide
           with. -->
      <Breadcrumb
        :items="chrome.crumbs"
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
      <DocsAgentPage
        v-if="agent"
        :agent="agent"
        :previous="chrome.previous"
        :next="chrome.next"
      />
    </div>

    <template #toc>
      <!-- Outline, then the complementary groups, then — at the FOOT of the column — the
           offer. The rail serves the page before it asks for anything, so the one commercial
           block on the screen is both the last thing in the order and the furthest thing
           from the reader's eye when they arrive. -->
      <div class="flex flex-1 flex-col gap-(--spacing-xl)">
        <DocOnThisPage
          :items="AGENT_PAGE_TOC"
          :active-id="activeId"
          :groups="railGroups"
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
