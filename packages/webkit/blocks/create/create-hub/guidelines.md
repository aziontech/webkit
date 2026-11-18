# Create hub

The Creation Center, where a new project starts. The user arrives from Home or a Create action with something to deploy and needs to pick its source in one look: a repository from their Git account, a template, or a file or folder from their machine. The page puts the two main sources side by side, Import from GitHub and Start from template, under one heading, and offers file and folder upload in the heading.

## When to use

- Use create-hub as the first screen of every new project, where the user picks Git, a template or an upload.
- The entry point of every new project, before the user has decided where the code comes from.
- The user may import an existing repository, start from a framework or starter template, or upload local files.
- The choice leads to a focused flow outside the console shell, such as `create/create-deploy-template`.

## When not to use

- Creating a first-level resource that has no source code: use `create/create-page`.
- Configuring and deploying once the source is known: use `create/create-deploy-template`.
- A first-level resource created in ordered steps: use `create/create-wizard`.
- Adding something inside an existing resource: use `create/create-drawer`.
- The drop target and upload progress after a folder is dropped: those are `state/state-project-intake`.
- Teaching a module to a new account: use `state/state-first-use`.

## Building blocks

### A. Creation header — `AppHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The creation header from `top-bar/top-bar-creation`: a small outlined back `IconButton` to Home, the `Brand` linking home, a `Breadcrumb` with Creation Center as the single current crumb, and the account `Avatar` alone on the right. No sidebar.

### B. Page heading — `PageHeader` (required)

`PageHeader` at `size="large"`. The description says what the page offers in one sentence and ends with inline file and folder `Button`s at `variant="link"` that open the system picker (a hidden file input, and one with `webkitdirectory` for a folder). Picking hands the files to the Upload a project flow (`create/create-deploy-template` Upload); the block announces it with an info toast. Dropping a folder is the job of `state/state-project-intake`; this page does not claim it. They are link-coloured and underline only on hover, like the rest of the console's text actions.

### C. Git connect — `EmptyState`, `Button`, `Alert`, `Link` (required until connected)

Under the Import from GitHub heading, a medium `bordered` `EmptyState` (it draws its own dashed surface, no wrapper): the provider glyph, a title, one sentence, Continue with GitHub as a secondary large `Button` and Manage connected providers as a large `Link`, both centred at their natural width (`class="self-center"`), so on a phone the button does not stretch across the column. It shows only while no account is connected. When the connection fails, a small danger `Alert` under the button says so and the button retries.

### D. Repository search — `Select`, `Input` (required once connected)

A large `Select` of the connected scopes with the provider glyph in the trigger and Add GitHub account as the last option, beside a large search `Input` that filters by name and also accepts a repository URL. Picking a scope reloads the list.

### E. Repository list — `Card`, `Item`, `Button`, `Skeleton`, `Alert`, `EmptyState` (required once connected)

A flush `Card` with an `Item` list, one small row per repository: glyph, name, its last push as the description and a small secondary Import `Button` named after the repository. Repositories are ordered most recently pushed first; the ten most recent show, and a transparent Load more adds ten at a time. While a scope loads, six `Skeleton` rows in the shape of the `Item` stand in, hidden from assistive technology, under an `aria-busy` region with one `role="status"` line. A failed load replaces the list with a danger `Alert` and a Retry action; a search with no match shows a small `EmptyState` with Clear search.

### F. Template gallery — `Input`, `ScrollArea`, `Card`, `IntegrationCard`, `EmptyState` (required)

Beside the Start from template heading, a medium search `Input` that filters the templates by name and description, then a faded `ScrollArea` with an `aria-label`. A search with no match shows a small `EmptyState` with Clear search. For the full gallery with property filters, preview and loading or failed states, link to `view/view-template-browser`. Inside, sections in fixed order: Recommended framework cards in three columns from the large breakpoint, the starter templates one per kind of resource, then every other framework in two columns with the vendor beside the title. The starter and framework tiles are `IntegrationCard` with `href`: the title is a link stretched over the tile, with the glyph, the vendor and one sentence. A Recommended card keeps its own glow markup, and its title is a link stretched over the card in the same way; no tile carries `role="button"`. A Recommended card shows its framework mark in grey until it is hovered or focused, then in colour, and lights a soft glow from its top start corner drawn from the mark: an `aria-hidden` span under the content (the `Card` carries `isolate`) holds a scaled, blurred, faded copy of the mark, so a colour mark glows in its own colours and a one-colour mark in `text-(--primary)`.

## Data

The block takes its accounts, repositories and templates through props and emits every action; it fetches nothing. `CreateHubAccount`, `CreateHubRepository`, `CreateHubTemplateSection` and `CreateHubProps` are exported from `create-hub.vue`, and `sample.ts` holds the sample repositories and templates the block renders when `repositories` or `templates` is left out (the repositories never while `loading` or `error` is set). `sampleAccounts` is what the variants pass to show a connected account.

