# Marketplace (`platform/view/marketplace`)

> The marketplace page: a medium page heading with the outlined Documentation action over centred `Tabs` for Templates and Integrations, Templates first and selected. The Templates tab is the full catalog: its own `PropertyFilter` (free text and Framework, in the URL through a second `useCollection`) over a dense grid of small template tiles (two to five a row by width), each a `Card kind="integration"` with the framework mark, the name as a link to the template page, two lines of description and the framework badge; a filter that matches nothing shows a bordered `EmptyState` with Clear filters. The Integrations tab shows a Featured row of three `featured` integration cards (centred, raised, the context badge in the corner) while no filter is set, then All integrations: one `PropertyFilter` (free text over name, publisher and description; Publisher, Category, Context and Status as properties, all in the URL through `useCollection`) over a grid of `Card kind="integration"` tiles with the logo, the name, by the publisher, two lines of description, the category badge, the Installed tag and an Install or Configure action. A tile opens the integration in a medium right `Drawer`: name and publisher in the header, the description, `KeyValuePairs` (publisher, category, context, version, last update, the applications it runs on), an Overview in `DocProse`, the permissions it needs, and the install form, a required Application `Field` with a `Select` of the applications it is not on yet. Install is an async run (`platform/states/async-submit`): the button shows `loading`, a progress toast follows the user, and the outcome lands as a toast and an inline `Alert` in the drawer; success carries Configure and Open application, failure is permanent and carries Edit and Reinstall. A search that matches nothing shows No matching integrations with Clear filters; while the catalog loads the tiles are skeletons. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/view/marketplace/marketplace.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/marketplace")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [DocProse](../../../components/doc-prose.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, [Drawer](../../../components/drawer.md), `DrawerTitle`, [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [KeyValuePairs](../../../components/key-value-pairs.md), [Link](../../../components/link.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../../components/property-filter.md), [SaveBar](../../../components/save-bar.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Skeleton](../../../components/skeleton.md), [Switch](../../../components/switch.md), [Table](../../../components/table.md), [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), `use-collection`
- Skills: `webkit-lists`, `webkit-form`, `webkit-errors`, `webkit-ui-states`

## Asked as

marketplace; integration catalog; integrations marketplace; install an integration; browse integrations; extensions catalog; plugin catalog; app store page; integration detail; installed integrations; configure integration; marketplace de integrações; catálogo de integrações; instalar integração; loja de extensões; template marketplace; search templates

The page where people find something made by Azion or a partner and add it to what they run. Two kinds of item live here: integrations, installed into an existing application, and templates, which start a new project. People browse by need ("block bots", "split traffic"), compare by publisher and context, read what an integration does and what it may touch, then install it on one application and keep working while it installs. One `useCollection` call holds the search and the filters; one drawer holds the detail and the install; the install reports by toast wherever the person is.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A catalog of installable add-ons (integrations, extensions, plugins) with a publisher, a category and an installed state per account.
- Installing means choosing a target (an application) and waiting for an asynchronous run.
- The same page also lists the templates, the other way to start from someone else's work, as a searchable grid on the first tab.

## When not to use

- Only templates, grouped by category with a filter, a preview and a README: use `platform/view/template-browser`.
- Deploying a chosen template: use `platform/create/deploy-template`.
- The resources the account already created: use `platform/view/card-view` or `platform/view/table-view`.
- Changing the settings of an installed integration on one application: use `platform/edit/edit-resource` from Configure.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size: "Marketplace" and one sentence of purpose. The actions slot holds only the outlined medium Documentation `Button`, which opens the docs in a new tab.

### B. Item kinds — `Tabs` (required)

`Tabs.Root` with Templates first and Integrations second, starting on the tab the URL names (Templates by default here, as in the design sample). The tab row is centred over the catalog with `Tabs.List align="center"`, as in the design sample; the solution page keeps its tabs at the start, since they head a resource page. Each tab is a `Tabs.Panel`; the panels keep their own state when the person switches.

### C. Featured — `Card` (required)

While no filter is set (`filtersActive` is false), a "Featured" `h2` over three `Card kind="integration" featured` tiles in a row (one a row on a phone): the mark, the name, the publisher and the description centred on a raised surface with a primary glow at the top, and the context as a primary badge in the corner. They carry no action, so the row reads as a recommendation; the tile opens the drawer. Searching hides the row, so the results start at the top.

### D. Search and filter — `PropertyFilter` (required)

Under the "All integrations" `h2`, one `PropertyFilter` bound with `v-bind="propertyFilterProps"`. Free text searches the name, the publisher and the description; Publisher and Category list the values in the catalog, Context is Application or Firewall, and Status is Installed or Available. Every token lives in the URL (`url: true`).

