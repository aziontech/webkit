import { toSfc } from '../../_shared/story-source'
import {
  FIREWALL_SETTINGS,
  resourceScript,
  resourceSetup,
  resourceTemplate,
  SETTINGS_COMPONENTS
} from './_resource-settings'

const EDITED = { edits: { debugRules: true } }
const SAVING = { edits: { debugRules: true }, saving: true }

const TEMPLATE = resourceTemplate(FIREWALL_SETTINGS)

const meta = {
  title: 'Templates/Platform/Forms/SettingsSaveBar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The commit bar a settings page mounts once something is edited: a zero-height sticky strip at the bottom of the scroll region holding a full-bleed band with a top rule, an info glyph, the unsaved-changes label with an optional muted hint, and Discard beside Save, stacked under the label on small screens. It slides up on the first edit and back down when the save lands. Every Application, Workload and Firewall Settings tab, the generic resource settings page, Account Settings, Build & Deployment and the function and Edge DNS settings end with it. Built from `Button` inside a `Transition`, over the platform shell with `TabView` and a column of `CardBox` rows.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(FIREWALL_SETTINGS, EDITED),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Firewall Settings tab after Debug Rules was switched on: the bar is up; Discard restores the record and the bar leaves, Save holds its loading state and then leaves.'
      },
      source: { code: toSfc(resourceScript(FIREWALL_SETTINGS, EDITED), TEMPLATE) }
    }
  }
}

export const Saving = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(FIREWALL_SETTINGS, SAVING),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'While the save request is in flight: Save shows its loading state and Discard is disabled.'
      },
      source: { code: toSfc(resourceScript(FIREWALL_SETTINGS, SAVING), TEMPLATE) }
    }
  }
}
