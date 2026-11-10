import { toSfc } from '../../_shared/story-source'
import {
  ACCESS_LIST_SETTINGS,
  DEPLOYABLE_SETTINGS,
  POLICY_SETTINGS,
  PROJECT_SETTINGS,
  resourceScript,
  resourceSetup,
  resourceTemplate,
  SETTINGS_COMPONENTS
} from './_resource-settings'

const PROJECT_TEMPLATE = resourceTemplate(PROJECT_SETTINGS)
const DEPLOYABLE_TEMPLATE = resourceTemplate(DEPLOYABLE_SETTINGS)
const POLICY_TEMPLATE = resourceTemplate(POLICY_SETTINGS)
const RESOURCE_TEMPLATE = resourceTemplate(ACCESS_LIST_SETTINGS)

const story = (resource, template, text, state) => ({
  render: () => ({
    components: SETTINGS_COMPONENTS,
    setup: resourceSetup(resource, state),
    template
  }),
  parameters: {
    docs: {
      description: { story: text },
      source: { code: toSfc(resourceScript(resource, state), template) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Forms/EditResource',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The settings page of a resource: the platform shell with the resource breadcrumb, then a small Settings page heading over stacked `Section` bands in the form column, each a heading with an anchor-link button and a `Hint` glyph over a flush `CardBox` of field rows. The commit band is not there at rest: on the first edit a zero-height sticky strip at the bottom of the scroll region slides up a full-bleed band with a top rule, an info glyph, the unsaved-changes label with an optional muted hint, and Discard beside Save (stacked under the label on small screens), and it leaves once Save lands or Discard restores the record. The account settings pages end with the same band. A resource with a tab bar renders it as its Settings tab; a first-level resource with no tabs renders it as its own `/<resource>/:id/settings` page. Built from the platform shell, `TabView`, `CardBox`, `Item`, `InputText`, `Select`, `MultiSelect`, `Switch`, `Textarea`, `FieldRadioBlock`, `Table`, `Tag`, `Tooltip`, `Message`, `HelperText`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'settings page',
        'resource settings',
        'settings tab',
        'application settings',
        'workload settings',
        'firewall settings',
        'edit settings',
        'página de configurações',
        'configurações do recurso',
        'aba de configurações',
        'save bar',
        'unsaved changes bar',
        'sticky save bar',
        'discard and save',
        'commit bar',
        'barra de salvar',
        'alterações não salvas',
        'salvar alterações',
        'edit resource',
        'editar recurso'
      ],
      skills: ['webkit-form', 'webkit-errors', 'webkit-layout', 'webkit-ux-heuristics']
    }
  }
}

export default meta

export const ProjectSettings = story(
  PROJECT_SETTINGS,
  PROJECT_TEMPLATE,
  'A project’s Settings tab: General, Modules and Subscription modules, with Contact sales beside the WebSocket Proxy switch that only sales can turn on. Edit a field and the bar names what changed and what saving publishes.'
)

export const DeployableSettings = story(
  DEPLOYABLE_SETTINGS,
  DEPLOYABLE_TEMPLATE,
  'A deployable resource’s Settings tab, under the environment switcher in the breadcrumb and the Deploy action in the tab bar: General, the Domains table with the environment, policy and certificate of each domain, the collapsed Advanced Settings band holding Deployment Settings, Protocol Settings and Mutual Authentication, and the Danger Zone. The bar sits under the page here, outside the tab’s own scroll region.'
)

export const PolicySettings = story(
  POLICY_SETTINGS,
  POLICY_TEMPLATE,
  'A security policy’s Settings tab, with the Documentation action in the heading: General, Modules with DDoS Protection locked on, Debug Rules and Status.'
)

export const ResourceSettings = story(
  ACCESS_LIST_SETTINGS,
  RESOURCE_TEMPLATE,
  'The settings page of a first-level resource with no tabs, drawn from the same field list as its create page: here an access list at /access-lists/:id/settings, with its name under General and the type and entries under List settings. The entries field follows the selected type, and Save checks every field before it commits.'
)

export const UnsavedChanges = story(
  POLICY_SETTINGS,
  POLICY_TEMPLATE,
  'The policy Settings tab after Debug Rules was switched on: the bar is up; Discard restores the record and the bar leaves, Save holds its loading state and then leaves.',
  { edits: { debugRules: true } }
)

export const Saving = story(
  POLICY_SETTINGS,
  POLICY_TEMPLATE,
  'While the save request is in flight: Save shows its loading state and Discard is disabled.',
  { edits: { debugRules: true }, saving: true }
)
