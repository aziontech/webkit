import { toSfc } from '../../_shared/story-source'
import {
  APPLICATION_SETTINGS,
  FIREWALL_SETTINGS,
  NETWORK_LIST_SETTINGS,
  resourceScript,
  resourceSetup,
  resourceTemplate,
  SETTINGS_COMPONENTS,
  WORKLOAD_SETTINGS
} from './_resource-settings'

const APPLICATION_TEMPLATE = resourceTemplate(APPLICATION_SETTINGS)
const WORKLOAD_TEMPLATE = resourceTemplate(WORKLOAD_SETTINGS)
const FIREWALL_TEMPLATE = resourceTemplate(FIREWALL_SETTINGS)
const RESOURCE_TEMPLATE = resourceTemplate(NETWORK_LIST_SETTINGS)

const story = (resource, template, text) => ({
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(resource),
    template
  }),
  parameters: {
    docs: {
      description: { story: text },
      source: { code: toSfc(resourceScript(resource), template) }
    }
  }
})

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
          'The settings page of a resource: the platform shell with the resource breadcrumb, then a small Settings page heading over stacked `Section` bands in the form column, each a heading with an anchor-link button and a `Hint` glyph over a flush `CardBox` of field rows. The commit band is not there at rest: it slides up, pinned full-bleed to the bottom of the scroll region, on the first edit, and leaves once Save lands or Discard restores the record. Application, Workload and Firewall render it as their Settings tab under the resource tab bar; the generic `/<module>/:id/settings` page renders it with no tabs for Domains, Connectors, Custom Pages, Firewall, WAF Rules, Certificate Manager, Network Lists, Data Stream and Object Storage (Functions is edited in its editor instead). Built from the platform shell, `TabView`, `CardBox`, `Item`, `InputText`, `Select`, `MultiSelect`, `Switch`, `Textarea`, `FieldRadioBlock`, `Table`, `Tag`, `Tooltip`, `Message`, `HelperText`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ApplicationSettings = story(
  APPLICATION_SETTINGS,
  APPLICATION_TEMPLATE,
  'An application’s Settings tab: General, Modules and Subscription modules, with Contact sales beside the WebSocket Proxy switch that only sales can turn on. Edit a field and the bar names what changed and what saving publishes.'
)

export const WorkloadSettings = story(
  WORKLOAD_SETTINGS,
  WORKLOAD_TEMPLATE,
  'A workload’s Settings tab, under the environment switcher in the breadcrumb and the Deploy action in the tab bar: General, the Domains table with the environment, policy and certificate of each domain, the collapsed Advanced Settings band holding Deployment Settings, Protocol Settings and Mutual Authentication, and the Danger Zone. The bar sits under the page here, outside the tab’s own scroll region.'
)

export const FirewallSettings = story(
  FIREWALL_SETTINGS,
  FIREWALL_TEMPLATE,
  'A firewall’s Settings tab, with the Documentation action in the heading: General, Modules with DDoS Protection locked on, Debug Rules and Status.'
)

export const ResourceSettings = story(
  NETWORK_LIST_SETTINGS,
  RESOURCE_TEMPLATE,
  'The generic settings page of a first-level resource, drawn from the same field list as its create page: here a network list at /network-lists/:id/settings, with its name under General and the type and entries under List settings. The entries field follows the selected type, and Save checks every field before it commits.'
)
