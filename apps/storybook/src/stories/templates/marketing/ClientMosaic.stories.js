import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ClientMosaic from '@aziontech/webkit/client-mosaic'
import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION as MOSAIC_SECTION } from './_sections/client-mosaic'
import { SITE_SECTION as COLUMNS_SECTION } from './_sections/client-mosaic-columns'

const MOSAIC_IMPORT = "import ClientMosaic from '@aziontech/webkit/client-mosaic'"
const COLUMNS_IMPORT =
  "import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'"

const source = (tag, importLine, section) => {
  const { body, script } = sectionMarkup(tag, section.props)
  return toSfc([...COLUMN_IMPORTS, importLine, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Social Proof/ClientMosaic',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const MosaicTemplate = (args) => ({
  components: { SectionContainer, SectionGap, ClientMosaic },
  setup() {
    return { args }
  },
  template: inColumn('<ClientMosaic v-bind="args" />')
})

const ColumnsTemplate = (args) => ({
  components: { SectionContainer, SectionGap, ClientMosaicColumns },
  setup() {
    return { args }
  },
  template: inColumn('<ClientMosaicColumns v-bind="args" />')
})

export const Default = {
  render: MosaicTemplate,
  args: withStoryAssets(MOSAIC_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The Home mosaic in four columns, two on a phone. Netshoes leads as a large story tile, GPA runs two rows tall, and six logo tiles fill the rest.'
      },
      source: { code: source('ClientMosaic', MOSAIC_IMPORT, MOSAIC_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(MOSAIC_SECTION)
}

export const Columns = {
  render: ColumnsTemplate,
  args: withStoryAssets(COLUMNS_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'Three featured stories side by side, each mark on a face painted in the client brand colour over a one-line story that links to the case.'
      },
      source: { code: source('ClientMosaicColumns', COLUMNS_IMPORT, COLUMNS_SECTION) }
    }
  }
}

export const ColumnsJson = {
  tags: ['!dev'],
  ...siteJsonStory(COLUMNS_SECTION)
}
