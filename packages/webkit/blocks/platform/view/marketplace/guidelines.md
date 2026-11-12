# Marketplace

The page where people find something made by Azion or a partner and add it to what they run. Two kinds of item live here: integrations, installed into an existing application, and templates, which start a new project. People browse by need ("block bots", "split traffic"), compare by publisher and context, read what an integration does and what it may touch, then install it on one application and keep working while it installs. One `useCollection` call holds the search and the filters; one drawer holds the detail and the install; the install reports by toast wherever the person is.

## When to use

- A catalog of installable add-ons (integrations, extensions, plugins) with a publisher, a category and an installed state per account.
- Installing means choosing a target (an application) and waiting for an asynchronous run.
- The same page also points people at templates, the other way to start from someone else's work.

## When not to use

- Only templates, with a preview and a README: use `platform/view/template-browser`.
- Deploying a chosen template: use `platform/create/deploy-template`.
- The resources the account already created: use `platform/view/card-view` or `platform/view/table-view`.
- Changing the settings of an installed integration on one application: use `platform/edit/edit-resource` from Configure.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size: "Marketplace" and one sentence of purpose. The actions slot holds only the outlined medium Documentation `Button`, which opens the docs in a new tab.

### B. Item kinds — `Tabs` (required)

`Tabs.Root` with Integrations and Templates, starting on the tab the URL names (Integrations by default here). Each tab is a `Tabs.Panel`; the panels keep their own state when the person switches.

### C. Featured — `Card` (required)

While no filter is set (`filtersActive` is false), a "Featured" `h2` over three `Card kind="integration"` tiles in a row (one a row on a phone). They carry the context as their badge and no action, so the row reads as a recommendation; the tile opens the drawer. Searching hides the row, so the results start at the top.

### D. Search and filter — `PropertyFilter` (required)

Under the "All integrations" `h2`, one `PropertyFilter` bound with `v-bind="propertyFilterProps"`. Free text searches the name, the publisher and the description; Publisher and Category list the values in the catalog, Context is Application or Firewall, and Status is Installed or Available. Every token lives in the URL (`url: true`).

### E. Integration tiles — `Card`, `Button` (required)

A `ul` grid, one to three tiles a row by width, of `Card kind="integration"`: the logo, the name (the stretched target that emits `select`), "by" the publisher, two lines of description, the category as a secondary badge, the Installed tag from `installed`, and in the `action` slot an outlined small `Button`, Install for an available integration and Configure for an installed one, named with the integration (`Install Rate Guard`). Both the tile and its action open the drawer.

### F. No matching integrations — `EmptyState`, `Button` (required)

