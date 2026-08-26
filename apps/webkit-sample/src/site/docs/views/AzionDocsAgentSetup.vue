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
  //
  // The trail and Copy page are the MASTHEAD's, not the shell's — they used to be a sticky
  // bar of their own above the scroll (see DocsAgentSetup).
  import DocCta from '@aziontech/webkit-docs/doc-cta'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { scrollToHeading } from '@aziontech/webkit-docs/heading-scroll'
  import { scrollParent } from '@aziontech/webkit-docs/scroll-parent'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, ref } from 'vue'

  import DocsAgentSetup from '../components/DocsAgentSetup.vue'
  import DocsLayout from '../components/DocsLayout.vue'
  import { AGENT_SETUP_TOC } from '../lib/docs-agent-setup.js'
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

  // The page scrolls its own column — the docs top bar and both rails are fixed around it —
  // so the scroll has to be issued on that column and not on the window. WHICH element it is
  // belongs to the shell: it wraps the page in the design system's `ScrollArea` inside the
  // `<main>` landmark, so this asks for the nearest scrolling ancestor rather than naming
  // either element. Same resolution the scroll-spy uses, so the rail lights the section a
  // click lands on.
  const scroller = () => scrollParent(body.value)

  const goToHeading = (event, item) => scrollToHeading(scroller(), body.value, item.id, event)

  provideHeadingNav(goToHeading)

  // Trail and reading order come from the RAIL, like every MDX page's do (see
  // docs-pages.js). Typed out here they went stale the moment the tree changed: the trail
  // still said `Start` after that segment was retitled `Getting Started`, and `previous`
  // still called the home "Getting Started" after the rail stopped doing so.
  const CHROME = docsPageChrome('/site/docs/agent-setup')
</script>

<template>
  <DocsLayout>
    <div ref="body">
      <DocsAgentSetup
        :crumbs="CHROME.crumbs"
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
