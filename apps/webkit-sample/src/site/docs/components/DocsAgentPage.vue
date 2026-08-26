<script setup>
  // ONE AGENT'S setup page — the page a card on the index opens, and the page a reader
  // actually follows: install, token, connect, verify, then everything the connection
  // bought them.
  //
  // It is ONE component for all seven tools, not seven files. Every agent page is the same
  // page with a different tool in it — the same eight sections in the same order, the same
  // MCP server, the same prompts — and that sameness is the feature: a reader who has set
  // up Claude Code and comes back for Cursor already knows where "Troubleshooting" is. Seven
  // copies would have drifted into seven different pages within a month, and the reader
  // would have to re-learn the shape each time. What is genuinely per-tool lives in
  // docs-agent-pages.js, keyed by slug.
  //
  // COMPOSED IN VUE, not written as MDX, for the reason the index is: the closing "Other
  // agents" grid draws six other companies' real logos, which are inline SVG and therefore
  // a slot — and MDX has no slots. Everything else still comes from the layer: `DocSteps` /
  // `DocStep` for the walkthrough, `DocCodeGroup` for every snippet, `DocItemGroup` for the
  // tool and documentation rows, `DocPrompt` for prompts, `DocCallout` for tips,
  // `DocAccordionGroup` for the FAQ and the troubleshooting pairs, `DocCardGroup` for the
  // grid, and `DocMarkdown` for the copy that lives in data — so a sentence carrying
  // `azion deploy` renders the same inline code chip an MDX page would.
  import CopyButton from '@aziontech/webkit/copy-button'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import DocAccordionGroup from '@aziontech/webkit-docs/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit-docs/doc-accordion-item'
  import DocCallout from '@aziontech/webkit-docs/doc-callout'
  import DocCard from '@aziontech/webkit-docs/doc-card'
  import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'
  import DocCodeGroup from '@aziontech/webkit-docs/doc-code-group'
  import DocHeading from '@aziontech/webkit-docs/doc-heading'
  import DocItem from '@aziontech/webkit-docs/doc-item'
  import DocItemGroup from '@aziontech/webkit-docs/doc-item-group'
  import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
  import DocPagination from '@aziontech/webkit-docs/doc-pagination'
  import DocPrompt from '@aziontech/webkit-docs/doc-prompt'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import DocStep from '@aziontech/webkit-docs/doc-step'
  import DocSteps from '@aziontech/webkit-docs/doc-steps'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  import {
    AGENT_DOC_LINKS,
    agentContextFile,
    agentFaq,
    agentHeaderLinks,
    agentSteps,
    agentTips,
    agentTroubleshooting,
    BROWSER_PRIMER,
    CLI_SAMPLES,
    CONTEXT_EXAMPLE,
    MCP_SERVER_URL,
    MCP_TOOL_COLUMNS,
    MCP_TOOLS,
    SAMPLE_PROMPTS
  } from '../lib/docs-agent-pages.js'
  import {
    agentFacts,
    agentHref,
    COMPARE_TAG_SEVERITY,
    otherAgents
  } from '../lib/docs-agent-setup.js'

  const props = defineProps({
    // The row from `AGENTS` this page is about.
    agent: { type: Object, required: true },
    // The page before this one in reading order: { title, href }.
    previous: { type: Object, default: null },
    // The page after this one.
    next: { type: Object, default: null }
  })

  const steps = computed(() => agentSteps(props.agent))
  const tips = computed(() => agentTips(props.agent))
  const faq = computed(() => agentFaq(props.agent))
  const troubleshooting = computed(() => agentTroubleshooting(props.agent))
  const contextFile = computed(() => agentContextFile(props.agent))
  const others = computed(() => otherAgents(props.agent.slug))

  // ── The MCP tool table, on a phone ──────────────────────────────────────────
  //
  // The table is two columns: a 300px frozen name and a description that does not
  // wrap, so the row is 759px wide at every viewport and the reader scrolls it. That
  // is right on a laptop — the name stays pinned while the sentence slides under it —
  // and unusable at 390px, where 300px of a 356px viewport is the name and every
  // description costs a 403px horizontal drag.
  //
  // Below `sm` the row therefore STACKS: name on its own line with its copy control,
  // description wrapped underneath, no horizontal scroll at all. The stacking itself
  // is CSS on the wrapper, but the `width` cannot be — the DS applies a fixed column
  // width as an INLINE `flex: 0 0 300px !important` (table.vue), which no class can
  // outrank, and in a `flex-col` row that basis would become a 300px tall cell. So the
  // switch happens in the DATA: below `sm` the column drops both `width` and `frozen`
  // and the cell falls back to its `data-[grow]` weight, which the wrapper then
  // neutralises with `flex-none`.
  const compact = ref(false)
  let compactQuery = null
  const syncCompact = (event) => {
    compact.value = event.matches
    // Re-bind after the column set changes: the scroll viewport is a stable element
    // today, but the reference is cheap to refresh and a stale one would silently leave
    // the fade frozen on whatever it last read.
    nextTick(bindViewport)
  }

  const toolColumns = computed(() =>
    compact.value
      ? MCP_TOOL_COLUMNS.map(({ width: _width, frozen: _frozen, ...column }) => column)
      : MCP_TOOL_COLUMNS
  )

  // ── The frozen column's scroll-fade ─────────────────────────────────────────
  //
  // A frozen cell paints a 24px gradient off its right edge, and it is the only thing
  // that says "this column is pinned and the rest is sliding under it". It used to be
  // suppressed outright, because at rest it lands on the first word of every
  // description and dims it whether the table has been scrolled or not — a permanent
  // shadow to signal something that had not happened yet.
  //
  // Gating it on actual scroll keeps the signal and drops the shadow: at `scrollLeft:
  // 0` the gradient is transparent, and it fades in the moment the table moves. The
  // listener is passive and reads one number, so it costs nothing per frame.
  const toolTable = ref(null)
  const toolsScrolled = ref(false)
  let toolViewport = null
  const syncScrolled = () => {
    toolsScrolled.value = (toolViewport?.scrollLeft ?? 0) > 0
  }

  const bindViewport = () => {
    const next = toolTable.value?.querySelector('[data-testid="data-table__viewport"]') ?? null
    if (next === toolViewport) return syncScrolled()
    toolViewport?.removeEventListener('scroll', syncScrolled)
    toolViewport = next
    toolViewport?.addEventListener('scroll', syncScrolled, { passive: true })
    syncScrolled()
  }

  onMounted(() => {
    compactQuery = window.matchMedia('(max-width: 639.98px)')
    compact.value = compactQuery.matches
    compactQuery.addEventListener('change', syncCompact)
    bindViewport()
  })

  onBeforeUnmount(() => {
    compactQuery?.removeEventListener('change', syncCompact)
    toolViewport?.removeEventListener('scroll', syncScrolled)
  })
  const facts = computed(() => agentFacts(props.agent))
  const headerLinks = computed(() => agentHeaderLinks(props.agent))

  // `fileName`, not `label`: a single sample renders no tab strip, so the file name is the
  // only place the block can say WHICH file these five lines belong in — which is the whole
  // point of the section.
  const contextSample = computed(() => [
    { language: 'markdown', fileName: contextFile.value, code: CONTEXT_EXAMPLE }
  ])

  // Does a link leave the documentation. Same test `DocCard` and `DocItem` make, and the
  // reason both draw two different glyphs — so a bare `<a>` in a step reads the same way.
  const isExternal = (href) => /^(https?:)?\/\//.test(href)
