import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import ProductWidget from '@aziontech/webkit/product-widget'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import ProductWidget from '@aziontech/webkit/product-widget'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'"
]

const components = {
  Button,
  FrameBox,
  ProductWidget,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  TextureMaterial
}

const TITLE = 'Deploy your first function in two commands'

const DESCRIPTION =
  'Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion.'

const TERMINAL_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <div class="contents [--section-title-headline-span:2] [--section-title-headline-max:var(--container-xl)]">
      <SectionTitle
        kind="horizontal"
        padding="small"
        eyebrow="Azion CLI"
        title="${TITLE}"
        description="${DESCRIPTION}"
      >
        <template #actions>
          <Button
            label="Install the CLI"
            kind="outlined"
            size="large"
            href="https://www.azion.com/en/documentation/products/azion-cli/overview/"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </SectionTitle>
    </div>
  </template>

  <FrameBox flush borders="y" marks="all">
    <div
      class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-16) md:pt-(--spacing-32) [--texture-wave-gain:1.8] [--texture-wave-pace:5] [--texture-pool-a:50%_100%] [--texture-pool-b:50%_0%]"
    >
      <TextureMaterial kind="pixelate" size="small" fade="none" />
      <div
        class="relative z-10 mx-auto -mb-(--spacing-xs) h-(--size-72) w-full max-w-(--container-4xl) rounded-(--shape-elements) shadow-(--shadow-2xl) md:h-(--size-96)"
      >
        <ProductWidget name="cli-terminal-deploy" />
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/CLI/CliTerminal',
  excludeStories: ['SITE_SECTION_TERMINAL'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Terminal = {
  ...editable(() => ({ components, template: TERMINAL_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TERMINAL_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_TERMINAL = {
  _id: 'cli-terminal',
  props: {
    eyebrow: 'Azion CLI',
    title: TITLE,
    description: DESCRIPTION,
    script: 'deploy',
    actions: [
      {
        label: 'Install the CLI',
        href: 'https://www.azion.com/en/documentation/products/azion-cli/overview/',
        kind: 'outlined',
        trailing: true
      }
    ]
  }
}

export const TerminalJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_TERMINAL)
}
