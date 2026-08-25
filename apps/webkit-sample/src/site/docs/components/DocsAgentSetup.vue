<script setup>
  // The Agent Setup page — a docs READING page that is also a DESIGNED OBJECT.
  //
  // It is the third shape in this sample, and it exists because the first two do not
  // cover it. `DocsHome` is a landing page: bands, a hero, no prose. `DocsMdxPage`
  // is prose an author types in one `.mdx` file. This page is prose with two things MDX
  // cannot express: a picker whose card set FILTERS, and cards whose glyph is another
  // company's real logo — an inline SVG, so a slot, and MDX has no slots.
  //
  // So the body is composed in Vue and EVERY BLOCK IN IT STILL COMES FROM THE LAYER:
  // `DocHeading` for the anchored h2s (the same component `DocMarkdown` renders, so this
  // page's headings behave identically to a prose page's — same anchor, same glyph, same
  // id for the rail to point at), `DocTabs` for the picker, `DocCardGroup` / `DocCard`
  // for the grid, `DocItemGroup` / `DocItem` for the resource rows, and `DocPrompt` for
  // the prompts. `DocProse` wraps the lot, so the leads and the headings take the page's
  // own type scale and rhythm rather than a set of classes typed here.
  //
  // THE PICKER IS TABS, NOT A ROW OF PILLS. The published page filters with a chip row,
  // which is the right control when filters combine — several at once, cleared
  // independently. These do not: a tool is a terminal agent or an IDE, never both, so the
  // choice is one-of-N and that is a tab strip. Using `DocTabs` also means the strip, the
  // underline and the whole keyboard model are the design system's.
  import DocCard from '@aziontech/webkit-docs/doc-card'
  import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'
  import DocHeading from '@aziontech/webkit-docs/doc-heading'
  import DocItem from '@aziontech/webkit-docs/doc-item'
  import DocItemGroup from '@aziontech/webkit-docs/doc-item-group'
  import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocPrompt from '@aziontech/webkit-docs/doc-prompt'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import DocTab from '@aziontech/webkit-docs/doc-tab'
  import DocTabs from '@aziontech/webkit-docs/doc-tabs'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'

  import {
    AGENT_FILTERS,
    AGENT_RESOURCES,
    AGENTS,
    BROWSER_PRIMER,
    SAMPLE_PROMPTS
  } from '../lib/docs-agent-setup.js'

  defineProps({
    // The page before this one in reading order: { title, href }.
    previous: { type: Object, default: null },
    // The page after this one.
    next: { type: Object, default: null }
  })

  // One pass over the filters, so a tab's grid is resolved once rather than each card
  // re-filtering the list. `All` is not a `kind` — it is the absence of one.
  const GRIDS = AGENT_FILTERS.map((filter) => {
    const agents = filter === 'All' ? AGENTS : AGENTS.filter((agent) => agent.kind === filter)
    return { filter, agents }
  })
</script>

<template>
  <!-- The docs MEASURE and the docs masthead, both from where the MDX page takes them,
       so the two reading pages open identically. -->
  <article class="layout-column-docs layout-boundary-inline pt-14 pb-12">
    <DocPageHeader
      title="Agent Setup"
      description="Connect your AI coding agent to Azion and ship straight from your editor or terminal."
      last-updated="2026-08-21"
      :copyable="false"
    />

    <DocProse class="pt-14">
      <!-- ══ Pick your tool ═══════════════════════════════════════════════════════ -->
      <DocHeading
        id="pick-your-tool"
        :level="2"
      >
        Pick your tool
      </DocHeading>
      <p>
        Select a tool for step-by-step setup: Azion MCP server, project context, and a verification
        prompt.
      </p>

      <DocTabs>
        <DocTab
          v-for="grid in GRIDS"
          :key="grid.filter"
          :title="grid.filter"
        >
          <DocCardGroup :cols="3">
            <DocCard
              v-for="agent in grid.agents"
              :key="agent.name"
              :title="agent.name"
              :overline="agent.overline"
              :href="agent.href"
            >
              <!-- Every card draws the vendor's own logo, so the region is the slot and
                   never the card's font-glyph `icon` prop: a stand-in glyph on one row
                   of seven reads as a different brand, not as a smaller one. -->
              <template #icon>
                <AgentMark :name="agent.mark" />
              </template>
              {{ agent.description }}
            </DocCard>
          </DocCardGroup>
        </DocTab>
      </DocTabs>

      <p>
        Another MCP-compatible tool? The
        <a href="#mcp-configuration">MCP Configuration Guide</a> covers more clients.
      </p>

      <!-- ══ Start in the browser ═════════════════════════════════════════════════
           The published page puts two buttons here and both carry the same long priming
           prompt inside their URL — so the reader is handed a prompt they cannot read.
           `DocPrompt` shows it instead, capped to four lines with the rest one press
           away, and hands it to whichever agent the reader already has open. -->
      <DocHeading
        id="start-in-the-browser"
        :level="2"
      >
        Start in the browser
      </DocHeading>
      <p>No editor needed — open a session already primed with Azion context:</p>

      <DocPrompt title="AI Assistant">
        {{ BROWSER_PRIMER }}
      </DocPrompt>

      <!-- ══ What your agent can use ══════════════════════════════════════════════ -->
      <DocHeading
        id="what-your-agent-can-use"
        :level="2"
      >
        What your agent can use
      </DocHeading>

      <DocItemGroup>
        <DocItem
          v-for="resource in AGENT_RESOURCES"
          :key="resource.title"
          :title="resource.title"
          :icon="resource.icon"
          :href="resource.href"
          :target="resource.target ?? '_self'"
        >
          {{ resource.description }}
        </DocItem>
      </DocItemGroup>

      <!-- ══ Prompts to try ═══════════════════════════════════════════════════════
           The bare shape: no description, because the heading and its lead have already
           said what these are, and three framed paragraphs of explanation would bury
           the three sentences the reader came for. -->
      <DocHeading
        id="prompts-to-try"
        :level="2"
      >
        Prompts to try
      </DocHeading>
      <p>
        Say one of these to a connected agent. Each exercises a different half of the connection —
        the documentation search, the CLI, and the configuration it writes.
      </p>

      <DocPrompt
        v-for="prompt in SAMPLE_PROMPTS"
        :key="prompt"
      >
        {{ prompt }}
      </DocPrompt>
    </DocProse>

    <DocPagination
      v-if="previous || next"
      :previous="previous"
      :next="next"
      class="pt-12"
    />
  </article>
</template>
