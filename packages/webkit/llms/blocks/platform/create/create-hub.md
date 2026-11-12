# CreateHub (`platform/create/create-hub`)

> The Creation Center, where a project starts: the creation header with a single current crumb and a back control to Home, a large page heading whose lead also offers to pick a file or a folder, then two columns side by side from the large breakpoint. On the left, Import from GitHub: a dashed EmptyState with Continue with GitHub until an account is connected, then an account Select with an Add GitHub account option, a search that also takes a repository URL, and a flush list of repositories with an Import button each, shown as skeleton rows while a scope loads. On the right, Start from template: a Filter button over a faded ScrollArea holding Recommended framework cards in three columns, then the starter templates, one per kind of resource, and every other framework as two-column cards with the vendor beside the title. Dragging a folder onto the page shows the drop target plotted in ProjectIntake. Built from `PageHeader`, `GlobalHeader`, `Breadcrumb`, `EmptyState`, `Link`, `Select`, `Input`, `Card`, `Item`, `Skeleton`, `ScrollArea` and `Button`.

- Surface: product
- Source: `blocks/platform/create/create-hub/create-hub.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/create-hub")`
- Components: [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [EmptyState](../../../components/empty-state.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Link](../../../components/link.md), [PageHeader](../../../components/page-header.md), [ScrollArea](../../../components/scroll-area.md), [Select](../../../components/select.md), [Skeleton](../../../components/skeleton.md)
- Skills: `webkit-create-surface`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

create hub; creation center; new project; start a project; import from github; import repository; start from template; template gallery; create from git; central de criação; novo projeto; importar repositório; começar de um template

The Creation Center, where a new project starts. The user arrives from Home or a Create action with something to deploy and needs to pick its source in one look: a repository from their Git account, a template, or a file or folder from their machine. The page puts the two main sources side by side, Import from GitHub and Start from template, under one heading, and accepts a dropped folder anywhere.

## When to use

- The entry point of every new project, before the user has decided where the code comes from.
- The user may import an existing repository, start from a framework or starter template, or upload local files.
- The choice leads to a focused flow outside the console shell, such as `platform/create/deploy-template`.

## When not to use

- Creating a first-level resource that has no source code: use `platform/create/single-page-create`.
- A guided multi-step creation once the source is known: use `platform/create/source-wizard`.
- Adding something inside an existing resource: use `platform/create/create-in-drawer`.
- The drop target and upload progress after a folder is dropped: those are `platform/states/project-intake`.
- Teaching a module to a new account: use `platform/states/first-use`.

## Building blocks

### A. Creation header — `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar` (required)

The creation header from `headers/creation-header`: a small outlined back `IconButton` to Home, the `Brand` linking home, a `Breadcrumb` with Creation Center as the single current crumb, and the account `Avatar` alone on the right. No sidebar.

### B. Page heading — `PageHeader` (required)

`PageHeader` at `size="large"`. The description says what the page offers in one sentence and ends with inline file and folder `Button`s at `kind="link"` that open the system picker, the keyboard path to the drag and drop it mentions. They are link-coloured and underline only on hover, like the rest of the console's text actions.

### C. Git connect — `Card`, `EmptyState`, `Button`, `Link` (required until connected)

Under the Import from GitHub heading, a `Card` with a medium `EmptyState` on a dashed surface: the provider glyph, a title, one sentence, Continue with GitHub as a secondary large `Button` and Manage connected providers as a large `Link`, both centred at their natural width (`class="self-center"`), so on a phone the button does not stretch across the column. It shows only while no account is connected.

### D. Repository search — `Select`, `Input` (required once connected)

A large `Select` of the connected scopes with the scope avatar in the trigger and Add GitHub account as the last option, beside a large search `Input` that filters by name and also accepts a repository URL. Picking a scope reloads the list.

### E. Repository list — `Card`, `Item`, `Button`, `Skeleton` (required once connected)

A flush `Card` with an `Item` list, one small row per repository: glyph, name, its last push as the description and a small secondary Import `Button`. While a scope loads, six `Skeleton` rows in the shape of the `Item` stand in and the list carries `aria-busy`. Repositories are ordered most recently pushed first.

### F. Template gallery — `Button`, `ScrollArea`, `Card` (required)

Under the Start from template heading, an outlined medium Filter `Button`, then a faded `ScrollArea` with an `aria-label`. Inside, sections in fixed order: Recommended framework cards in three columns from the large breakpoint, the starter templates one per kind of resource, then every other framework in two columns with the vendor beside the title. Each template is a whole `Card` acting as a button with its glyph, title and one sentence.

## Do

- Keep both sources visible at once from the large breakpoint, the Git column first.
- Show the connect state only until an account exists, then go straight to the list.
- Let the search accept a pasted repository URL, so the user does not have to find it in the list.
- Keep template sections in the same order on every visit; Recommended first.
- Offer file and folder buttons in the heading so uploading works without a mouse.

## Don't

- Don't put the hub inside the console shell or open it in a drawer; it is a focused page.
- Don't replace the list with a spinner while a scope loads; use skeleton rows in its shape.
- Don't add a Continue or Next button; each Import and each template card starts its flow.
- Don't let the template gallery push the page into a long scroll on large screens; it scrolls inside its own area.
- Don't show templates as a dense table; the glyph and sentence are what the user scans.
- Don't hand-write the file and folder links or underline them at rest; use `Button kind="link"`.

## Copy

- **Heading:** a verb phrase for the task, e.g. "Start a new project"; description one sentence with a period, e.g. "Start from a repository or use a framework template."
- **Column titles:** short fragments, e.g. "Import from GitHub".
- **Connect state:** title states the task, e.g. "Connect your repository"; description one sentence, e.g. "Select a Git provider to connect your repository and start the deployment process."
- **Buttons:** verb first, three words or fewer, e.g. "Continue with GitHub", "Import", "Filter".
- **Search:** placeholder and `aria-label` name what it takes, e.g. "Search projects or enter a Git repository URL".
- **Template cards:** title is the template name; description one sentence, e.g. "Compile Rust to WebAssembly and run it."
- Follow `skills/webkit-microcopy`: sentence case, select rather than choose or pick, no em dash.

## Accessibility

- The `PageHeader` title is the page's only `h1`; column titles are `h2`, template titles `h3`.
- The back `IconButton`, the brand link, the account button, the scope `Select` and the search each have an `aria-label`.
- Template cards are focusable with `role="button"` and `tabindex="0"`, and respond to Enter and Space.
- The loading list sets `aria-busy="true"`; skeleton rows are hidden from assistive technology.
- Drag and drop always has a keyboard alternative: the file and folder buttons in the description.
- The `ScrollArea` is named so screen reader users know which region scrolls.

## States

- Default: no Git account connected; the connect state beside the template gallery.
- Connected: jane-doe is the selected scope and its seven repositories are listed, most recently pushed first.
- LoadingRepositories: a scope was just picked; six skeleton rows stand in for the repositories.

## Related

- `platform/create/deploy-template` — where a template card or Import leads.
- `platform/states/project-intake` — the drop target and upload overlay for a dropped folder.
- `platform/create/source-wizard` — the guided flow once a source is chosen.
- `headers/creation-header` — the header this page uses.
- `platform/dashboard/home-dashboard` — Home, where the back control returns.

## Variants

- `Default` — primary (the code below)
- `Connected` — GitHub connected: jane-doe is the selected scope and its seven repositories are listed, most recently pushed first.
- `LoadingRepositories` — A scope just picked: six skeleton rows stand in for the repositories while they load.

Each variant is the same screen in another state: `get_pattern("platform/create/create-hub", { variant })`, or the file under `blocks/platform/create/create-hub/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, ref } from 'vue'

  const breadcrumb = [{ label: 'Creation Center', current: true }]
  const ACCOUNTS = [
    { label: 'jane-doe', value: 'jane-doe' },
    { label: 'acme', value: 'acme' },
    { label: 'acme-labs', value: 'acme-labs' }
  ]
  const repos = [
    { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next' },
    { name: 'docs-site', age: '5 hours ago', icon: 'ai-cor ai-astro' },
    { name: 'api-playground', age: 'yesterday', icon: 'ai-cor ai-vue' },
    { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-cor ai-react' },
    { name: 'observability-dashboard', age: '6 days ago', icon: 'ai-cor ai-svelte' },
    { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-cor ai-nuxt' },
    { name: 'internal-admin', age: 'last month', icon: 'ai-cor ai-angular' }
  ]
  const sections = [
    {
      id: 'recommended',
      label: 'Recommended',
      kind: 'cards',
      items: [
        {
          slug: 'next-boilerplate',
          title: 'Next.js Boilerplate',
          description: 'Deploy a full-stack Next.js application in a few steps.',
          icon: 'ai-cor ai-next',
          markClass: '[[data-theme=dark]_&]:invert'
        },
        {
          slug: 'react-boilerplate',
          title: 'React Boilerplate',
          description: 'Automate your React.js deployment process.',
          icon: 'ai-cor ai-react',
          markClass: ''
        },
        {
          slug: 'vue-boilerplate',
          title: 'Vue.js starter',
          description: 'A lightweight template to rapidly build Vue.js applications.',
          icon: 'ai-cor ai-vue',
          markClass: ''
        },
        {
          slug: 'angular-boilerplate',
          title: 'Angular Boilerplate',
          description: 'Automate your Angular deployment process with this template.',
          icon: 'ai-cor ai-angular',
          markClass: ''
        },
        {
          slug: 'nuxt-ecommerce',
          title: 'Nuxt E-commerce',
          description: 'Launch a Nuxt e-commerce or content app.',
          icon: 'ai-cor ai-nuxt',
          markClass: ''
        },
        {
          slug: 'astro-starter',
          title: 'Astro Starter',
          description: 'Ship a content-driven Astro site that renders.',
          icon: 'ai-cor ai-astro',
          markClass: ''
        },
        {
          slug: 'svelte-boilerplate',
          title: 'Svelte Boilerplate',
          description: 'Accelerate the deployment of Svelte applications.',
          icon: 'ai-cor ai-svelte',
          markClass: ''
        },
        {
          slug: 'preact-starter',
          title: 'Preact Starter',
          description: 'Deploy a Preact app: the React API in a fraction of the bundle.',
          icon: 'ai ai-preact',
          markClass: ''
        },
        {
          slug: 'qwik-starter',
          title: 'Qwik Starter',
          description: 'Ship a resumable Qwik app that hydrates only what the reader touches.',
          icon: 'ai ai-qwik',
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
          icon: 'pi pi-file',
          markClass: ''
        },
        {
          slug: 'reverse-proxy',
          title: 'Reverse Proxy',
          description: 'Front an origin you already run and pass its traffic on.',
          vendor: 'Acme',
          icon: 'pi pi-server',
          markClass: ''
        },
        {
          slug: 'api-service',
          title: 'API Service',
          description: 'Run a small HTTP API with routing and JSON responses.',
          vendor: 'Acme',
          icon: 'pi pi-code',
          markClass: ''
        },
        {
          slug: 'scheduled-job',
          title: 'Scheduled Job',
          description: 'Run a task on a schedule, with its runs and logs kept.',
          vendor: 'Acme',
          icon: 'pi pi-clock',
          markClass: ''
        },
        {
          slug: 'ai-inference',
          title: 'AI Inference',
          description: 'Serve a model behind an endpoint that streams its answers.',
          vendor: 'Acme',
          icon: 'pi pi-bolt',
          markClass: ''
        },
        {
          slug: 'image-optimization',
          title: 'Image Optimization',
          description: 'Resize and compress images on request, cached after the first.',
          vendor: 'Acme',
          icon: 'pi pi-image',
          markClass: ''
        },
        {
          slug: 'storefront',
          title: 'Storefront',
          description: 'A server-rendered commerce storefront with cart and checkout.',
          vendor: 'Acme',
          icon: 'pi pi-shopping-cart',
          markClass: ''
        },
        {
          slug: 'multi-tenant-app',
          title: 'Multi-tenant App',
          description: 'One codebase that serves each tenant on its own domain.',
          vendor: 'Acme',
          icon: 'pi pi-users',
          markClass: ''
        },
        {
          slug: 'auth-gateway',
          title: 'Auth Gateway',
          description: 'Check a token before a request reaches the service behind it.',
          vendor: 'Acme',
          icon: 'pi pi-lock',
          markClass: ''
        },
        {
          slug: 'database-app',
          title: 'Database App',
          description: 'A starter wired to a database, with a table and its queries.',
          vendor: 'Acme',
          icon: 'pi pi-database',
          markClass: ''
        },
        {
          slug: 'blog',
          title: 'Blog',
          description: 'A content site with posts, tags and a feed.',
          vendor: 'Community',
          icon: 'pi pi-pencil',
          markClass: ''
        },
        {
          slug: 'landing-page',
          title: 'Landing Page',
          description: 'A single page with a hero, features and a sign-up form.',
          vendor: 'Community',
          icon: 'pi pi-desktop',
          markClass: ''
        },
        {
          slug: 'docs-site',
          title: 'Documentation Site',
          description: 'Searchable docs with versioned sections.',
          vendor: 'Community',
          icon: 'pi pi-book',
          markClass: ''
        },
        {
          slug: 'status-page',
          title: 'Status Page',
          description: 'Publish uptime and incidents for the services you run.',
          vendor: 'Community',
          icon: 'pi pi-chart-line',
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
          icon: 'ai-cor ai-next',
          markClass: '[[data-theme=dark]_&]:invert'
        },
        {
          slug: 'nitro-starter',
          title: 'Nitro Starter',
          description: 'Deploy a Nitro server build, the engine behind Nuxt, on its own.',
          vendor: '',
          icon: 'pi pi-server',
          markClass: ''
        },
        {
          slug: 'gatsby-starter',
          title: 'Gatsby Starter',
          description: 'Publish a Gatsby site built at deploy time and served worldwide.',
          vendor: '',
          icon: 'ai ai-gatsby',
          markClass: ''
        },
        {
          slug: 'docusaurus-starter',
          title: 'Docusaurus Starter',
          description: 'Publish a Docusaurus documentation site.',
          vendor: '',
          icon: 'ai ai-docusaurus',
          markClass: ''
        },
        {
          slug: 'vitepress-starter',
          title: 'VitePress Starter',
          description: 'Publish a VitePress documentation site.',
          vendor: '',
          icon: 'ai ai-vitepress',
          markClass: ''
        },
        {
          slug: 'vuepress-starter',
          title: 'VuePress Starter',
          description: 'Publish a VuePress documentation site.',
          vendor: '',
          icon: 'ai ai-vuepress',
          markClass: ''
        },
        {
          slug: 'hugo-starter',
          title: 'Hugo Starter',
          description: 'Deploy a Hugo site with thousands of pages built in seconds.',
          vendor: '',
          icon: 'ai ai-hugo',
          markClass: ''
        },
        {
          slug: 'jekyll-starter',
          title: 'Jekyll Starter',
          description: 'Publish a Jekyll site straight from its source.',
          vendor: '',
          icon: 'ai ai-jekyll',
          markClass: ''
        },
        {
          slug: 'hexo-starter',
          title: 'Hexo Starter',
          description: 'Publish a Hexo blog.',
          vendor: '',
          icon: 'ai ai-hexo',
          markClass: ''
        },
        {
          slug: 'eleventy-starter',
          title: 'Eleventy Starter',
          description: 'Publish an Eleventy site with no framework runtime shipped to the reader.',
          vendor: '',
          icon: 'ai ai-eleventy',
          markClass: ''
        },
        {
          slug: 'stencil-starter',
          title: 'Stencil Starter',
          description: 'Build framework-agnostic web components with Stencil.',
          vendor: '',
          icon: 'pi pi-code',
          markClass: ''
        },
        {
          slug: 'html-starter',
          title: 'Static HTML Starter',
          description: 'Serve a folder of HTML, CSS and JavaScript with no build step.',
          vendor: '',
          icon: 'ai-cor ai-html',
          markClass: ''
        },
        {
          slug: 'javascript-starter',
          title: 'JavaScript Starter',
          description: 'Run plain JavaScript with no framework, only a handler.',
          vendor: '',
          icon: 'ai-cor ai-js',
          markClass: ''
        },
        {
          slug: 'typescript-starter',
          title: 'TypeScript Starter',
          description: 'Run a TypeScript handler, compiled on build.',
          vendor: '',
          icon: 'ai-cor ai-ts',
          markClass: ''
        },
        {
          slug: 'rustwasm-starter',
          title: 'Rust WASM Starter',
          description: 'Compile Rust to WebAssembly and run it.',
          vendor: '',
          icon: 'pi pi-microchip',
          markClass: ''
        },
        {
          slug: 'emscripten-starter',
          title: 'Emscripten Starter',
          description: 'Bring C or C++, compiled to WebAssembly with Emscripten.',
          vendor: '',
          icon: 'pi pi-microchip',
          markClass: ''
        }
      ]
    }
  ]
  const skeletonRows = 6

  const accounts = ref([])
  const connecting = ref(false)
  const scope = ref('')
  const reposLoading = ref(false)
  const search = ref('')

  const loadRepos = () => {
    reposLoading.value = true
    setTimeout(() => {
      reposLoading.value = false
    }, 900)
  }

  const connect = () => {
    connecting.value = true
    setTimeout(() => {
      connecting.value = false
      accounts.value = ACCOUNTS
      scope.value = ACCOUNTS[0].value
      loadRepos()
    }, 1500)
  }

  const onSelectScope = (value) => {
    if (!value || value === '__add-account__' || value === scope.value) return
    scope.value = value
    loadRepos()
  }

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos
    return repos.filter((repo) => repo.name.toLowerCase().includes(q))
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Home"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

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
              Start from a repository or use a framework template. You can also drag and drop your
              project, or select a
              <Button
                kind="link"
                label="file"
              />
              or a
              <Button
                kind="link"
                label="folder"
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
                <h2 class="text-heading-xxs text-(--text-default)">Import from GitHub</h2>
              </header>

              <div class="flex flex-col lg:min-h-0 lg:flex-1">
                <div
                  v-if="!accounts.length"
                  class="flex lg:min-h-0 lg:flex-1"
                >
                  <Card class="w-full">
                    <template #content>
                      <div
                        class="flex rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
                      >
                        <EmptyState
                          size="medium"
                          title="Connect your repository"
                          description="Select a Git provider to connect your repository and start the deployment process."
                          class="w-full"
                        >
                          <template #icon>
                            <span class="relative flex size-10 items-center justify-center">
                              <span
                                aria-hidden="true"
                                class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                              />
                              <span
                                aria-hidden="true"
                                class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                              />
                              <span
                                class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                              >
                                <i
                                  class="ai ai-github text-body-md leading-none text-(--text-default)"
                                  aria-hidden="true"
                                />
                              </span>
                            </span>
                          </template>
                          <template #actions>
                            <Button
                              label="Continue with GitHub"
                              icon="ai ai-github"
                              kind="secondary"
                              size="large"
                              class="self-center"
                              :loading="connecting"
                              @click="connect"
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
                    </template>
                  </Card>
                </div>

                <div
                  v-else
                  class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full"
                >
                  <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
                    <div class="shrink-0 sm:w-(--container-3xs)">
                      <Select
                        :model-value="scope"
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
                          <template #iconLeft>
                            <i
                              class="ai ai-github text-body-md leading-none shrink-0 text-(--text-default)"
                              aria-hidden="true"
                            />
                          </template>
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Option
                            v-for="account in accounts"
                            :key="account.value"
                            :value="account.value"
                          >
                            {{ account.label }}
                          </Select.Option>
                          <Select.Option
                            value="__add-account__"
                            icon="pi pi-plus-circle"
                          >
                            Add GitHub account
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </div>

                    <div class="flex w-full flex-1">
                      <Input
                        v-model="search"
                        size="large"
                        placeholder="Search projects or enter a Git repository URL"
                        aria-label="Search projects or enter a Git repository URL"
                        class="w-full"
                      >
                        <template #iconLeft>
                          <i class="pi pi-search" />
                        </template>
                      </Input>
                    </div>
                  </div>

                  <div class="flex lg:min-h-0">
                    <Card
                      :padded="false"
                      class="w-full"
                    >
                      <template #content>
                        <div class="overflow-y-auto overscroll-contain lg:min-h-0">
                          <Item.List
                            v-if="reposLoading"
                            key="repos-loading"
                            aria-busy="true"
                          >
                            <Item
                              v-for="n in skeletonRows"
                              :key="'repo-skeleton-' + n"
                              size="small"
                            >
                              <Item.Media>
                                <Skeleton
                                  kind="shape"
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
                          <Item.List
                            v-else-if="filteredRepos.length"
                            key="repos-list"
                          >
                            <Item
                              v-for="repo in filteredRepos"
                              :key="repo.name"
                              size="small"
                            >
                              <Item.Media>
                                <span
                                  class="flex size-7 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
                                  <span class="flex items-center gap-(--spacing-xxs) text-body-xs">
                                    <i
                                      class="pi pi-history"
                                      aria-hidden="true"
                                    />
                                    {{ repo.age }}
                                  </span>
                                </Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  label="Import"
                                  kind="secondary"
                                  size="small"
                                />
                              </Item.Actions>
                            </Item>
                          </Item.List>
                          <p
                            v-else
                            class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                          >
                            No repositories match “{{ search }}”.
                          </p>
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
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                    Start from template
                  </p>

                  <div class="flex shrink-0 items-center">
                    <Button
                      label="Filter"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-filter"
                    />
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
                    <div class="pb-(--spacing-xxs) pe-(--spacing-xxs)">
                      <div class="flex flex-col gap-(--layout-section-gap)">
                        <section
                          v-for="section in sections"
                          :key="section.id"
                          class="flex flex-col gap-(--layout-group-gap)"
                        >
                          <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
                            {{ section.label }}
                          </p>

                          <div
                            v-if="section.kind === 'list'"
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2"
                          >
                            <div
                              v-for="item in section.items"
                              :key="item.slug"
                              class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                            >
                              <Card
                                role="button"
                                tabindex="0"
                              >
                                <template #content>
                                  <div class="flex items-start gap-(--spacing-md)">
                                    <span
                                      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                    >
                                      <i
                                        :class="[item.icon, item.markClass]"
                                        class="text-body-lg leading-none text-(--text-default)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                                      <div
                                        class="flex flex-wrap items-baseline gap-x-(--spacing-xs)"
                                      >
                                        <h3 class="text-label-md text-(--text-default)">
                                          {{ item.title }}
                                        </h3>
                                        <span
                                          v-if="item.vendor"
                                          class="text-body-xs text-(--text-muted)"
                                          >by {{ item.vendor }}</span
                                        >
                                      </div>
                                      <p class="text-pretty text-body-sm text-(--text-muted)">
                                        {{ item.description }}
                                      </p>
                                    </div>
                                  </div>
                                </template>
                              </Card>
                            </div>
                          </div>

                          <div
                            v-else
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                          >
                            <div
                              v-for="item in section.items"
                              :key="item.slug"
                              class="flex group relative min-h-(--size-44) cursor-pointer"
                            >
                              <Card
                                class="w-full"
                                role="button"
                                tabindex="0"
                              >
                                <template #content>
                                  <div
                                    class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-start"
                                  >
                                    <span
                                      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                    >
                                      <i
                                        :class="[item.icon, item.markClass]"
                                        class="text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
                                        aria-hidden="true"
                                      />
                                    </span>
                                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                      <h3 class="text-label-md text-(--text-default)">
                                        {{ item.title }}
                                      </h3>
                                      <p class="text-pretty text-body-sm text-(--text-muted)">
                                        {{ item.description }}
                                      </p>
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
