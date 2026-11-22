# CreateHub (`create/create-hub`)

> The Creation Center, where a project starts: the creation header with a single current crumb and a back control to Home, a large page heading whose lead offers to upload a file or a folder through the system picker, then two columns side by side from the large breakpoint. On the left, Import from GitHub: a bordered EmptyState with Continue with GitHub until an account is connected (a danger Alert under the button when the connection fails), then an account Select with an Add GitHub account option, a search that also takes a repository URL, and a flush list of the ten most recently pushed repositories with a named Import button each and Load more for the rest; skeleton rows with a status line while a scope loads, a danger Alert with Retry when the list fails to load, and a small EmptyState with Clear search when nothing matches. On the right, Start from template: a template search over a faded ScrollArea holding Recommended framework cards in three columns, then the starter templates, one per kind of resource, and every other framework as two-column `IntegrationCard`s with the vendor beside the title; each tile links to its deploy page, and a search with no match shows an EmptyState with Clear search. Each Recommended card turns its mark from grey to colour and lights a glow drawn from its mark on hover and focus. Built from `PageHeader`, `AppHeader`, `Breadcrumb`, `EmptyState`, `Alert`, `Link`, `Select`, `Input`, `Card`, `IntegrationCard`, `Item`, `Skeleton`, `ScrollArea` and `Button`.

