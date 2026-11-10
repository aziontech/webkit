import cloudflareExtendedColor from '@aziontech/webkit/assets/cloudflare-extended-color.svg'
import cloudflareExtendedReversed from '@aziontech/webkit/assets/cloudflare-extended-reversed.svg'
import vercelExtendedMono from '@aziontech/webkit/assets/vercel-extended-mono.svg'
import vercelExtendedReversed from '@aziontech/webkit/assets/vercel-extended-reversed.svg'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ComparisonTable from '@aziontech/webkit/comparison-table'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { CLOUDFLARE_SECTION, VERCEL_SECTION } from './_sections/comparison-table'

const IMPORT = "import ComparisonTable from '@aziontech/webkit/comparison-table'"

const source = (section) => {
  const { body, script } = sectionMarkup('ComparisonTable', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Comparison/CompareCompetitors',
  component: ComparisonTable,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const Template = (args) => ({
  components: { SectionContainer, SectionGap, ComparisonTable },
  setup() {
    return { args }
  },
  template: inColumn('<ComparisonTable v-bind="args" />')
})

export const AzionVsCloudflare = {
  render: Template,
  args: {
    ...CLOUDFLARE_SECTION.props,
    competitor: {
      name: 'Cloudflare',
      logo: cloudflareExtendedReversed,
      logoLight: cloudflareExtendedColor
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'Six categories with a definition on every capability. The Cloudflare logo has two files: the reversed one for the dark theme and the color one for light.'
      },
      source: { code: source(CLOUDFLARE_SECTION) }
    }
  }
}

export const AzionVsCloudflareJson = {
  tags: ['!dev'],
  ...siteJsonStory(CLOUDFLARE_SECTION)
}

export const AzionVsVercel = {
  render: Template,
  args: {
    ...VERCEL_SECTION.props,
    competitor: {
      name: 'Vercel',
      logo: vercelExtendedReversed,
      logoLight: vercelExtendedMono
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          'All twenty-three rows of the Vercel comparison in seven categories. The Vercel logo has two files: the reversed one for the dark theme and the mono one for light.'
      },
      source: { code: source(VERCEL_SECTION) }
    }
  }
}

export const AzionVsVercelJson = {
  tags: ['!dev'],
  ...siteJsonStory(VERCEL_SECTION)
}
