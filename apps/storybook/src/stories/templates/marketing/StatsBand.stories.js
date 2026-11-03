import BigNumbers from '@aziontech/webkit/big-numbers'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
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
  { prefix: '+', value: '100', label: 'Data centers worldwide' },
  { prefix: '+', value: '3k', label: 'ASNs directly connected to Azion' },
  { value: '100', suffix: '%', label: 'Availability, guaranteed by SLA' }
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
  excludeStories: ['REACH_SECTION', 'PARTNERS_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Reach = {
  ...editable(
    () => ({
      components,
      setup: () => ({ reach: REACH }),
      template: REACH_TEMPLATE
    }),
    { reach: REACH }
  ),
  parameters: {
    docs: {
      source: { code: toSfc(importsFor('reach', REACH), REACH_TEMPLATE) }
    }
  }
}

export const REACH_SECTION = {
  _id: 'stats-band',
  props: { items: REACH }
}

export const ReachJson = {
  tags: ['!dev'],
  ...siteJsonStory(REACH_SECTION)
}

export const Partners = {
  ...editable(
    () => ({
      components,
      setup: () => ({ figures: PARTNER_FIGURES }),
      template: PARTNERS_TEMPLATE
    }),
    { figures: PARTNER_FIGURES }
  ),
  parameters: {
    docs: {
      source: { code: toSfc(importsFor('figures', PARTNER_FIGURES), PARTNERS_TEMPLATE) }
    }
  }
}

export const PARTNERS_SECTION = {
  _id: 'stats-band',
  props: { items: PARTNER_FIGURES }
}

export const PartnersJson = {
  tags: ['!dev'],
  ...siteJsonStory(PARTNERS_SECTION)
}
