import { toSfc } from '../../_shared/story-source'
import {
  FIREWALL_SETTINGS,
  resourceScript,
  resourceSetup,
  resourceTemplate,
  SETTINGS_COMPONENTS
} from './_resource-settings'

const SCRIPT = resourceScript(FIREWALL_SETTINGS)
const DEFAULT_TEMPLATE = resourceTemplate(FIREWALL_SETTINGS)
const SAVING_TEMPLATE = resourceTemplate(FIREWALL_SETTINGS, { saving: true })

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
          'The sticky commit bar a resource settings tab mounts once something is edited: an info glyph, the unsaved-changes label with an optional hint, and Discard beside Save, as a full-bleed band pinned to the bottom of the scroll region, edge to edge like the resource tab bar above it. Every Application, Workload and Firewall Settings tab ends with it. Built from `Button` over a plain sticky footer, inside the platform shell with `TabView`, above a column of `CardBox` rows.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(FIREWALL_SETTINGS),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The bar on the Firewall Settings tab: scroll the tab and the band stays at the bottom edge until the last band passes above it.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_TEMPLATE) }
    }
  }
}

export const Saving = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(FIREWALL_SETTINGS),
    template: SAVING_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'While the save request is in flight: Save shows its loading state and Discard is disabled.'
      },
      source: { code: toSfc(SCRIPT, SAVING_TEMPLATE) }
    }
  }
}
