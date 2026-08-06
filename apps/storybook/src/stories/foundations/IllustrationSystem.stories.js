import Illustration from '@aziontech/webkit/illustration'
import IllustrationBox from '@aziontech/webkit/illustration-box'
import IllustrationBranch from '@aziontech/webkit/illustration-branch'
import IllustrationChart from '@aziontech/webkit/illustration-chart'
import IllustrationConnector from '@aziontech/webkit/illustration-connector'
import IllustrationElbow from '@aziontech/webkit/illustration-elbow'
import IllustrationGauge from '@aziontech/webkit/illustration-gauge'
import IllustrationList from '@aziontech/webkit/illustration-list'
import IllustrationNode from '@aziontech/webkit/illustration-node'
import IllustrationPill from '@aziontech/webkit/illustration-pill'
import IllustrationSurface from '@aziontech/webkit/illustration-surface'
import IllustrationWindow from '@aziontech/webkit/illustration-window'

import {
  PageContainer,
  PageHeader,
  SectionHeader
} from '../../foundations/components/layout/index.js'

// The five primitives an illustration is assembled from, each with every variant and both
// states. Data lives beside the render so the catalog cannot drift from what it documents.
const BOX_SIZES = ['small', 'medium', 'large']
const PILL_SIZES = ['small', 'medium', 'large']
const WINDOW_SIZES = ['medium', 'large']
const WINDOW_KINDS = ['icon', 'chat', 'website']
const EDGE_STYLES = ['solid', 'dashed']
const CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const SEVERITIES = ['success', 'warning', 'danger', 'info']
const SAMPLE_ROWS = [
  { label: 'Prod', value: 'key_01F8A3', status: 'active' },
  { label: 'Staging', value: 'key_02C9B7', status: 'revoked' },
  { label: 'Test', value: 'key_03E41D', status: 'active' }
]
const SAMPLE_SERIES = [36, 43, 38, 58, 43, 34]
const SAMPLE_LABELS = ['1w', '2w', '3w', '4w', '5w', '6w']

const RIM_TOKENS = [
  ['--illustration-rim', '135° ramp of --border-default — the resting rim, at border weight'],
  ['--illustration-rim-active', '135° ramp of --primary — the emphasized rim'],
  ['--illustration-rim-layers', 'fill · rim · fill — drop into background-image'],
  ['--illustration-rim-layers-active', 'the same stack, emphasized'],
  ['--illustration-rim-boxes', 'padding-box, border-box, border-box'],
  ['--illustration-rim-width', 'var(--border-2) — 2px, medium and large parts'],
  ['--illustration-rim-width-hairline', 'var(--border-width-default) — 0.8px, small parts'],
  ['--illustration-shape-node', 'var(--radius-sm) — 2px, the node'],
  ['--illustration-shape-small', 'var(--radius-lg) — 8px, 32px parts'],
  ['--illustration-shape-medium', 'var(--radius-xl) — 12px, 64px parts'],
  ['--illustration-shape-large', 'var(--radius-2xl) — 16px, 128px parts'],
  ['--illustration-label-small', '0.5rem — the one label below the typography floor']
]