When `status` is `no-match`, the grid gives way to a medium `EmptyState` with the filter-slash glyph, "No matching integrations", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`.

### G. Popular templates — `Card`, `Button` (required)

The Templates tab: a "Popular templates" `h2` with a transparent small Browse all templates `Button` that leads to `platform/view/template-browser`, over a grid of small `Card` tiles (the mark, the name as a stretched link to the template's preview, the framework). The full catalog, its filter and the README live in the template browser.

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

### M. Install toast — `Toaster` (required)

One `Toaster` at `bottom-right`, raised through `toast` with one id for the install, so progress turns into the outcome in place. Progress is `toast.loading` ("Installing Rate Guard on storefront…", "It keeps running if you close this panel."). Success is `toast.success`, closable, with Configure and Open application. Failure is `toast.error` with `duration: 0`, closable, with Edit (reopens the drawer with the same choice) and Reinstall. Leaving the page dismisses it.

### N. Solution page — `Tabs`, `Card`, `Select`, `Field`, `KeyValuePairs`, `DocProse` (optional)

The drawer's content as a page, for the integration's own URL (the variant adds `Link`, `Table` and `Tag`). A `Link` back to Marketplace, the `PageHeader`, then `Tabs` for Overview (`DocProse`), Usage (how to set it up, with the setting names in code), Changelog (an ordered version history, newest first, `Latest` as an info `Tag`) and Applications (a `Table` of the applications running it with their version, `Table.CellStatus` Up to date or Update available, and an `Update to <version>` button). Beside it, an install card: a required Application `Select` whose options carry an `Installed` or `Update available` `Tag` (installed and current ones are disabled) and a submit that reads Install or Update; under it the facts in `KeyValuePairs`. Install and Update are async runs with the same toast as the drawer (Configure, Open application).

### O. Configure screen — `Field`, `Select`, `Alert`, `Button` (optional)

The settings of one installed integration on one application (the variant adds `SettingsSection`, `Item`, `SettingRow`, `Switch`, `Input` and `SaveBar`). `SettingsSection`s group them; an on/off setting is a compact `SettingRow` in an `Item.List`, the rest are `Field`s. Errors follow `platform/states/form-error`: nothing is red before Save; after it a danger `Alert` above and a `Field.Error` per field, focus on the first. Changes raise a `SaveBar` with Discard and Save. Saving settings is not a deploy, so the toast has no Edit or Redeploy.

### P. Template page — `Field`, `Button`, `KeyValuePairs` (optional)

A template as a page, for the template's own URL (the variant adds `SettingsSection`, `Input` and `Link`): the description, a deploy form (application name, repository) beside the facts. Deploy is a build and deploy, so it follows `platform/states/async-submit`: loading on the button, a progress toast, and a success toast with Edit and Redeploy.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`; derive the Status property from where each integration is installed.
- Use `Card kind="integration"` for every integration tile, with the installed state as the `installed` prop and one action in the `action` slot.
- Hide the Featured row while any filter is set.
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
- Don't rebuild the template browser inside the Templates tab; link to it.

## Copy

- **Title:** "Marketplace". Description: "Find integrations and templates that run on your applications."
- **Tabs:** "Integrations", "Templates". **Sections:** "Featured", "All integrations", "Popular templates".
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

- One `main` landmark; the `PageHeader` title is the only `h1`, each section heading an `h2`, each tile name an `h3`.
- The tabs follow the tablist pattern: arrow keys move between Integrations and Templates, and each panel is labelled by its tab.
- Each tile's target is a real button named by the integration; the action button sits above it and is named with the integration, so "Install" is never ambiguous in a list.
- The Installed state is text in a `Tag`, never colour alone.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to what opened it; its form has an accessible name.
- The Application field is required and labelled; its error is tied to the `Select` through the `Field`, and focus stays on Install so the person can correct and resubmit.
- Toasts are announced politely and never take focus; the failure toast stays until closed and its actions are reachable by keyboard.

## States

- Default: the Integrations tab with Featured, All integrations, the filter and the tiles; a tile opens the drawer and Install runs and lands as a success toast and Alert.
- Templates: the Templates tab with popular templates linking to the template browser.
- Detail: the drawer is open on Request Signer with its details, overview, permissions and the install form.
- Installing: Install is running on storefront; the button is `loading`, the field disabled and the progress toast says it keeps running.
- Installed: Request Signer is installed on storefront; the success Alert, the Installed tag, Configure in the footer and the success toast with Configure and Open application.
- InstallFailed: the install on checkout failed; the danger Alert with the reason and Reinstall, and the permanent toast with Edit and Reinstall.
- NoMatch: the search "kubernetes" matches nothing; the Featured row hides and the empty state offers Clear filters.
- Loading: the filter is disabled and six `Skeleton` tiles (logo, name, two lines, badge, action) hold the grid in a band that is `aria-busy`.

- SolutionPage: Waiting Room as a page, storefront on 1.3.0 (Update available) and checkout on 1.4.0.
- Configure: Waiting Room settings on storefront, with the SaveBar after a change.
- TemplatePage: Nuxt Storefront as a page with its deploy form.

## Related

- `platform/view/template-browser` — the full template catalog the Templates tab leads to.
- `platform/create/deploy-template` — where a template's Deploy leads.
- `platform/states/async-submit` — the toast and inline outcome every install follows.
- `platform/states/form-error` — the field, section and toast placement of a form error.
- `Card` (`kind="integration"`) and `useCollection` — see `skills/webkit-lists`.
