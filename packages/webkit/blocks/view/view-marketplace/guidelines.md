# ViewMarketplace

The page where people find something made by Azion or a partner and add it to what they run. It lists integrations, installed into an existing application; templates, which start a new project, live in `view/view-template-browser`. People browse by need ("block bots", "split traffic"), compare by publisher and context, read what an integration does and what it may touch, then install it on one application and keep working while it installs. One `useCollection` call holds the search and the filters; one drawer holds the detail and the install; the install reports by toast wherever the person is.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use marketplace for installable integrations into an existing resource; templates live in view-template-browser.
- A catalog of installable add-ons (integrations, extensions, plugins) with a publisher, a category and an installed state per account.
- Installing means choosing a target (an application) and waiting for an asynchronous run.

## When not to use

- The catalog of templates a project starts from: use `view/view-template-browser`.
- Deploying a chosen template: use `create/create-deploy-template`.
- The resources the account already created: use `view/view-card` or `view/view-table`.
- Changing the settings of an installed integration on one application: use `edit/edit-resource` from Configure.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size: "Marketplace" and one sentence of purpose. The actions slot holds only the outlined medium Documentation `Button`, which opens the docs in a new tab.

### B. Featured — `IntegrationCard` (required)

While no filter is set (`filtersActive` is false), a "Featured" `h2` over three `IntegrationCard featured` tiles in a row (one a row on a phone): the mark, the name, the publisher and the description centred on a raised surface with a primary glow at the top, and the context as a primary badge in the corner. They carry no action, so the row reads as a recommendation; the tile opens the drawer. Searching hides the row, so the results start at the top.

### C. Search and filter — `PropertyFilter` (required)

Under the "All integrations" `h2`, one `PropertyFilter` bound with `v-bind="propertyFilterProps"`. Free text searches the name, the publisher and the description; Publisher and Category list the values in the catalog, Context is Application or Firewall, and Status is Installed or Available. Every token lives in the URL (`url: true`).

### D. Integration tiles — `IntegrationCard`, `Button` (required)

A `ul` grid, one to three tiles a row by width, of `IntegrationCard`: the logo, the name (the stretched target that emits `select`), "by" the publisher, two lines of description, the category as a secondary badge, the Installed tag from `installed`, and in the `action` slot an outlined small `Button`, Install for an available integration and Configure for an installed one, named with the integration (`Install Rate Guard`). Both the tile and its action open the drawer.

### E. No matching integrations — `EmptyState`, `Button` (required)

When `status` is `no-match`, the grid gives way to a medium `EmptyState` with the filter-slash glyph, "No matching integrations", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`.

### F. Integration drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter` (required)

A large right `Drawer` controlled by `v-model:open`. Its content is a `form` named `Install <name>` with `novalidate`. `PanelHeader` holds the logo, the name as `DrawerTitle`, "by" the publisher and the drawer's own close button. `PanelBody` scrolls; `PanelFooter` holds, at the end, Configure (outlined, a link to the integration's settings) when it is installed somewhere, and the primary submit Install while an application is left.

### G. Install outcome — `Alert` (required)

The inline half of the state-async-submit outcome, at the top of the drawer: a success `Alert` naming the application ("Rate Guard is installed on storefront. It runs from the next request."), or a danger `Alert` with the server's reason and a Reinstall action. Nothing shows while idle or running; the button and the toast carry the running state.

### H. Integration facts — `KeyValueList` (required)

A two-column `KeyValueList` named "Integration details": Publisher (in `bdi`), Category, Context, Version, Updated and Installed on (the applications, or "Not installed").

### I. Overview — `DocProse` (required)

An "Overview" `h3` over the publisher's text in `DocProse`, ending on what installing adds to the application. Then a "Permissions" `h3` with the list of what the integration may read or add, each line led by a check glyph.

### J. Install form — `Field`, `Select` (required)

An "Install" `h3` ("Install on another application" once installed somewhere) over a required `Field` labelled Application with a `Select` of the applications it is not installed on yet. Submitting without a choice marks the `Field` invalid and shows `Field.Error` ("Select the application to install Rate Guard on."); otherwise `Field.Description` says where it runs. While the run lasts the `Field` is disabled. When no application is left, the field gives way to one sentence and the footer drops Install.

