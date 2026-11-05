import HeroWithOpening from '@aziontech/webkit/sections/hero-with-opening'

import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SIX_SECTION, THREE_SECTION } from './_sections/hero-with-opening'

const IMPORT = "import HeroWithOpening from '@aziontech/webkit/sections/hero-with-opening'"

const source = (section) => {
  const { body, script } = sectionMarkup('HeroWithOpening', section.props)
  return toSfc([IMPORT, '', ...script], body)
}

const meta = {
  title: 'Templates/Marketing/Heroes/HeroWithOpening',
  component: HeroWithOpening,
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
  components: { HeroWithOpening },
  setup() {
    return { args }
  },
  template: '<HeroWithOpening v-bind="args" />'
})

export const SixArguments = {
  render: Template,
  args: SIX_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Six arguments in two rows of three, for a page that argues on breadth. The headline is short, so it keeps the narrow column and breaks early.'
      },
      source: { code: source(SIX_SECTION) }
    }
  }
}

export const SixArgumentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SIX_SECTION)
}

export const ThreeArguments = {
  render: Template,
  args: THREE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Three arguments in one row, for a page that argues on a few strong claims. The headline is long, so its column widens and it breaks into two lines instead of three.'
      },
      source: { code: source(THREE_SECTION) }
    }
  }
}

export const ThreeArgumentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(THREE_SECTION)
}
