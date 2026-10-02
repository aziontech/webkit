import azionHighlight from '@aziontech/webkit/assets/azion-highlight.svg'
import branches from '@aziontech/webkit/assets/branches.svg'
import combineDataAndVectorSearch from '@aziontech/webkit/assets/combine-data-and-vector-search.svg'
import ddosProtection from '@aziontech/webkit/assets/ddos-protection.svg'
import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'
import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
import Illustration from '@aziontech/webkit/illustration'

import {
  PageContainer,
  PageHeader,
  SectionHeader
} from '../../foundations/components/layout/index.js'

// Every scene the library ships, in the order `name` accepts them. Data lives beside the
// render so the catalog cannot drift from what it documents.
const ASSETS = [
  'ai-applications',
  'automate-threat-mitigation',
  'azion-to-vercel',
  'build-applications',
  'deploy-secure-mcp-server',
  'distributed-apis',
  'dns-protection',
  'fastest-path-to-live-website',
  'global-network',
  'implement-api-gateway-security',
  'improve-application-performance-and-reliability',
  'infrastructure-as-code',
  'live-debugging',
  'low-latency',
  'modern-frontends',
  'no-idle-no-waste',
  'preview',
  'programmable-security',
  'protect-financial-applications',
  'quick-start-with-templates',
  'retail-application-modernization',
  'runtime',
  'saas-platforms',
  'stay-in-control',
  'white-gloves-when-it-matters'
]

const CANVAS_TOKENS = [
  ['--illustration-canvas-width', '37rem — 592px, the frame every scene is drawn on'],
  ['--illustration-canvas-height', '18.75rem — 300px, the same frame']
]

const COLOR_ROLES = [
  ['ground', '--bg-canvas', 'Window bodies and fades painted in the page colour'],
  ['surface', '--bg-surface', 'Boxes, nodes, cards'],
  ['surface-raised', '--bg-surface-raised', 'Stacked panels'],
  ['block', '--bg-selected', 'Content blocks and guides'],
  ['line', '--border-default', 'Outlines and connectors'],
  ['line-muted', '--border-muted', 'Subtle columns and rules'],
  ['line-strong', '--text-disabled', 'Strong strokes'],
  ['highlight', '--border-strong', 'Rim light, glass, grid lines — drawn translucent'],
  ['ink', '--text-default', 'Glyphs and outlined labels'],
  ['ink-muted', '--text-muted', 'Secondary labels'],
  ['primary', '--primary', 'Brand marks, active rims, connectors'],
  ['accent', '--accent', 'Accent marks'],
  ['code-punctuation', '--code-sintax-punctuation', 'Code samples'],
  ['code-keyword', '--code-sintax-keyword', 'Code samples'],
  ['success', '--success-contrast', 'Status ink'],
  ['success-surface', '--success', 'Status badge fill'],
  ['danger', '--danger-contrast', 'Status ink'],
  ['warning', '--warning-contrast', 'Status ink'],
  ['warning-surface', '--warning', 'Status badge fill'],
  ['info', '--info-contrast', 'Status ink'],
  ['info-surface', '--info', 'Status badge fill']
]

const FILES = [
  ['azion-highlight.svg', azionHighlight],
  ['branches.svg', branches],
  ['combine-data-and-vector-search.svg', combineDataAndVectorSearch],
  ['ddos-protection.svg', ddosProtection],
  ['personal-tokens.svg', personalTokens],
  ['quick-start-with-templates.svg', quickStartWithTemplates],
  ['usage-chart.svg', usageChart]
]

