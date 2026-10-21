import BigNumbers from '@aziontech/webkit/big-numbers'
import FrameBox from '@aziontech/webkit/frame-box'
import Hero from '@aziontech/webkit/hero'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import TextureMaterial from '@aziontech/webkit/texture-material'

import {
  mergeImports,
  SITE_HEADER_COMPONENTS,
  SITE_HEADER_IMPORTS,
  SITE_HEADER_MARKUP,
  SITE_HEADER_SETUP,
  SITE_LINKS
} from '../../_shared/headers'
import { indent } from '../../_shared/markup'
import {
  LG_PROBE_IMPORT,
  SITE_FOOTER_COMPONENTS,
  SITE_FOOTER_IMPORTS,
  SITE_FOOTER_SETUP,
  siteFooterMarkup,
  useSiteFooter
} from '../../_shared/site-footer'
import { toSfc } from '../../_shared/story-source'

const FIGURES = [
  { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
  { value: '24', suffix: '/7', label: 'Support on every plan' },
  { value: '99.99', suffix: '%', label: 'Availability, contractual' }
]

const figure = (item) =>
  `  { value: '${item.value}', suffix: '${item.suffix}', label: '${item.label}' }`

const IMPORTS = [
  ...mergeImports(SITE_HEADER_IMPORTS, [
    "import BigNumbers from '@aziontech/webkit/big-numbers'",
    "import FrameBox from '@aziontech/webkit/frame-box'",
    "import Hero from '@aziontech/webkit/hero'",
    "import SectionContainer from '@aziontech/webkit/section-container'",
    "import SectionGap from '@aziontech/webkit/section-gap'",
    "import SectionModule from '@aziontech/webkit/section-module'",
    "import TextureMaterial from '@aziontech/webkit/texture-material'",
    ...SITE_FOOTER_IMPORTS,
    LG_PROBE_IMPORT
  ]),
  '',
  ...SITE_HEADER_SETUP,
  `const figures = [\n${FIGURES.map(figure).join(',\n')}\n]`,
  '',
  ...SITE_FOOTER_SETUP
]

const TEMPLATE = `<div class="flex min-h-screen w-full flex-col bg-(--bg-canvas) text-(--text-default)">
${indent(SITE_HEADER_MARKUP)}

  <main class="flex-1">
    <Hero kind="band" size="large" max-width="site">
      <Hero.Title
        centered
        title="Run serverless code at the edge"
        description="Functions execute on 100+ data centers worldwide, with no servers to provision and nothing to scale by hand."
      >
        <template #actions>
          <Button label="Start for Free" kind="primary" size="large" href="#" />
          <Button label="Talk to an expert" kind="outlined" size="large" href="#" />
        </template>
      </Hero.Title>
    </Hero>

    <SectionContainer max-width="site">
      <SectionGap hatch />

      <SectionModule :divided="false" :padded="false">
        <FrameBox flush borders="y" marks="bottom">
          <BigNumbers :items="figures" />
        </FrameBox>
      </SectionModule>

      <SectionGap hatch />

      <FrameBox borders="none" marks="all" data-hatch="true" class="h-[calc(var(--spacing-xxl)*2)]">
        <TextureMaterial kind="lines" />
      </FrameBox>
    </SectionContainer>
  </main>

${indent(siteFooterMarkup('site'))}
</div>`

const components = {
  ...SITE_HEADER_COMPONENTS,
  BigNumbers,
  FrameBox,
  Hero,
  'Hero.Title': Hero.Title,
  SectionContainer,
  SectionGap,
  SectionModule,
  TextureMaterial,
  ...SITE_FOOTER_COMPONENTS
}

const meta = {
  title: 'Templates/Shells/SiteShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'The marketing site shell: a sticky `GlobalHeader` in its `site` placement (see Templates › Headers › SiteHeader), one `Hero` band opening the page, every section stacked inside one framed `SectionContainer max-width="site"` separated by hatched gaps, a closing frame that draws no rule of its own, and the `Footer` in its `site` placement closing the page frame. The hero, the sections and the footer all resolve to the site measure, which is the only reason the side rules running down the page are continuous; the hairline above the footer is the mirror of the hero’s top rule, so the frame turns the corner instead of stopping at it. The footer’s social buttons are small, the brand mark leads the social row from `lg` (answered by the `lg:` utility, so it follows the breakpoint token) and moves to the signature band below it, and row two sizes its bands by content, so the row never wraps while the status pair still has room. Built from `GlobalHeader`, `Hero`, `SectionContainer`, `SectionGap`, `SectionModule`, `FrameBox`, `BigNumbers`, `TextureMaterial` and `Footer`. The full mega-menus and the navigation sheet are documented on Templates › Marketing › Shell › SiteNav.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup() {
      return {
        links: SITE_LINKS,
        figures: FIGURES,
        ...useSiteFooter()
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A landing page reduced to its frame: the bar, one hero, one framed section, the close and the footer. Every other band on Templates › Marketing drops into the column between the hero and the close.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
