# DeployDrawer (`platform/create/deploy-drawer`)

> The drawer a platform deploys from, opened by the outlined Deploy button on a service or a project. Every variant shares one Resources card: a row per resource with its Ready tag, the picked version and a Change version menu, and a Dependencies disclosure with the modules and integrations the service references. On a service the default flow is environment first: the Project card uses an existing project or creates one, the environments come as radio blocks, and Projects impacted lists every project the environment’s shared Deployment Settings publish to. A deploy started without a pinned version first builds one, so the drawer opens as Build and deployment with a Building row and the other sections faded. A service can also deploy project first, picking the project before the environment. On a project, the drawer carries every resource it serves and warns when its Deployment Settings also publish elsewhere. Built from `SettingsSection`, `Drawer`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Card`, `Item`, `Accordion`, `Separator`, `Popover`, `DropdownMenu`, `ToggleGroup`, `Field` choice cards with `RadioButton`, `Input`, `Avatar`, `Tag`, `Spinner`, `Alert`, `Tooltip` and `Button`.

- Surface: product
- Source: `blocks/platform/create/deploy-drawer/deploy-drawer.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/deploy-drawer")`
- Components: [Accordion](../../../components/accordion.md), [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`, [DropdownMenu](../../../components/dropdown-menu.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [Item](../../../components/item.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Popover](../../../components/popover.md), [RadioButton](../../../components/radio-button.md), [Separator](../../../components/separator.md), [SettingsSection](../../../components/settings-section.md), [Skeleton](../../../components/skeleton.md), [Spinner](../../../components/spinner.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-ui-states`

## Asked as

deploy drawer; deploy panel; deploy service; choose versions to deploy; dependencies before deploy; release drawer; gaveta de deploy; implantar serviço; escolher versão

The drawer a platform deploys from, opened by Deploy on a service or a project. The user is about to put a version into traffic and needs to confirm exactly what goes out (each resource and dependency at a version), where it goes (a project and one of its environments) and what else it reaches (every project that shares the environment's Deployment Settings). One Deploy at the foot commits all of it.

## When to use

- A service or a project has a ready version and the user deploys it from its page or list.
- The deploy reaches more than the resource itself: dependencies at their own versions, or other projects through shared Deployment Settings.
- A service deploys to a project that may not exist yet; the Project section creates it in place.

## When not to use

- Creating or editing an item inside a resource: use `platform/create/create-in-drawer`.
- The first deploy at the end of a create flow: use `platform/create/deploy-template` or `platform/create/provision-wizard`, which stream `platform/create/deployment-flow` in the page.
- Reading what a past deploy did: use `platform/detail/deployment-logs` or `platform/detail/version-detail`.
- Binding one resource to another without deploying: use `platform/create/resource-picker`.

## Building blocks

### A. Trigger and frame — `Drawer`, `DrawerTrigger`, `Button`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

An outlined medium `Button` reading Deploy inside `DrawerTrigger`, on the service or project page. The `Drawer` is `size="medium"`, portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title.

### B. Panel header — `PanelHeader`, `DrawerTitle`, `DrawerClose` (required)

`DrawerTitle` reads Deploy, or Build and deployment while a version is being built first. `DrawerClose` on the right; no Cancel anywhere.

### C. Sections — `PanelContent`, `SettingsSection` (required)

`PanelContent` holds one `fieldset` of `SettingsSection` bands, each with a title and a `hint`: Resources, Project, Environment, Projects impacted on a service; Resources and Environment on a project. The order is the order of the decision: what, where, then what else it reaches.

### D. Resources card — `Card`, `Separator`, `Item`, `Tag`, `DropdownMenu`, `Input`, `Avatar`, `Button` (required)

`Card :padded="false"` with one small inline `Item` per resource, split by `Separator`s. Each row shows a small `Tag` reading Ready, or a warning tag when no version is ready, and the picked version. Change version, an outlined small `Button`, opens a `DropdownMenu`: the summary and a search `Input` in its top slot, one `DropdownMenu.Option` per version (the author `Avatar` on the left, the name with an Active `Tag`, the age on the right, the picked one `selected`), and a transparent Load more `Button` in its bottom slot. The menu gives the rows their roles, arrow-key movement, hover and focus, so the block never re-types them. Disable Change version when there is nothing to change to.

### E. Dependencies — `Accordion`, `Item`, `Tag`, `DropdownMenu` (required)

A small `Accordion` below the resource rows, collapsed, listing the modules and integrations the service references, each with its own version and Change version menu. Dependencies go out with the deploy, so they are shown even when the user does not change them.

### F. Project — `ToggleGroup`, `Item`, `Tag`, `Tooltip`, `Popover`, `DropdownMenu` (required on a service)

A full-width `ToggleGroup` in the card header switches between Use existing and Create new. The project is an outlined `Item`: its name, a New `Tag` when it will be created, and its domains grouped by environment, the first one linked with a `Tooltip`, the rest behind a `+N` `Tag` that opens a searchable `Popover`. Change opens a `DropdownMenu` of the projects grouped by how they relate to the service.

### G. Environment — `Field`, `RadioButton`, `Tag` (required)

Choice cards, one horizontal `Field` with a `RadioButton` per environment of the project, each with one sentence on how it serves traffic and a small `Tag` such as Last used. The group carries an `aria-label`.

### H. Projects impacted and commit — `Item`, `Tag`, `Tooltip`, `Popover`, `PanelFooter`, `Button` (required on a service)

Every project the chosen environment's shared Deployment Settings publish to, grouped by environment, the current one tagged Selected, with its domains shown like the Project card. `PanelFooter` holds one primary medium `Button` reading Deploy, alone on the right, of `type="submit"`.

## Do

- Show every resource and dependency with the version that will go out, even when the user changes nothing.
- Preselect the last used project and environment, and say so with a tag.
- List every project a shared Deployment Setting reaches before the user deploys, not after.
- When no version is pinned, open as Build and deployment with a Building row, keep the other sections faded and `inert`, and disable Deploy until the build lands.
- On a project, warn with an `Alert` above the environments when its Deployment Settings also publish elsewhere.
- Keep an environment that Strict Deployment Settings lock visible but disabled, with a Strict tag and one sentence naming the settings and the service they keep bound.
- Tag an environment Also deploys (warning) when the chosen environment's shared settings reach it, and say once, in a warning `Alert`, how many environments go live at once.
- Say in an info `Alert` when the deploy replaces another service on the chosen project, naming both.
- When a choice changes what the deploy reaches, reload that section in place: `Skeleton` rows, `aria-busy` on the region and one `role="status"` line; never clear the whole drawer.
- Tag a dependency other services reference as Shared, name them in a `Tooltip`, and say once that a shared dependency deploys at one version.
- When a dependency has no ready version, disable Deploy and say why in the footer, next to the button it disables.
- After Deploy, follow `platform/states/async-submit`: the drawer closes and one toast per run turns from Deploying… into the outcome, with Edit (reopens the drawer with the same choices) and Redeploy.

## Don't

- Don't deploy from a dialog, or ask for confirmation after Deploy; the drawer is the review.
- Don't hide dependencies or impacted projects behind a second step.
- Don't let Change version list hundreds of versions at once; search plus Load more.
- Don't add a second commit such as Save as draft; one Deploy.
- Don't print the shared-settings warning on each impacted row; it belongs once, above them.
- Don't hide a locked environment, or let it be picked and fail at deploy time.
- Don't offer View deployments in the outcome toast; it carries Edit and Redeploy.

## Copy

- **Trigger, title, commit:** "Deploy" on all three; "Build and deployment" as the title only while a build runs first.
- **Section hints:** one sentence on what the section decides, e.g. "The project whose domains serve the service."
- **Version control:** "Change version"; search placeholder and `aria-label` "Search versions"; footer "Load 10 more".
- **Project modes:** "Use existing" and "Create new".
- **Environment descriptions:** one sentence on how it serves, e.g. "Live traffic. One version serves the domain, and deploying replaces it."
- **Tags:** one or two words, e.g. "Ready", "Active", "Last used", "Selected", "New".
- **In progress:** the progressive verb with `…`, e.g. "Building…".
- **Run toast:** "Deploying web-app…" with "<version> to <environments>. It keeps running if you leave."; the outcome "web-app is live in Production." or "web-app wasn't deployed." with what failed and that nothing changed; actions "Edit" and "Redeploy".
- **Locks and reach:** "<settings> is Strict, so <service> stays bound to <environment>."; "Also deploys"; "<settings> is shared, so it deploys at one version."
- Follow `skills/webkit-microcopy`: Deploy, never publish or activate; sentence case; no em dash.

## Accessibility

- The drawer traps focus while open and returns it to the Deploy trigger on close.
- The `form` and the `ToggleGroup` carry `aria-label`s; the environment group is named by its `aria-label`.
- The version menu is a `role="menu"` moved with the arrow keys, each version a `menuitem` named by its version, author and age; the current one carries `aria-current`; search inputs have an `aria-label` that matches the placeholder.
- Each impacted environment group has an `aria-label` with its count, e.g. "Projects impacted in Production (3)".
- Faded sections during a build are `inert`, so keyboard users cannot reach controls that do nothing yet.
- A section that reloads carries `aria-busy="true"` with its `Skeleton` rows `aria-hidden`, and a `role="status"` line reads Loading the projects this deployment reaches, or Loading dependencies.
- A locked environment's radio is `disabled`; its reason is the card's description, so it is read with the choice.
- The Shared tag sits in a focusable wrapper so its `Tooltip` opens from the keyboard, and its name already says who else references it.
- A disabled Deploy is described by the footer line that explains why (`aria-describedby`).
- Run progress and outcome reach screen readers through the toast region, so the user hears them from any page.
- Glyphs in rows are decorative and carry `aria-hidden="true"`; tags give the state in words.

## States

- Service: a service deploying environment first; Resources, Project with the last used project, Environment and Projects impacted.
- Building: no pinned version; titled Build and deployment with a Building row in place of Resources, the other sections faded and inert, Deploy disabled.
- ServiceProjectFirst: the project-first flow; Resources, the Project card with the last used project and a Change popover, then every environment.
- Project: deploying a project; its service and storage in Resources, Production and Preview, and a warning about other projects that share its storefront settings.
- Environment: a locked Strict environment, an Also deploys tag, the replace and multi-environment `Alert`s, Projects impacted grouped per environment and reloaded on switch; the run ends in a success toast with Edit and Redeploy.
- Dependencies: the open Dependencies disclosure with a Shared dependency, a not-versioned integration and a dependency with no ready version that blocks Deploy; changing the service version reloads the list. The first run fails and its toast offers Edit and Redeploy; Redeploy succeeds.

## Related

- `platform/create/create-in-drawer` — the drawer that creates items rather than deploying.
- `platform/create/deployment-flow` — the run a deploy streams once it starts.
- `platform/states/async-submit` — the toast and outcome rule every deploy started here follows.
- `platform/detail/deployment-logs` — the logs of a deploy after it ran.
- `platform/detail/version-detail` — what a version contains before it is deployed.
- `platform/create/resource-picker` — the Existing or New pattern the Project section follows.
- `SettingsSection` — the band each section uses; see `skills/webkit-create-surface` for the drawer commit model.

## Variants

- `Service` — primary (the code below)
- `Building` — Deploy without a pinned version: the drawer opens as Build and deployment, a Building row with the new version and its elapsed seconds stands in for the Resources card, and the Project, Environment and Projects impacted sections stay faded and inert, with Deploy disabled, until the build lands.
- `ServiceProjectFirst` — The project-first flow: the same Resources card, a Project card with the last used project, its domain and a Change popover of the projects serving the service, then every environment as a radio block.
- `Project` — Deploy on a project: the Resources card with the service it serves and its dependencies, then its storage, which is not versioned; Production and Preview below, with a warning that shared-storefront also publishes to project-05 and project-09.
- `Environment` — The environment decision at its edges: Staging is locked by Strict Deployment Settings (a disabled choice card with a Strict tag and the reason), Preview is tagged Also deploys because Production's shared settings reach it, an info Alert says the deploy replaces legacy-web on the chosen project and a warning Alert says it goes live in two environments at once. Projects impacted are grouped per environment with a heading and a count, and switching environment reloads them with Skeleton rows, aria-busy and a status line. Deploy closes the drawer and reports through one toast that turns from Deploying… into the outcome with Edit and Redeploy.
- `Dependencies` — The Dependencies disclosure open: each module and integration with its own version and Change version menu, auth-gateway tagged Shared with a Tooltip naming the services that also reference it and one info Alert saying a shared dependency deploys at one version, payments-api not versioned (a note instead of the menu), and geo-redirect with no ready version, which disables Deploy with the reason in the footer. Changing the service version reloads the dependencies with Skeleton rows, aria-busy and a status line; a second resource that references nothing says so. The first run fails and its toast carries Edit and Redeploy; Redeploy succeeds.

Each variant is the same screen in another state: `get_pattern("platform/create/deploy-drawer", { variant })`, or the file under `blocks/platform/create/deploy-drawer/variants/`.

## Code (`Service`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Separator from '@aziontech/webkit/separator'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  interface Version {
    id: string
    name: string
    author: string
    createdAgo: string
    active?: boolean
  }
  interface Dependency {
    key: string
    label: string
    name: string
    icon: string
    note: string
    total: number
    versions: Version[]
  }
  interface Resource extends Dependency {
    owner: boolean
    dependencies: Dependency[]
  }
  interface DomainGroup {
    environment: string
    total: number
    summary: string
    domains: string[]
  }
  interface ExistingProject {
    id: string
    name: string
    detail: string
    domains: DomainGroup[]
  }
  interface ProjectGroup {
    key: string
    label: string
    projects: ExistingProject[]
  }
  interface ProjectView {
    id?: string
    name: string
    domain?: string
    detail?: string
    domains?: DomainGroup[]
  }

  const resources: Resource[] = [
    {
      key: 'service',
      label: 'Service',
      name: 'web-app',
      icon: 'pi pi-server',
      note: '',
      total: 6,
      versions: [
        {
          id: 'AEO25I38',
          name: 'AEO25I38',
          author: 'Rafael Umman',
          createdAgo: '1 day ago',
          active: true
        },
        {
          id: 'AG1VVDJP',
          name: 'AG1VVDJP',
          author: 'Marcus Grando',
          createdAgo: '3 days ago'
        },
        {
          id: 'AHFPL906',
          name: 'AHFPL906',
          author: 'Bruno Germano',
          createdAgo: '3 days ago'
        },
        { id: 'AITJB4GN', name: 'AITJB4GN', author: 'Gab Lisboa', createdAgo: '4 days ago' },
        {
          id: 'AK7D0ZX4',
          name: 'AK7D0ZX4',
          author: 'Robson Junior',
          createdAgo: '6 days ago'
        }
      ],
      owner: true,
      dependencies: [
        {
          key: 'service@AG1VVDJP:module-auth-gateway',
          label: 'Module',
          name: 'auth-gateway',
          icon: 'pi pi-code',
          note: '',
          total: 8,
          versions: [
            {
              id: 'APICRFV0',
              name: 'APICRFV0',
              author: 'Rafael Umman',
              createdAgo: '2 days ago'
            },
            {
              id: 'AQW6HBBH',
              name: 'AQW6HBBH',
              author: 'Marcus Grando',
              createdAgo: '3 days ago'
            },
            {
              id: 'ASA076RY',
              name: 'ASA076RY',
              author: 'Bruno Germano',
              createdAgo: '5 days ago'
            },
            {
              id: 'ATNTX28F',
              name: 'ATNTX28F',
              author: 'Gab Lisboa',
              createdAgo: '5 days ago'
            },
            {
              id: 'AV1NMXOW',
              name: 'AV1NMXOW',
              author: 'Robson Junior',
              createdAgo: '6 days ago'
            }
          ]
        },
        {
          key: 'service@AG1VVDJP:module-geo-redirect',
          label: 'Module',
          name: 'geo-redirect',
          icon: 'pi pi-code',
          note: '',
          total: 11,
          versions: [
            {
              id: 'AK16MQ4R',
              name: 'AK16MQ4R',
              author: 'Herbert Júlio',
              createdAgo: '2 days ago'
            },
            {
              id: 'ALF0CLL8',
              name: 'ALF0CLL8',
              author: 'Rafael Umman',
              createdAgo: '4 days ago'
            },
            {
              id: 'AMSU2H1P',
              name: 'AMSU2H1P',
              author: 'Marcus Grando',
              createdAgo: '4 days ago'
            },
            {
              id: 'AO6NSCI6',
              name: 'AO6NSCI6',
              author: 'Bruno Germano',
              createdAgo: '6 days ago'
            },
            {
              id: 'APKHI7YN',
              name: 'APKHI7YN',
              author: 'Gab Lisboa',
              createdAgo: '6 days ago'
            }
          ]
        },
        {
          key: 'service@AG1VVDJP:integration-payments-api',
          label: 'Integration',
          name: 'payments-api',
          icon: 'pi pi-link',
          note: '',
          total: 11,
          versions: [
            {
              id: 'ASEKWJQF',
              name: 'ASEKWJQF',
              author: 'Gab Lisboa',
              createdAgo: '21 hours ago'
            },
            {
              id: 'ATSEMF6W',
              name: 'ATSEMF6W',
              author: 'Robson Junior',
              createdAgo: '2 days ago'
            },
            {
              id: 'AV68CAND',
              name: 'AV68CAND',
              author: 'Isaque Böck',
              createdAgo: '2 days ago'
            },
            {
              id: 'AWK2263U',
              name: 'AWK2263U',
              author: 'Rafael Garbinatto',
              createdAgo: '3 days ago'
            },
            {
              id: 'AXXVS1KB',
              name: 'AXXVS1KB',
              author: 'Herbert Júlio',
              createdAgo: '5 days ago'
            }
          ]
        }
      ]
    }
  ]

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  const newProject: ProjectView = { name: 'web-app', domain: 'web-app.example.com' }

  const projectGroups: ProjectGroup[] = [
    {
      key: 'serving',
      label: 'Serving web-app',
      projects: [
        {
          id: '1020655',
          name: 'project-01',
          detail: '2 environments',
          domains: [
            {
              environment: 'Production',
              total: 8,
              summary: '8 domains',
              domains: [
                'project-1.example.com',
                'project-1-alias-1.example.com',
                'project-1-alias-2.example.com',
                'project-1-alias-3.example.com',
                'project-1-alias-4.example.com',
                'project-1-alias-5.example.com',
                'project-1-alias-6.example.com',
                'project-1-alias-7.example.com'
              ]
            }
          ]
        }
      ]
    },
    {
      key: 'flexible',
      label: 'Flexible',
      projects: [
        {
          id: '1031410004',
          name: 'campaign-landing',
          detail: 'Serves black-friday-2025',
          domains: [
            {
              environment: 'Production',
              total: 1,
              summary: '1 domains',
              domains: ['campaign.example.com']
            }
          ]
        },
        {
          id: '1031410005',
          name: 'docs-site',
          detail: 'Serves docs-web · Preview only',
          domains: [
            {
              environment: 'Preview',
              total: 1,
              summary: '1 domains',
              domains: ['*-preview.docs.example.com']
            }
          ]
        },
        {
          id: '1021001',
          name: 'project-03',
          detail: 'Serves analytics-pro',
          domains: [
            {
              environment: 'Production',
              total: 22,
              summary: '10 of 22 domains',
              domains: [
                'project-3.example.com',
                'project-3-alias-1.example.com',
                'project-3-alias-2.example.com',
                'project-3-alias-3.example.com',
                'project-3-alias-4.example.com',
                'project-3-alias-5.example.com',
                'project-3-alias-6.example.com',
                'project-3-alias-7.example.com',
                'project-3-alias-8.example.com',
                'project-3-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1021866',
          name: 'project-08',
          detail: 'Serves ecommerce-v2',
          domains: [
            {
              environment: 'Production',
              total: 57,
              summary: '10 of 57 domains',
              domains: [
                'project-8.example.com',
                'project-8-alias-1.example.com',
                'project-8-alias-2.example.com',
                'project-8-alias-3.example.com',
                'project-8-alias-4.example.com',
                'project-8-alias-5.example.com',
                'project-8-alias-6.example.com',
                'project-8-alias-7.example.com',
                'project-8-alias-8.example.com',
                'project-8-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1022731',
          name: 'project-13',
          detail: 'Serves mobile-app',
          domains: [
            {
              environment: 'Production',
              total: 92,
              summary: '10 of 92 domains',
              domains: [
                'project-13.example.com',
                'project-13-alias-1.example.com',
                'project-13-alias-2.example.com',
                'project-13-alias-3.example.com',
                'project-13-alias-4.example.com',
                'project-13-alias-5.example.com',
                'project-13-alias-6.example.com',
                'project-13-alias-7.example.com',
                'project-13-alias-8.example.com',
                'project-13-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1023596',
          name: 'project-18',
          detail: 'Serves react-dashboard',
          domains: [
            {
              environment: 'Production',
              total: 28,
              summary: '10 of 28 domains',
              domains: [
                'project-18.example.com',
                'project-18-alias-1.example.com',
                'project-18-alias-2.example.com',
                'project-18-alias-3.example.com',
                'project-18-alias-4.example.com',
                'project-18-alias-5.example.com',
                'project-18-alias-6.example.com',
                'project-18-alias-7.example.com',
                'project-18-alias-8.example.com',
                'project-18-alias-9.example.com'
              ]
            }
          ]
        }
      ]
    }
  ]

  const environmentChoices = [
    {
      name: 'Production',
      description: 'Live traffic. One version serves the domain, and deploying replaces it.',
      tag: 'Last used'
    },
    {
      name: 'Preview',
      description:
        'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
      tag: ''
    }
  ]

  const impacted = [
    {
      environment: 'Production',
      projects: [
        {
          id: '1020655',
          name: 'project-01',
          selected: true,
          domains: [
            {
              environment: 'Production',
              total: 8,
              summary: '8 domains',
              domains: [
                'project-1.example.com',
                'project-1-alias-1.example.com',
                'project-1-alias-2.example.com',
                'project-1-alias-3.example.com',
                'project-1-alias-4.example.com',
                'project-1-alias-5.example.com',
                'project-1-alias-6.example.com',
                'project-1-alias-7.example.com'
              ]
            }
          ]
        },
        {
          id: '1021347',
          name: 'project-05',
          domains: [
            {
              environment: 'Production',
              total: 36,
              summary: '10 of 36 domains',
              domains: [
                'project-5.example.com',
                'project-5-alias-1.example.com',
                'project-5-alias-2.example.com',
                'project-5-alias-3.example.com',
                'project-5-alias-4.example.com',
                'project-5-alias-5.example.com',
                'project-5-alias-6.example.com',
                'project-5-alias-7.example.com',
                'project-5-alias-8.example.com',
                'project-5-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1022039',
          name: 'project-09',
          domains: [
            {
              environment: 'Production',
              total: 64,
              summary: '10 of 64 domains',
              domains: [
                'project-9.example.com',
                'project-9-alias-1.example.com',
                'project-9-alias-2.example.com',
                'project-9-alias-3.example.com',
                'project-9-alias-4.example.com',
                'project-9-alias-5.example.com',
                'project-9-alias-6.example.com',
                'project-9-alias-7.example.com',
                'project-9-alias-8.example.com',
                'project-9-alias-9.example.com'
              ]
            }
          ]
        }
      ]
    }
  ]

  const open = ref(false)
  const picks = reactive<Record<string, string>>({ service: 'AG1VVDJP' })
  const versionOpen = reactive<Record<string, boolean>>({})
  const projectMode = ref('existing')
  const projectId = ref('1020655')
  const environment = ref('Production')

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject
      : (projectGroups
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === projectId.value) ?? projectGroups[0].projects[0])
  )

  const versionOf = (row: Dependency) =>
    row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0]

  const versionSummary = (row: Dependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const pickVersion = (row: Dependency, id: string) => {
    picks[row.key] = id
    versionOpen[row.key] = false
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.keys(picks).forEach((key) => delete picks[key])
    picks.service = 'AG1VVDJP'
    Object.keys(versionOpen).forEach((key) => delete versionOpen[key])
    projectMode.value = 'existing'
    projectId.value = '1020655'
    environment.value = 'Production'
  })
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        kind="outlined"
        size="medium"
        icon="pi pi-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Deploy"
          novalidate
          @submit.prevent="open = false"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Deploy</DrawerTitle>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Deploy</legend>
              <SettingsSection
                title="Resources"
                hint="The service version this deployment publishes, and the version of every module and integration it references."
              >
                <Card :padded="false">
                  <template #content>
                    <template
                      v-for="(row, index) in resources"
                      :key="row.key"
                    >
                      <Separator v-if="index" />
                      <Item
                        kind="inline"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              :class="row.icon"
                              class="text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <span class="shrink-0 text-body-sm text-(--text-muted)">
                              {{ row.label }}
                            </span>
                            <Item.Title>{{ row.name }}</Item.Title>
                            <Tag
                              v-if="!row.note"
                              :label="row.versions.length ? 'Ready' : 'No ready version'"
                              :severity="row.versions.length ? 'success' : 'warning'"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <Item.Description>
                            {{ row.note || versionOf(row).name }}
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions v-if="!row.note">
                          <DropdownMenu
                            v-model:open="versionOpen[row.key]"
                            placement="bottom-end"
                            @select="(_event, id) => pickVersion(row, String(id))"
                          >
                            <DropdownMenu.Trigger>
                              <Button
                                label="Change version"
                                kind="outlined"
                                size="small"
                                icon="pi pi-chevron-down"
                                icon-position="trailing"
                                :disabled="!row.versions.length"
                              />
                            </DropdownMenu.Trigger>
                            <template #top>
                              <div
                                class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                              >
                                <p class="text-label-sm text-(--text-muted)">
                                  {{ versionSummary(row) }}
                                </p>
                                <Input
                                  v-if="row.total > row.versions.length"
                                  size="medium"
                                  placeholder="Search versions"
                                  aria-label="Search versions"
                                >
                                  <template #iconLeft>
                                    <i
                                      class="pi pi-search"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </Input>
                              </div>
                            </template>
                            <DropdownMenu.Group>
                              <DropdownMenu.Option
                                v-for="entry in row.versions"
                                :key="entry.id"
                                :value="entry.id"
                                :label="entry.name"
                                :selected="entry.id === versionOf(row).id"
                                :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                              >
                                <template #left>
                                  <Avatar
                                    :alt="entry.author"
                                    :label="entry.author"
                                    size="small"
                                    kind="square"
                                  />
                                </template>
                                <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
                                  <span class="truncate">{{ entry.name }}</span>
                                  <Tag
                                    v-if="entry.active"
                                    label="Active"
                                    severity="success"
                                    size="small"
                                    class="shrink-0"
                                  />
                                </span>
                                <template #right>
                                  <span class="text-body-xs text-(--text-muted)">{{
                                    entry.createdAgo
                                  }}</span>
                                </template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                            <template
                              v-if="row.total > row.versions.length"
                              #bottom
                            >
                              <div
                                class="border-t border-(--border-default) px-(--spacing-xxs) pt-(--spacing-xxs)"
                              >
                                <Button
                                  :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                                  kind="transparent"
                                  size="small"
                                  class="w-full"
                                />
                              </div>
                            </template>
                          </DropdownMenu>
                        </Item.Actions>
                      </Item>
                      <template v-if="row.owner">
                        <Separator />
                        <Accordion
                          type="single"
                          collapsible
                          size="medium"
                        >
                          <Accordion.Item value="dependencies">
                            <Accordion.Trigger>
                              <span class="text-label-sm text-(--text-default)">Dependencies</span>
                            </Accordion.Trigger>
                            <Accordion.Content>
                              <div class="min-w-0 px-(--spacing-md) py-(--spacing-md)">
                                <p
                                  v-if="!row.dependencies.length"
                                  class="text-body-sm text-(--text-muted)"
                                >
                                  {{ row.name }} references no other resources.
                                </p>
                                <Item.Group v-else>
                                  <Item
                                    v-for="dependency in row.dependencies"
                                    :key="dependency.key"
                                    kind="inline"
                                    size="small"
                                  >
                                    <Item.Media>
                                      <span class="flex size-5 items-center justify-center">
                                        <i
                                          :class="dependency.icon"
                                          class="text-body-xs text-(--text-muted)"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Item.Media>
                                    <Item.Content>
                                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                        <span class="shrink-0 text-body-sm text-(--text-muted)">
                                          {{ dependency.label }}
                                        </span>
                                        <Item.Title>{{ dependency.name }}</Item.Title>
                                        <Tag
                                          v-if="!dependency.note"
                                          :label="
                                            dependency.versions.length
                                              ? 'Ready'
                                              : 'No ready version'
                                          "
                                          :severity="
                                            dependency.versions.length ? 'success' : 'warning'
                                          "
                                          size="small"
                                          class="shrink-0"
                                        />
                                      </span>
                                      <Item.Description>
                                        {{ dependency.note || versionOf(dependency).name }}
                                      </Item.Description>
                                    </Item.Content>
                                    <Item.Actions v-if="!dependency.note">
                                      <DropdownMenu
                                        v-model:open="versionOpen[dependency.key]"
                                        placement="bottom-end"
                                        @select="
                                          (_event, id) => pickVersion(dependency, String(id))
                                        "
                                      >
                                        <DropdownMenu.Trigger>
                                          <Button
                                            label="Change version"
                                            kind="outlined"
                                            size="small"
                                            icon="pi pi-chevron-down"
                                            icon-position="trailing"
                                            :disabled="!dependency.versions.length"
                                          />
                                        </DropdownMenu.Trigger>
                                        <template #top>
                                          <div
                                            class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                                          >
                                            <p class="text-label-sm text-(--text-muted)">
                                              {{ versionSummary(dependency) }}
                                            </p>
                                            <Input
                                              v-if="dependency.total > dependency.versions.length"
                                              size="medium"
                                              placeholder="Search versions"
                                              aria-label="Search versions"
                                            >
                                              <template #iconLeft>
                                                <i
                                                  class="pi pi-search"
                                                  aria-hidden="true"
                                                />
                                              </template>
                                            </Input>
                                          </div>
                                        </template>
                                        <DropdownMenu.Group>
                                          <DropdownMenu.Option
                                            v-for="entry in dependency.versions"
                                            :key="entry.id"
                                            :value="entry.id"
                                            :label="entry.name"
                                            :selected="entry.id === versionOf(dependency).id"
                                            :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                                          >
                                            <template #left>
                                              <Avatar
                                                :alt="entry.author"
                                                :label="entry.author"
                                                size="small"
                                                kind="square"
                                              />
                                            </template>
                                            <span
                                              class="inline-flex min-w-0 items-center gap-(--spacing-xs)"
                                            >
                                              <span class="truncate">{{ entry.name }}</span>
                                              <Tag
                                                v-if="entry.active"
                                                label="Active"
                                                severity="success"
                                                size="small"
                                                class="shrink-0"
                                              />
                                            </span>
                                            <template #right>
                                              <span class="text-body-xs text-(--text-muted)">{{
                                                entry.createdAgo
                                              }}</span>
                                            </template>
                                          </DropdownMenu.Option>
                                        </DropdownMenu.Group>
                                        <template
                                          v-if="dependency.total > dependency.versions.length"
                                          #bottom
                                        >
                                          <div
                                            class="border-t border-(--border-default) px-(--spacing-xxs) pt-(--spacing-xxs)"
                                          >
                                            <Button
                                              :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                              kind="transparent"
                                              size="small"
                                              class="w-full"
                                            />
                                          </div>
                                        </template>
                                      </DropdownMenu>
                                    </Item.Actions>
                                  </Item>
                                </Item.Group>
                                <span
                                  class="sr-only"
                                  role="status"
                                />
                              </div>
                            </Accordion.Content>
                          </Accordion.Item>
                        </Accordion>
                      </template>
                    </template>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Project"
                hint="The project whose domains serve the service. Create one to publish it on a new domain."
              >
                <Card :padded="false">
                  <template #header>
                    <ToggleGroup
                      v-model="projectMode"
                      :options="projectModes"
                      size="medium"
                      fluid
                      aria-label="Project"
                      class="w-full"
                    />
                  </template>
                  <template #content>
                    <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                      <Item
                        kind="outlined"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              class="pi pi-box text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <Item.Title>{{ project.name }}</Item.Title>
                            <Tag
                              v-if="projectMode === 'new'"
                              label="New"
                              severity="success"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <Item.Description v-if="projectMode === 'new'">
                            Gets its domains on the first deploy.
                          </Item.Description>
                          <ul
                            v-else
                            class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0"
                          >
                            <li
                              v-for="domainGroup in project.domains"
                              :key="domainGroup.environment"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <Tag
                                :label="domainGroup.environment"
                                severity="secondary"
                                size="small"
                                class="shrink-0"
                              />
                              <div class="flex min-w-0">
                                <Tooltip
                                  :text="`Open ${domainGroup.domains[0]} in a new tab`"
                                  class="w-full"
                                >
                                  <a
                                    :href="`https://${domainGroup.domains[0]}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-link="true"
                                    class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                  >
                                    <span
                                      class="truncate underline-offset-2 group-hover/link:underline"
                                    >
                                      {{ domainGroup.domains[0] }}
                                    </span>
                                    <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                    <i
                                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </Tooltip>
                              </div>
                              <Popover
                                v-if="domainGroup.total > 1"
                                placement="bottom-start"
                                width="small"
                              >
                                <Popover.Trigger>
                                  <div class="shrink-0 cursor-pointer">
                                    <Tag
                                      :label="`+${domainGroup.total - 1}`"
                                      severity="secondary"
                                      size="small"
                                    />
                                  </div>
                                </Popover.Trigger>
                                <Popover.Content>
                                  <div
                                    class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                  >
                                    <p class="text-label-sm text-(--text-muted)">
                                      {{ domainGroup.summary }}
                                    </p>
                                    <Input
                                      v-if="domainGroup.total > 10"
                                      size="medium"
                                      placeholder="Search domains"
                                      aria-label="Search domains"
                                    >
                                      <template #iconLeft>
                                        <i
                                          class="pi pi-search"
                                          aria-hidden="true"
                                        />
                                      </template>
                                    </Input>
                                  </div>

                                  <div
                                    class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                                  >
                                    <a
                                      v-for="domain in domainGroup.domains"
                                      :key="domain"
                                      :href="`https://${domain}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                    >
                                      <span class="truncate">{{ domain }}</span>
                                      <i
                                        class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                                        aria-hidden="true"
                                      />
                                    </a>
                                  </div>

                                  <div
                                    v-if="domainGroup.total > domainGroup.domains.length"
                                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                                  >
                                    <Button
                                      :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                      kind="transparent"
                                      size="small"
                                      class="w-full"
                                    />
                                  </div>

                                  <span
                                    class="sr-only"
                                    role="status"
                                  >
                                    {{ domainGroup.summary }}
                                  </span>
                                </Popover.Content>
                              </Popover>
                            </li>
                          </ul>
                        </Item.Content>
                        <Item.Actions v-if="projectMode === 'existing'">
                          <DropdownMenu
                            placement="bottom-end"
                            @select="(_event, id) => (projectId = String(id))"
                          >
                            <DropdownMenu.Trigger>
                              <Button
                                label="Change"
                                kind="outlined"
                                size="small"
                                icon="pi pi-chevron-down"
                                icon-position="trailing"
                              />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Group
                              v-for="group in projectGroups"
                              :key="group.key"
                              :label="group.label"
                            >
                              <DropdownMenu.Option
                                v-for="entry in group.projects"
                                :key="entry.id"
                                :value="entry.id"
                                :label="entry.name"
                                :selected="entry.id === project.id"
                              >
                                <template #right>
                                  <span class="truncate text-body-xs text-(--text-muted)">
                                    {{ entry.detail }}
                                  </span>
                                </template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                          </DropdownMenu>
                        </Item.Actions>
                      </Item>
                    </div>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Environment"
                hint="Where the deployment goes live, from the environments this project serves. Each one publishes with the Deployment Settings set on the project."
              >
                <div
                  role="radiogroup"
                  aria-label="Environment"
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                >
                  <div
                    v-for="entry in environmentChoices"
                    :key="entry.name"
                    class="relative min-w-0"
                  >
                    <Field.Label>
                      <Field orientation="horizontal">
                        <RadioButton
                          v-model="environment"
                          name="service-deploy-environment"
                          :value="entry.name"
                        />
                        <Field.Content>
                          <Field.Title>
                            {{ entry.name }}
                          </Field.Title>
                          <Field.Description v-if="entry.description">
                            {{ entry.description }}
                          </Field.Description>
                        </Field.Content>
                      </Field>
                    </Field.Label>
                    <div
                      v-if="entry.tag"
                      class="pointer-events-none absolute end-(--spacing-sm) top-(--spacing-sm)"
                    >
                      <Tag
                        :label="entry.tag"
                        severity="info"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Projects impacted"
                hint="This environment publishes with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                  <div
                    v-for="group in impacted"
                    :key="group.environment"
                    class="flex min-w-0 flex-col gap-(--spacing-xs)"
                  >
                    <ul
                      class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
                      :aria-label="`Projects impacted in ${group.environment} (${group.projects.length})`"
                    >
                      <li
                        v-for="target in group.projects"
                        :key="target.id"
                        class="min-w-0"
                      >
                        <Item
                          kind="outlined"
                          size="small"
                        >
                          <Item.Media>
                            <span
                              class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                            >
                              <i
                                class="pi pi-box text-body-xs text-(--text-default)"
                                aria-hidden="true"
                              />
                            </span>
                          </Item.Media>
                          <Item.Content>
                            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <Item.Title>{{ target.name }}</Item.Title>
                              <Tag
                                v-if="target.selected"
                                label="Selected"
                                severity="secondary"
                                size="small"
                                class="shrink-0"
                              />
                            </span>
                            <ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0">
                              <li
                                v-for="domainGroup in target.domains"
                                :key="domainGroup.environment"
                                class="flex min-w-0 items-center gap-(--spacing-xs)"
                              >
                                <Tag
                                  :label="domainGroup.environment"
                                  severity="secondary"
                                  size="small"
                                  class="shrink-0"
                                />
                                <div class="flex min-w-0">
                                  <Tooltip
                                    :text="`Open ${domainGroup.domains[0]} in a new tab`"
                                    class="w-full"
                                  >
                                    <a
                                      :href="`https://${domainGroup.domains[0]}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      data-link="true"
                                      class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                    >
                                      <span
                                        class="truncate underline-offset-2 group-hover/link:underline"
                                      >
                                        {{ domainGroup.domains[0] }}
                                      </span>
                                      <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                      <i
                                        class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                        aria-hidden="true"
                                      />
                                    </a>
                                  </Tooltip>
                                </div>
                                <Popover
                                  v-if="domainGroup.total > 1"
                                  placement="bottom-start"
                                  width="small"
                                >
                                  <Popover.Trigger>
                                    <div class="shrink-0 cursor-pointer">
                                      <Tag
                                        :label="`+${domainGroup.total - 1}`"
                                        severity="secondary"
                                        size="small"
                                      />
                                    </div>
                                  </Popover.Trigger>
                                  <Popover.Content>
                                    <div
                                      class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                    >
                                      <p class="text-label-sm text-(--text-muted)">
                                        {{ domainGroup.summary }}
                                      </p>
                                      <Input
                                        v-if="domainGroup.total > 10"
                                        size="medium"
                                        placeholder="Search domains"
                                        aria-label="Search domains"
                                      >
                                        <template #iconLeft>
                                          <i
                                            class="pi pi-search"
                                            aria-hidden="true"
                                          />
                                        </template>
                                      </Input>
                                    </div>

                                    <div
                                      class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                                    >
                                      <a
                                        v-for="domain in domainGroup.domains"
                                        :key="domain"
                                        :href="`https://${domain}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                      >
                                        <span class="truncate">{{ domain }}</span>
                                        <i
                                          class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                                          aria-hidden="true"
                                        />
                                      </a>
                                    </div>

                                    <div
                                      v-if="domainGroup.total > domainGroup.domains.length"
                                      class="border-t border-(--border-default) p-(--spacing-xxs)"
                                    >
                                      <Button
                                        :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                        kind="transparent"
                                        size="small"
                                        class="w-full"
                                      />
                                    </div>

                                    <span
                                      class="sr-only"
                                      role="status"
                                    >
                                      {{ domainGroup.summary }}
                                    </span>
                                  </Popover.Content>
                                </Popover>
                              </li>
                            </ul>
                          </Item.Content>
                        </Item>
                      </li>
                    </ul>
                  </div>
                </div>
              </SettingsSection>

              <span
                class="sr-only"
                role="status"
              />
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
              <Button
                label="Deploy"
                kind="primary"
                size="medium"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
```
