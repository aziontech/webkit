import BigNumbers from '@aziontech/webkit/big-numbers'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const objectLiteral = (item) => {
  const entries = Object.entries(item).map(([key, value]) => `${key}: ${quoted(value)}`)
  const inline = `  { ${entries.join(', ')} }`
  return inline.length <= 100
    ? inline
    : `  {\n${entries.map((entry) => `    ${entry}`).join(',\n')}\n  }`
}

const listLine = (name, items) => `const ${name} = [\n${items.map(objectLiteral).join(',\n')}\n]`

const REACH = [
  { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
  { value: '24', suffix: '/7', label: 'Support on every plan' },
  { value: '99.99', suffix: '%', label: 'Availability, contractual' }
]

const PARTNER_FIGURES = [
  { prefix: '+', value: '100', label: 'Datacenters worldwide' },
  { prefix: '+', value: '3k', label: 'ASNs directly connected to the Azion network' },
  { value: '100', suffix: '%', label: 'availability, guaranteed by SLA' }
]

const importsFor = (name, items) => [
  "import BigNumbers from '@aziontech/webkit/big-numbers'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  listLine(name, items)
]

const components = {
  BigNumbers,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule
}

const statsBand = (name) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <BigNumbers :items="${name}" />
  </FrameBox>
</SectionModule>`)

const REACH_TEMPLATE = statsBand('reach')
const PARTNERS_TEMPLATE = statsBand('figures')

const meta = {
  title: 'Templates/Marketing/Network/StatsBand',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A row of three figures, each a big number with its qualifier, unit and one-line caption, set between two hatched gaps as the page’s proof that the claims around it are measured. Products places it right after the platform guarantees; Partners opens its column with it under the hero form. Built from `SectionModule`, `FrameBox` and `BigNumbers`, which picks its own column count from the number of figures.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Reach = {
  render: () => ({
    components,
    setup: () => ({ reach: REACH }),
    template: REACH_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Products page’s figures: each value carries a unit set beside it (`ms`, `/7`, `%`) and no qualifier.'
      },
      source: { code: toSfc(importsFor('reach', REACH), REACH_TEMPLATE) }
    }
  }
}

export const Partners = {
  render: () => ({
    components,
    setup: () => ({ figures: PARTNER_FIGURES }),
    template: PARTNERS_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Partners page’s figures: two values open with a `+` qualifier and the third closes with a `%` unit.'
      },
      source: { code: toSfc(importsFor('figures', PARTNER_FIGURES), PARTNERS_TEMPLATE) }
    }
  }
}