- Surface: app
- Source: `blocks/create/create-hub/create-hub.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-hub")`
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), `AppHeaderAccount`, [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [IntegrationCard](../../components/integration-card.md), [Item](../../components/item.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [ScrollArea](../../components/scroll-area.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), `use-file-picker`
- Skills: `webkit-create-surface`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

create hub; creation center; new project; start a project; import from github; import repository; start from template; template gallery; create from git; central de criação; novo projeto; importar repositório; começar de um template; create project; where to start; começar um projeto

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

`PageHeader` at `size="large"`. The description says what the page offers in one sentence and ends with inline file and folder `Button`s at `variant="link"` that open the system picker through `useFilePicker` (one for files, one with `directory` for a folder). Picking hands the files to the Upload a project flow (`create/create-deploy-template` Upload); the block announces it with an info toast. Dropping a folder is the job of `state/state-project-intake`; this page does not claim it. They are link-coloured and underline only on hover, like the rest of the console's text actions.

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

## Variants

- `Default` — primary (the code below)
- `Connected` — GitHub connected: jane-doe is the selected scope and its ten most recently pushed repositories are listed, with Load more for the other two.
- `RepositoriesLoading` — A scope just picked: six skeleton rows, hidden from assistive technology, stand in for the repositories while one status line says they are loading.
- `ConnectError` — The GitHub connection failed: the connect EmptyState stays, with a danger Alert under Continue with GitHub saying the authorization did not finish; pressing the button again retries.
- `LoadError` — The repositories of the jane-doe scope failed to load: a danger Alert with Retry takes the place of the list, while the scope Select and the search stay usable.

Each variant is the same screen in another state: `get_block("create/create-hub", { variant })`, or the file under `blocks/create/create-hub/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, ref, watch } from 'vue'

  import { sampleRepositories, sampleTemplates } from './sample'

  /** A GitHub account or organization the person can import from. */
  export interface CreateHubAccount {
    /** The name shown in the scope Select. */
    label: string
    /** The scope key. */
    value: string
  }

  /** One repository in the selected scope, most recently pushed first. */
  export interface CreateHubRepository {
    /** The repository name. */
    name: string
    /** When it was last pushed, already phrased (2 hours ago). */
    age: string
    /** The framework or kind glyph, an icon class. */
    icon: string
  }

  /** One template tile. */
  export interface CreateHubTemplate {
    /** The key of its deploy page. */
    slug: string
    /** The template name. */
    title: string
    /** One sentence on what it deploys. */
    description: string
    /** Who publishes it, shown beside the title on list tiles. */
    vendor?: string
    /** The framework or kind glyph, an icon class. */
    icon: string
    /** Extra classes on the glyph, such as the dark-theme invert. */
    markClass: string
  }

  /** How a template section lays out its tiles. */
  export type CreateHubTemplateSectionKind = 'cards' | 'list'

  /** A group of templates under one heading. */
  export interface CreateHubTemplateSection {
    /** Stable key. */
    id: string
    /** The section heading. */
    label: string
    /** Recommended cards in three columns, or two-column integration tiles. */
    kind: CreateHubTemplateSectionKind
    /** The templates in the section. */
    items: CreateHubTemplate[]
  }

  export interface CreateHubProps {
    /** The connected GitHub accounts; empty, the connect state shows. */
    accounts?: CreateHubAccount[]
    /** The repositories of the selected scope. Left out, the sample renders. */
    repositories?: CreateHubRepository[]
    /** The template sections. Left out, the sample renders. */
    templates?: CreateHubTemplateSection[]
    /** The GitHub authorization is in flight; Continue with GitHub spins. */
    connecting?: boolean
    /** Why the GitHub connection failed, shown under Continue with GitHub. */
    connectError?: string
    /** The repositories of the selected scope are loading; skeleton rows show. */
    loading?: boolean
    /** Why the repositories failed to load; a danger alert with Retry replaces the list. */
    error?: string
  }

  const props = withDefaults(defineProps<CreateHubProps>(), {
    accounts: () => [],
    repositories: undefined,
    templates: undefined,
    connecting: false,
    connectError: '',
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    connect: [event: MouseEvent]
    retry: [event: MouseEvent]
    import: [event: MouseEvent, repository: CreateHubRepository]
    upload: [event: Event, files: File[]]
  }>()

  const scope = defineModel<string>('scope', { default: '' })

  const breadcrumb = [{ label: 'Creation Center', active: true }]
  const REPO_PAGE = 10
  const skeletonRows = 6

  const search = ref('')
  const repoLimit = ref(REPO_PAGE)
  const templateSearch = ref('')
  const filePicker = useFilePicker({ multiple: true })
  const folderPicker = useFilePicker({ directory: true })

  const accounts = computed(() => props.accounts)
  const activeScope = computed(() => scope.value || props.accounts[0]?.value || '')
  const reposLoading = computed(() => props.loading)
  const reposFailed = computed(() => props.error !== '')
  const repos = computed<CreateHubRepository[]>(
    () => props.repositories ?? (props.loading || props.error ? [] : sampleRepositories)
  )
  const sections = computed<CreateHubTemplateSection[]>(() => props.templates ?? sampleTemplates)

  watch(activeScope, () => {
    repoLimit.value = REPO_PAGE
  })

  const onSelectScope = (value: string) => {
    if (!value || value === '__add-account__' || value === activeScope.value) return
    scope.value = value
  }

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos.value
    return repos.value.filter((repo) => repo.name.toLowerCase().includes(q))
  })
  const shownRepos = computed(() => filteredRepos.value.slice(0, repoLimit.value))
  const hiddenRepoCount = computed(() => filteredRepos.value.length - shownRepos.value.length)

  const showMoreRepos = () => {
    repoLimit.value += REPO_PAGE
  }

  const clearSearch = () => {
    search.value = ''
  }

  const templateMatches = (item: CreateHubTemplate, query: string) =>
    item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)

  const filteredSections = computed(() => {
    const q = templateSearch.value.trim().toLowerCase()
    if (!q) return sections.value
    return sections.value
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => templateMatches(item, q))
      }))
      .filter((section) => section.items.length > 0)
  })

  const clearTemplateSearch = () => {
    templateSearch.value = ''
  }

  const templateHref = (item: CreateHubTemplate) => `/create/templates/${item.slug}`

  const pickFrom = async (event: MouseEvent, picker: typeof filePicker) => {
    const picked = await picker.open()
    if (picked.length) emit('upload', event, picked)
  }
  const openFilePicker = (event: MouseEvent) => pickFrom(event, filePicker)
  const openFolderPicker = (event: MouseEvent) => pickFrom(event, folderPicker)

  const TEMPLATE_GLOW_CLASS =
    'pointer-events-none absolute inset-0 -z-1 overflow-hidden rounded-(--shape-card) opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance ' +
    'group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none'

  const TEMPLATE_ICON_CLASS =
    'text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance ' +
    'group-focus-within:grayscale-0 group-hover:grayscale-0 motion-reduce:transition-none'
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Home"
          variant="outline"
          size="small"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <AppHeaderAccount
          name="name@example.com"
          aria-label="Account settings"
        />
      </AppHeader.End>
    </AppHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative flex min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0"
    >
      <div class="flex min-h-0 flex-1 flex-col overflow-auto lg:overflow-hidden">
        <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
          <PageHeader
            title="Start a new project"
            size="large"
          >
            <template #description>
              Start from a repository or use a framework template. You can also upload your project:
              select a
              <Button
                variant="link"
                label="file"
                @click="openFilePicker"
              />
              or a
              <Button
                variant="link"
                label="folder"
                @click="openFolderPicker"
              />.
            </template>
          </PageHeader>

          <div
            class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
          >
            <section
              class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
            >
              <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
                <h2 class="text-heading-2xs text-(--text-default)">Import from GitHub</h2>
              </header>

              <div class="flex flex-col lg:min-h-0 lg:flex-1">
                <div
                  v-if="!accounts.length"
                  class="flex lg:min-h-0 lg:flex-1"
                >
                  <EmptyState
                    bordered
                    size="medium"
                    title="Connect your repository"
                    description="Select a Git provider to connect your repository and start the deployment process."
                    class="w-full"
                  >
                    <template #icon>
                      <span class="relative flex size-10 items-center justify-center">
                        <span
                          aria-hidden="true"
                          class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                        />
                        <span
                          aria-hidden="true"
                          class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                        />
                        <span
                          class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
                        >
                          <i
                            class="az az-github text-body-md leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                    </template>
                    <template #actions>
                      <Button
                        label="Continue with GitHub"
                        icon="az az-github"
                        variant="secondary"
                        size="large"
                        class="self-center"
                        :loading="connecting"
                        @click="(event: MouseEvent) => emit('connect', event)"
                      />
                      <Alert
                        v-if="connectError"
                        severity="danger"
                        size="small"
                        :label="connectError"
                        class="w-full"
                      />
                      <Link
                        label="Manage connected providers"
                        href="#"
                        size="large"
                        class="self-center"
                        @click.prevent
                      />
                    </template>
                  </EmptyState>
                </div>

                <div
                  v-else
                  class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full"
                >
                  <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
                    <div class="shrink-0 sm:w-(--container-3xs)">
                      <Select
                        :model-value="activeScope"
                        aria-label="Git account scope"
                        size="large"
                        :display-value="
                          (value) =>
                            accounts.find((account) => account.value === value)?.label ?? ''
                        "
                        class="w-full"
                        @update:model-value="onSelectScope"
                      >
                        <Select.Trigger>
                          <template #leading>
                            <i
                              class="az az-github text-body-md leading-none shrink-0 text-(--text-default)"
                              aria-hidden="true"
                            />
                          </template>
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item
                            v-for="account in accounts"
                            :key="account.value"
                            :value="account.value"
                          >
                            {{ account.label }}
                          </Select.Item>
                          <Select.Item
                            value="__add-account__"
                            icon="az az-circle-plus"
                          >
                            Add GitHub account
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </div>

                    <div class="flex w-full flex-1">
                      <Input
                        v-model="search"
                        size="large"
                        placeholder="Search repositories or paste a repository URL"
                        aria-label="Search repositories or paste a repository URL"
                        class="w-full"
                      >
                        <template #leading>
                          <i class="az az-search" />
                        </template>
                      </Input>
                    </div>
                  </div>

                  <div class="flex lg:min-h-0">
                    <Card
                      :padded="false"
                      class="w-full"
                    >
                      <template #default>
                        <div class="overflow-y-auto overscroll-contain lg:min-h-0">
                          <div
                            v-if="reposFailed"
                            key="repos-failed"
                            class="p-(--spacing-md)"
                          >
                            <Alert
                              severity="danger"
                              :label="error"
                              action-label="Retry"
                              @action="(event: MouseEvent) => emit('retry', event)"
                            />
                          </div>
                          <div
                            v-else-if="reposLoading"
                            key="repos-loading"
                            aria-busy="true"
                          >
                            <p
                              role="status"
                              class="sr-only"
                            >
                              Loading repositories
                            </p>
                            <Item.List aria-hidden="true">
                              <Item
                                v-for="n in skeletonRows"
                                :key="'repo-skeleton-' + n"
                                size="small"
                              >
                                <Item.Media>
                                  <Skeleton
                                    variant="rectangle"
                                    width="1.75rem"
                                    height="1.75rem"
                                  />
                                </Item.Media>
                                <Item.Content>
                                  <div class="flex flex-col gap-(--spacing-xs)">
                                    <Skeleton
                                      width="40%"
                                      height="0.875rem"
                                    />
                                    <Skeleton
                                      width="25%"
                                      height="0.75rem"
                                    />
                                  </div>
                                </Item.Content>
                                <Item.Actions>
                                  <Skeleton
                                    width="4.5rem"
                                    height="1.75rem"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                          </div>
                          <div
                            v-else-if="filteredRepos.length"
                            key="repos-list"
                          >
                            <Item.List :aria-label="`Repositories in ${activeScope}`">
                              <Item
                                v-for="repo in shownRepos"
                                :key="repo.name"
                                size="small"
                              >
                                <Item.Media>
                                  <span
                                    class="flex size-7 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                                  >
                                    <i
                                      :class="repo.icon"
                                      class="text-body-md leading-none text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ repo.name }}</Item.Title>
                                  <Item.Description>
                                    <span
                                      class="flex items-center gap-(--spacing-2xs) text-body-xs"
                                    >
                                      <i
                                        class="az az-history"
                                        aria-hidden="true"
                                      />
                                      {{ repo.age }}
                                    </span>
                                  </Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <Button
                                    label="Import"
                                    variant="secondary"
                                    size="small"
                                    :aria-label="`Import ${repo.name}`"
                                    @click="(event: MouseEvent) => emit('import', event, repo)"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                            <div
                              v-if="hiddenRepoCount > 0"
                              class="flex justify-center border-t border-(--border-muted) p-(--spacing-sm)"
                            >
                              <Button
                                :label="`Load more (${hiddenRepoCount})`"
                                variant="ghost"
                                size="small"
                                @click="showMoreRepos"
                              />
                            </div>
                          </div>
                          <EmptyState
                            v-else
                            size="small"
                            icon="az az-search"
                            title="No repositories match"
                            :description="`Nothing in ${activeScope} is named like “${search}”.`"
                          >
                            <template #actions>
                              <Button
                                label="Clear search"
                                variant="outline"
                                size="small"
                                @click="clearSearch"
                              />
                            </template>
                          </EmptyState>
                        </div>
                      </template>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            <section
              class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
            >
              <div class="flex flex-col gap-(--spacing-sm)">
                <div
                  class="flex min-h-(--size-8) flex-wrap items-center justify-between gap-(--spacing-md)"
                >
                  <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">
                    Start from template
                  </h2>

                  <div class="flex w-full shrink-0 items-center sm:w-(--container-3xs)">
                    <Input
                      v-model="templateSearch"
                      size="medium"
                      placeholder="Search templates"
                      aria-label="Search templates"
                      class="w-full"
                    >
                      <template #leading>
                        <i class="az az-search" />
                      </template>
                    </Input>
                  </div>
                </div>
              </div>

              <div class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                <div class="flex lg:min-h-0 lg:flex-1">
                  <ScrollArea
                    fade
                    aria-label="Start from template results"
                    class="w-full"
                  >
                    <div class="pb-(--spacing-2xs) pe-(--spacing-2xs)">
                      <EmptyState
                        v-if="!filteredSections.length"
                        size="small"
                        icon="az az-search"
                        title="No templates match"
                        :description="`Nothing is named like “${templateSearch}”.`"
                      >
                        <template #actions>
                          <Button
                            label="Clear search"
                            variant="outline"
                            size="small"
                            @click="clearTemplateSearch"
                          />
                        </template>
                      </EmptyState>
                      <div
                        v-else
                        class="flex flex-col gap-(--layout-section-gap)"
                      >
                        <section
                          v-for="section in filteredSections"
                          :key="section.id"
                          class="flex flex-col gap-(--layout-group-gap)"
                        >
                          <h3 class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
                            {{ section.label }}
                          </h3>

                          <div
                            v-if="section.kind === 'list'"
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2"
                          >
                            <IntegrationCard
                              v-for="item in section.items"
                              :key="item.slug"
                              :title="item.title"
                              :logo="`${item.icon} ${item.markClass}`.trim()"
                              :vendor="item.vendor ?? ''"
                              :description="item.description"
                              :href="templateHref(item)"
                            />
                          </div>

                          <div
                            v-else
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                          >
                            <div
                              v-for="item in section.items"
                              :key="item.slug"
                              class="flex group relative min-h-(--size-44)"
                            >
                              <Card
                                :href="templateHref(item)"
                                class="w-full"
                              >
                                <template #default>
                                  <div class="isolate flex flex-1 flex-col">
                                    <span
                                      aria-hidden="true"
                                      :class="TEMPLATE_GLOW_CLASS"
                                    >
                                      <i
                                        :class="[item.icon, item.markClass]"
                                        class="absolute start-(--spacing-xl) top-(--spacing-xl) scale-600 text-body-lg leading-none text-(--primary) opacity-25 blur-sm"
                                      />
                                    </span>
                                    <div
                                      class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-start"
                                    >
                                      <span
                                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                                      >
                                        <i
                                          :class="[
                                            TEMPLATE_ICON_CLASS,
                                            [item.icon, item.markClass]
                                          ]"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                                        <h4 class="text-label-md text-(--text-default)">
                                          {{ item.title }}
                                        </h4>
                                        <p class="text-pretty text-body-sm text-(--text-muted)">
                                          {{ item.description }}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </Card>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
```

## `sample.ts`

```ts
import type {
  CreateHubAccount,
  CreateHubRepository,
  CreateHubTemplateSection
} from './create-hub.vue'

export const sampleAccounts: CreateHubAccount[] = [
  { label: 'jane-doe', value: 'jane-doe' },
  { label: 'acme', value: 'acme' },
  { label: 'acme-labs', value: 'acme-labs' }
]

export const sampleRepositories: CreateHubRepository[] = [
  { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'az-color az-nextjs' },
  { name: 'docs-site', age: '5 hours ago', icon: 'az-color az-astro' },
  { name: 'api-playground', age: 'yesterday', icon: 'az-color az-vue' },
  { name: 'storefront-checkout', age: '3 days ago', icon: 'az-color az-react' },
  { name: 'observability-dashboard', age: '6 days ago', icon: 'az-color az-svelte' },
  { name: 'marketing-landing', age: '2 weeks ago', icon: 'az-color az-nuxt' },
  { name: 'internal-admin', age: 'last month', icon: 'az-color az-angular' },
  { name: 'image-resizer', age: 'last month', icon: 'az az-image' },
  { name: 'status-page', age: '2 months ago', icon: 'az-color az-astro' },
  { name: 'auth-gateway', age: '2 months ago', icon: 'az az-lock' },
  { name: 'blog', age: '3 months ago', icon: 'az-color az-nuxt' },
  { name: 'design-tokens', age: '5 months ago', icon: 'az az-palette' }
]

export const sampleTemplates: CreateHubTemplateSection[] = [
  {
    id: 'recommended',
    label: 'Recommended',
    kind: 'cards',
    items: [
      {
        slug: 'next-boilerplate',
        title: 'Next.js Boilerplate',
        description: 'Deploy a full-stack Next.js application in a few steps.',
        icon: 'az-color az-nextjs',
        markClass: '[[data-theme=dark]_&]:invert'
      },
      {
        slug: 'react-boilerplate',
        title: 'React Boilerplate',
        description: 'Automate your React.js deployment process.',
        icon: 'az-color az-react',
        markClass: ''
      },
      {
        slug: 'vue-boilerplate',
        title: 'Vue.js starter',
        description: 'A lightweight template to rapidly build Vue.js applications.',
        icon: 'az-color az-vue',
        markClass: ''
      },
      {
        slug: 'angular-boilerplate',
        title: 'Angular Boilerplate',
        description: 'Automate your Angular deployment process with this template.',
        icon: 'az-color az-angular',
        markClass: ''
      },
      {
        slug: 'nuxt-ecommerce',
        title: 'Nuxt E-commerce',
        description: 'Launch a Nuxt e-commerce or content app.',
        icon: 'az-color az-nuxt',
        markClass: ''
      },
      {
        slug: 'astro-starter',
        title: 'Astro Starter',
        description: 'Ship a content-driven Astro site that renders.',
        icon: 'az-color az-astro',
        markClass: ''
      },
      {
        slug: 'svelte-boilerplate',
        title: 'Svelte Boilerplate',
        description: 'Accelerate the deployment of Svelte applications.',
        icon: 'az-color az-svelte',
        markClass: ''
      },
      {
        slug: 'preact-starter',
        title: 'Preact Starter',
        description: 'Deploy a Preact app: the React API in a fraction of the bundle.',
        icon: 'az az-preact',
        markClass: ''
      },
      {
        slug: 'qwik-starter',
        title: 'Qwik Starter',
        description: 'Ship a resumable Qwik app that hydrates only what the reader touches.',
        icon: 'az az-qwik',
        markClass: ''
      }
    ]
  },
  {
    id: 'starters',
    label: 'Starter templates',
    kind: 'list',
    items: [
      {
        slug: 'static-site',
        title: 'Static Site',
        description: 'Publish a folder of built files and serve it as-is.',
        vendor: 'Acme',
        icon: 'az az-file',
        markClass: ''
      },
      {
        slug: 'reverse-proxy',
        title: 'Reverse Proxy',
        description: 'Front an origin you already run and pass its traffic on.',
        vendor: 'Acme',
        icon: 'az az-server',
        markClass: ''
      },
      {
        slug: 'api-service',
        title: 'API Service',
        description: 'Run a small HTTP API with routing and JSON responses.',
        vendor: 'Acme',
        icon: 'az az-code',
        markClass: ''
      },
      {
        slug: 'scheduled-job',
        title: 'Scheduled Job',
        description: 'Run a task on a schedule, with its runs and logs kept.',
        vendor: 'Acme',
        icon: 'az az-clock',
        markClass: ''
      },
      {
        slug: 'ai-inference',
        title: 'AI Inference',
        description: 'Serve a model behind an endpoint that streams its answers.',
        vendor: 'Acme',
        icon: 'az az-bolt',
        markClass: ''
      },
      {
        slug: 'image-optimization',
        title: 'Image Optimization',
        description: 'Resize and compress images on request, cached after the first.',
        vendor: 'Acme',
        icon: 'az az-image',
        markClass: ''
      },
      {
        slug: 'storefront',
        title: 'Storefront',
        description: 'A server-rendered commerce storefront with cart and checkout.',
        vendor: 'Acme',
        icon: 'az az-shopping-cart',
        markClass: ''
      },
      {
        slug: 'multi-tenant-app',
        title: 'Multi-tenant App',
        description: 'One codebase that serves each tenant on its own domain.',
        vendor: 'Acme',
        icon: 'az az-users',
        markClass: ''
      },
      {
        slug: 'auth-gateway',
        title: 'Auth Gateway',
        description: 'Check a token before a request reaches the service behind it.',
        vendor: 'Acme',
        icon: 'az az-lock',
        markClass: ''
      },
      {
        slug: 'database-app',
        title: 'Database App',
        description: 'A starter wired to a database, with a table and its queries.',
        vendor: 'Acme',
        icon: 'az az-database',
        markClass: ''
      },
      {
        slug: 'blog',
        title: 'Blog',
        description: 'A content site with posts, tags and a feed.',
        vendor: 'Community',
        icon: 'az az-pencil',
        markClass: ''
      },
      {
        slug: 'landing-page',
        title: 'Landing Page',
        description: 'A single page with a hero, features and a sign-up form.',
        vendor: 'Community',
        icon: 'az az-desktop',
        markClass: ''
      },
      {
        slug: 'docs-site',
        title: 'Documentation Site',
        description: 'Searchable docs with versioned sections.',
        vendor: 'Community',
        icon: 'az az-book',
        markClass: ''
      },
      {
        slug: 'status-page',
        title: 'Status Page',
        description: 'Publish uptime and incidents for the services you run.',
        vendor: 'Community',
        icon: 'az az-chart-line',
        markClass: ''
      }
    ]
  },
  {
    id: 'frameworks',
    label: 'All frameworks',
    kind: 'list',
    items: [
      {
        slug: 'opennextjs-starter',
        title: 'OpenNext Starter',
        description: 'Deploy Next.js through the OpenNext adapter, server routes included.',
        vendor: '',
        icon: 'az-color az-nextjs',
        markClass: '[[data-theme=dark]_&]:invert'
      },
      {
        slug: 'nitro-starter',
        title: 'Nitro Starter',
        description: 'Deploy a Nitro server build, the engine behind Nuxt, on its own.',
        vendor: '',
        icon: 'az az-server',
        markClass: ''
      },
      {
        slug: 'gatsby-starter',
        title: 'Gatsby Starter',
        description: 'Publish a Gatsby site built at deploy time and served worldwide.',
        vendor: '',
        icon: 'az az-gatsby',
        markClass: ''
      },
      {
        slug: 'docusaurus-starter',
        title: 'Docusaurus Starter',
        description: 'Publish a Docusaurus documentation site.',
        vendor: '',
        icon: 'az az-docusaurus',
        markClass: ''
      },
      {
        slug: 'vitepress-starter',
        title: 'VitePress Starter',
        description: 'Publish a VitePress documentation site.',
        vendor: '',
        icon: 'az az-vitepress',
        markClass: ''
      },
      {
        slug: 'vuepress-starter',
        title: 'VuePress Starter',
        description: 'Publish a VuePress documentation site.',
        vendor: '',
        icon: 'az az-vuepress',
        markClass: ''
      },
      {
        slug: 'hugo-starter',
        title: 'Hugo Starter',
        description: 'Deploy a Hugo site with thousands of pages built in seconds.',
        vendor: '',
        icon: 'az az-hugo',
        markClass: ''
      },
      {
        slug: 'jekyll-starter',
        title: 'Jekyll Starter',
        description: 'Publish a Jekyll site straight from its source.',
        vendor: '',
        icon: 'az az-jekyll',
        markClass: ''
      },
      {
        slug: 'hexo-starter',
        title: 'Hexo Starter',
        description: 'Publish a Hexo blog.',
        vendor: '',
        icon: 'az az-hexo',
        markClass: ''
      },
      {
        slug: 'eleventy-starter',
        title: 'Eleventy Starter',
        description: 'Publish an Eleventy site with no framework runtime shipped to the reader.',
        vendor: '',
        icon: 'az az-eleventy',
        markClass: ''
      },
      {
        slug: 'stencil-starter',
        title: 'Stencil Starter',
        description: 'Build framework-agnostic web components with Stencil.',
        vendor: '',
        icon: 'az az-code',
        markClass: ''
      },
      {
        slug: 'html-starter',
        title: 'Static HTML Starter',
        description: 'Serve a folder of HTML, CSS and JavaScript with no build step.',
        vendor: '',
        icon: 'az-color az-html',
        markClass: ''
      },
      {
        slug: 'javascript-starter',
        title: 'JavaScript Starter',
        description: 'Run plain JavaScript with no framework, only a handler.',
        vendor: '',
        icon: 'az-color az-javascript',
        markClass: ''
      },
      {
        slug: 'typescript-starter',
        title: 'TypeScript Starter',
        description: 'Run a TypeScript handler, compiled on build.',
        vendor: '',
        icon: 'az-color az-typescript',
        markClass: ''
      },
      {
        slug: 'rustwasm-starter',
        title: 'Rust WASM Starter',
        description: 'Compile Rust to WebAssembly and run it.',
        vendor: '',
        icon: 'az az-microchip',
        markClass: ''
      },
      {
        slug: 'emscripten-starter',
        title: 'Emscripten Starter',
        description: 'Bring C or C++, compiled to WebAssembly with Emscripten.',
        vendor: '',
        icon: 'az az-microchip',
        markClass: ''
      }
    ]
  }
]
```