</script>

<template>
  <article class="pb-12">
    <!-- The masthead's RULE bleeds and its CONTENT takes the column — the same split every
         other docs page makes (see DocsMdxPage).

         IT IS COMPOSED HERE, NOT `DocPageHeader`. That masthead is a column of title,
         deck and date, which is right for a prose page; this one is an identity card for a
         third-party product, and it has four things that page never has: the vendor's mark
         beside the title rather than above it, the maker's name as the title's own
         overline, the tool's facts as tags, and the references a reader might want INSTEAD
         of the four steps below. The type scale and the tokens are still the layer's.

         THE DATE IS GONE, and the link row took its place. "Last updated" answers a
         question a reader asks about PROSE — is this stale? — where this page's answer to
         "is this current?" is the config snippet itself, and the row of references is what
         a reader scanning the top actually wants. -->
    <div class="border-b border-(--border-default) pt-14">
      <header
        class="layout-column-docs layout-boundary-inline flex flex-col gap-(--spacing-md) pb-(--spacing-lg)"
      >
        <!-- THE MARK SITS IN A TILE, not loose on the page: a logo drawn straight onto the
             canvas at 24px reads as a bullet beside the title, where the same mark inside a
             bordered square reads as the product's own icon — and the tile gives seven marks
             of seven different aspect ratios one shared footprint, so the seven pages open
             identically. The maker is the title's OVERLINE, in `--primary`: it is the one
             line above the page's own name, so it takes the brand colour rather than
             competing with the title in the same ink.

             THE TILE MATCHES THE HEIGHT OF THE INFO BESIDE IT, AND IT IS 1:1. It was a
             fixed 48 centred against a block that measures 61.5 (an overline over a title),
             which left daylight above and below it and read as a badge parked next to the
             heading rather than as the heading's own adornment.

             It is a FIXED square per breakpoint, not a stretched one, because a stretched
             height cannot produce a square: `align-items: stretch` gives a flex item an
             INDEFINITE cross size, so `aspect-square` has nothing to transfer a width from
             and the tile came out 34×61.5 — measured, not guessed. So the square is sized
             to the block it stands beside: 56 against the 54 the mobile heading measures,
             64 against the 61.5 of `sm` and up. Both land inside 2.5px, which reads as
             flush; the two-line title a phone gives `GitHub Copilot` is the one case the
             tile does not track, and a 92px logo tile there would be the wrong answer
             anyway. The mark inside scales with the tile, keeping the reference's
             half-of-the-tile proportion.

             ON A PHONE THE TILE WRAPS ABOVE THE TITLE. Beside it, a 56px square plus the
             `--spacing-sm` gap leaves ~310px for a title set at `heading-2xl`, so
             `GitHub Copilot + Azion` broke into three lines in a column narrower than the
             one the rest of the page reads in. Stacked, the title gets the full measure
             and the mark reads as the page's opening mark rather than as a bullet the
             heading has to flow around. -->
        <div
          class="flex flex-col items-start gap-(--spacing-sm) sm:flex-row sm:items-center sm:gap-(--spacing-md)"
        >
          <span
            class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16 [&>svg]:size-7 sm:[&>svg]:size-8"
          >
            <AgentMark :name="agent.mark" />
          </span>
          <div class="min-w-0 flex-1">
            <span class="block text-overline-sm uppercase text-(--primary)">{{
              agent.vendor
            }}</span>
            <h1 class="m-0 text-heading-2xl text-(--text-default) sm:text-heading-xl">
              {{ agent.name }} + Azion
            </h1>
          </div>
        </div>

        <p class="m-0 text-body-md text-(--text-muted)">
          {{ agent.description }} Made by {{ agent.vendor }}.
        </p>

        <!-- The same four axes the comparison table ranks the tools on, as the same tag the
             table draws — so a reader arriving from that table sees their own row restated.
             Pill-shaped here: in a table cell a chip is a value, in a masthead it is a
             badge, and `medium` is Tag's largest step (24px against small's 20) — these sit
             under a page title with nothing competing for the room, where the table's chips
             have to fit a 32px cell. -->
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <Tag
            v-for="fact in facts"
            :key="fact"
            :label="fact"
            :severity="COMPARE_TAG_SEVERITY"
            size="medium"
            rounded
          />
        </div>

        <!-- Every one of these leaves the documentation, so every one carries the external
             arrow — and the dot between them is a separator, not a bullet: they are one
             line of references, not a list. -->
        <div class="flex flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-xxs)">
          <template
            v-for="(link, index) in headerLinks"
            :key="link.href"
          >
            <span
              v-if="index > 0"
              class="text-label-md text-(--text-muted)"
              aria-hidden="true"
              >·</span
            >
            <a
              :href="link.href"
              target="_blank"
              rel="noreferrer"
              class="group/link inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-flat) text-label-md text-(--text-muted) no-underline hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
            >
              {{ link.label }}
              <i
                class="pi pi-arrow-up-right text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          </template>
        </div>
      </header>
    </div>

    <DocProse class="layout-column-docs layout-boundary-inline pt-14">
      <!-- ══ Quick start ══════════════════════════════════════════════════════════
           Four steps, numbered by `DocSteps` from the document order rather than by hand.
           The token is a step of its own because it is the one thing a reader cannot do
           from their editor, and the step that fails silently when it is skipped: an
           unauthenticated MCP server connects and then answers nothing. -->
      <DocHeading
        id="quick-start"
        :level="2"
      >
        Quick start
      </DocHeading>

      <DocSteps>
        <DocStep
          v-for="step in steps"
          :key="step.key"
          :title="step.title"
        >
          <!-- The copy lives in data, so it is rendered THROUGH the layer's markdown — a
               step that says `claude mcp list` gets the inline code chip an MDX page would
               give it. The flush class is on the wrapper because DocProse pads a paragraph
               from the top and the step already pays that gap. -->
          <DocMarkdown
            v-if="step.body"
            :source="step.body"
            class="[&>*:first-child]:pt-0!"
          />

          <DocCodeGroup
            v-if="step.samples"
            :samples="step.samples"
          />

          <!-- A note that says something the snippet cannot: the one way this client
               differs from the other six. -->
          <DocCallout
            v-if="step.note"
            kind="warning"
            :label="step.note"
          />

          <!-- THE GLYPH SAYS WHERE THE LINK GOES, in the same vocabulary the rest of the
               layer uses: `pi-chevron-right` for a page inside the documentation (what
               `DocItem` draws on its rows), `pi-arrow-up-right` when the destination
               leaves it. The external arrow travels its own diagonal on hover where the
               chevron only nudges right — which is the difference the two glyphs are
               making visible. -->
          <p v-if="step.link">
            <a
              :href="step.link.href"
              :target="isExternal(step.link.href) ? '_blank' : '_self'"
              :rel="isExternal(step.link.href) ? 'noreferrer' : undefined"
              class="group/link inline-flex items-center gap-(--spacing-xxs)"
            >
              {{ step.link.label }}
              <i
                :class="
                  isExternal(step.link.href)
                    ? 'pi-arrow-up-right group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5'
                    : 'pi-chevron-right group-hover/link:translate-x-0.5'
                "
                class="pi text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          </p>

          <!-- The last step ends on something to paste, because a verification command
               proves the wiring and a prompt proves the point. -->
          <DocPrompt
            v-if="step.prompt"
            title="Try it"
            icon="pi pi-sparkles"
            >{{ step.prompt }}</DocPrompt
          >
        </DocStep>
      </DocSteps>

      <!-- ══ Azion platform access ════════════════════════════════════════════════ -->
      <DocHeading
        id="platform-access"
        :level="2"
      >
        Azion platform access
      </DocHeading>
      <p>
        Three layers, and a connected agent uses all three: the MCP server to look things up and
        create configuration, the CLI to build and deploy from your working copy, and a context file
        so it starts each session knowing your account.
      </p>

      <DocHeading
        id="mcp-server"
        :level="3"
      >
        MCP server
      </DocHeading>
      <p>
        One HTTP endpoint at <code>{{ MCP_SERVER_URL }}</code
        >, authenticated with your Personal Token. It exposes nine tools — six that read a corpus,
        three that write:
      </p>

      <!-- A TABLE, because the tool NAME is what the reader takes away — they will name it
           in a prompt — and a name in a frozen left column with a copy control beside it
           is a name they can lift without selecting text. The wrapper earns the prose
           rhythm (`data-doc-block`) and keeps the prose out of the table
           (`data-doc-chrome`), exactly as the index's comparison table does. -->
      <!-- THE FROZEN COLUMN'S SCROLL-FADE IS GATED ON SCROLL, not suppressed. The
           gradient is the only thing that says "this column is pinned and the rest is
           sliding under it", but at rest it dims the first word of every description —
           so it starts transparent and fades in the moment the viewport moves
           (`data-scrolled`, set from a passive scroll listener above).

           BELOW `sm` THE ROW STACKS. A 300px frozen name in a 356px viewport leaves 56px
           of description, so the phone gets no table chrome at all: the header row goes,
           the row becomes a column, and each cell takes the full width — name and copy
           control on one line, wrapped description under it, nothing to scroll
           sideways. The cells drop `flex-none` because with the inline width gone (see
           `toolColumns`) they would otherwise take their `data-[grow]` basis as a
           HEIGHT in a `flex-col` row, and the DS's width-defining `role=presentation`
           box drops `w-max` for `w-full` — at max-content it stays 459px wide (the
           longest description on one unbroken line) and the text never wraps, which is
           the whole point of stacking. -->
      <div
        ref="toolTable"
        data-doc-block
        data-doc-chrome
        :data-scrolled="toolsScrolled || null"
        class="[&_[data-frozen=start]]:after:opacity-0 [&_[data-frozen=start]]:after:transition-opacity [&_[data-frozen=start]]:after:duration-fast-02 [&_[data-frozen=start]]:after:ease-productive-entrance data-[scrolled]:[&_[data-frozen=start]]:after:opacity-100 motion-reduce:[&_[data-frozen=start]]:after:transition-none max-sm:[&_[role=presentation]]:w-full max-sm:[&_[role=rowgroup][data-frozen]]:hidden max-sm:[&_[role=row]]:flex-col max-sm:[&_[role=row]]:items-stretch max-sm:[&_[role=cell]]:w-full max-sm:[&_[role=cell]]:min-h-0 max-sm:[&_[role=cell]]:flex-none"
      >
        <Table
          :data="MCP_TOOLS"
          :columns="toolColumns"
          row-key="id"
          border
        >
          <!-- The name is a CODE CHIP, not plain text in a cell: it is a literal a reader
               types into a prompt, and the chip is what says so — the same bordered,
               tinted chip an inline `code` span takes in the prose above. The copy control
               closes the cell on the right, so nine rows put nine copy targets on one
               vertical line. -->
          <template #cell-title="{ row }">
            <span class="flex min-w-0 flex-1 items-center justify-between gap-(--spacing-xs)">
              <code
                class="min-w-0 truncate rounded-(--shape-flat) border border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-0.5 text-label-code-sm text-(--text-default)"
                >{{ row.title }}</code
              >
              <CopyButton
                :value="row.title"
                :aria-label="`Copy ${row.title}`"
                kind="transparent"
                size="small"
                class="shrink-0"
              />
            </span>
          </template>

          <!-- The DS renders a plain cell value inside a `truncate` span, which is
               right while the row is a row: the sentence is cut, and the scroll (now
               with its fade back) says there is more. Once the row stacks the cut has
               nothing behind it — there is no sideways scroll left to reveal the rest —
               so below `sm` the same span wraps instead. -->
          <template #cell-description="{ value }">
            <span class="min-w-0 flex-1 whitespace-normal sm:truncate">{{ value }}</span>
          </template>
        </Table>
      </div>

      <DocHeading
        id="azion-cli"
        :level="3"
      >
        Azion CLI
      </DocHeading>
      <p>
        Local builds, deploys and the product commands the API does not cover. Install it once and
        {{ agent.name }} runs it for you — the first <code>azion login</code> is interactive, so run
        that one yourself.
      </p>

      <DocCodeGroup :samples="CLI_SAMPLES" />

      <DocHeading
        id="agent-context"
        :level="3"
      >
        Agent context
      </DocHeading>
      <p>
        {{ agent.name }} reads <code>{{ contextFile }}</code> at the repository root before it
        answers. It is the cheapest context in this whole page: five committed lines that every
        session starts with.
      </p>

      <DocCodeGroup :samples="contextSample" />

      <!-- ══ Agent-friendly docs ══════════════════════════════════════════════════ -->
      <DocHeading
        id="agent-friendly-docs"
        :level="2"
      >
        Agent-friendly docs
      </DocHeading>
      <p>
        Token-efficient references an agent can fetch on its own, with no tool call and no token.
        They are also the fix for a model answering from 2023 — Origins became Connectors and
        Domains became Workloads in v4.
      </p>

      <DocItemGroup>
        <DocItem
          v-for="link in AGENT_DOC_LINKS"
          :key="link.title"
          :title="link.title"
          :icon="link.icon"
          :href="link.href"
          :target="link.target ?? '_self'"
        >
          {{ link.description }}
        </DocItem>
      </DocItemGroup>

      <p>No MCP support in the tool you are using? Prime it by hand, once per session:</p>

      <DocPrompt
        title="Any assistant"
        icon="pi pi-comment"
      >
        {{ BROWSER_PRIMER }}
      </DocPrompt>

      <!-- ══ Example prompts ══════════════════════════════════════════════════════ -->
      <DocHeading
        id="example-prompts"
        :level="2"
      >
        Example prompts
      </DocHeading>
      <p>
        Each of these exercises a different half of the connection — the documentation search, the
        CLI, the configuration it writes, the analytics API, the storage.
      </p>

      <DocPrompt
        v-for="prompt in SAMPLE_PROMPTS"
        :key="prompt"
      >
        {{ prompt }}
      </DocPrompt>

      <!-- ══ Tips ═════════════════════════════════════════════════════════════════
           `tip` is the one callout kind that carries no severity: these are shortcuts, not
           stakes, so they take the page's own surface and spend their emphasis on the
           glyph. -->
      <DocHeading
        id="tips"
        :level="2"
      >
        Tips
      </DocHeading>

      <!-- The copy comes from data, so it goes in through `label` rather than the slot:
           the prop renders as inline prose, so a tip naming `CLAUDE.md` or `azion deploy`
           gets the same code chip a paragraph would. A `DocMarkdown` here would put a
           block `<p>` inside the callout's own paragraph, which the browser un-nests. -->
      <DocCallout
        v-for="tip in tips"
        :key="tip"
        kind="tip"
        :label="tip"
      />

      <!-- ══ FAQ ══════════════════════════════════════════════════════════════════
           Accordions, and closed on arrival: three questions the reader may already know
           the answer to should not push Troubleshooting off the screen. -->
      <DocHeading
        id="faq"
        :level="2"
      >
        FAQ
      </DocHeading>

      <DocAccordionGroup>
        <DocAccordionItem
          v-for="entry in faq"
          :key="entry.question"
          :title="entry.question"
        >
          <DocMarkdown
            :source="entry.answer"
            class="[&>*:first-child]:pt-0!"
          />
        </DocAccordionItem>
      </DocAccordionGroup>

      <!-- ══ Troubleshooting ══════════════════════════════════════════════════════ -->
      <DocHeading
        id="troubleshooting"
        :level="2"
      >
        Troubleshooting
      </DocHeading>

      <DocAccordionGroup>
        <DocAccordionItem
          v-for="entry in troubleshooting"
          :key="entry.question"
          :title="entry.question"
        >
          <DocMarkdown
            :source="entry.answer"
            class="[&>*:first-child]:pt-0!"
          />
        </DocAccordionItem>
      </DocAccordionGroup>

      <!-- ══ Other agents ═════════════════════════════════════════════════════════
           THE SAME GRID THE INDEX OPENS WITH, minus this page. Same cards, same marks,
           same maker overlines — a reader who got here and decided this is not their tool
           should not have to go back a page to see the other six. -->
      <DocHeading
        id="other-agents"
        :level="2"
      >
        Other agents
      </DocHeading>

      <DocCardGroup :cols="3">
        <DocCard
          v-for="other in others"
          :key="other.slug"
          :title="other.name"
          :overline="other.vendor"
          :href="agentHref(other)"
        >
          <template #icon>
            <AgentMark :name="other.mark" />
          </template>
          {{ other.description }}
        </DocCard>
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