| Prop            | Type                         | What it does                                                                       |
| --------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `accounts`      | `CreateHubAccount[]`         | The connected GitHub accounts. `[]` (the default) shows the connect state.         |
| `repositories`  | `CreateHubRepository[]`      | The repositories of the selected scope, most recently pushed first.                |
| `templates`     | `CreateHubTemplateSection[]` | The template sections, Recommended first.                                          |
| `connecting`    | `boolean`                    | The GitHub authorization is in flight; Continue with GitHub spins.                 |
| `connectError`  | `string`                     | Why the connection failed, shown in the danger `Alert` under Continue with GitHub. |
| `loading`       | `boolean`                    | The repositories of the selected scope are loading; skeleton rows show.            |
| `error`         | `string`                     | Why the repositories failed to load, shown in the danger `Alert` with Retry.       |
| `v-model:scope` | `string`                     | The selected account; empty, the first account is selected.                        |

| Event          | Payload               | When                                                                       |
| -------------- | --------------------- | -------------------------------------------------------------------------- |
| `connect`      | `(event)`             | Continue with GitHub, the first time and on a retry after an error.        |
| `update:scope` | `(value)`             | Another account was selected in the scope `Select`; load its repositories. |
| `retry`        | `(event)`             | Retry in the repositories error alert.                                     |
| `import`       | `(event, repository)` | Import on a repository row.                                                |
| `upload`       | `(event, files)`      | A file or a folder was picked through the system picker.                   |

To go live, render the block from a page that owns the GitHub requests and pass what they return:

```vue
<script setup lang="ts">
  import CreateHub from './create-hub.vue'

  const { accounts, connect, connecting, connectFailed } = useGitAccounts()
  const scope = ref('')
  const { data, pending, error, refresh } = useRepositories(scope)
  const connectError =
    "GitHub didn't connect. The authorization window closed before GitHub answered."
  const loadError = "The repositories in this scope didn't load. GitHub didn't answer in time."
</script>

<template>
  <CreateHub
    v-model:scope="scope"
    :accounts="accounts"
    :connecting="connecting"
    :connect-error="connectFailed ? connectError : ''"
    :repositories="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    @connect="connect"
    @retry="refresh"
    @import="(event, repository) => openImport(repository)"
  />
</template>
```

Then delete the sample imports. Pass `templates` from the template catalog, or keep the sample sections as the shipped list.

## Do

- Keep both sources visible at once from the large breakpoint, the Git column first.
- Show the connect state only until an account exists, then go straight to the list.
- Let the search accept a pasted repository URL, so the user does not have to find it in the list.
- Keep template sections in the same order on every visit; Recommended first.
- Offer file and folder buttons in the heading so uploading works without a mouse.
- Show a failed connection or a failed load with a danger `Alert` and a way to retry, and a search with no match with an `EmptyState` and Clear search.

## Don't

- Don't put the hub inside the console shell or open it in a drawer; it is a focused page.
- Don't replace the list with a spinner while a scope loads; use skeleton rows in its shape.
- Don't add a Continue or Next button; each Import and each template card starts its flow.
- Don't let the template gallery push the page into a long scroll on large screens; it scrolls inside its own area.
- Don't show templates as a dense table; the glyph and sentence are what the user scans.
- Don't hand-write the file and folder links or underline them at rest; use `Button variant="link"`.

## Copy

- **Heading:** a verb phrase for the task, e.g. "Start a new project"; description one sentence with a period, e.g. "Start from a repository or use a framework template."
- **Column titles:** short fragments, e.g. "Import from GitHub".
- **Connect state:** title states the task, e.g. "Connect your repository"; description one sentence, e.g. "Select a Git provider to connect your repository and start the deployment process."
- **Buttons:** verb first, three words or fewer, e.g. "Continue with GitHub", "Import", "Load more", "Clear search".
- **Search:** placeholder and `aria-label` name what it takes, e.g. "Search repositories or paste a repository URL".
- **Template cards:** title is the template name; description one sentence, e.g. "Compile Rust to WebAssembly and run it."
- Follow `skills/webkit-microcopy`: sentence case, select rather than choose or pick, no em dash.

## Accessibility

- The `PageHeader` title is the page's only `h1`; column titles are `h2`, the template section labels `h3`, and template titles sit below them (the `IntegrationCard` title, and `h4` on a Recommended card).
- The back `IconButton`, the brand link, the account button, the scope `Select` and the search each have an `aria-label`.
- Each template tile is reached through its title link, which covers the tile; Enter follows it. Each Import button is named after its repository.
- The loading region sets `aria-busy="true"` with one `role="status"` line; skeleton rows are hidden from assistive technology.
- Upload works from the keyboard: the file and folder buttons in the description open the system picker.
- The `ScrollArea` is named so screen reader users know which region scrolls.

## States

- Default: no Git account connected (`accounts` is `[]`); the connect state beside the template gallery.
- Connected: `accounts` is passed and jane-doe, the first, is the selected scope; its ten most recently pushed repositories are listed, with Load more for the rest.
- RepositoriesLoading: a scope was just picked (`loading`); six skeleton rows stand in for the repositories.
- ConnectError: the GitHub connection failed (`connectError` is set); a danger Alert under Continue with GitHub.
- LoadError: the repositories failed to load (`error` is set); a danger Alert with Retry in place of the list.

## Related

- `create/create-deploy-template` — where a template card or Import leads.
- `state/state-project-intake` — the drop target and upload overlay for a dropped folder.
- `top-bar/top-bar-creation` — the header this page uses.
- `dashboard/dashboard-home` — Home, where the back control returns.
