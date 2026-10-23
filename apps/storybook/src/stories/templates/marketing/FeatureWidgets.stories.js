import BentoGrid from '@aziontech/webkit/bento-grid'
import Button from '@aziontech/webkit/button'
import ButtonHighlight from '@aziontech/webkit/button-highlight'
import FrameBox from '@aziontech/webkit/frame-box'
import Illustration from '@aziontech/webkit/illustration'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import BentoGrid from '@aziontech/webkit/bento-grid'",
  "import Button from '@aziontech/webkit/button'",
  "import ButtonHighlight from '@aziontech/webkit/button-highlight'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Illustration from '@aziontech/webkit/illustration'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  BentoGrid,
  'BentoGrid.Cell': BentoGrid.Cell,
  Button,
  ButtonHighlight,
  FrameBox,
  Illustration,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const ITEMS = [
  {
    title: 'Ask your coding agent',
    description:
      'Connect the Azion MCP servers to Claude Code, Cursor or ChatGPT, and the agent creates, instances and routes the function, with a dry run before every write.',
    illustration: 'deploy-secure-mcp-server',
    copy: { label: 'Copy prompt' }
  },
  {
    title: 'Build it in the Console',
    description:
      'Choose the application it runs on, write the handler in the editor, name it, and create it. The rule that runs it is drafted for you.',
    illustration: 'build-applications',
    href: '/site/docs',
    linkLabel: 'Docs'
  },
  {
    title: 'Ship it from the terminal',
    description:
      'azion init scaffolds from 25 presets, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain.',
    illustration: 'quick-start-with-templates',
    href: '/site/docs',
    linkLabel: 'Docs'
  }
]

const cell = (item) => `<BentoGrid.Cell :padded="false">
  <div class="flex h-full w-full min-w-0 flex-col">
    <Illustration name="${item.illustration}" />
    <div class="flex flex-1 flex-col items-start gap-(--spacing-lg) p-(--spacing-xl)">
      <p class="m-0 text-pretty text-body-md text-(--text-muted)">
        <strong class="font-medium text-(--text-default)">${item.title}</strong>
        ${item.description}
      </p>
      <span class="mt-auto flex flex-wrap gap-(--spacing-sm)">
${
  item.copy
    ? `        <ButtonHighlight label="${item.copy.label}" size="medium" icon="pi pi-copy" />`
    : `        <Button
          label="${item.linkLabel}"
          kind="outlined"
          size="medium"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
          href="${item.href}"
        />`
}
      </span>
    </div>
  </div>
</BentoGrid.Cell>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="centered"
      eyebrow="Get started"
      title="Start where you already work"
      description="The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal."
    >
      <template #actions>
        <Button label="Start for free" kind="secondary" href="/signup" />
        <Button label="Docs" kind="outlined" icon="pi pi-chevron-right" icon-position="trailing" href="/site/docs" />
      </template>
    </SectionTitle>
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <BentoGrid flush :columns="3" aria-label="Start where you already work">
${each(ITEMS, cell, 3)}
    </BentoGrid>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Features/FeatureWidgets',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'feature-widgets',
  props: {
    anchor: 'get-started',
    eyebrow: 'Get started',
    title: 'Start where you already work',
    description:
      'The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal.',
    actions: [
      { label: 'Start for free', href: '/signup', kind: 'secondary' },
      { label: 'Docs', href: '/site/docs', kind: 'outlined', trailing: true }
    ],
    columns: 3,
    items: [
      {
        title: ITEMS[0].title,
        description: ITEMS[0].description,
        copy: {
          label: 'Copy prompt',
          text: 'Create a function that answers 401 when a request has no Authorization header.'
        }
      },
      {
        title: ITEMS[1].title,
        description: ITEMS[1].description,
        href: '/site/docs',
        linkLabel: 'Docs'
      },
      {
        title: ITEMS[2].title,
        description: ITEMS[2].description,
        href: '/site/docs',
        linkLabel: 'Docs'
      }
    ]
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
