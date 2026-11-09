import { toSfc } from '../../_shared/story-source'
import {
  APPLICATION_SETTINGS,
  FIREWALL_SETTINGS,
  resourceScript,
  resourceSetup,
  resourceTemplate,
  SETTINGS_COMPONENTS,
  WORKLOAD_SETTINGS
} from './_resource-settings'

const APPLICATION_TEMPLATE = resourceTemplate(APPLICATION_SETTINGS)
const WORKLOAD_TEMPLATE = resourceTemplate(WORKLOAD_SETTINGS)
const FIREWALL_TEMPLATE = resourceTemplate(FIREWALL_SETTINGS)

const meta = {
  title: 'Templates/Platform/Forms/SettingsPage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Settings tab of a resource, the same for every one: the platform shell with the resource breadcrumb, the full-bleed tab bar, then a small page heading over stacked settings bands, each a heading with a `Hint` glyph over a flush `CardBox` of field rows, in the form column, with the full-bleed commit band pinned to the bottom of the scroll region. Application, Workload and Firewall all take this shape. Built from the platform shell, `TabView`, `CardBox`, `Item`, `InputText`, `Switch`, `Tag`, `Tooltip`, `Link`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ApplicationSettings = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(APPLICATION_SETTINGS),
    template: APPLICATION_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'An application: General, Modules and Subscription modules bands under its eight tabs, over the save bar that names what saving publishes.'
      },
      source: { code: toSfc(resourceScript(APPLICATION_SETTINGS), APPLICATION_TEMPLATE) }
    }
  }
}

export const WorkloadSettings = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(WORKLOAD_SETTINGS),
    template: WORKLOAD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A workload: General, its Domains with the environment each answers in, the collapsed Advanced Settings band and the Danger Zone, over the same save bar.'
      },
      source: { code: toSfc(resourceScript(WORKLOAD_SETTINGS), WORKLOAD_TEMPLATE) }
    }
  }
}

export const FirewallSettings = {
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(FIREWALL_SETTINGS),
    template: FIREWALL_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A firewall: General, Modules with DDoS Protection locked on, Debug Rules and Status, over the same save bar.'
      },
      source: { code: toSfc(resourceScript(FIREWALL_SETTINGS), FIREWALL_TEMPLATE) }
    }
  }
}