### E. Integration tiles — `Card`, `Button` (required)

A `ul` grid, one to three tiles a row by width, of `Card kind="integration"`: the logo, the name (the stretched target that emits `select`), "by" the publisher, two lines of description, the category as a secondary badge, the Installed tag from `installed`, and in the `action` slot an outlined small `Button`, Install for an available integration and Configure for an installed one, named with the integration (`Install Rate Guard`). Both the tile and its action open the drawer.

### F. No matching integrations — `EmptyState`, `Button` (required)

When `status` is `no-match`, the grid gives way to a medium `EmptyState` with the filter-slash glyph, "No matching integrations", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`.

### G. Templates — `PropertyFilter`, `Card`, `EmptyState`, `Button` (required)

The first tab is the full template catalog. A second `useCollection` runs the templates: its `PropertyFilter` (placeholder and `aria-label` "Search templates") turns free text over the name, the framework and the description, and a Framework property, into tokens that live in the URL under the `templates` prefix, so they never collide with the integration filter. Under it a `ul` grid of `Card kind="integration"` tiles, two a row on a phone, then three, four and five as the page widens: the framework mark as the `logo` (`ai-cor` colour marks; the black Next.js mark inverts in dark), the name as an `h3` holding a stretched link to the template page (`/marketplace/templates/<id>`), two lines of description and the framework as a secondary badge. The tile markup is the `Card`'s, shared with `platform/view/template-browser`. When its `status` is `no-match`, the grid gives way to a bordered medium `EmptyState`, "No matching templates", with an outlined small Clear filters `Button` bound to the templates' `clearFilters`.

### H. Integration drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerClose`, `PanelHeader`, `PanelContent`, `PanelFooter` (required)

