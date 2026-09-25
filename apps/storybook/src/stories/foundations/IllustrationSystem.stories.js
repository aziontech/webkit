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
  'implement-api-gateway-security',
  'infrastructure-as-code',
  'live-debugging',
  'modern-frontends',
  'preview',
  'programmable-security',
  'protect-financial-applications',
  'quick-start-with-templates',
  'retail-application-modernization',
  'runtime',
  'saas-platforms'
]

const CANVAS_TOKENS = [
  ['--illustration-canvas-width', '37rem — 592px, the frame every scene is drawn on'],
  ['--illustration-canvas-height', '18.75rem — 300px, the same frame']
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
      return { ASSETS, CANVAS_TOKENS, LABEL_CLASS, CELL_CLASS, SECTION_CLASS }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Illustration System">
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
            description="Draw it in the Assets file in Figma on the 592×300 frame, export the frame as SVG, drop it into packages/webkit/src/assets/illustrations/ under the frame's own name, and add one line to registry.ts. Never hand-draw one in markup — that is the drift this component exists to prevent."
          />
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
