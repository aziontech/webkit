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
  // docs-pages.js) — and the trail and Copy page are the MASTHEAD's, not the shell's, where
  // they used to sit in a sticky bar of their own (see DocsAgentPage): `docs-nav.js` generates one row per agent from the same `AGENTS` list
  // this page reads, so the tree cannot name a tool that has no page and the reading order
  // walks the seven in the order the index offers them.
  import DocCta from '@aziontech/webkit-docs/doc-cta'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { scrollToHeading } from '@aziontech/webkit-docs/heading-scroll'
  import { scrollParent } from '@aziontech/webkit-docs/scroll-parent'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import DocsAgentPage from '../components/DocsAgentPage.vue'
  import DocsLayout from '../components/DocsLayout.vue'
  import { AGENT_PAGE_TOC } from '../lib/docs-agent-pages.js'
  import { agentBySlug } from '../lib/docs-agent-setup.js'
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

  // The page scrolls its own column — the docs top bar and both rails are fixed around it —
  // so the scroll has to be issued on that column and not on the window. WHICH element it is
  // belongs to the shell: it wraps the page in the design system's `ScrollArea` inside the
  // `<main>` landmark, so this asks for the nearest scrolling ancestor rather than naming
  // either element. Same resolution the scroll-spy uses, so the rail lights the section a
  // click lands on.
  const scroller = () => scrollParent(body.value)

  const goToHeading = (event, item) => scrollToHeading(scroller(), body.value, item.id, event)

  provideHeadingNav(goToHeading)
</script>

<template>
  <!-- Keyed on the slug so a move between two agent pages REMOUNTS rather than re-renders.
       The body element, the scroll-spy observer and the heading nav are all bound to one
       page's DOM; re-rendering in place would leave the spy watching headings that have
       been replaced and the reader halfway down the previous tool's scroll — and the
       closing "Other agents" grid makes that move a common one. -->
  <DocsLayout :key="slug">
    <div ref="body">
      <DocsAgentPage
        v-if="agent"
        :agent="agent"
        :crumbs="chrome.crumbs"
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