### K. Solution page — `Card`, `Select`, `Field`, `KeyValueList`, `DocProse` (optional)

The drawer's content as a page, for the integration's own URL (the variant renders `parts/solution-page.vue`, which adds `Tabs`, `Link`, `Table` and `Tag`). A `Link` back to Marketplace, the `PageHeader`, then `Tabs` for Overview (what it does and what it needs, under section headings smaller than the page title), Usage (how to set it up, with the setting names in code), Changelog (an ordered version history, newest first, `Latest` as an info `Tag`) and Applications (a `Table` of the applications running it with their version, `TableCellStatus` Up to date or Update available, and an `Update to <version>` button). Beside it, an install card: a required Application `Select` whose options carry an `Installed` or `Update available` `Tag` (installed and current ones are disabled) and a submit that reads Install or Update; under it the facts in `KeyValueList`. Install and Update are async runs with the same toast as the drawer (Configure, Open application).

### L. Configure screen — `Field`, `Select`, `Alert`, `Button` (optional)

The settings of one installed integration on one application (the variant renders `parts/configure-page.vue`, which adds `SettingsGroup`, `Item`, `SettingsRow`, `Switch`, `Input` and `SaveBar`). `SettingsGroup`s group them; an on/off setting is a compact `SettingsRow` in an `Item.List`, the rest are `Field`s. Errors follow `state/state-form-validation` (SectionRejected): nothing is red before Save; after it a danger `Alert` above and a `Field.Error` per field, focus on the first. Changes raise a `SaveBar` with Discard and Save. Saving settings is not a deploy, so the toast has no Edit or Redeploy.

### M. Loading catalog — `Card`, `Skeleton` (required)

While `loading` is set, the Featured row and the heading of All integrations give way to one band that is `aria-busy` and named Loading integrations: the disabled `PropertyFilter` over six `Card`s holding `Skeleton` shapes (mark, name, two lines, the badge and the action), in the grid of the tiles.

### Install toast — through `toast`

Raised through `toast` with one id for the install, so progress turns into the outcome in place, and only while the drawer is closed: with the drawer open, the inline `Alert` and the Install button carry the run, so no toast covers the form; closing the drawer raises the toast for the run (an outcome once). Progress is `toast.loading` ("Installing Rate Guard on storefront…", "It keeps running while you work elsewhere."). Success is `toast.success`, closable, with Configure and Open application. Failure is `toast.error` with `duration: 0`, closable, with Edit (reopens the drawer with the same choice) and Reinstall. Leaving the page dismisses it. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its records through props and emits every action; it fetches nothing and runs no install itself. `MarketplaceIntegration`, `MarketplaceInstall` and `MarketplaceProps` are exported from `view-marketplace.vue`, and `sample.ts` holds the sample catalog and applications the block renders when `integrations` and `applications` are left out (the catalog never while `loading` is set).

| Prop                   | Type                       | What it does                                                                                                 |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `integrations`         | `MarketplaceIntegration[]` | The catalog; the search, the properties, Featured and the tiles run on it in the browser.                    |
| `applications`         | `string[]`                 | The applications an integration can be installed on; the drawer's `Select` lists the ones it is not on yet.  |
| `loading`              | `boolean`                  | The catalog is loading: the search disables and six skeleton tiles hold the grid.                            |
| `installing`           | `boolean`                  | The install request is in flight: Install spins, the field locks and the progress toast shows.               |
| `error`                | `string`                   | Why the last install failed: the danger `Alert` with Reinstall and the permanent failure toast.              |
| `installedApplication` | `string`                   | The application the last install succeeded on: the success `Alert`, the Installed tag and the success toast. |
| `defaultText`          | `string`                   | Search text the filter starts with, shown as a free-text token.                                              |
| `defaultIntegration`   | `string`                   | Id of the integration whose drawer starts open.                                                              |
| `defaultApplication`   | `string`                   | Application the install field starts with.                                                                   |

