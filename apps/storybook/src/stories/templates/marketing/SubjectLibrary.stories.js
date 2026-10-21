import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CallToAction from '@aziontech/webkit/call-to-action'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  Button,
  CallToAction,
  CardGrid,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule
}

const SUBJECTS = [
  {
    slug: 'api-security',
    title: 'API Security',
    description:
      'Understand threat risks, implement a robust API Security checklist, and learn architecture best practices to protect your applications with maximum performance.',
    articles: [
      { label: 'What is API Security?', href: 'https://www.azion.com/en/learning/api/what-is-api-security/' },
      { label: 'API Gateway vs. API Security', href: 'https://www.azion.com/en/learning/api/api-gateway-vs-api-security/' },
      { label: 'OWASP API Security Top 10', href: 'https://www.azion.com/en/learning/api/owasp-api-security-top-10/' },
      { label: 'OWASP Top 10 for LLMs', href: 'https://www.azion.com/en/learning/api/owasp-top-10-for-llms/' },
      { label: 'REST vs. GraphQL Security', href: 'https://www.azion.com/en/learning/api/rest-vs-graphql-security/' },
      { label: 'API Security Checklist', href: 'https://www.azion.com/en/learning/api/api-security-checklist/' },
      { label: 'API Security Best Practices', href: 'https://www.azion.com/en/learning/api/api-security-best-practices/' }
    ]
  },
  {
    slug: 'ai',
    title: 'AI',
    description:
      'Discover the transformative power of Artificial Intelligence (AI), a field at the forefront of innovation and technology.',
    articles: [
      { label: 'What is Artificial Intelligence (AI)?', href: 'https://www.azion.com/en/learning/ai/what-is-artificial-intelligence/' },
      { label: 'What is Machine Learning?', href: 'https://www.azion.com/en/learning/ai/what-is-machine-learning/' },
      { label: 'What is RAG?', href: 'https://www.azion.com/en/learning/ai/what-is-rag/' },
      { label: 'What is Vector Search?', href: 'https://www.azion.com/en/learning/ai/what-is-vector-search/' },
      { label: 'What are AI Agents?', href: 'https://www.azion.com/en/learning/ai/what-are-ai-agents/' },
      { label: 'Model Context Protocol (MCP)', href: 'https://www.azion.com/en/learning/ai/model-context-protocol-mcp/' },
      { label: 'What is AI Inference?', href: 'https://www.azion.com/en/learning/ai/what-is-ai-inference/' }
    ]
  },
  {
    slug: 'bots',
    title: 'Bots',
    description:
      'Bots are automated software programs that perform repetitive tasks on websites and applications. While some bots like search engine crawlers are beneficial, malicious bots can cause significant harm to businesses in multiple ways.',
    articles: [
      { label: 'What is a Bot?', href: 'https://www.azion.com/en/learning/bots/what-is-a-bot/' },
      { label: 'What is a Bot Attack?', href: 'https://www.azion.com/en/learning/bots/what-is-a-bot-attack/' },
      { label: 'What is Bot Management?', href: 'https://www.azion.com/en/learning/bots/what-is-bot-management/' },
      { label: 'What is Credential Stuffing?', href: 'https://www.azion.com/en/learning/bots/what-is-credential-stuffing/' }
    ]
  },
  {
    slug: 'cdn',
    title: 'CDN',
    description:
      'The primary goal of a CDN is to reduce latency and improve the speed at which static content is delivered by caching it on servers closer to the end-users',
    articles: [
      { label: 'What is a CDN?', href: 'https://www.azion.com/en/learning/cdn/what-is-a-cdn/' },
      { label: 'What is Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-caching/' },
      { label: 'What is Micro Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-micro-caching/' },
      { label: 'What is Tiered Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-tiered-caching/' }
    ]
  }
]

const article = (link) =>
  `<li>
  <a
    href="${link.href}"
    class="text-body-sm text-(--text-muted) underline underline-offset-2 transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
  >
    ${link.label}
  </a>
</li>`

const subjectCard = (subject) =>
  `<FrameBox
  id="${subject.slug}"
  borders="none"
  marks="all"
  class="min-w-0 scroll-mt-(--spacing-xxl) bg-(--bg-canvas)"
>
  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
    <div class="flex flex-col gap-(--spacing-sm)">
      <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
        ${subject.title}
      </h3>
      <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
        ${subject.description}
      </p>
    </div>
    <ul
      role="list"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
    >
${each(subject.articles, article, 3)}
    </ul>
  </div>
</FrameBox>`

const CLOSING_CELL = `<FrameBox
  borders="none"
  marks="all"
  class="min-w-0 bg-(--bg-surface-raised) sm:col-span-2"
>
  <CallToAction
    kind="lead"
    eyebrow="Next step"
    class="h-full"
    title="Put what you learned to work."
    title-muted="On Azion."
    description="Deploy your first application in minutes, or talk to our team about your architecture."
  >
    <template #actions>
      <Button
        label="Start Free"
        kind="secondary"
        size="large"
        href="/signup"
      />
      <Button
        label="Talk to our team"
        kind="outlined"
        size="large"
        href="/contact"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </CallToAction>
</FrameBox>`

const LIBRARY_TEMPLATE = inColumn(`<SectionModule
  id="subjects"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <FrameBox
    flush
    borders="y"
    marks="none"
  >
    <CardGrid
      kind="divider"
      :columns="3"
      :mobile-columns="1"
    >
${each(SUBJECTS, subjectCard, 3)}

${indent(CLOSING_CELL, 3)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/SubjectLibrary',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A library of subjects in a divider grid: one card per subject holding its name, what it covers, and a list of its article links, closed by a call to action that spans the last two cells so the grid has no empty cell at any breakpoint. The Learning Center renders it. Built from `SectionModule`, `FrameBox`, `CardGrid`, `CallToAction` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: LIBRARY_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The first four Learning Center subjects with their articles, and the closing call to action in the grid’s last two cells.'
      },
      source: { code: toSfc(IMPORTS, LIBRARY_TEMPLATE) }
    }
  }
}
