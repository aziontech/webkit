import {
  CodeBlock,
  GroupHeader,
  PageContainer,
  PageHeader,
  PageSection
} from '../../../../foundations/components/layout/index.js'
import TokenPanel from '../../../../foundations/components/TokenPanel.vue'
import TokenTable from '../../../../foundations/components/TokenTable.vue'
import { layoutFamilies } from '../../../../foundations/data/layout.js'

// The four container types, in the order a product meets them: the widest first.
const CONTAINERS = [
  {
    class: 'layout-column',
    type: 'Data',
    token: '--layout-measure',
    use: 'Lists and detail dashboards.',
    why: 'Capped so a table running to the viewport edge on an ultrawide screen does not put its row actions a head-turn away from the name that identifies the row — but no tighter, because more columns visible is the point.'
  },
  {
    class: 'layout-column-focused',
    type: 'Focused',
    token: '--layout-measure-focused',
    use: 'Home, and any single-task page that still goes multi-column.',
    why: 'One task, but the task is a rail plus a card grid — wide enough for those bands to breathe, and no wider.'
  },
  {
    class: 'layout-column-form',
    type: 'Form',
    token: '--layout-measure-form',
    use: 'Settings and in-page edit forms.',
    why: 'A single stacked column of fields. Past ~1200px the extra width lands entirely inside the controls: a label sits at the far left of the row from the input it names, and the eye travels the whole measure to pair them.'
  },
  {
    class: 'layout-form-create',
    type: 'Create',
    token: '--layout-measure-form-create',
    use: 'A dedicated create page — sidebar hidden, sticky action bar.',
    why: 'A sibling of the form measure rather than the same class, because it also retunes --layout-measure-control (256px → 472px) for every field row inside it. Home is focused too, but it has no field rows to retune.'
  }
]

const measureTokens = Object.fromEntries(
  layoutFamilies
    .find((family) => family.title === 'Measure')
    .tokens.map((token) => [token.name, token])
)
const widestMeasure = Math.max(...Object.values(measureTokens).map((token) => token.px ?? 0))

const CONTAINER_ROWS = CONTAINERS.map((container) => ({
  ...container,
  name: container.class,
  tailwind: container.class,
  css: `var(${container.token})`,
  raw: measureTokens[container.token].raw,
  scale: (measureTokens[container.token].px / widestMeasure) * 100 + '%'
}))

const PAGE_SHAPE = `<!-- Every page: one column class, one parent section, bands inside it. -->
<div class="layout-column layout-boundary flex min-w-0 flex-col">
  <PageHeading />

  <!-- The ONE element below the heading. Carries the boundary step as a margin,
       and spaces the sections inside it with the section gap. -->
  <section class="layout-section-start flex flex-col gap-(--layout-section-gap)">
    <!-- Each band spaces its own parts with the group gap: its title over its
         card, its controls over the table they narrow. -->
    <section class="flex flex-col gap-(--layout-group-gap)">…</section>
    <form    class="flex flex-col gap-(--layout-group-gap)">…</form>
  </section>
</div>`

const BOUNDARY_SHAPE = `<!-- A padded page gets the boundary from the app shell, OUTSIDE the capped block -->
<div class="layout-boundary overflow-auto">        <!-- the scroll box -->
  <main class="layout-column">…</main>             <!-- 1620px of CONTENT -->
</div>

<!-- A self-padded page carries both on the SAME block. box-sizing makes the cap
     swallow the inset, so the cap grows by exactly the inset it now contains —
     and both shapes resolve to the same content column at every viewport. -->
<main class="layout-column layout-boundary">…</main>

<!-- A sticky action bar takes the inline half only: its py is a bar height, not a
     page boundary. Same column class, so its buttons sit on the same axis as the
     form they submit. -->
<footer class="layout-column-form layout-boundary-inline sticky bottom-0">…</footer>`

