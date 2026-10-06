import agibankExtendedColor from '@aziontech/webkit/assets/agibank-extended-color.svg'
import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
import bancoDeLaNacionExtendedMono from '@aziontech/webkit/assets/banco-de-la-nacion-extended-mono.svg'
import crefisaExtendedReversed from '@aziontech/webkit/assets/crefisa-extended-reversed.svg'
import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
import marisaExtendedColor from '@aziontech/webkit/assets/marisa-extended-color.svg'
import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'
import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import LogoWall from '@aziontech/webkit/logo-wall'
import Quote from '@aziontech/webkit/quote'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import agibankExtendedColor from '@aziontech/webkit/assets/agibank-extended-color.svg'",
  "import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'",
  "import bancoDeLaNacionExtendedMono from '@aziontech/webkit/assets/banco-de-la-nacion-extended-mono.svg'",
  "import crefisaExtendedReversed from '@aziontech/webkit/assets/crefisa-extended-reversed.svg'",
  "import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'",
  "import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'",
  "import marisaExtendedColor from '@aziontech/webkit/assets/marisa-extended-color.svg'",
  "import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'",
  "import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'",
  "import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'",
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import LogoWall from '@aziontech/webkit/logo-wall'",
  "import Quote from '@aziontech/webkit/quote'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  Button,
  FrameBox,
  LogoWall,
  Quote,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const setup = () => ({
  agibankExtendedColor,
  agibankExtendedReversed,
  bancoDeLaNacionExtendedMono,
  crefisaExtendedReversed,
  fourbankExtendedReversed,
  magaluExtendedColor,
  marisaExtendedColor,
  netshoesExtendedColor,
  rennerExtendedColor,
  zoopExtendedColor
})

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      eyebrow="Trusted by Industry Leaders"
      title="Battle-Tested by the World's Largest Banks and E-commerce Companies"
    />
  </template>

  <FrameBox flush borders="y" marks="all">
    <LogoWall
      kind="rectangle"
      aria-label="Banks and e-commerce companies running on Azion"
      :items="[
        { alt: 'Magalu', src: magaluExtendedColor, href: 'https://www.azion.com/en/success-case/magalu/' },
        { alt: 'Banco de la Nación', src: bancoDeLaNacionExtendedMono, href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/' },
        { alt: 'Netshoes', src: netshoesExtendedColor, href: 'https://www.azion.com/en/success-case/netshoes/' },
        { alt: 'Agibank', src: agibankExtendedReversed, href: 'https://www.azion.com/en/success-case/agibank/' },
        { alt: 'Zoop', src: zoopExtendedColor, href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/' },
        { alt: 'Crefisa', src: crefisaExtendedReversed, href: 'https://www.azion.com/en/success-case/crefisa/' },
        { alt: 'Renner', src: rennerExtendedColor, href: 'https://www.azion.com/en/success-case/renner/' },
        { alt: 'Fourbank', src: fourbankExtendedReversed, href: 'https://www.azion.com/en/success-case/fourbank/' },
        { alt: 'Marisa', src: marisaExtendedColor, href: 'https://www.azion.com/en/success-case/marisa/' }
      ]"
    >
      <template #mark="{ item, index }">
        <template v-if="index === 3">
          <img
            :src="agibankExtendedReversed"
            alt="Agibank"
            decoding="async"
            class="h-5 w-auto max-w-full object-contain sm:max-w-24 hidden [[data-theme=dark]_&]:block"
          />
          <img
            :src="agibankExtendedColor"
            alt="Agibank"
            decoding="async"
            class="h-5 w-auto max-w-full object-contain sm:max-w-24 block [[data-theme=dark]_&]:hidden"
          />
        </template>
        <img
          v-else-if="index === 1"
          :src="item.src"
          :alt="item.alt"
          decoding="async"
          class="h-5 w-auto max-w-full object-contain sm:max-w-24 [[data-theme=dark]_&]:invert"
        />
        <img
          v-else-if="index === 5 || index === 7"
          :src="item.src"
          :alt="item.alt"
          decoding="async"
          class="h-5 w-auto max-w-full object-contain sm:max-w-24 invert [[data-theme=dark]_&]:invert-0"
        />
        <img
          v-else
          :src="item.src"
          :alt="item.alt"
          decoding="async"
          class="h-5 w-auto max-w-full object-contain sm:max-w-24"
        />
      </template>
      <template #aside>
        <Quote
          kind="signed"
          text='"Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results."'
          name="Ismael Aguilar"
          job-title="Information Security Manager at Zoop"
        >
          <template #mark>
            <img
              :src="zoopExtendedColor"
              alt="Zoop"
              decoding="async"
              class="h-8 w-auto max-w-40 object-contain"
            />
          </template>
          <template #actions>
            <Button
              label="View success story"
              kind="secondary"
              size="large"
              href="https://www.azion.com/en/success-case/zoop-case-performance-at-scale/"
              target="_blank"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </Quote>
      </template>
    </LogoWall>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Social Proof/LogoWallQuote',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Client marks on the start edge and one of those clients speaking on the end edge, in one frame. `LogoWall` draws the grid and its `#aside` slot holds a signed `Quote`. Used by the Solutions page, under a section title. Cache, Application Accelerator and Our Network hand-roll the same split with their own grid; this is the webkit build to use instead. Built from `SectionModule`, `SectionTitle`, `FrameBox`, `LogoWall`, `Quote` and `Button`. Each mark goes through the `#mark` slot so it can be placed per theme: white artwork is inverted on the light theme, dark artwork on the dark one, colour files are shown as drawn, and a client with a file per theme renders both and lets CSS reveal one.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'From the Solutions page: a `SectionTitle` opens the module, and nine `kind="rectangle"` cells, each linked to that client’s success case, sit beside a Zoop quote. A linked cell lifts its mark and reveals "Read story" on hover and focus.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
