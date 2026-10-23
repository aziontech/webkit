import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import CardGridCell from '@aziontech/webkit/card-grid-cell'
import FrameBox from '@aziontech/webkit/frame-box'
import MediaTile from '@aziontech/webkit/media-tile'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import StickyStack from '@aziontech/webkit/sticky-stack'
import TextureMaterial from '@aziontech/webkit/texture-material'
import { markRaw } from 'vue'

import WorkloadDeployLogsWidget from '../../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadDeployLogsWidget.vue'
import WorkloadDomainsWidget from '../../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadDomainsWidget.vue'
import WorkloadRolloutRowsWidget from '../../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadRolloutRowsWidget.vue'
import WorkloadsListWidget from '../../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadsListWidget.vue'
import WorkloadTopologyChainWidget from '../../../../../webkit-sample/src/site/ui/mockup/widgets/WorkloadTopologyChainWidget.vue'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CardGrid,
  CardGridCell,
  FrameBox,
  MediaTile,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  StickyStack,
  TextureMaterial
}

const DOCS_HREF = 'https://www.azion.com/en/documentation/products/workloads/'

const BARE = { kind: 'bare', chrome: false, width: 600 }

const FEATURES = [
  {
    title: 'Every workload on one list',
    description:
      'See each workload with its domain, status and last deployment, so what is live is never a question.',
    href: DOCS_HREF,
    widget: 'WorkloadsListWidget',
    component: WorkloadsListWidget,
    props: { ...BARE, width: 680 }
  },
  {
    title: 'Read the deployment topology',
    description:
      'The domains, the application and the firewall a workload serves, drawn as one chain.',
    href: DOCS_HREF,
    widget: 'WorkloadTopologyChainWidget',
    component: WorkloadTopologyChainWidget,
    props: BARE
  },
  {
    title: 'Domains and TLS, handled',
    description:
      'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
    href: DOCS_HREF,
    widget: 'WorkloadDomainsWidget',
    component: WorkloadDomainsWidget,
    props: BARE
  },
  {
    title: 'Ship a version in seconds',
    description:
      'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
    href: DOCS_HREF,
    widget: 'WorkloadDeployLogsWidget',
    component: WorkloadDeployLogsWidget,
    props: BARE
  },
  {
    title: 'Gradual rollouts and instant rollback',
    description:
      'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
    href: DOCS_HREF,
    widget: 'WorkloadRolloutRowsWidget',
    component: WorkloadRolloutRowsWidget,
    props: BARE
  }
]

const quoted = (value) => `'${value.replace(/'/g, "\\'")}'`

const propsLiteral = (props) =>
  `{ ${Object.entries(props)
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? quoted(value) : value}`)
    .join(', ')} }`

const declareFeatures = (name, items) =>
  `const ${name} = [\n${items
    .map(
      (item) =>
        `  {\n    title: ${quoted(item.title)},\n    description:\n      ${quoted(item.description)},\n    href: ${quoted(item.href)},\n    component: ${item.widget},\n    props: ${propsLiteral(item.props)}\n  }`
    )
    .join(',\n')}\n]`

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGridCell from '@aziontech/webkit/card-grid-cell'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTile from '@aziontech/webkit/media-tile'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import StickyStack from '@aziontech/webkit/sticky-stack'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  ...FEATURES.map(
    (item) => `import ${item.widget} from '@site/ui/mockup/widgets/${item.widget}.vue'`
  ),
  '',
  declareFeatures('features', FEATURES)
]

const DOCS_ACTION = `<Button
  label="Docs"
  kind="secondary"
  size="small"
  :href="features[index].href"
  icon="pi pi-chevron-right"
  icon-position="trailing"
  animated
/>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      eyebrow="Workloads"
      title="Everything a workload does, one screen at a time"
      description="Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it."
      size="large"
    />
  </template>

  <FrameBox
    flush
    borders="y"
    marks="bottom"
    class="lg:hidden"
  >
    <CardGrid
      flush
      kind="frame"
      :columns="3"
    >
      <CardGridCell
        v-for="feature in features"
        :key="feature.title"
        kind="canvas"
        :padded="false"
      >
        <MediaTile
          kind="plain"
          :title="feature.title"
          :description="feature.description"
        >
          <template #media>
            <div class="h-80 w-full min-w-0">
              <component
                :is="feature.component"
                v-bind="feature.props"
                still
              />
            </div>
          </template>
        </MediaTile>
      </CardGridCell>
    </CardGrid>
  </FrameBox>

  <FrameBox
    flush
    borders="y"
    marks="bottom"
    class="hidden lg:block [--sticky-stack-top:3.5rem] [--sticky-stack-height:min(40rem,calc(100dvh-3.5rem))] [--sticky-stack-align:stretch] [--sticky-stack-frame-border:1px]"
  >
    <StickyStack :items="features">
      <template #media="{ index, active }">
        <div class="contents">
          <div
            class="relative h-[30rem] w-full min-w-0 overflow-hidden rounded-(--shape-card) bg-(--bg-surface) lg:absolute lg:inset-0 lg:h-auto lg:rounded-none lg:border-0 [background-clip:var(--illustration-rim-boxes)] [background-image:linear-gradient(var(--bg-surface),var(--bg-surface)),var(--illustration-rim),linear-gradient(var(--bg-surface),var(--bg-surface))] [background-origin:var(--illustration-rim-boxes)] [border:var(--illustration-rim-width-hairline)_solid_transparent]"
          >
            <TextureMaterial
              kind="dots"
              size="small"
              class="opacity-40"
            />
            <div
              class="relative z-10 flex h-full w-full items-center justify-center p-(--spacing-md) lg:p-(--spacing-xl)"
            >
              <div class="h-[30rem] max-h-full w-full min-w-0">
                <component
                  :is="features[index].component"
                  v-bind="features[index].props"
                  :active="active"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #actions="{ index }">
        ${DOCS_ACTION.split('\n').join('\n        ')}
      </template>
    </StickyStack>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Features/FeatureScroll',
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
  render: () => ({
    components,
    setup: () => ({
      features: FEATURES.map((item) => ({ ...item, component: markRaw(item.component) }))
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'feature-scroll',
  props: {
    eyebrow: 'Workloads',
    title: 'Everything a workload does, one screen at a time',
    description:
      'Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it.',
    items: FEATURES.map(({ title, description, href, widget, props }) => ({
      title,
      description,
      href,
      action: { label: 'Docs', href, trailing: true },
      scene: { component: widget, props }
    }))
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
