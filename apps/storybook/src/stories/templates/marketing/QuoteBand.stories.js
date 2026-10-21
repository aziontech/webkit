import contabilizeiSymbolColor from '@aziontech/webkit/assets/contabilizei-symbol-color.png'
import herosparkExtendedColor from '@aziontech/webkit/assets/herospark-extended-color.svg'
import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import Quote from '@aziontech/webkit/quote'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const QUOTE_IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Quote from '@aziontech/webkit/quote'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const HIGHLIGHT_IMPORTS = [
  "import contabilizeiSymbolColor from '@aziontech/webkit/assets/contabilizei-symbol-color.png'",
  ...QUOTE_IMPORTS
]

const SIGNED_IMPORTS = [
  "import herosparkExtendedColor from '@aziontech/webkit/assets/herospark-extended-color.svg'",
  "import Button from '@aziontech/webkit/button'",
  ...QUOTE_IMPORTS
]

const components = { Button, FrameBox, Quote, SectionContainer, SectionGap, SectionModule }

const setup = () => ({ contabilizeiSymbolColor, herosparkExtendedColor })

const HIGHLIGHT_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <Quote
      kind="highlight"
      text="With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed."
      name="Fabrício Santos"
      job-title="DevSecOps Manager at Contabilizei"
      :logo="contabilizeiSymbolColor"
      logo-alt="Contabilizei"
      class="p-(--spacing-xl)"
    />
  </FrameBox>
</SectionModule>`)

const SIGNED_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <Quote
      kind="signed"
      text='"Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."'
      name="Mateus Leonardi"
      job-title="CTO at HeroSpark"
      class="p-(--spacing-xl) lg:max-w-(--container-5xl)"
    >
      <template #mark>
        <img
          :src="herosparkExtendedColor"
          alt="HeroSpark"
          decoding="async"
          class="h-8 w-auto max-w-40 object-contain"
        />
      </template>
      <template #actions>
        <Button
          label="View success story"
          kind="outlined"
          size="large"
          href="https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Quote>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Social Proof/QuoteBand',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'One client quotation standing on its own between two hatched gaps, framed edge to edge with corner marks on its floor. It is the single proof beat of a product page, where a wall of clients would be too much: the Functions page carries the featured Contabilizei quotation, the Workloads page a signed HeroSpark one with a link to its success story. Built from `SectionModule`, `FrameBox`, `Quote` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Highlight = {
  render: () => ({ components, setup, template: HIGHLIGHT_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'From the Functions page: a `kind="highlight"` quotation in the large heading step, with the Contabilizei symbol tile passed as `logo` and set in its own column beside the sentence from `md` up.'
      },
      source: { code: toSfc(HIGHLIGHT_IMPORTS, HIGHLIGHT_TEMPLATE) }
    }
  }
}

export const Signed = {
  render: () => ({ components, setup, template: SIGNED_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'From the Workloads page: a `kind="signed"` quotation held to `--container-5xl` on large screens, signed by the HeroSpark wordmark in the `#mark` slot and closed by an outlined link to the client’s success story.'
      },
      source: { code: toSfc(SIGNED_IMPORTS, SIGNED_TEMPLATE) }
    }
  }
}
