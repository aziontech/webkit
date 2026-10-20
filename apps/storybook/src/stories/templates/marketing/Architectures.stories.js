import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import Flow from '@aziontech/webkit/flow'
import FrameBox from '@aziontech/webkit/frame-box'
import Overline from '@aziontech/webkit/overline'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Tag from '@aziontech/webkit/tag'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  Flow,
  'Flow.Node': Flow.Node,
  'Flow.Parallel': Flow.Parallel,
  FrameBox,
  Overline,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Tag,
  TextureMaterial
}

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import Flow from '@aziontech/webkit/flow'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import Overline from '@aziontech/webkit/overline'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Tag from '@aziontech/webkit/tag'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'"
]

const NODE_CLASS =
  'flex w-56 flex-col gap-(--spacing-xxs) rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-xs)'

const LIT_NODE_CLASS = `${NODE_CLASS} border-(--primary)! bg-(--primary-mask)! shadow-[0_0_24px_-8px_var(--primary)]`

const AI_TRAFFIC = {
  eyebrow: 'Architecture',
  title: 'One platform for API and AI traffic',
  description:
    'Agents, apps and workflows reach models, tools and APIs through the same gateway, so every call is authenticated, routed and observed in one place.',
  href: '/docs/ai-gateway',
  levels: [
    [
      { icon: 'pi pi-sitemap', role: 'Workflow', title: 'Order pipeline', detail: 'Nightly batch' },
      { icon: 'pi pi-comments', role: 'AI app', title: 'Support chat', detail: 'Web and mobile' },
      { icon: 'pi pi-android', role: 'Agent', title: 'Code reviewer', detail: 'MCP client' }
    ],
    [
      {
        icon: 'pi pi-shield',
        role: 'AI Gateway',
        title: 'Routing and control',
        detail: 'Auth, cache, rate limit, logs',
        lit: true
      }
    ],
    [
      {
        icon: 'pi pi-sparkles',
        role: 'Model',
        title: 'Claude Opus 5.5',
        detail: 'Anthropic',
        tag: { label: 'Primary', severity: 'success' }
      },
      {
        icon: 'pi pi-sparkles',
        role: 'Model',
        title: 'GPT-5.5',
        detail: 'OpenAI',
        tag: { label: 'Fallback', severity: 'secondary' }
      },
      { icon: 'pi pi-wrench', role: 'MCP server', title: 'Internal tools', detail: 'Self-hosted' },
      { icon: 'pi pi-database', role: 'Database', title: 'Customer records', detail: 'Postgres' }
    ]
  ]
}

const API_PLATFORM = {
  eyebrow: 'Reference architecture',
  title: 'APIs answered where the caller is',
  description:
    'Authenticate, rate limit and route in the location closest to the caller, and reach your origin only when the edge cannot answer.',
  href: '/docs/architecture/apis',
  levels: [
    [
      { icon: 'pi pi-mobile', role: 'Client', title: 'Mobile app', detail: 'iOS and Android' },
      { icon: 'pi pi-desktop', role: 'Client', title: 'Web app', detail: 'Browser' },
      { icon: 'pi pi-server', role: 'Client', title: 'Partner API', detail: 'Server to server' }
    ],
    [
      {
        icon: 'pi pi-shield',
        role: 'Security',
        title: 'WAF',
        detail: 'Rules and rate limits',
        tag: { label: 'Edge', severity: 'secondary' }
      },
      {
        icon: 'pi pi-bolt',
        role: 'Compute',
        title: 'Functions',
        detail: 'Auth and routing',
        lit: true,
        tag: { label: 'Edge', severity: 'secondary' }
      }
    ],
    [
      {
        icon: 'pi pi-box',
        role: 'Cache',
        title: 'Edge cache',
        detail: 'Hit on most calls',
        tag: { label: '92% hit', severity: 'success' }
      },
      { icon: 'pi pi-database', role: 'Origin', title: 'Your API', detail: 'Reached on miss' }
    ]
  ]
}

const COMPARE_WITHOUT = [
  [
    { icon: 'pi pi-mobile', role: 'Client', title: 'Mobile app', detail: 'iOS and Android' },
    { icon: 'pi pi-desktop', role: 'Client', title: 'Web app', detail: 'Browser' }
  ],
  [
    {
      icon: 'pi pi-globe',
      role: 'Vendor',
      title: 'CDN',
      detail: 'Own contract',
      tag: { label: 'Hop 1', severity: 'warning' }
    },
    {
      icon: 'pi pi-shield',
      role: 'Vendor',
      title: 'WAF',
      detail: 'Own contract',
      tag: { label: 'Hop 2', severity: 'warning' }
    },
    {
      icon: 'pi pi-key',
      role: 'Vendor',
      title: 'API gateway',
      detail: 'Own contract',
      tag: { label: 'Hop 3', severity: 'warning' }
    }
  ],
  [{ icon: 'pi pi-server', role: 'Origin', title: 'Your API', detail: 'Every request' }]
]

const COMPARE_WITH = [
  [
    { icon: 'pi pi-mobile', role: 'Client', title: 'Mobile app', detail: 'iOS and Android' },
    { icon: 'pi pi-desktop', role: 'Client', title: 'Web app', detail: 'Browser' }
  ],
  [
    {
      icon: 'pi pi-bolt',
      role: 'Azion',
      title: 'One edge layer',
      detail: 'CDN, WAF, gateway, functions',
      lit: true,
      tag: { label: 'One hop', severity: 'success' }
    }
  ],
  [{ icon: 'pi pi-server', role: 'Origin', title: 'Your API', detail: 'Only on miss' }]
]