export default {
  title: 'Foundations/Assets/Illustrations',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Illustrations in this design system are **drawn, not assembled**. Each one is a scene from the Assets library in Figma, exported at 592×300 and shipped as an SVG inside the package; `<Illustration name="…" />` renders one by name from a closed registry. There is deliberately no way to compose a scene out of markup, so a screen can only show artwork design has signed off and the same concept is the same drawing everywhere. A scene that does not exist yet has to be drawn in Figma and exported — not approximated in code.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

const LABEL_CLASS = 'text-label-sm text-[var(--text-muted)]'
const CELL_CLASS = 'flex flex-col items-start gap-[var(--spacing-sm)]'
const SECTION_CLASS = 'mb-[var(--spacing-xxl)]'

export const Library = {
  name: 'Library',
  render: () => ({
    components: { PageContainer, PageHeader, SectionHeader, Illustration },
    setup() {
      return { ASSETS, FILES, CANVAS_TOKENS, COLOR_ROLES, LABEL_CLASS, CELL_CLASS, SECTION_CLASS }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Illustrations">
          One drawing per concept, exported from Figma and shipped with the package. Render one
          with <code class="font-code text-code">&lt;Illustration name="…" /&gt;</code>; the names
          below are the only values the prop accepts.
        </PageHeader>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="The library"
            description="Every scene is drawn on the same 592×300 frame, so scenes line up with each other in a grid and a cell can reserve the box before the SVG loads. The root fills its container at that aspect ratio, capped at the canvas width."
          />
          <div class="grid gap-[var(--spacing-xl)] md:grid-cols-2">
            <div v-for="asset in ASSETS" :key="asset" :class="CELL_CLASS">
              <code class="font-code text-code text-[var(--text-default)]">{{ asset }}</code>
              <Illustration :name="asset" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Files"
            description="Drawings that are not scenes — hero art, card visuals — ship as files on their own canvas. Import one by its file name from @aziontech/webkit/assets/, never by its folder, and render it as an image."
          />
          <div class="grid gap-(--spacing-xl) md:grid-cols-2">
            <div v-for="[file, src] in FILES" :key="file" :class="CELL_CLASS">
              <code class="font-code text-code text-(--text-default)">@aziontech/webkit/assets/{{ file }}</code>
              <img :src="src" alt="" class="h-auto max-w-full" />
            </div>
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="When the scene does not exist yet"
            description="A name that resolves to nothing — empty, or absent from the registry — renders the placeholder frame instead of collapsing the layout, and an unregistered name also warns in development. Leave &lt;Illustration /&gt; unnamed where a drawing is still being made: the frame holds the space and reads as unfinished on the screen, which is louder than a gap nobody notices."
          />
          <div :class="CELL_CLASS">
            <code class="font-code text-code text-(--text-default)">&lt;Illustration /&gt;</code>
            <Illustration />
          </div>
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Adding a scene"
            description="Draw it in the Assets file in Figma on the 592×300 frame, export the frame as SVG, drop it into packages/webkit/src/assets/illustrations/ under the frame's own name, and add one line to registry.ts. Never hand-draw one in markup — that is the drift this component exists to prevent. A colour the export palette in palette.ts does not list fails the suite until it is given a role or marked as drawn."
          />
        </section>

        <section :class="SECTION_CLASS">
          <SectionHeader
            title="Colour"
            description="The library is drawn once, in dark mode. Every colour a scene carries is repainted from an --illustration-* role of the theme, and each role aliases a global token — so one export follows light and dark, inside whatever [data-theme] subtree it renders. Colours that read the same in both themes (window controls, framework marks, the dot map, shadows) stay as drawn."
          />
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="border-b border-(--border-default)">
                  <th class="text-label-sm text-(--text-muted) py-(--spacing-xs) pr-(--spacing-lg) font-normal">Role</th>
                  <th class="text-label-sm text-(--text-muted) py-(--spacing-xs) pr-(--spacing-lg) font-normal">Aliases</th>
                  <th class="text-label-sm text-(--text-muted) py-(--spacing-xs) pr-(--spacing-lg) font-normal">Light · Dark</th>
                  <th class="text-label-sm text-(--text-muted) py-(--spacing-xs) font-normal">Use</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="[role, alias, use] in COLOR_ROLES" :key="role" class="border-b border-(--border-muted)">
                  <td class="py-(--spacing-xs) pr-(--spacing-lg) align-top">
                    <code class="font-code text-code text-(--text-default)">--illustration-{{ role }}</code>
                  </td>
                  <td class="py-(--spacing-xs) pr-(--spacing-lg) align-top">
                    <code class="font-code text-code text-(--text-muted)">{{ alias }}</code>
                  </td>
                  <td class="py-(--spacing-xs) pr-(--spacing-lg) align-top">
                    <div class="flex gap-(--spacing-xxs)">
                      <span v-for="mode in ['light', 'dark']" :key="mode" :data-theme="mode" class="rounded-(--shape-elements) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-xxs)">
                        <span class="block size-6 rounded-(--shape-elements)" :style="{ background: 'var(--illustration-' + role + ')' }" />
                      </span>
                    </div>
                  </td>
                  <td class="text-body-sm text-(--text-muted) py-(--spacing-xs) align-top">{{ use }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionHeader title="Canvas" />
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="border-b border-[var(--border-default)]">
                  <th class="text-label-sm text-[var(--text-muted)] py-[var(--spacing-xs)] pr-[var(--spacing-lg)] font-normal">Token</th>
                  <th class="text-label-sm text-[var(--text-muted)] py-[var(--spacing-xs)] font-normal">Value and use</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="[token, note] in CANVAS_TOKENS" :key="token" class="border-b border-[var(--border-muted)]">
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
