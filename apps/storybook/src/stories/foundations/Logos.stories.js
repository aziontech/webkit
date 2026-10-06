import {
  CodeBlock,
  PageContainer,
  PageHeader,
  SectionHeader
} from '../../foundations/components/layout/index.js'

const FILES = import.meta.glob(
  '../../../../../packages/webkit/src/assets/logos/**/*.{svg,png,webp}',
  { eager: true, import: 'default' }
)

const NAME = /^(.+)-(extended|symbol)-(color|reversed|mono)\.(svg|png|webp)$/

const GROUPS = [
  ['clients', 'Clients', 'Customers that run on Azion.'],
  ['former', 'Former clients', 'Customers that no longer run on Azion; never on a current trust strip.'],
  ['frameworks', 'Frameworks', 'What a workload is built with: frameworks, clouds, model providers, data tools.'],
  ['standards', 'Standards', 'Specification bodies and formats a workload is written against.'],
  ['certifications', 'Certifications', 'Compliance badges.'],
  ['analysts', 'Analysts', 'Analyst firms that rank Azion.'],
  ['competitors', 'Competitors', 'Vendors Azion is compared against.'],
  ['agents', 'Agents', 'Coding agents.']
]

const marks = Object.entries(FILES)
  .map(([path, src]) => {
    const [folder, ...rest] = path.split('/assets/logos/')[1].split('/')
    const file = rest.pop()
    const match = file.match(NAME)
    return match && { group: rest[0] === 'former' ? 'former' : folder, file, src, mode: match[3] }
  })
  .filter(Boolean)
  .sort((a, b) => a.file.localeCompare(b.file))

const SECTIONS = GROUPS.map(([key, title, description]) => ({
  key,
  title,
  description,
  marks: marks.filter((mark) => mark.group === key)
})).filter((section) => section.marks.length > 0)

const IMPORT_EXAMPLE = `import caixa from '@aziontech/webkit/assets/caixa-extended-color.svg'
import gartnerOnDark from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
import { CLIENTS, clientSymbolFor } from '@aziontech/webkit/assets/client-registry'`

export default {
  title: 'Foundations/Assets/Logos',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Every third-party mark the package ships, one file per brand, type and colormode. A file is imported by its name alone from `@aziontech/webkit/assets/`, so it can move between folders without breaking an import.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Library = {
  name: 'Library',
  render: () => ({
    components: { CodeBlock, PageContainer, PageHeader, SectionHeader },
    setup() {
      return { SECTIONS, IMPORT_EXAMPLE, total: marks.length }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Logos">
          {{ total }} marks, each a file named
          <code class="font-code text-code">&lt;brand&gt;-&lt;type&gt;-&lt;colormode&gt;</code>.
          The file name is the whole import path.
        </PageHeader>

        <section class="mb-(--spacing-xxl)">
          <SectionHeader
            title="Naming"
            description="type is extended (the full logo) or symbol (the mark alone). colormode is color (the brand's own colours, for a light surface), reversed (for a dark surface: white artwork, or the brand's own dark lockup) or mono (one dark ink). A brand has at most one file per combination."
          />
        </section>

        <section class="mb-(--spacing-xxl)">
          <SectionHeader
            title="Importing"
            description="Import a mark by its file name, never by its folder. The client and competitor registries index the marks a page usually needs."
          />
          <CodeBlock :content="IMPORT_EXAMPLE" language="javascript" />
        </section>

        <section v-for="section in SECTIONS" :key="section.key" class="mb-(--spacing-xxl)">
          <SectionHeader :title="section.title" :description="section.description" />
          <div class="grid gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
            <figure
              v-for="mark in section.marks"
              :key="mark.file"
              class="m-0 flex flex-col gap-(--spacing-xs)"
            >
              <div
                :data-theme="mark.mode === 'reversed' ? 'dark' : 'light'"
                class="flex h-24 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-md)"
              >
                <img :src="mark.src" :alt="mark.file" class="max-h-10 max-w-full object-contain" />
              </div>
              <figcaption class="font-code text-code break-all text-(--text-muted)">{{ mark.file }}</figcaption>
            </figure>
          </div>
        </section>
      </PageContainer>
    `
  })
}