const node = ({
  icon,
  role,
  title,
  detail,
  lit,
  tag
}) => `<Flow.Node unstyled class="${lit ? LIT_NODE_CLASS : NODE_CLASS}">
  <span class="flex items-center gap-(--spacing-xs)">
    <i class="${icon} text-(--text-muted)" aria-hidden="true" />
    <Overline class="[&>span]:text-(--text-muted)!">${role}</Overline>${
      tag
        ? `
    <Tag class="ml-auto" label="${tag.label}" severity="${tag.severity}" size="small" />`
        : ''
    }
  </span>
  <span class="text-label-md text-(--text-default)">${title}</span>
  <span class="text-body-xs text-(--text-muted)">${detail}</span>
</Flow.Node>`

const level = (nodes) => `<Flow.Parallel align="start">
${each(nodes, node, 1)}
</Flow.Parallel>`

const architecture = ({ eyebrow, title, description, href, levels }) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="all">
    <div class="flex flex-col bg-(--bg-canvas)">
      <div class="p-(--spacing-xl) pb-0">
        <SectionTitle
          kind="left"
          :framed="false"
          eyebrow="${eyebrow}"
          title="${title}"
          description="${description}"
        >
          <template #actions>
            <Button
              label="See the architecture"
              kind="secondary"
              size="large"
              href="${href}"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </SectionTitle>
      </div>
      <div class="relative overflow-hidden">
        <TextureMaterial kind="dots" size="medium" fade="bottom" />
        <div class="relative z-10 p-(--spacing-xl)">
          <Flow align="center" class="[&>div]:mx-auto [&>div]:gap-(--spacing-xxl)">
${each(levels, level, 6)}
          </Flow>
        </div>
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const COMPARE = {
  eyebrow: 'Architecture',
  title: 'The same traffic, with and without Azion',
  description:
    'Without a shared platform each concern is another vendor between the caller and your origin. With Azion they are one layer, running in the location closest to the caller.',
  href: '/docs/architecture',
  without: { label: 'Without Azion', levels: COMPARE_WITHOUT },
  with: { label: 'With Azion', levels: COMPARE_WITH }
}

const side = ({ label, levels }) => `<CardGrid.Cell kind="canvas">
  <div class="flex flex-col gap-(--spacing-md)">
    <h3 class="m-0 text-label-lg text-(--text-default)">${label}</h3>
    <Flow align="center" class="[&>div]:gap-(--spacing-xl)">
${each(levels, level, 3)}
    </Flow>
  </div>
</CardGrid.Cell>`

const comparison = ({ eyebrow, title, description, href, without, with: withAzion }) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="all">
    <div class="flex flex-col bg-(--bg-canvas)">
      <div class="p-(--spacing-xl) pb-0">
        <SectionTitle
          kind="left"
          :framed="false"
          eyebrow="${eyebrow}"
          title="${title}"
          description="${description}"
        >
          <template #actions>
            <Button
              label="See the architecture"
              kind="secondary"
              size="large"
              href="${href}"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </SectionTitle>
      </div>
      <div class="relative overflow-hidden">
        <TextureMaterial kind="dots" size="medium" fade="bottom" />
        <div class="relative z-10 p-(--spacing-xl)">
          <FrameBox flush borders="y" marks="bottom">
            <CardGrid flush kind="frame" :columns="2">
${each([without, withAzion], side, 7)}
            </CardGrid>
          </FrameBox>
        </div>
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const COMPARE_TEMPLATE = comparison(COMPARE)

const AI_TEMPLATE = architecture(AI_TRAFFIC)
const API_TEMPLATE = architecture(API_PLATFORM)

const meta = {
  title: 'Templates/Marketing/Content/Architectures',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A reference-architecture band: a short title block over a diagram drawn with `Flow` nodes, on a `dots` texture that fades out toward the bottom so the diagram sits on a quiet field instead of a hard edge. Each `Flow.Parallel` is one column of the diagram and the connectors between columns are drawn for you; each node carries its role as an overline, a name, one line of detail and, where it matters, a status tag; the node that carries the platform is lit. Built from `SectionModule`, `FrameBox`, `TextureMaterial`, `SectionTitle`, `Flow`, `Overline`, `Tag` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const AiTraffic = {
  render: () => ({ components, template: AI_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Agents, apps and workflows on the left, one gateway in the middle, and the models, tools and data it reaches on the right.'
      },
      source: { code: toSfc(IMPORTS, AI_TEMPLATE) }
    }
  }
}

export const ApiPlatform = {
  render: () => ({ components, template: API_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The same band carrying a different diagram: callers, the edge layers, then cache and origin.'
      },
      source: { code: toSfc(IMPORTS, API_TEMPLATE) }
    }
  }
}

export const WithAndWithoutAzion = {
  render: () => ({ components, template: COMPARE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Two diagrams of the same traffic in framed cells: the stack of separate vendors between caller and origin, and the one lit Azion layer that replaces them.'
      },
      source: { code: toSfc(IMPORTS, COMPARE_TEMPLATE) }
    }
  }
}
