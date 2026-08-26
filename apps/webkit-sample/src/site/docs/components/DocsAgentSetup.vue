<script setup>
  // The Agent Setup INDEX — a docs reading page that is also a designed object, and the
  // door to seven setup pages.
  //
  // It is the third shape in this sample, and it exists because the first two do not cover
  // it. `DocsHome` is a landing page: bands, a hero, no prose. `DocsMdxPage` is prose an
  // author types in one `.mdx` file. This page is prose with three things MDX cannot
  // express: a picker whose card set FILTERS, cards whose glyph is another company's real
  // logo (an inline SVG, so a slot), and a comparison table that is the design system's
  // own `Table` rather than a markdown grid.
  //
  // So the body is composed in Vue and EVERY BLOCK IN IT STILL COMES FROM A PACKAGE:
  // `DocHeading` for the anchored h2/h3s (the same component `DocMarkdown` renders, so
  // this page's headings behave identically to a prose page's — same anchor, same glyph,
  // same id for the rail to point at), `DocTabs` for the picker, `DocCardGroup` /
  // `DocCard` for both grids — the agents, and the definitions that close the page — the
  // webkit `Table` and `Tag` for the comparison, `DocCallout` for the legend, and
  // `DocProse` around the lot so the leads and headings take the page's own type scale and
  // rhythm rather than a set of classes typed here.
  //
  // THE STRUCTURE IS THE REFERENCE'S: pick, compare, understand. A section that hands the
  // reader seven tools has to answer three questions in that order — which one is mine,
  // how do they differ, and what do these words mean — and each answer wants a different
  // object: a filtered grid, a table, and a grid of definitions. The per-tool instructions are
  // NOT here: they are a page each (see DocsAgentPage), because a reader who has chosen
  // Cursor should not scroll past six other tools' config files.
  //
  // THE PICKER IS TABS, NOT A ROW OF PILLS. Chips are the right control when filters
  // combine — several at once, cleared independently. These do not: a reader is in a
  // terminal or in an editor, so the choice is one-of-N and that is a tab strip. Using
  // `DocTabs` also means the strip, the underline and the whole keyboard model are the
  // design system's.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import SplitButton from '@aziontech/webkit/split-button'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import DocCallout from '@aziontech/webkit-docs/doc-callout'
  import DocCard from '@aziontech/webkit-docs/doc-card'
  import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'
  import DocHeading from '@aziontech/webkit-docs/doc-heading'
  import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import DocTab from '@aziontech/webkit-docs/doc-tab'
  import DocTabs from '@aziontech/webkit-docs/doc-tabs'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'

  import {
    AGENT_FILTERS,
    AGENT_SETUP_DESCRIPTION,
    agentHref,
    agentsByFilter,
    agentSetupMarkdown,
    COMPARE_COLUMNS,
    COMPARE_FLAGS,
    COMPARE_LEGEND,
    COMPARE_ROWS,
    COMPARE_TAG_SEVERITY,
    KEY_CONCEPTS,
    TRADEOFFS,
    WORKFLOW_TYPES
  } from '../lib/docs-agent-setup.js'
  import { useDocsCrumbNav } from '../lib/docs-crumb-nav.js'
  import { useDocsPageActions } from '../lib/docs-page-actions.js'

  defineProps({
    // The ancestor trail, current page last — derived from the rail by the view.
    crumbs: { type: Array, default: () => [] },
    // The page before this one in reading order: { title, href }.
    previous: { type: Object, default: null },
    // The page after this one.
    next: { type: Object, default: null }
  })

  // A crumb is a real anchor, so the plain left click has to be taken into the app's own
  // router — otherwise stepping back up the trail reloads the whole SPA. Same split the
  // rail makes: modified clicks stay the browser's.
  const onCrumbNavigate = useDocsCrumbNav()

  // The page is composed rather than written, so its markdown is BUILT from the same data
  // the body renders (see docs-agent-setup.js) — not typed out a second time to rot. It is
  // wired HERE rather than in the view because the control it drives is the masthead's.
  const {
    actions: PAGE_ACTIONS,
    label: copyLabel,
    icon: copyIcon,
    copyPage,
    onPageAction
  } = useDocsPageActions(agentSetupMarkdown)

  // One pass over the filters, so a tab's grid is resolved once rather than each card
  // re-filtering the list.
  const GRIDS = AGENT_FILTERS.map((filter) => ({ filter, agents: agentsByFilter(filter) }))

  // The three columns whose value is a word from a small vocabulary. One slot each, from
  // one list, because the cell is identical in all three: a Tag, so that two rows carrying
  // the same answer are visibly the same answer.
  const TAG_COLUMNS = ['pricing', 'model', 'context']