| Event     | Payload                                 | When                                                          |
| --------- | --------------------------------------- | ------------------------------------------------------------- |
| `select`  | `(event, integration)`                  | A tile, or its Install or Configure button, opens the drawer. |
| `install` | `(event, { integration, application })` | Install (or Reinstall) with an application chosen.            |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import ViewMarketplace, { type MarketplaceInstall } from './view-marketplace.vue'

  const { data, pending } = useIntegrations()
  const { data: applications } = useApplications()
  const installing = ref(false)
  const installError = ref('')
  const installedOn = ref('')

  const install = async (event: Event, { integration, application }: MarketplaceInstall) => {
    installing.value = true
    installError.value = ''
    installedOn.value = ''
    try {
      await installIntegration(integration.id, application)
      installedOn.value = application
    } catch (failure) {
      installError.value = reasonOf(failure)
    } finally {
      installing.value = false
    }
  }
</script>

<template>
  <ViewMarketplace
    :integrations="data ?? []"
    :applications="applications ?? []"
    :loading="pending"
    :installing="installing"
    :error="installError"
    :installed-application="installedOn"
    @install="install"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`; derive the Status property from where each integration is installed.
- Use `IntegrationCard` for every integration tile, with the installed state as the `installed` prop and one action in the `actions` slot.
- Hide the Featured row while any filter is set.
- Keep templates out of this page: a template starts a project, so it lives in `view/view-template-browser`.
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
- Don't add a Templates tab or template tiles; link to `view/view-template-browser` instead.
- Don't use `featured` for every integration tile; it marks the short Featured row only.

## Copy

- **Title:** "Marketplace". Description: "Find integrations that run on your applications."
- **Sections:** "Featured", "All integrations".
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
- Each tile's target is a real button named by the integration; the action button sits above it and is named with the integration, so "Install" is never ambiguous in a list.
- The Installed state is text in a `Tag`, never colour alone.
- `/` focuses the integrations search from anywhere on the page, except while typing in a field.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to what opened it; its form has an accessible name.
- The Application field is required and labelled; its error is tied to the `Select` through the `Field`, and focus stays on Install so the person can correct and resubmit.
- Toasts never take focus and are announced politely, the failure toast assertively; the failure toast stays until closed and its actions are reachable by keyboard.
- In Configure, `⌘ S` (`Ctrl S` off Apple) saves the settings while the `SaveBar` shows unsaved changes, the same as Save; with no changes it does nothing. Save carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- Default: `integrations`, or the sample; Featured, All integrations, the filter and the tiles; a tile opens the drawer and Install emits `install`; `installing`, `error` and `installedApplication` show its outcome.
- Detail: `defaultIntegration="request-signer"`; the drawer is open on Request Signer with its details, overview, permissions and the install form.
- Installing: `installing`, with `defaultApplication="storefront"`; Install is running on storefront; the button is `loading`, the field disabled and the progress toast says it keeps running.
- Installed: `installedApplication="storefront"`; Request Signer is installed on storefront; the success Alert, the Installed tag, Configure in the footer and the success toast with Configure and Open application.
- InstallError: `error`, with `defaultApplication="checkout"`; the install on checkout failed; the danger Alert with the reason and Reinstall, and the permanent toast with Edit and Reinstall.
- NoMatch: `defaultText="kubernetes"`; the integration search "kubernetes" matches nothing; the Featured row hides and the empty state offers Clear filters.
- Loading: `loading`; the search is disabled and six `Skeleton` integration tiles hold the grid in a band that is `aria-busy`.
- SolutionPage: Waiting Room as a page, storefront on 1.3.0 (Update available) and checkout on 1.4.0.
- Configure: Waiting Room settings on storefront, with the SaveBar after a change.

## Related

- `view/view-template-browser` — the one template catalog, grouped by category, with a filter and a README preview.
- `create/create-deploy-template` — where a template's Deploy leads.
- `state/state-async-submit` — the toast and inline outcome every install follows.
- `state/state-form-validation` (SectionRejected) — the field, section and toast placement of a form error.
- `IntegrationCard` and `useCollection` — see `skills/webkit-lists`.
