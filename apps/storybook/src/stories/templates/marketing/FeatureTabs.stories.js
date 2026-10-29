import Button from '@aziontech/webkit/button'
import CodeBlock from '@aziontech/webkit/code-block'
import FrameBox from '@aziontech/webkit/frame-box'
import MediaTabs from '@aziontech/webkit/media-tabs'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { WORKLOAD_RECIPE_TABS } from '../../../../../webkit-sample/src/site/data/workload-recipes.js'
import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, declareTabs, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CodeBlock,
  FrameBox,
  MediaTabs,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const TITLE = 'From a hostname to a full stack, on one platform'
const DESCRIPTION =
  'Storage, a database, a firewall and a cache policy all bind to the same workload. Each one is a binding, not another deployment to run.'

const ITEMS = WORKLOAD_RECIPE_TABS.map(({ title, description }) => ({ title, description }))
const CODE_TABS = WORKLOAD_RECIPE_TABS.map((tab) => tab.code)
const FILES = CODE_TABS.map((tab) => [tab])

const text = (value) => `'${value.replace(/'/g, "\\'")}'`

const CODE_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  '',
  `const items = [\n${ITEMS.map(
    (item) => `  {\n    title: ${text(item.title)},\n    description: ${text(item.description)}\n  }`
  ).join(',\n')}\n]`,
  '',
  declareTabs('codeTabs', CODE_TABS),
  '',
  'const files = codeTabs.map((tab) => [tab])'
]

const CODE_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="horizontal"
      title="${TITLE}"
      description="${DESCRIPTION}"
    >
      <template #actions>
        <Button
          label="Docs"
          kind="secondary"
          size="large"
          href="/docs"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </SectionTitle>
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <div class="-mx-px [--media-tabs-media-min:30rem]">
      <MediaTabs
        :items="items"
        size="medium"
        texture="pixelate"
        texture-size="small"
        texture-fade="top"
        :auto-play-interval="5200"
      >
        <template #media="{ index, active }">
          <div class="w-full min-w-0 p-(--spacing-xl)">
            <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="files[index]"
                show-line-numbers
                :animate-lines="active"
                copy-aria-label="Copy the workload sample"
              />
            </div>
          </div>
        </template>
      </MediaTabs>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Solutions/FeatureTabs',
  excludeStories: ['SITE_SECTION_CODE'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Code = {
  ...editable(
    () => ({
      components,
      setup: () => ({ items: ITEMS, files: FILES }),
      template: CODE_TEMPLATE
    }),
    { items: ITEMS, files: FILES }
  ),
  parameters: {
    docs: {
      source: { code: toSfc(CODE_IMPORTS, CODE_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_CODE = {
  _id: 'feature-tabs-code',
  props: {
    title: TITLE,
    description: DESCRIPTION,
    tabs: WORKLOAD_RECIPE_TABS,
    copyAriaLabel: 'Copy the workload sample',
    action: { label: 'Docs', href: '/docs' }
  }
}

export const CodeJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_CODE)
}