A medium right `Drawer` controlled by `v-model:open`. Its content is a `form` named `Install <name>` with `novalidate`. `PanelHeader` holds the logo, the name as `DrawerTitle`, "by" the publisher and `DrawerClose`. `PanelContent` scrolls; `PanelFooter` holds, at the end, Configure (outlined, a link to the integration's settings) when it is installed somewhere, and the primary submit Install while an application is left.

### I. Install outcome — `Alert` (required)

The inline half of the async-submit outcome, at the top of the drawer: a success `Alert` naming the application ("Rate Guard is installed on storefront. It runs from the next request."), or a danger `Alert` with the server's reason and a Reinstall action. Nothing shows while idle or running; the button and the toast carry the running state.

### J. Integration facts — `KeyValuePairs` (required)

A two-column `KeyValuePairs` named "Integration details": Publisher (in `bdi`), Category, Context, Version, Updated and Installed on (the applications, or "Not installed").

### K. Overview — `DocProse` (required)

An "Overview" `h3` over the publisher's text in `DocProse`, ending on what installing adds to the application. Then a "Permissions" `h3` with the list of what the integration may read or add, each line led by a check glyph.

### L. Install form — `Field`, `Select` (required)

An "Install" `h3` ("Install on another application" once installed somewhere) over a required `Field` labelled Application with a `Select` of the applications it is not installed on yet. Submitting without a choice marks the `Field` invalid and shows `Field.Error` ("Select the application to install Rate Guard on."); otherwise `Field.Description` says where it runs. While the run lasts the `Field` is disabled. When no application is left, the field gives way to one sentence and the footer drops Install.

### M. Solution page — `Tabs`, `Card`, `Select`, `Field`, `KeyValuePairs`, `DocProse` (optional)

The drawer's content as a page, for the integration's own URL (the variant adds `Link`, `Table` and `Tag`). A `Link` back to Marketplace, the `PageHeader`, then `Tabs` for Overview (`DocProse`), Usage (how to set it up, with the setting names in code), Changelog (an ordered version history, newest first, `Latest` as an info `Tag`) and Applications (a `Table` of the applications running it with their version, `Table.CellStatus` Up to date or Update available, and an `Update to <version>` button). Beside it, an install card: a required Application `Select` whose options carry an `Installed` or `Update available` `Tag` (installed and current ones are disabled) and a submit that reads Install or Update; under it the facts in `KeyValuePairs`. Install and Update are async runs with the same toast as the drawer (Configure, Open application).

### N. Configure screen — `Field`, `Select`, `Alert`, `Button` (optional)

The settings of one installed integration on one application (the variant adds `SettingsSection`, `Item`, `SettingRow`, `Switch`, `Input` and `SaveBar`). `SettingsSection`s group them; an on/off setting is a compact `SettingRow` in an `Item.List`, the rest are `Field`s. Errors follow `platform/states/form-error`: nothing is red before Save; after it a danger `Alert` above and a `Field.Error` per field, focus on the first. Changes raise a `SaveBar` with Discard and Save. Saving settings is not a deploy, so the toast has no Edit or Redeploy.

### O. Template page — `Field`, `Button`, `KeyValuePairs` (optional)

A template as a page, for the template's own URL (the variant adds `SettingsSection`, `Input` and `Link`): the description, a deploy form (application name, repository) beside the facts. Deploy is a build and deploy, so it follows `platform/states/async-submit`: loading on the button, a progress toast, and a success toast with Edit and Redeploy.

### Install toast — through `toast`

Raised through `toast` with one id for the install, so progress turns into the outcome in place. Progress is `toast.loading` ("Installing Rate Guard on storefront…", "It keeps running if you close this panel."). Success is `toast.success`, closable, with Configure and Open application. Failure is `toast.error` with `duration: 0`, closable, with Edit (reopens the drawer with the same choice) and Reinstall. Leaving the page dismisses it. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`; derive the Status property from where each integration is installed.
- Use `Card kind="integration"` for every integration tile, with the installed state as the `installed` prop and one action in the `action` slot.
- Hide the Featured row while any filter is set.
- Open on Templates and narrow the templates with one `PropertyFilter` on their own `useCollection`, as every list does; the grouped catalog with a preview drawer is the template browser's job.
- Open the detail in a drawer so the catalog, the filter and the scroll stay put.
- Show the permissions before the install form, and the target as a required field.
- Treat install as an async run: `loading` on Install, a progress toast, then the outcome as a toast and an inline `Alert`, with actions that fit an integration (Configure, Open application; Edit, Reinstall).
- Keep the failure toast until the person closes it.

## Don't

- Don't install from the tile in one click; the person must pick the application and see the permissions.
- Don't point the outcome at a list of runs ("View installs", "View deployments"); the toast carries Configure or Edit and Reinstall.
- Don't use "Retry" or "Try again" for a failed install; the action is Reinstall.
- Don't show Install for an application that already runs the integration; filter it out of the `Select`.
- Don't badge every tile with more than one tag beside Installed; the publisher and the category are enough to compare.
- Don't rebuild the template browser inside the Templates tab: no categories, no property filter, no preview drawer; the tile links to the template page.
- Don't use `featured` for every integration tile; it marks the short Featured row only.

## Copy

- **Title:** "Marketplace". Description: "Find integrations and templates that run on your applications."
- **Tabs:** "Templates", "Integrations". **Sections:** "Featured", "All integrations".
- **Template search:** placeholder and `aria-label` "Search templates"; no match: "No matching templates", "No template matches these filters. Try another name or framework.", "Clear filters".
- **Filter:** placeholder and `aria-label` "Search integrations".
- **Tile action:** "Install" or "Configure"; its `aria-label` adds the name.
- **Drawer:** the name, "by <publisher>", "Overview", "Permissions", "Install" or "Install on another application", the field "Application" with "Select an application".
- **Validation:** "Select the application to install <name> on."
- **Progress toast:** "Installing <name> on <application>…" / "It keeps running if you close this panel."
- **Success:** toast "<name> is installed on <application>." / "It runs from the next request to the application.", actions "Configure" and "Open application"; the inline `Alert` says the same in one line.
- **Failure:** toast "<name> wasn't installed on <application>." with the reason as a full sentence, actions "Edit" and "Reinstall"; the inline `Alert` carries the reason and "Reinstall".
- **No match:** "No matching integrations", "No integration matches this search. Remove a filter to widen the results.", "Clear filters".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the `PageHeader` title is the only `h1`, each section heading an `h2`, each tile name an `h3`.
- The tabs follow the tablist pattern: arrow keys move between Templates and Integrations, and each panel is labelled by its tab.
- Each template tile's target is a real link named by the template; the mark is decorative.
- Each tile's target is a real button named by the integration; the action button sits above it and is named with the integration, so "Install" is never ambiguous in a list.
- The Installed state is text in a `Tag`, never colour alone.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to what opened it; its form has an accessible name.
- The Application field is required and labelled; its error is tied to the `Select` through the `Field`, and focus stays on Install so the person can correct and resubmit.
- Toasts are announced politely and never take focus; the failure toast stays until closed and its actions are reachable by keyboard.

## States

- Default: the Templates tab with the search and the full template grid; each tile links to its template page.
- Integrations: the Integrations tab with Featured, All integrations, the filter and the tiles; a tile opens the drawer and Install runs and lands as a success toast and Alert.
- Detail: the drawer is open on Request Signer with its details, overview, permissions and the install form.
- Installing: Install is running on storefront; the button is `loading`, the field disabled and the progress toast says it keeps running.
- Installed: Request Signer is installed on storefront; the success Alert, the Installed tag, Configure in the footer and the success toast with Configure and Open application.
- InstallFailed: the install on checkout failed; the danger Alert with the reason and Reinstall, and the permanent toast with Edit and Reinstall.
- NoMatch: the integration search "kubernetes" matches nothing; the Featured row hides and the empty state offers Clear filters.
- TemplatesNoMatch: the template search "kubernetes" matches nothing; the bordered empty state offers Clear filters.
- Loading: on Templates, the search is disabled and ten `Skeleton` tiles (mark, name, two lines) hold the grid in a band that is `aria-busy`; the Integrations tab holds six skeleton integration tiles under a disabled filter.

- SolutionPage: Waiting Room as a page, storefront on 1.3.0 (Update available) and checkout on 1.4.0.
- Configure: Waiting Room settings on storefront, with the SaveBar after a change.
- TemplatePage: Nuxt Storefront as a page with its deploy form.

## Related

- `platform/view/template-browser` — the template catalog grouped by category, with a filter and a README preview.
- `platform/create/deploy-template` — where a template's Deploy leads.
- `platform/states/async-submit` — the toast and inline outcome every install follows.
- `platform/states/form-error` — the field, section and toast placement of a form error.
- `Card` (`kind="integration"`) and `useCollection` — see `skills/webkit-lists`.

## Variants

- `Default` — primary (the code below)
- `Integrations` — The Integrations tab: the Featured row of three featured integration tiles over All integrations, the filter and the integration grid with Install and Configure.
- `Detail` — The detail drawer open on Request Signer: details, overview, permissions and the install form.
- `Installing` — Install is running on storefront: the button shows loading, the field is disabled and the progress toast says it keeps running if the panel closes.
- `Installed` — The install succeeded: the success Alert in the drawer, the Installed tag on the tile, Configure in the footer and the success toast with Configure and Open application.
- `InstallFailed` — The install failed on checkout: the danger Alert with the reason and Reinstall, and the permanent failure toast with Edit and Reinstall.
- `NoMatch` — The Integrations tab with a search that matches no integration: the Featured row hides, the token stays and a medium EmptyState offers Clear filters.
- `TemplatesNoMatch` — A template search that matches nothing: the free-text token stays and a bordered medium EmptyState offers Clear filters.
- `Loading` — The catalog is loading: the template search is disabled and skeleton tiles hold the template grid; the Integrations tab holds skeleton integration tiles under a disabled filter.
- `SolutionPage` — The integration as a full page (Waiting Room): a Back to Marketplace `Link`, the `PageHeader`, `Tabs` for Overview, Usage, Changelog (version history, Latest marked) and Applications (a `Table` of the applications running it, `Table.CellStatus` Up to date or Update available and an Update to <version> action), beside an install card whose Application `Select` tags each application Installed or Update available. Install and Update are async runs that end in a toast with Configure and Open application.
- `Configure` — The screen behind Configure: the integration's settings on one application (Queue visitors `Switch`, Capacity and Queue page title fields, Session length `Select`) in `SettingsSection`s, errors after Save with a summary `Alert`, and a `SaveBar` with Discard and Save; saving is not a deploy, so its toast has no Redeploy.
- `TemplatePage` — A template as a full page (Nuxt Storefront): a Back to Templates `Link`, the description, the deploy form (application name and repository, errors after Deploy) beside the template facts; Deploy is an async run that ends in the async-submit toast with Edit and Redeploy.

Each variant is the same screen in another state: `get_pattern("platform/view/marketplace", { variant })`, or the file under `blocks/platform/view/marketplace/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  type IntegrationContext = 'application' | 'firewall'

  interface Integration {
    id: string
    name: string
    vendor: string
    logo: string
    category: string
    context: IntegrationContext
    description: string
    version: string
    updated: string
    featured: boolean
    installedOn: string[]
  }

  const CONTEXTS: Record<IntegrationContext, string> = {
    application: 'Application',
    firewall: 'Firewall'
  }
  const APPLICATIONS = ['storefront', 'checkout', 'docs', 'api']

  const integration = (
    id: string,
    name: string,
    vendor: string,
    logo: string,
    category: string,
    context: IntegrationContext,
    description: string,
    extra: Partial<Integration> = {}
  ): Integration => ({
    id,
    name,
    vendor,
    logo,
    category,
    context,
    description,
    version: '1.4.0',
    updated: 'Oct 30, 2026',
    featured: false,
    installedOn: [],
    ...extra
  })

  const catalog = ref([
    integration(
      'request-signer',
      'Request Signer',
      'Acme',
      'pi pi-key',
      'Access control',
      'firewall',
      'Sign every request with a rotating key, so the origin only answers traffic that passed through.',
      { featured: true }
    ),
    integration(
      'waiting-room',
      'Waiting Room',
      'Acme',
      'pi pi-hourglass',
      'Traffic management',
      'application',
      'Queue visitors during a traffic surge and let them in as capacity frees up.',
      { featured: true, installedOn: ['storefront'] }
    ),
    integration(
      'bot-score',
      'Bot Score',
      'Acme',
      'pi pi-shield',
      'Bot management',
      'firewall',
      'Score each request on known bot behaviour and block the ones above your threshold.',
      { featured: true }
    ),
    integration(
      'split-traffic',
      'Split Traffic',
      'Azion',
      'pi pi-sitemap',
      'Testing',
      'application',
      'Send a share of visitors to a second version of a page and keep each one on theirs.'
    ),
    integration(
      'geo-content',
      'Geo Content',
      'Azion',
      'pi pi-globe',
      'Personalization',
      'application',
      'Serve a regional version of a page from the visitor’s country, with a fallback.'
    ),
    integration(
      'signed-urls',
      'Signed URLs',
      'Azion',
      'pi pi-link',
      'Access control',
      'firewall',
      'Issue links that expire, so protected files can only be fetched for a limited time.',
      { installedOn: ['docs', 'api'] }
    ),
    integration(
      'rate-guard',
      'Rate Guard',
      'Acme',
      'pi pi-sliders-h',
      'Access control',
      'firewall',
      'Limit how many requests one client can make in a window, per path or per key.'
    ),
    integration(
      'payload-limit',
      'Payload Limit',
      'Azion',
      'pi pi-box',
      'Traffic management',
      'firewall',
      'Refuse request bodies above a size you set, before they reach the origin.'
    ),
    integration(
      'request-id',
      'Request ID',
      'Azion',
      'pi pi-hashtag',
      'Observability',
      'application',
      'Add a unique identifier header to every request, to trace it across services.'
    ),
    integration(
      'phone-check',
      'Phone Check',
      'Acme',
      'pi pi-phone',
      'Fraud prevention',
      'firewall',
      'Validate phone numbers on sign-up forms and flag numbers linked to fraud.'
    ),
    integration(
      'queue-writer',
      'Queue Writer',
      'Azion',
      'pi pi-inbox',
      'Messaging',
      'application',
      'Write each request to a queue for processing later, and answer the client right away.'
    ),
    integration(
      'schedule-block',
      'Scheduled Block',
      'Azion',
      'pi pi-calendar-times',
      'Access control',
      'firewall',
      'Close an application to traffic on a schedule, such as outside business hours.'
    )
  ])

  interface Template {
    id: string
    title: string
    framework: string
    icon: string
    description: string
    markClass: string
  }

  const template = (
    id: string,
    title: string,
    framework: string,
    icon: string,
    description: string,
    markClass = ''
  ): Template => ({ id, title, framework, icon, description, markClass })

  const INVERT_IN_DARK = '[[data-theme=dark]_&]:invert'

  const templates: Template[] = [
    template(
      'next-starter',
      'Next.js Starter',
      'Next.js',
      'ai-cor ai-next',
      'A Next.js app with server rendering and static pages, ready to deploy.',
      INVERT_IN_DARK
    ),
    template(
      'react-starter',
      'React Starter',
      'React',
      'ai-cor ai-react',
      'A single-page React app built with Vite, every route served from the edge.'
    ),
    template(
      'vue-starter',
      'Vue Starter',
      'Vue',
      'ai-cor ai-vue',
      'A lightweight Vue app with routing, built with Vite.'
    ),
    template(
      'nuxt-store',
      'Nuxt Storefront',
      'Nuxt',
      'ai-cor ai-nuxt',
      'A product catalog with a cart, rendered on the server and cached close to buyers.'
    ),
    template(
      'astro-blog',
      'Astro Blog',
      'Astro',
      'ai-cor ai-astro',
      'A content-first blog with Markdown posts, an RSS feed and a sitemap.'
    ),
    template(
      'angular-dashboard',
      'Angular Dashboard',
      'Angular',
      'ai-cor ai-angular',
      'A single-page admin dashboard with routing and lazy-loaded modules.'
    ),
    template(
      'svelte-starter',
      'Svelte Starter',
      'SvelteKit',
      'ai-cor ai-svelte',
      'A SvelteKit app with server routes and prerendered pages.'
    ),
    template(
      'solid-starter',
      'Solid Starter',
      'SolidStart',
      'ai-cor ai-solidjs',
      'A SolidStart app with fine-grained updates and streaming server rendering.'
    ),
    template(
      'qwik-starter',
      'Qwik Starter',
      'Qwik',
      'ai ai-qwik',
      'A resumable Qwik app that loads only the code a visitor touches.'
    ),
    template(
      'gatsby-site',
      'Gatsby Site',
      'Gatsby',
      'ai ai-gatsby',
      'A marketing site built at deploy time from Markdown and images.'
    ),
    template(
      'docusaurus-docs',
      'Docusaurus Docs',
      'Docusaurus',
      'ai ai-docusaurus',
      'A documentation site with versioned sections, search and a blog.'
    ),
    template(
      'vitepress-docs',
      'VitePress Docs',
      'VitePress',
      'ai ai-vitepress',
      'A fast documentation site written in Markdown, with a sidebar and search.'
    ),
    template(
      'hugo-docs',
      'Hugo Docs',
      'Hugo',
      'ai ai-hugo',
      'A documentation site with search, versioned sections and dark mode.'
    ),
    template(
      'static-site',
      'Static Site',
      'Static files',
      'ai ai-edge-storage',
      'Publish a folder of built files and serve it from the closest location.'
    ),
    template(
      'reverse-proxy',
      'Reverse Proxy',
      'JavaScript',
      'ai ai-edge-connectors',
      'Front an origin you already run and pass every request on to it.'
    ),
    template(
      'rest-api',
      'REST API',
      'Hono',
      'ai ai-hono',
      'A small Hono API with typed routes, running at the edge.'
    )
  ]

  const withStatus = (item: Integration) => ({
    ...item,
    status: item.installedOn.length ? 'installed' : 'available'
  })

  const unique = (key: 'vendor' | 'category') =>
    [...new Set(catalog.value.map((item) => item[key]))].sort()

  const properties = computed(() => [
    { key: 'name', label: 'Name' },
    {
      key: 'vendor',
      label: 'Publisher',
      options: unique('vendor').map((value) => ({ value }))
    },
    {
      key: 'category',
      label: 'Category',
      options: unique('category').map((value) => ({ value }))
    },
    {
      key: 'context',
      label: 'Context',
      options: Object.entries(CONTEXTS).map(([value, label]) => ({ value, label }))
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'installed', label: 'Installed' },
        { value: 'available', label: 'Available' }
      ]
    }
  ])

  const { items, propertyFilterProps, status, filtersActive, clearFilters } = useCollection({
    items: () => catalog.value.map(withStatus),
    filtering: { fields: ['name', 'vendor', 'description'] },
    propertyFiltering: { properties },
    url: true
  })

  const featured = computed(() => catalog.value.filter((item) => item.featured))

  const {
    items: templateItems,
    propertyFilterProps: templateFilterProps,
    status: templateStatus,
    clearFilters: clearTemplateFilters
  } = useCollection({
    items: templates,
    filtering: { fields: ['title', 'framework', 'description'] },
    propertyFiltering: {
      properties: [
        { key: 'title', label: 'Name' },
        {
          key: 'framework',
          label: 'Framework',
          options: [...new Set(templates.map((item) => item.framework))]
            .sort()
            .map((value) => ({ value }))
        }
      ]
    },
    url: { prefix: 'templates' }
  })

  const activeTab = ref('templates')

  const detailOpen = ref(false)
  const selectedId = ref('request-signer')
  const selected = computed(
    () => catalog.value.find((item) => item.id === selectedId.value) ?? catalog.value[0]
  )
  const available = computed(() =>
    APPLICATIONS.filter((app) => !selected.value.installedOn.includes(app))
  )

  const form = reactive({ application: '' })
  const showErrors = ref(false)
  const applicationInvalid = computed(() => showErrors.value && !form.application)

  const run = reactive({ state: 'idle', application: '', reason: '' })
  const INSTALL_TOAST = 'marketplace-install'
  let timer: ReturnType<typeof setTimeout> | undefined

  const openDetail = (id: string) => {
    if (selectedId.value !== id) {
      selectedId.value = id
      form.application = ''
      showErrors.value = false
      Object.assign(run, { state: 'idle', application: '', reason: '' })
    }
    detailOpen.value = true
  }

  const configure = () => {
    toast.dismiss(INSTALL_TOAST)
    openDetail(selectedId.value)
  }

  const succeed = (item: Integration, application: string) => {
    item.installedOn = [...item.installedOn, application]
    form.application = ''
    showErrors.value = false
    Object.assign(run, { state: 'succeeded', application, reason: '' })
    toast.success(`${item.name} is installed on ${application}.`, {
      id: INSTALL_TOAST,
      description: 'It runs from the next request to the application.',
      closable: true,
      actions: [
        { label: 'Configure', onClick: configure },
        { label: 'Open application', onClick: () => toast.dismiss(INSTALL_TOAST) }
      ]
    })
  }

  const install = () => {
    showErrors.value = true
    if (!form.application || run.state === 'running') return
    const item = selected.value
    const application = form.application
    Object.assign(run, { state: 'running', application, reason: '' })
    toast.loading(`Installing ${item.name} on ${application}…`, {
      id: INSTALL_TOAST,
      description: 'It keeps running if you close this panel.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => succeed(item, application), 2400)
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(INSTALL_TOAST)
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Marketplace"
        description="Find integrations and templates that run on your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <Tabs.Root v-model="activeTab">
          <Tabs.List align="center">
            <Tabs.Item
              value="templates"
              label="Templates"
            />
            <Tabs.Item
              value="integrations"
              label="Integrations"
            />
          </Tabs.List>
          <Tabs.Content>
            <Tabs.Panel value="templates">
              <section
                class="flex min-w-0 flex-col gap-(--layout-group-gap) pt-(--layout-group-gap)"
                aria-label="Templates"
              >
                <PropertyFilter
                  v-bind="templateFilterProps"
                  placeholder="Search templates"
                  aria-label="Search templates"
                />

                <EmptyState
                  v-if="templateStatus === 'no-match'"
                  bordered
                  size="medium"
                  icon="pi pi-search"
                  title="No matching templates"
                  description="No template matches these filters. Try another name or framework."
                >
                  <template #actions>
                    <Button
                      label="Clear filters"
                      kind="outlined"
                      size="small"
                      @click="clearTemplateFilters"
                    />
                  </template>
                </EmptyState>

                <ul
                  v-else
                  class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
                >
                  <li
                    v-for="item in templateItems"
                    :key="item.id"
                    class="flex min-w-0"
                  >
                    <Card
                      kind="integration"
                      class="w-full"
                      :title="item.title"
                      :logo="[item.icon, item.markClass].filter(Boolean).join(' ')"
                      :description="item.description"
                      :badges="[{ label: item.framework, severity: 'secondary' }]"
                      :href="`/marketplace/templates/${item.id}`"
                    />
                  </li>
                </ul>
              </section>
            </Tabs.Panel>

            <Tabs.Panel value="integrations">
              <div class="flex min-w-0 flex-col gap-(--layout-section-gap) pt-(--layout-group-gap)">
                <section
                  v-if="!filtersActive"
                  class="flex min-w-0 flex-col gap-(--layout-group-gap)"
                  aria-labelledby="marketplace-featured"
                >
                  <h2
                    id="marketplace-featured"
                    class="text-heading-xxs text-(--text-default)"
                  >
                    Featured
                  </h2>
                  <ul class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 md:grid-cols-3">
                    <li
                      v-for="item in featured"
                      :key="item.id"
                      class="flex min-w-0"
                    >
                      <Card
                        class="w-full"
                        kind="integration"
                        featured
                        :title="item.name"
                        :vendor="item.vendor"
                        :logo="item.logo"
                        :description="item.description"
                        :badges="[{ label: CONTEXTS[item.context] }]"
                        :installed="item.installedOn.length > 0"
                        @select="openDetail(item.id)"
                      />
                    </li>
                  </ul>
                </section>

                <section
                  class="flex min-w-0 flex-col gap-(--layout-group-gap)"
                  aria-labelledby="marketplace-all"
                >
                  <h2
                    id="marketplace-all"
                    class="text-heading-xxs text-(--text-default)"
                  >
                    All integrations
                  </h2>
                  <PropertyFilter
                    v-bind="propertyFilterProps"
                    placeholder="Search integrations"
                    aria-label="Search integrations"
                  />

                  <EmptyState
                    v-if="status === 'no-match'"
                    size="medium"
                    icon="pi pi-filter-slash"
                    title="No matching integrations"
                    description="No integration matches this search. Remove a filter to widen the results."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        kind="outlined"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>

                  <ul
                    v-else
                    class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    <li
                      v-for="item in items"
                      :key="item.id"
                      class="flex min-w-0"
                    >
                      <Card
                        class="w-full"
                        kind="integration"
                        :title="item.name"
                        :vendor="item.vendor"
                        :logo="item.logo"
                        :description="item.description"
                        :badges="[{ label: item.category, severity: 'secondary' }]"
                        :installed="item.status === 'installed'"
                        @select="openDetail(item.id)"
                      >
                        <template #action>
                          <Button
                            :label="item.status === 'installed' ? 'Configure' : 'Install'"
                            :aria-label="`${item.status === 'installed' ? 'Configure' : 'Install'} ${item.name}`"
                            kind="outlined"
                            size="small"
                            @click="openDetail(item.id)"
                          />
                        </template>
                      </Card>
                    </li>
                  </ul>
                </section>
              </div>
            </Tabs.Panel>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>

    <Drawer
      v-model:open="detailOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            :aria-label="`Install ${selected.name}`"
            novalidate
            @submit.prevent="install"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                <span
                  class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    :class="selected.logo"
                    class="text-body-lg leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
                <div class="flex min-w-0 flex-col">
                  <DrawerTitle>{{ selected.name }}</DrawerTitle>
                  <span class="text-body-xs text-(--text-muted)"
                    >by <bdi>{{ selected.vendor }}</bdi></span
                  >
                </div>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <div class="flex flex-col gap-(--layout-section-gap)">
                <Alert
                  key="alert-1"
                  v-if="run.state === 'succeeded'"
                  severity="success"
                  :label="`${selected.name} is installed on ${run.application}. It runs from the next request.`"
                />
                <Alert
                  key="alert-2"
                  v-else-if="run.state === 'failed'"
                  severity="danger"
                  :label="`${selected.name} wasn't installed on ${run.application}. ${run.reason}`"
                  action-label="Reinstall"
                  @action="
                    () => {
                      form.application = run.application
                      install()
                    }
                  "
                />

                <p class="m-0 text-body-sm text-(--text-muted)">{{ selected.description }}</p>

                <KeyValuePairs
                  :columns="2"
                  aria-label="Integration details"
                >
                  <KeyValuePairs.Item label="Publisher"
                    ><bdi>{{ selected.vendor }}</bdi></KeyValuePairs.Item
                  >
                  <KeyValuePairs.Item label="Category">{{ selected.category }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Context">{{
                    CONTEXTS[selected.context]
                  }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Version">{{ selected.version }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Updated">{{ selected.updated }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Installed on">{{
                    selected.installedOn.length ? selected.installedOn.join(', ') : 'Not installed'
                  }}</KeyValuePairs.Item>
                </KeyValuePairs>

                <section
                  class="flex flex-col gap-(--layout-group-gap)"
                  aria-labelledby="integration-overview"
                >
                  <h3
                    id="integration-overview"
                    class="text-heading-xxs text-(--text-default)"
                  >
                    Overview
                  </h3>
                  <DocProse>
                    <p>{{ selected.description }}</p>
                    <p>
                      Installing adds a function instance to the application you choose and one rule
                      that runs it. Its settings can be changed at any time from Configure.
                    </p>
                  </DocProse>
                </section>

                <section
                  class="flex flex-col gap-(--layout-group-gap)"
                  aria-labelledby="integration-permissions"
                >
                  <h3
                    id="integration-permissions"
                    class="text-heading-xxs text-(--text-default)"
                  >
                    Permissions
                  </h3>
                  <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                    <li
                      v-for="permission in [
                        'Read the application’s rules',
                        'Add a function instance to the application',
                        'Add one rule that runs the function'
                      ]"
                      :key="permission"
                      class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                    >
                      <i
                        class="pi pi-check shrink-0 text-(--success-contrast)"
                        aria-hidden="true"
                      />
                      {{ permission }}
                    </li>
                  </ul>
                </section>

                <section
                  class="flex flex-col gap-(--layout-group-gap)"
                  aria-labelledby="integration-install"
                >
                  <h3
                    id="integration-install"
                    class="text-heading-xxs text-(--text-default)"
                  >
                    {{ selected.installedOn.length ? 'Install on another application' : 'Install' }}
                  </h3>
                  <Field
                    v-if="available.length"
                    :invalid="applicationInvalid"
                    :disabled="run.state === 'running'"
                    required
                  >
                    <Field.Label>Application</Field.Label>
                    <Select
                      v-model="form.application"
                      size="medium"
                      placeholder="Select an application"
                    >
                      <Select.Trigger class="w-full" />
                      <Select.Content>
                        <Select.Option
                          v-for="app in available"
                          :key="app"
                          :value="app"
                          >{{ app }}</Select.Option
                        >
                      </Select.Content>
                    </Select>
                    <Field.Error v-if="applicationInvalid">
                      Select the application to install {{ selected.name }} on.
                    </Field.Error>
                    <Field.Description v-else>
                      The integration runs on every request to this application.
                    </Field.Description>
                  </Field>
                  <p
                    v-else
                    class="m-0 text-body-sm text-(--text-muted)"
                  >
                    {{ selected.name }} is installed on every application.
                  </p>
                </section>
              </div>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
                <Button
                  v-if="selected.installedOn.length"
                  label="Configure"
                  icon="pi pi-cog"
                  kind="outlined"
                  size="medium"
                  :href="`/marketplace/${selected.id}/configure`"
                />
                <Button
                  key="button-2"
                  v-if="available.length"
                  label="Install"
                  kind="primary"
                  size="medium"
                  type="submit"
                  :loading="run.state === 'running'"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
```