export default {
  title: 'Foundations/Illustration System',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Illustrations in this design system are **built, not drawn** — assembled from five HTML primitives styled entirely by design tokens, so one illustration follows light and dark, scales with `size`, and can animate. An exported `.svg` can do none of those. This page is the parts catalog: every primitive, every variant, both states. Toggle the theme in the toolbar to see the rim light flip. Compose them by hand with the `Illustration` compound, or register a composition as a named asset and render it with `<Illustration name="…" />`.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

const LABEL_CLASS = 'text-label-sm text-[var(--text-muted)]'
const CELL_CLASS = 'flex flex-col items-start gap-[var(--spacing-sm)]'
const GRID_CLASS = 'flex flex-wrap items-end gap-[var(--spacing-xl)]'
const SECTION_CLASS = 'mb-[var(--spacing-xxl)]'

export const Parts = {
  name: 'Parts',
  render: () => ({
    components: {
      PageContainer,
      PageHeader,
      SectionHeader,
      Illustration,
      IllustrationBox,
      IllustrationNode,
      IllustrationConnector,
      IllustrationElbow,
      IllustrationBranch,
      IllustrationPill,
      IllustrationWindow,
      IllustrationSurface,
      IllustrationGauge,
      IllustrationChart,
      IllustrationList
    },
    setup() {
      return {
        BOX_SIZES,
        PILL_SIZES,
        WINDOW_SIZES,
        WINDOW_KINDS,
        EDGE_STYLES,
        CORNERS,
        SEVERITIES,
        SAMPLE_ROWS,
        SAMPLE_SERIES,
        SAMPLE_LABELS,
        LABEL_CLASS,
        CELL_CLASS,
        GRID_CLASS,
        SECTION_CLASS
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Illustration System">
          Five primitives, one rim light, and design tokens all the way down. Every part reads
          <code class="font-code text-code">size</code> and <code class="font-code text-code">active</code>
          from the illustration it sits in, so an asset composes parts and never repeats geometry.
        </PageHeader>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Icon box"
            description="A rounded square holding one centered glyph — the workhorse part, standing for a service, resource, or capability. Carries the rim light. Radius and rim thickness step with the size."
          />
          <div :class="GRID_CLASS">
            <div v-for="size in BOX_SIZES" :key="size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ size }}</span>
              <IllustrationBox :size="size" icon="ai ai-real-time-metrics" />
            </div>
            <div v-for="size in BOX_SIZES" :key="'active-' + size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ size }} · active</span>
              <IllustrationBox :size="size" icon="ai ai-real-time-metrics" active />
            </div>
            <div v-for="size in BOX_SIZES" :key="'square-' + size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ size }} · square</span>
              <IllustrationBox :size="size" shape="square" icon="ai ai-real-time-metrics" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Node"
            description="An 8px junction where connectors meet. Fixed at every scene size — it is a joint, not a scaled part — and it uses a real border rather than the rim, because a dashed edge cannot be painted as a background."
          />
          <div :class="GRID_CLASS">
            <div v-for="kind in EDGE_STYLES" :key="kind" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ kind }}</span>
              <IllustrationNode :kind="kind" />
            </div>
            <div v-for="kind in EDGE_STYLES" :key="'active-' + kind" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ kind }} · active</span>
              <IllustrationNode :kind="kind" active />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">strong</span>
              <IllustrationNode emphasis="strong" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Connector"
            description="The line between two parts, drawn as an inline SVG stroke so the dashed variant can march its dashes. The dash cycle of 4 divides the flow-dash keyframe's travel of 24, so the loop has no visible seam. Its length belongs to the scene, not the line — it has no size prop and takes 24 / 48 / 96px from the illustration it sits in. Add grow when it should span instead."
          />
          <div :class="GRID_CLASS">
            <div v-for="kind in EDGE_STYLES" :key="kind" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ kind }}</span>
              <IllustrationConnector :kind="kind" />
            </div>
            <div v-for="kind in EDGE_STYLES" :key="'active-' + kind" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ kind }} · active</span>
              <IllustrationConnector :kind="kind" active />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">dashed · animated</span>
              <IllustrationConnector kind="dashed" animated active />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">vertical</span>
              <IllustrationConnector orientation="vertical" kind="dashed" animated />
            </div>
            <div v-for="size in BOX_SIZES" :key="'len-' + size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ size }} scene</span>
              <Illustration :size="size">
                <IllustrationConnector kind="dashed" />
              </Illustration>
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Content pill"
            description="A small labelled capsule for naming a part of the scene. The glyph inherits the label's size, so the two always match. Carries the rim light."
          />
          <div :class="GRID_CLASS">
            <div v-for="size in PILL_SIZES" :key="size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ size }}</span>
              <IllustrationPill :size="size" icon="ai ai-real-time-metrics" label="Metrics" />
            </div>
            <div v-for="size in PILL_SIZES" :key="'active-' + size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ size }} · active</span>
              <IllustrationPill :size="size" icon="ai ai-real-time-metrics" label="Metrics" active />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="UI element"
            description="An abstracted application window: three status dots over one of three scenes. Sits on the canvas rather than a surface, so it overrides the rim's fill layer. No small step — 32px leaves no room for a scene."
          />
          <div :class="GRID_CLASS">
            <div v-for="kind in WINDOW_KINDS" :key="kind" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ kind }}</span>
              <IllustrationWindow :kind="kind" icon="ai ai-edge-application" />
            </div>
            <div v-for="kind in WINDOW_KINDS" :key="'active-' + kind" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ kind }} · active</span>
              <IllustrationWindow :kind="kind" icon="ai ai-edge-application" active />
            </div>
            <div v-for="size in WINDOW_SIZES" :key="'size-' + size" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">website · {{ size }}</span>
              <IllustrationWindow kind="website" :size="size" />
            </div>
          </div>
        </section>
        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Elbow"
            description="A connector that turns 90° through a rounded corner, for a path that changes axis. Drawn as two adjacent CSS borders with a radius between them rather than an SVG path — path data takes neither % nor calc(), so a path would have to be recomputed from a measured box."
          />
          <div :class="GRID_CLASS">
            <div v-for="corner in CORNERS" :key="corner" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ corner }}</span>
              <IllustrationElbow :corner="corner" kind="dashed" class="size-12" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">active</span>
              <IllustrationElbow corner="bottom-left" kind="dashed" active class="size-12" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Branch"
            description="An S-curve tributary leaving a trunk and meeting a label at another height — the shape a branch diagram reads as. Plotted in a unit-square viewBox stretched to the box, with a non-scaling stroke so the hairline stays true at any span."
          />
          <div :class="GRID_CLASS">
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">up</span>
              <IllustrationBranch direction="up" class="h-12 w-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">down</span>
              <IllustrationBranch direction="down" class="h-12 w-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">active</span>
              <IllustrationBranch direction="up" active class="h-12 w-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">accent</span>
              <IllustrationBranch direction="down" accent class="h-12 w-16" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Surface"
            description="The plainest part: a rectangle with an edge. A filled panel holds other parts; an outline is a ghost frame a scene is arranged against. Both carry the rim light — a filled panel through the same three-layer stack as every other part, an outline through border-image, which is why an outline wants to be square (border-image cannot follow a radius, so a rounded outline falls back to the flat hairline)."
          />
          <div :class="GRID_CLASS">
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">filled</span>
              <IllustrationSurface class="size-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">outline</span>
              <IllustrationSurface kind="outline" class="size-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">filled · active</span>
              <IllustrationSurface active class="size-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">outline · square</span>
              <IllustrationSurface kind="outline" shape="square" class="size-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">outline · square · active</span>
              <IllustrationSurface kind="outline" shape="square" active class="size-16" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">filled · square</span>
              <IllustrationSurface shape="square" class="size-16" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Gauge"
            description="A circular progress ring with an optional value in the middle. The arc is drawn by dashing the circumference, so any value renders without extra geometry."
          />
          <div :class="GRID_CLASS">
            <div v-for="severity in SEVERITIES" :key="severity" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ severity }}</span>
              <IllustrationGauge :severity="severity" :value="100" label="100" class="size-12" />
            </div>
            <div v-for="value in [25, 50, 75]" :key="'v' + value" :class="CELL_CLASS">
              <span :class="LABEL_CLASS">{{ value }}%</span>
              <IllustrationGauge :value="value" :label="String(value)" class="size-12" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Chart"
            description="A sparkline over column backdrops, with square markers at each point and an optional axis. Values are normalized against their own range, so a series of any magnitude fills the plot; one column can be emphasized with the brand ramp."
          />
          <div class="flex flex-wrap gap-[var(--spacing-xl)]">
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">with axis · highlight</span>
              <IllustrationChart :data="SAMPLE_SERIES" :labels="SAMPLE_LABELS" :highlight="3" class="h-24 w-[170px]" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">bare</span>
              <IllustrationChart :data="SAMPLE_SERIES" class="h-24 w-[170px]" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="List"
            description="Rows of mono text divided by hairline rules: a table reduced to the shape of one. The emphasized row takes the brand fill so a scene can point at a single record."
          />
          <div class="flex flex-wrap gap-[var(--spacing-xl)]">
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">with highlight</span>
              <IllustrationList :rows="SAMPLE_ROWS" :highlight="1" class="w-[170px]" />
            </div>
            <div :class="CELL_CLASS">
              <span :class="LABEL_CLASS">plain</span>
              <IllustrationList :rows="SAMPLE_ROWS" class="w-[170px]" />
            </div>
          </div>
        </section>
      </PageContainer>
    `
  })
}

export const Tokens = {
  name: 'Tokens',
  render: () => ({
    components: { PageContainer, PageHeader, SectionHeader, IllustrationBox },
    setup() {
      return { RIM_TOKENS, LABEL_CLASS }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Illustration tokens">
          The private vocabulary the illustration parts read, from
          <code class="font-code text-code">packages/theme/src/tokens/semantic/illustrations.data.js</code>.
          Do not consume these outside the illustration components.
        </PageHeader>

        <section class="mb-[var(--spacing-xxl)]">
          <SectionHeader
            title="The rim light"
            description="A 135° three-stop ramp, opaque at the two ends of the top-left to bottom-right axis and transparent through the middle, so an edge reads as lit from the top-left and again from the bottom-right. The resting ramp is --border-default, the same hairline role every bordered surface uses, so an edge reads at border weight rather than as a drawn white outline; only the active ramp goes to full strength, in --primary. Both reference semantic roles, so the rim follows the theme instead of vanishing in one mode."
          />
          <div class="flex flex-wrap items-end gap-[var(--spacing-xl)]">
            <div class="flex flex-col items-start gap-[var(--spacing-sm)]">
              <span :class="LABEL_CLASS">--illustration-rim</span>
              <IllustrationBox size="large" icon="ai ai-edge-application" />
            </div>
            <div class="flex flex-col items-start gap-[var(--spacing-sm)]">
              <span :class="LABEL_CLASS">--illustration-rim-active</span>
              <IllustrationBox size="large" icon="ai ai-edge-application" active />
            </div>
          </div>
        </section>

        <section>
          <SectionHeader title="Scale" />
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="border-b border-[var(--border-default)]">
                  <th class="text-label-sm text-[var(--text-muted)] py-[var(--spacing-xs)] pr-[var(--spacing-lg)] font-normal">Token</th>
                  <th class="text-label-sm text-[var(--text-muted)] py-[var(--spacing-xs)] font-normal">Value and use</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="[token, note] in RIM_TOKENS" :key="token" class="border-b border-[var(--border-muted)]">
                  <td class="py-[var(--spacing-xs)] pr-[var(--spacing-lg)] align-top">
                    <code class="font-code text-code text-[var(--text-default)]">{{ token }}</code>
                  </td>
                  <td class="text-body-sm text-[var(--text-muted)] py-[var(--spacing-xs)] align-top">{{ note }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </PageContainer>
    `
  })
}
