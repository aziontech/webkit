import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import EmptyState from '@aziontech/webkit/empty-state'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import ScrollArea from '@aziontech/webkit/scroll-area'
import Select from '@aziontech/webkit/select'
import Skeleton from '@aziontech/webkit/skeleton'
import Min from '@aziontech/webkit/svg/azion/min'
import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  creationHeader,
  declare,
  HEADER_IMPORTS,
  headerComponents,
  itemComponents,
  pageHeading
} from './_create-markup'

const BREADCRUMB = [{ label: 'Creation Center', current: true }]

const ACCOUNTS = [
  { label: 'gab-az', value: 'gab-az' },
  { label: 'aziontech', value: 'aziontech' },
  { label: 'azion-templates', value: 'azion-templates' }
]

const REPOS = [
  { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next' },
  { name: 'azion-docs-site', age: '5 hours ago', icon: 'ai-cor ai-astro' },
  { name: 'edge-functions-playground', age: 'yesterday', icon: 'ai-cor ai-vue' },
  { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-cor ai-react' },
  { name: 'observability-dashboard', age: '6 days ago', icon: 'ai-cor ai-svelte' },
  { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-cor ai-nuxt' },
  { name: 'internal-admin', age: 'last month', icon: 'ai-cor ai-angular' }
]

const DARK_INVERT = '[[data-theme=dark]_&]:invert'

const SECTIONS = [
  {
    id: 'recommended',
    label: 'Recommended',
    kind: 'cards',
    items: [
      {
        slug: 'next-boilerplate',
        title: 'Next.js Boilerplate',
        description: 'Deploy a full-stack Next.js application to the edge in a few steps.',
        icon: 'ai-cor ai-next',
        markClass: DARK_INVERT
      },
      {
        slug: 'react-boilerplate',
        title: 'React Boilerplate',
        description: 'Automate your React.js deployment process on the edge.',
        icon: 'ai-cor ai-react',
        markClass: ''
      },
      {
        slug: 'vue-boilerplate',
        title: 'Vue.js starter',
        description: 'A lightweight template to rapidly build Vue.js applications on the edge.',
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
        description: 'Launch a Nuxt e-commerce or content app on the edge.',
        icon: 'ai-cor ai-nuxt',
        markClass: ''
      },
      {
        slug: 'astro-starter',
        title: 'Astro Starter',
        description: 'Ship a content-driven Astro site that renders at the edge.',
        icon: 'ai-cor ai-astro',
        markClass: ''
      },
      {
        slug: 'svelte-boilerplate',
        title: 'Svelte Boilerplate',
        description: 'Accelerate the deployment of Svelte applications to run on the edge.',
        icon: 'ai-cor ai-svelte',
        markClass: ''
      },
      {
        slug: 'preact-starter',
        title: 'Preact Starter',
        description: 'Deploy a Preact app — the React API in a fraction of the bundle.',
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
    id: 'azion',
    label: 'Azion Templates',
    kind: 'list',
    items: [
      {
        slug: 'ai-inference-starter',
        title: 'AI Inference Starter Kit',
        description: 'Create an application running AI models at the edge.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'astro-odyssey',
        title: 'Astro Odyssey',
        description: 'A modern business marketing website theme/starter built with Astro.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'azion-proxy',
        title: 'Azion Proxy',
        description:
          'Front an origin you already run. Azion receives the traffic and passes it on.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'azion-static-site',
        title: 'Azion Static Site',
        description: 'Publish a folder of built files and serve it from Azion.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'dynamic-static-optimization',
        title: 'Dynamic and Static File Optimization',
        description: 'Boost your application to deliver your content using Azion as a CDN.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'functions-starter',
        title: 'Functions Starter Kit',
        description: 'Launch a “Hello World” originless application powered by functions.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'nextjs-ai-chatbot',
        title: 'Next.js AI Chatbot',
        description: 'A high-performance, server-rendered Next.js App Router AI Chatbot.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'nextjs-commerce',
        title: 'Next.js Commerce',
        description: 'Ecommerce template built with Next.js and Shopify.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'nextjs-multi-tenant',
        title: 'Next.js Multi-tenant Starter',
        description: 'A minimalistic multi-tenant Next.js starter template.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'sveltekit-commerce',
        title: 'SvelteKit Commerce',
        description: 'Ecommerce template built with SvelteKit and Shopify.',
        vendor: 'Azion',
        icon: '',
        markClass: ''
      },
      {
        slug: 'cosmic-agency-website',
        title: 'Cosmic Agency Website',
        description: "A custom template built using Cosmic's React components, Blocks.",
        vendor: 'Cosmic',
        icon: 'ai-cor ai-react',
        markClass: ''
      },
      {
        slug: 'cosmic-astro-blog',
        title: 'Cosmic Simple Astro Blog',
        description: 'An Astro blog template powered by Cosmic.',
        vendor: 'Cosmic',
        icon: 'ai-cor ai-astro',
        markClass: ''
      },
      {
        slug: 'eleventy-base-blog',
        title: '11ty Base Blog',
        description:
          'Deploy this starter template to build a blog with the Eleventy site generator.',
        vendor: '11ty',
        icon: 'ai ai-eleventy',
        markClass: ''
      },
      {
        slug: 'eleventy-landing-page',
        title: '11ty Landing Page',
        description: 'Create a simple landing page template built with 11ty and Tailwind CSS.',
        vendor: '11ty',
        icon: 'ai ai-eleventy',
        markClass: ''
      }
    ]
  },
  {
    id: 'frameworks',
    label: 'All Frameworks',
    kind: 'list',
    items: [
      {
        slug: 'opennextjs-starter',
        title: 'OpenNext Starter',
        description: 'Deploy Next.js through the OpenNext adapter, server routes included.',
        vendor: '',
        icon: 'ai-cor ai-next',
        markClass: DARK_INVERT
      },
      {
        slug: 'nitro-starter',
        title: 'Nitro Starter',
        description: 'Deploy a Nitro server build — the engine behind Nuxt, on its own.',
        vendor: '',
        icon: 'pi pi-server',
        markClass: ''
      },
      {
        slug: 'gatsby-starter',
        title: 'Gatsby Starter',
        description: 'Publish a Gatsby site built at deploy time and served from the edge.',
        vendor: '',
        icon: 'ai ai-gatsby',
        markClass: ''
      },
      {
        slug: 'docusaurus-starter',
        title: 'Docusaurus Starter',
        description: 'Publish a Docusaurus documentation site on the edge.',
        vendor: '',
        icon: 'ai ai-docusaurus',
        markClass: ''
      },
      {
        slug: 'vitepress-starter',
        title: 'VitePress Starter',
        description: 'Publish a VitePress documentation site on the edge.',
        vendor: '',
        icon: 'ai ai-vitepress',
        markClass: ''
      },
      {
        slug: 'vuepress-starter',
        title: 'VuePress Starter',
        description: 'Publish a VuePress documentation site on the edge.',
        vendor: '',
        icon: 'ai ai-vuepress',
        markClass: ''
      },
      {
        slug: 'hugo-starter',
        title: 'Hugo Starter',
        description: 'Publish a Hugo site — thousands of pages built in seconds.',
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
        description: 'Publish a Hexo blog on the edge.',
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
        description: 'Run plain JavaScript at the edge — no framework, just a handler.',
        vendor: '',
        icon: 'ai-cor ai-js',
        markClass: ''
      },
      {
        slug: 'typescript-starter',
        title: 'TypeScript Starter',
        description: 'Run a TypeScript handler at the edge, compiled on build.',
        vendor: '',
        icon: 'ai-cor ai-ts',
        markClass: ''
      },
      {
        slug: 'rustwasm-starter',
        title: 'Rust WASM Starter',
        description: 'Compile Rust to WebAssembly and run it at the edge.',
        vendor: '',
        icon: 'pi pi-microchip',
        markClass: ''
      },
      {
        slug: 'emscripten-starter',
        title: 'Emscripten Starter',
        description: 'Bring C or C++ to the edge, compiled to WebAssembly with Emscripten.',
        vendor: '',
        icon: 'pi pi-microchip',
        markClass: ''
      }
    ]
  }
]

const SKELETON_ROWS = 6
const HANDSHAKE_MS = 1500
const REPOS_MS = 900

const useCreationCenter =
  ({ connected, loading: busy }) =>
  () => {
    const accounts = ref(connected ? ACCOUNTS : [])
    const connecting = ref(false)
    const scope = ref(connected ? ACCOUNTS[0].value : '')
    const reposLoading = ref(busy)
    const search = ref('')

    const loadRepos = () => {
      reposLoading.value = true
      setTimeout(() => {
        reposLoading.value = false
      }, REPOS_MS)
    }

    const connect = () => {
      connecting.value = true
      setTimeout(() => {
        connecting.value = false
        accounts.value = ACCOUNTS
        scope.value = ACCOUNTS[0].value
        loadRepos()
      }, HANDSHAKE_MS)
    }

    const onSelectScope = (value) => {
      if (!value || value === '__add-account__' || value === scope.value) return
      scope.value = value
      loadRepos()
    }

    const filteredRepos = computed(() => {
      const q = search.value.trim().toLowerCase()
      if (!q) return REPOS
      return REPOS.filter((repo) => repo.name.toLowerCase().includes(q))
    })

    return {
      breadcrumb: BREADCRUMB,
      sections: SECTIONS,
      skeletonRows: SKELETON_ROWS,
      accounts,
      connecting,
      scope,
      reposLoading,
      search,
      filteredRepos,
      connect,
      onSelectScope
    }
  }

const scriptFor = ({ connected, loading }) => [
  ...HEADER_IMPORTS,
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Link from '@aziontech/webkit/link'",
  "import ScrollArea from '@aziontech/webkit/scroll-area'",
  "import Select from '@aziontech/webkit/select'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import Min from '@aziontech/webkit/svg/azion/min'",
  "import { computed, ref } from 'vue'",
  '',
  declare('breadcrumb', BREADCRUMB),
  declare('ACCOUNTS', ACCOUNTS),
  declare('repos', REPOS),
  declare('sections', SECTIONS),
  `const skeletonRows = ${SKELETON_ROWS}`,
  '',
  `const accounts = ref(${connected ? 'ACCOUNTS' : '[]'})`,
  'const connecting = ref(false)',
  `const scope = ref(${connected ? 'ACCOUNTS[0].value' : "''"})`,
  `const reposLoading = ref(${loading})`,
  "const search = ref('')",
  '',
  'const loadRepos = () => {',
  '  reposLoading.value = true',
  '  setTimeout(() => {',
  '    reposLoading.value = false',
  `  }, ${REPOS_MS})`,
  '}',
  '',
  'const connect = () => {',
  '  connecting.value = true',
  '  setTimeout(() => {',
  '    connecting.value = false',
  '    accounts.value = ACCOUNTS',
  '    scope.value = ACCOUNTS[0].value',
  '    loadRepos()',
  `  }, ${HANDSHAKE_MS})`,
  '}',
  '',
  'const onSelectScope = (value) => {',
  "  if (!value || value === '__add-account__' || value === scope.value) return",
  '  scope.value = value',
  '  loadRepos()',
  '}',
  '',
  'const filteredRepos = computed(() => {',
  '  const q = search.value.trim().toLowerCase()',
  '  if (!q) return repos',
  '  return repos.filter((repo) => repo.name.toLowerCase().includes(q))',
  '})'
]

const components = {
  ...headerComponents({ Avatar, Brand, Breadcrumb, GlobalHeader, IconButton }),
  ...itemComponents(Item, ['List', 'Media', 'Content', 'Title', 'Description', 'Actions']),
  Button,
  CardBox,
  EmptyState,
  InputText,
  Link,
  Min,
  ScrollArea,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Skeleton
}

const HEADING = pageHeading({
  size: 'large',
  title: 'Build on the most reliable network on earth',
  description: `Start from a repository or use a framework template. You can also drag and drop your project, or choose a
<button type="button" class="text-link cursor-pointer">file</button>
or a
<button type="button" class="text-link cursor-pointer">folder</button>.`
})

const CONNECT = `<CardBox v-if="!accounts.length" class="lg:min-h-0 lg:flex-1">
  <template #content>
    <EmptyState
      size="medium"
      title="Connect your repository"
      description="Choose a Git provider to connect your repository and start the deployment process."
      class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
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
          <span class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)">
            <i class="ai ai-github text-body-md leading-none text-(--text-default)" aria-hidden="true" />
          </span>
        </span>
      </template>
      <template #actions>
        <Button label="Continue with GitHub" icon="ai ai-github" kind="secondary" size="large" :loading="connecting" @click="connect" />
        <Link label="Manage connected providers" href="#" size="large" @click.prevent />
      </template>
    </EmptyState>
  </template>
</CardBox>`

const REPOSITORIES = `<div v-else class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full">
  <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
    <Select
      :model-value="scope"
      aria-label="Git account scope"
      size="large"
      :display-value="(value) => accounts.find((account) => account.value === value)?.label ?? ''"
      class="shrink-0 sm:w-(--container-3xs)"
      @update:model-value="onSelectScope"
    >
      <Select.Trigger>
        <template #iconLeft>
          <i class="ai ai-github text-body-md leading-none shrink-0 text-(--text-default)" aria-hidden="true" />
        </template>
      </Select.Trigger>
      <Select.Content>
        <Select.Option v-for="account in accounts" :key="account.value" :value="account.value">
          {{ account.label }}
        </Select.Option>
        <Select.Option value="__add-account__" icon="pi pi-plus-circle">
          Add GitHub Account
        </Select.Option>
      </Select.Content>
    </Select>

    <InputText
      v-model="search"
      size="large"
      placeholder="Search project or enter a Git Repository URL"
      aria-label="Search project or enter a Git Repository URL"
      class="w-full flex-1"
    >
      <template #iconLeft>
        <i class="pi pi-search" />
      </template>
    </InputText>
  </div>

  <CardBox :padded="false" class="lg:min-h-0">
    <template #content>
      <div class="overflow-y-auto overscroll-contain lg:min-h-0">
        <Item.List v-if="reposLoading" key="repos-loading" aria-busy="true">
          <Item v-for="n in skeletonRows" :key="'repo-skeleton-' + n" size="small">
            <Item.Media>
              <Skeleton kind="shape" width="1.75rem" height="1.75rem" />
            </Item.Media>
            <Item.Content class="gap-(--spacing-xs)">
              <Skeleton width="40%" height="0.875rem" />
              <Skeleton width="25%" height="0.75rem" />
            </Item.Content>
            <Item.Actions>
              <Skeleton width="4.5rem" height="1.75rem" />
            </Item.Actions>
          </Item>
        </Item.List>
        <Item.List v-else-if="filteredRepos.length" key="repos-list">
          <Item v-for="repo in filteredRepos" :key="repo.name" size="small">
            <Item.Media>
              <span class="flex size-7 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
                <i :class="repo.icon" class="text-body-md leading-none text-(--text-default)" aria-hidden="true" />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ repo.name }}</Item.Title>
              <Item.Description class="flex items-center gap-(--spacing-xxs) text-body-xs">
                <i class="pi pi-history" aria-hidden="true" />
                {{ repo.age }}
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button label="Import" kind="secondary" size="small" />
            </Item.Actions>
          </Item>
        </Item.List>
        <p v-else class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)">
          No repositories match “{{ search }}”.
        </p>
      </div>
    </template>
  </CardBox>
</div>`

const GIT_IMPORTER = `<section class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1">
  <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
    <h2 class="text-heading-xxs text-(--text-default)">Import from GitHub</h2>
  </header>

  <div class="flex flex-col lg:min-h-0 lg:flex-1">
${indent(CONNECT, 2)}

${indent(REPOSITORIES, 2)}
  </div>
</section>`

const TEMPLATE_BROWSER = `<section class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1">
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="flex min-h-(--size-8) flex-wrap items-center justify-between gap-(--spacing-md)">
      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Start from Template</p>

      <div class="flex shrink-0 items-center">
        <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
      </div>
    </div>
  </div>

  <div class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
    <ScrollArea fade aria-label="Start from Template results" class="pb-(--spacing-xxs) pr-(--spacing-xxs) lg:min-h-0 lg:flex-1">
      <div class="flex flex-col gap-(--layout-section-gap)">
        <section v-for="section in sections" :key="section.id" class="flex flex-col gap-(--layout-group-gap)">
          <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
            {{ section.label }}
          </p>

          <div v-if="section.kind === 'list'" class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
            <CardBox
              v-for="item in section.items"
              :key="item.slug"
              class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
              role="button"
              tabindex="0"
            >
              <template #content>
                <div class="flex items-start gap-(--spacing-md)">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
                    <i v-if="item.icon" :class="[item.icon, item.markClass]" class="text-body-lg leading-none text-(--text-default)" aria-hidden="true" />
                    <Min v-else class="h-5 w-auto" aria-label="Azion Marketplace" />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                    <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs)">
                      <h3 class="text-label-md text-(--text-default)">{{ item.title }}</h3>
                      <span v-if="item.vendor" class="text-body-xs text-(--text-muted)">by {{ item.vendor }}</span>
                    </div>
                    <p class="text-pretty text-body-sm text-(--text-muted)">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </template>
            </CardBox>
          </div>

          <div v-else class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
            <CardBox
              v-for="item in section.items"
              :key="item.slug"
              class="group relative min-h-(--size-44) cursor-pointer"
              role="button"
              tabindex="0"
            >
              <template #content>
                <div class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-left">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)">
                    <i
                      :class="[item.icon, item.markClass]"
                      class="text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <h3 class="text-label-md text-(--text-default)">{{ item.title }}</h3>
                    <p class="text-pretty text-body-sm text-(--text-muted)">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </template>
            </CardBox>
          </div>
        </section>
      </div>
    </ScrollArea>
  </div>
</section>`

const TEMPLATE = `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
${indent(creationHeader({ backLabel: 'Back to Home' }), 1)}

  <main class="animate-page-enter motion-reduce:animate-none relative flex min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
    <div class="flex min-h-0 flex-1 flex-col overflow-auto lg:overflow-hidden">
      <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
${indent(HEADING, 4)}

        <div class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)">
${indent(GIT_IMPORTER, 5)}

${indent(TEMPLATE_BROWSER, 5)}
        </div>
      </div>
    </div>
  </main>
</div>`

const meta = {
  title: 'Templates/Platform/Creation/CreationCenter',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Creation Center at `/create`, where a project starts: the creation header with a single current crumb and a back control to Home, a large page heading whose lead also offers to pick a file or a folder, then two columns side by side from the large breakpoint. On the left, Import from GitHub: a dashed EmptyState with Continue with GitHub until an account is connected, then an account Select with an Add GitHub Account option, a search that also takes a repository URL, and a flush list of repositories with an Import button each, shown as skeleton rows while a scope loads. On the right, Start from Template: a Filter button over a faded ScrollArea holding Recommended framework cards in three columns, then the Azion and partner templates and every other framework as two-column cards with the vendor beside the title. Dragging a folder onto the page shows the drop target plotted in ProjectIntake. Built from `GlobalHeader`, `Breadcrumb`, `EmptyState`, `Link`, `Select`, `InputText`, `CardBox`, `Item`, `Skeleton`, `ScrollArea` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: useCreationCenter(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const Default = story(
  { connected: false, loading: false },
  'A first visit: no Git account is connected, so the left column is the Connect your repository empty state. Continue with GitHub connects three accounts after a short handshake and loads the first one.'
)

export const Connected = story(
  { connected: true, loading: false },
  'GitHub connected: gab-az is the selected scope and its seven repositories are listed, most recently pushed first.'
)

export const LoadingRepositories = story(
  { connected: true, loading: true },
  'A scope just picked: six skeleton rows stand in for the repositories while they load.'
)
