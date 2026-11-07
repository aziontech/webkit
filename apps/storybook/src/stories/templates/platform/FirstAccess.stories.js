import { toSfc } from '../../_shared/story-source'
import {
  FIRST_ACCESS_COMPONENTS,
  FIRST_ACCESS_SCRIPT,
  firstAccessMain,
  firstAccessState
} from './_home-markup'

const TEMPLATE = firstAccessMain()

const meta = {
  title: 'Templates/Platform/States/FirstAccess',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The first screen a brand-new account sees on Home (`/home` while the account is empty, pinned at `/home-empty-state`), as the console’s HomeEmptyState renders it inside the shell: a greeting under a centred headline, the command prompt as a read-only InputText carrying a search glyph and a Kbd hint for the palette shortcut (a click opens the palette), and three doors (ship something new, add a domain, onboard an agent), each a flush CardBox with an Illustration stage, a title, a description and its own action. Typing a domain-shaped name into the second door opens a Popover under the field that checks the name and says whether Azion can register it. The HomePage template shows this screen inside the shell (its Empty story) next to the populated Home the same URL becomes once the account owns a resource; while it loads, the PageWires FirstAccess wire holds the grid. Built from CardBox, Illustration, InputText, Kbd, Popover, Spinner and Button.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: FIRST_ACCESS_COMPONENTS,
    setup: firstAccessState,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The three doors as Home ships them: Create Application, the domain field with its availability check, and the Copy prompt button for agent onboarding.'
      },
      source: { code: toSfc(FIRST_ACCESS_SCRIPT, TEMPLATE) }
    }
  }
}