export default {
  title: 'Foundations/Design Tokens/Responsive/Layout',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The container system: how far content sits from the app chrome (BOUNDARY), how far things sit from each other (RHYTHM), and how wide a reading column may get (MEASURE). Four container types, two rhythm steps, one boundary — every value derived from the spacing and container scales rather than restating a length.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Overview = {
  name: 'Overview',
  parameters: {
    docs: {
      description: {
        story:
          'Pick a container type by what the page is, not by what it looks like. The unit that picks it is the BAND, not the file: a tabbed module whose tab bar is second-level navigation is several pages in one route, and a tab showing a table is measured as data even when the tab beside it is a form.'
      }
    }
  },
  render: () => ({
    components: {
      PageContainer,
      PageHeader,
      PageSection,
      CodeBlock,
      GroupHeader,
      TokenPanel,
      TokenTable
    },
    data() {
      return {
        CONTAINER_ROWS,
        layoutFamilies,
        PAGE_SHAPE,
        BOUNDARY_SHAPE
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Layout">
          Three decisions, expressed once: how far content sits from the app chrome
          (<strong>boundary</strong>), how far things sit from each other (<strong>rhythm</strong>), and how
          wide a reading column may get (<strong>measure</strong>). Every value is a
          <code>var()</code> reference to the spacing or container scale, never a literal length — which is
          how the layout system stays responsive without a single media query of its own.
        </PageHeader>

        <!-- ── The four container types ── -->
        <PageSection title="Container types">
          <template #description>
            Every page carries exactly one of these. Full-bleed is the absence of all four, never a
            <code>w-full</code>. Within one band the class is the same everywhere it must align — the
            scrolling body <em>and</em> its sticky action bar — or the footer's buttons drift right of the
            form they submit.
          </template>

          <TokenTable :rows="CONTAINER_ROWS">
            <template #sample="{ row }">
              <span class="flex w-(--container-xs) min-w-0 flex-col gap-(--spacing-xxs)" :title="row.why">
                <span class="text-label-md text-(--text-default)">{{ row.type }}</span>
                <span class="block h-2 w-full rounded-full bg-(--bg-surface-raised)">
                  <span class="block h-full rounded-full bg-(--accent)" :style="{ width: row.scale }" />
                </span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ row.use }}</span>
              </span>
            </template>
          </TokenTable>
        </PageSection>

        <!-- ── The page shape ── -->
        <PageSection title="The page shape">
          <template #description>
            Three levels, each owning one decision: the boundary sets the page's top inset, the parent
            section spaces the sections inside it, and each of those spaces its own parts. The page stack
            itself never carries a vertical gap — it holds the heading and one element below it. Every page
            carries the parent section whether it holds one section or seven, so the shape is the same to
            read and a second section needs no rework.
          </template>
          <CodeBlock :content="PAGE_SHAPE" language="html" />
        </PageSection>

        <!-- ── The boundary is not part of the measure ── -->
        <PageSection title="The boundary is not part of the measure">
          <template #description>
            A measure describes <em>content</em> width — that is the one job it has. So when a page carries
            its own boundary on the same block as the cap, the cap grows by exactly the inset it now
            contains. Which means a page can gain or lose its own boundary — pick up a tab bar, drop one —
            without moving a pixel, and no page has to know which shape it is in.
          </template>
          <CodeBlock :content="BOUNDARY_SHAPE" language="html" />
        </PageSection>

        <!-- ── The tokens ── -->
        <PageSection title="Tokens">
          <template #description>
            Every one is a reference, never a length. That is what makes the layout scale inherit the
            spacing scale's breakpoints instead of restating them: <code>--spacing-lg</code> is 1rem and
            then 1.5rem from <code>sm</code>, and <code>var()</code> is substituted at use time on the
            element, so the boundary follows without owning a breakpoint map.
          </template>

          <div
            v-for="family in layoutFamilies"
            :key="family.title"
            class="mb-(--spacing-xl) last:mb-0"
          >
            <GroupHeader :title="family.title" :description="family.description" />
            <TokenPanel :family="family" />
          </div>
        </PageSection>

        <!-- ── Rhythm in practice ── -->
        <PageSection title="Two rhythm steps, nothing else">
          <template #description>
            The section step separates sections of a parent; the group step separates the parts inside one
            section. A gap is right on the parent and inside a section, and wrong on the page stack: within
            the parent every child <em>is</em> a section, so one rule spaces them all, while on the page
            stack the heading and the parent are different kinds of thing.
          </template>

          <div class="flex flex-col rounded-(--shape-card) border border-dashed border-(--border-strong) p-(--spacing-lg)">
            <template v-for="band in 2" :key="band">
              <div v-if="band > 1" class="h-(--layout-section-gap) flex shrink-0 items-center justify-center rounded-(--shape-elements) border border-dashed border-(--accent) bg-(--accent-mask) font-code text-body-xs leading-none text-(--accent)">--layout-section-gap</div>
              <div class="flex flex-col">
                <div class="h-6 rounded-(--shape-elements) bg-(--bg-surface-raised)" />
                <div class="h-(--layout-group-gap) flex shrink-0 items-center justify-center rounded-(--shape-elements) border border-dashed border-(--accent) bg-(--accent-mask) font-code text-body-xs leading-none text-(--accent)">--layout-group-gap</div>
                <div class="h-16 rounded-(--shape-elements) bg-(--bg-surface)" />
              </div>
            </template>
          </div>
        </PageSection>
      </PageContainer>
    `
  })
}