</script>

<template>
  <!-- The docs MEASURE and the docs masthead, both from where the MDX page takes them, so
       the two reading pages open identically. The COLUMN is carried by each block rather
       than by the article, because one thing on this page does not take it: the masthead's
       rule, which is the reading region's own edge. -->
  <article class="pb-12">
    <!-- The masthead's RULE bleeds, its CONTENT does not. A rule stopping at the column's
         inset reads as decoration under the title; run to the edge of the region it reads
         as the page's horizon, which is what every h2 below is subordinate to.

         THE TRAIL AND COPY PAGE ARE THE MASTHEAD'S, passed in for the reasons the MDX
         page passes them (see DocsMdxPage): this trail routes, and this page's action set
         is its own. They were a sticky bar of their own above the scroll. -->
    <div class="border-b border-(--border-default) pt-(--spacing-md)">
      <DocPageHeader
        class="layout-column-docs layout-boundary-inline"
        title="Agent Setup"
        :description="AGENT_SETUP_DESCRIPTION"
        last-updated="2026-08-26"
      >
        <template #breadcrumb>
          <Breadcrumb
            :items="crumbs"
            class="-ml-(--spacing-xs) min-w-0"
            @navigate="onCrumbNavigate"
          />
        </template>
        <template #actions>
          <SplitButton
            :label="copyLabel"
            :icon="copyIcon"
            :model="PAGE_ACTIONS"
            kind="outlined"
            class="shrink-0"
            @click="copyPage"
            @item-click="onPageAction"
          />
        </template>
      </DocPageHeader>
    </div>

    <DocProse class="layout-column-docs layout-boundary-inline pt-14">
      <!-- ══ Pick your agent ══════════════════════════════════════════════════════ -->
      <DocHeading
        id="pick-your-agent"
        :level="2"
      >
        Pick your agent
      </DocHeading>
      <p>Select an agent to get step-by-step setup instructions.</p>

      <DocTabs>
        <DocTab
          v-for="grid in GRIDS"
          :key="grid.filter"
          :title="grid.filter"
        >
          <DocCardGroup :cols="3">
            <DocCard
              v-for="agent in grid.agents"
              :key="agent.slug"
              :title="agent.name"
              :overline="agent.vendor"
              :href="agentHref(agent)"
            >
              <!-- Every card draws the vendor's own logo, so the region is the slot and
                   never the card's font-glyph `icon` prop: a stand-in glyph on one row of
                   seven reads as a different brand, not as a smaller one. The maker's name
                   is the overline on EVERY card, including the two where the title repeats
                   it — a grid where five cards open on a maker and two open on the title
                   has two rows of titles that do not line up. -->
              <template #icon>
                <AgentMark :name="agent.mark" />
              </template>
              {{ agent.description }}
            </DocCard>
          </DocCardGroup>
        </DocTab>
      </DocTabs>

      <p>
        Using something else that speaks MCP? The server is one HTTP endpoint — point your client at
        <code>mcp.azion.com</code> with a Personal Token and the nine tools show up.
      </p>

      <!-- ══ Compare agents ═══════════════════════════════════════════════════════
           A table, because the question this section answers is a scan across one row and
           down one column — which the cards above cannot serve at any width. It is the
           design system's own `Table` (data-driven, its first column frozen so a
           horizontal scroll never carries the row's name away), so a comparison in the
           docs and a resource list in the Console are one component to the reader.

           The wrapper is what earns it the prose rhythm (`data-doc-block`) and what keeps
           the prose OUT of it (`data-doc-chrome`): DocProse styles descendants, and a
           table full of `<a>` and `<code>` would otherwise take link ink and chip borders
           inside its cells. -->
      <DocHeading
        id="compare-agents"
        :level="2"
      >
        Compare agents
      </DocHeading>

      <div
        data-doc-block
        data-doc-chrome
      >
        <Table
          :data="COMPARE_ROWS"
          :columns="COMPARE_COLUMNS"
          row-key="id"
          border
        >
          <!-- The row's own name, with its mark — the same mark the card carried, so the
               reader recognizes the row from the grid they just left. It links to that
               tool's setup page: by this point the reader has usually decided, and the
               table is where they decide. -->
          <template #cell-agent="{ row }">
            <a
              :href="row.href"
              class="flex min-w-0 items-center gap-(--spacing-sm) text-label-md text-(--text-default) no-underline hover:underline"
            >
              <AgentMark
                :name="row.mark"
                class="size-4 shrink-0"
              />
              <span class="truncate">{{ row.agent }}</span>
            </a>
          </template>

          <!-- Yes/no columns — the three workflows and Open source — are one glyph pair:
               a check when the answer is yes, a minus when it is no. The minus matters as
               much as the check: an empty cell reads as data nobody filled in, where a
               minus reads as an answer. The word rides along for a screen reader, since a
               glyph alone is an empty cell to anyone not looking at it. -->
          <template
            v-for="column in COMPARE_FLAGS"
            :key="column"
            #[`cell-${column}`]="{ value }"
          >
            <i
              :class="value ? 'pi-check text-(--primary)' : 'pi-minus text-(--text-muted)'"
              class="pi text-label-md leading-none"
              aria-hidden="true"
            />
            <span class="sr-only">{{ value ? 'Yes' : 'No' }}</span>
          </template>

          <!-- The word columns: a Tag rather than bare text, so the vocabulary reads as a
               set of values and not as three columns of prose. ONE severity for all of
               them — a per-value colour turns a comparison into a recommendation (see
               COMPARE_TAG_SEVERITY). -->
          <template
            v-for="column in TAG_COLUMNS"
            :key="column"
            #[`cell-${column}`]="{ value }"
          >
            <Tag
              :label="value"
              :severity="COMPARE_TAG_SEVERITY"
              size="small"
            />
          </template>
        </Table>
      </div>

      <DocCallout kind="note">{{ COMPARE_LEGEND }}</DocCallout>

      <!-- ══ Understanding agents ═════════════════════════════════════════════════
           The words the two blocks above are written in. It closes the page rather than
           opening it: a reader who already knows what MCP is should not have to scroll
           past a glossary to reach the tool they came for. -->
      <DocHeading
        id="understanding-agents"
        :level="2"
      >
        Understanding agents
      </DocHeading>
      <p>Common types, concepts, and tradeoffs.</p>

      <DocHeading
        id="workflow"
        :level="3"
      >
        Workflow
      </DocHeading>

      <DocCardGroup :cols="2">
        <DocCard
          v-for="type in WORKFLOW_TYPES"
          :key="type.title"
          :title="type.title"
          :icon="type.icon"
          :label="type.description"
        />
      </DocCardGroup>

      <DocHeading
        id="key-concepts"
        :level="3"
      >
        Key concepts
      </DocHeading>

      <DocCardGroup :cols="2">
        <DocCard
          v-for="concept in KEY_CONCEPTS"
          :key="concept.title"
          :title="concept.title"
          :icon="concept.icon"
          :label="concept.description"
        />
      </DocCardGroup>

      <DocHeading
        id="common-tradeoffs"
        :level="3"
      >
        Common tradeoffs
      </DocHeading>

      <DocCardGroup :cols="2">
        <DocCard
          v-for="tradeoff in TRADEOFFS"
          :key="tradeoff.title"
          :title="tradeoff.title"
          :icon="tradeoff.icon"
          :label="tradeoff.description"
        />
      </DocCardGroup>
    </DocProse>

    <DocPagination
      v-if="previous || next"
      :previous="previous"
      :next="next"
      class="layout-column-docs layout-boundary-inline pt-12"
    />
  </article>
</template>
