import { layoutsData } from '@aziontech/theme/layouts'

import { CodeBlock, PageContainer, PageHeader } from '../../foundations/components/layout/index.js'

// Rows straight from the theme token source — the page can never drift from the
// catalog. The value shown is the reference as authored (`var(--spacing-lg)`), because
// that indirection is the point: a layout token never restates a length, it names
// which spacing or container step it follows.
const tokenRows = Object.entries(layoutsData).map(([name, value]) => ({
  name: `--${name}`,
  value
}))

const group = (prefix) => tokenRows.filter((row) => row.name.startsWith(prefix))

const BOUNDARY_ROWS = group('--layout-boundary')
const RHYTHM_ROWS = tokenRows.filter((row) => row.name.endsWith('-gap'))
const MEASURE_ROWS = group('--layout-measure')

// The four container types, in the order a product meets them: the widest first.
// `width` is what the cap resolves to today; it is shown so the three read as one
// scale rather than three unrelated numbers.
const CONTAINERS = [
  {
    class: 'layout-column',
    type: 'Data',
    token: '--layout-measure',
    width: '1620px',
    use: 'Lists and detail dashboards.',
    why: 'Capped so a table running to the viewport edge on an ultrawide screen does not put its row actions a head-turn away from the name that identifies the row — but no tighter, because more columns visible is the point.'
  },
  {
    class: 'layout-column-focused',
    type: 'Focused',
    token: '--layout-measure-focused',
    width: '1024px',
    use: 'Home, and any single-task page that still goes multi-column.',
    why: 'One task, but the task is a rail plus a card grid — wide enough for those bands to breathe, and no wider.'
  },
  {
    class: 'layout-column-form',
    type: 'Form',
    token: '--layout-measure-form',
    width: '1024px',
    use: 'Settings and in-page edit forms.',
    why: 'A single stacked column of fields. Past ~1200px the extra width lands entirely inside the controls: a label sits at the far left of the row from the input it names, and the eye travels the whole measure to pair them.'
  },
  {
    class: 'layout-form-create',
    type: 'Create',
    token: '--layout-measure-form-create',
    width: '1192px',
    use: 'A dedicated create page — sidebar hidden, sticky action bar.',
    why: 'A sibling of the form measure rather than the same class, because it also retunes --layout-measure-control (256px → 472px) for every field row inside it. Home is focused too, but it has no field rows to retune.'
  }
]

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
  title: 'Foundations/Layout',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
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
    components: { PageContainer, PageHeader, CodeBlock },
    data() {
      return {
        CONTAINERS,
        BOUNDARY_ROWS,
        RHYTHM_ROWS,
        MEASURE_ROWS,
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
        <section class="mb-(--spacing-xxl)">
          <h2 class="mb-(--spacing-md) text-heading-sm text-(--text-default)">Container types</h2>
          <p class="mb-(--spacing-lg) max-w-(--container-3xl) text-body-md text-(--text-muted)">
            Every page carries exactly one of these. Full-bleed is the absence of all four, never a
            <code>w-full</code>. Within one band the class is the same everywhere it must align — the
            scrolling body <em>and</em> its sticky action bar — or the footer's buttons drift right of the
            form they submit.
          </p>

          <div class="flex flex-col gap-(--spacing-md)">
            <article
              v-for="container in CONTAINERS"
              :key="container.class"
              class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)"
            >
              <div class="mb-(--spacing-sm) flex flex-wrap items-baseline gap-(--spacing-sm)">
                <span class="text-heading-xs text-(--text-default)">{{ container.type }}</span>
                <code class="text-body-sm text-(--primary)">.{{ container.class }}</code>
                <span class="ml-auto text-body-sm text-(--text-muted)">{{ container.width }}</span>
              </div>

              <!-- The cap, drawn: the rail is the viewport, the bar is the measure. -->
              <div class="mb-(--spacing-sm) h-2 w-full rounded-full bg-(--bg-surface-raised)">
                <div
                  class="h-full rounded-full bg-(--primary)"
                  :style="{ width: Math.round((parseInt(container.width, 10) / 1620) * 100) + '%' }"
                />
              </div>

              <p class="mb-(--spacing-xs) text-body-md text-(--text-default)">{{ container.use }}</p>
              <p class="text-body-sm text-(--text-muted)">{{ container.why }}</p>
              <code class="mt-(--spacing-sm) block text-body-sm text-(--text-muted)">
                {{ container.token }}
              </code>
            </article>
          </div>
        </section>

        <!-- ── The page shape ── -->
        <section class="mb-(--spacing-xxl)">
          <h2 class="mb-(--spacing-md) text-heading-sm text-(--text-default)">The page shape</h2>
          <p class="mb-(--spacing-lg) max-w-(--container-3xl) text-body-md text-(--text-muted)">
            Three levels, each owning one decision: the boundary sets the page's top inset, the parent
            section spaces the sections inside it, and each of those spaces its own parts. The page stack
            itself never carries a vertical gap — it holds the heading and one element below it. Every page
            carries the parent section whether it holds one section or seven, so the shape is the same to
            read and a second section needs no rework.
          </p>
          <CodeBlock :code="PAGE_SHAPE" language="html" />
        </section>

        <!-- ── The boundary is not part of the measure ── -->
        <section class="mb-(--spacing-xxl)">
          <h2 class="mb-(--spacing-md) text-heading-sm text-(--text-default)">
            The boundary is not part of the measure
          </h2>
          <p class="mb-(--spacing-lg) max-w-(--container-3xl) text-body-md text-(--text-muted)">
            A measure describes <em>content</em> width — that is the one job it has. So when a page carries
            its own boundary on the same block as the cap, the cap grows by exactly the inset it now
            contains. Which means a page can gain or lose its own boundary — pick up a tab bar, drop one —
            without moving a pixel, and no page has to know which shape it is in.
          </p>
          <CodeBlock :code="BOUNDARY_SHAPE" language="html" />
        </section>

        <!-- ── The tokens ── -->
        <section class="mb-(--spacing-xxl)">
          <h2 class="mb-(--spacing-md) text-heading-sm text-(--text-default)">Tokens</h2>
          <p class="mb-(--spacing-lg) max-w-(--container-3xl) text-body-md text-(--text-muted)">
            Every one is a reference, never a length. That is what makes the layout scale inherit the
            spacing scale's breakpoints instead of restating them: <code>--spacing-lg</code> is 1rem and
            then 1.5rem from <code>sm</code>, and <code>var()</code> is substituted at use time on the
            element, so the boundary follows without owning a breakpoint map.
          </p>

          <div class="flex flex-col gap-(--spacing-lg)">
            <div v-for="rows, label in { Boundary: BOUNDARY_ROWS, Rhythm: RHYTHM_ROWS, Measure: MEASURE_ROWS }" :key="label">
              <h3 class="mb-(--spacing-xs) text-label-md text-(--text-default)">{{ label }}</h3>
              <table class="w-full border-collapse text-body-sm">
                <tbody>
                  <tr
                    v-for="row in rows"
                    :key="row.name"
                    class="border-b border-(--border-default)"
                  >
                    <td class="py-(--spacing-xs) pr-(--spacing-md)">
                      <code class="text-(--text-default)">{{ row.name }}</code>
                    </td>
                    <td class="py-(--spacing-xs) text-(--text-muted)">
                      <code>{{ row.value }}</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ── Rhythm in practice ── -->
        <section class="mb-(--spacing-xxl)">
          <h2 class="mb-(--spacing-md) text-heading-sm text-(--text-default)">Two rhythm steps, nothing else</h2>
          <p class="mb-(--spacing-lg) max-w-(--container-3xl) text-body-md text-(--text-muted)">
            The section step separates sections of a parent; the group step separates the parts inside one
            section. A gap is right on the parent and inside a section, and wrong on the page stack: within
            the parent every child <em>is</em> a section, so one rule spaces them all, while on the page
            stack the heading and the parent are different kinds of thing.
          </p>

          <div class="flex flex-col gap-(--layout-section-gap) rounded-(--shape-card) border border-dashed border-(--border-strong) p-(--spacing-lg)">
            <div class="flex flex-col gap-(--layout-group-gap)">
              <div class="h-6 rounded-(--shape-elements) bg-(--bg-surface-raised)" />
              <div class="h-16 rounded-(--shape-elements) bg-(--bg-surface)" />
            </div>
            <div class="flex flex-col gap-(--layout-group-gap)">
              <div class="h-6 rounded-(--shape-elements) bg-(--bg-surface-raised)" />
              <div class="h-16 rounded-(--shape-elements) bg-(--bg-surface)" />
            </div>
          </div>
          <p class="mt-(--spacing-sm) text-body-sm text-(--text-muted)">
            The wide gap is <code>--layout-section-gap</code>; the tight one inside each band is
            <code>--layout-group-gap</code>.
          </p>
        </section>
      </PageContainer>
    `
  })
}
