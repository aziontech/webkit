import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import EmptyState from '@aziontech/webkit/empty-state'
import InputText from '@aziontech/webkit/input-text'
import Min from '@aziontech/webkit/svg/azion/min'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  mergeScripts,
  pageScroll,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'
import { declare } from './_summary-markup'

const HELP = 'https://www.azion.com/en/documentation/products/marketplace/'

const DARK_INK = '[[data-theme=dark]_&]:invert'

const TEMPLATES = [
  [
    'next',
    'Next.js Boilerplate',
    'Deploy a full-stack Next.js application to the edge in a few steps.',
    'ai-cor ai-next'
  ],
  [
    'react',
    'React Boilerplate',
    'Automate your React.js deployment process on the edge.',
    'ai-cor ai-react'
  ],
  [
    'vue',
    'Vue.js starter',
    'A lightweight template to rapidly build Vue.js applications on the edge.',
    'ai-cor ai-vue'
  ],
  [
    'angular',
    'Angular Boilerplate',
    'Automate your Angular deployment process with this template.',
    'ai-cor ai-angular'
  ],
  [
    'nuxt',
    'Nuxt E-commerce',
    'Launch a Nuxt e-commerce or content app on the edge.',
    'ai-cor ai-nuxt'
  ],
  [
    'astro',
    'Astro Starter',
    'Ship a content-driven Astro site that renders at the edge.',
    'ai-cor ai-astro'
  ],
  [
    'svelte',
    'Svelte Boilerplate',
    'Accelerate the deployment of Svelte applications to run on the edge.',
    'ai-cor ai-svelte'
  ],
  [
    'preact',
    'Preact Starter',
    'Deploy a Preact app — the React API in a fraction of the bundle.',
    'ai ai-preact'
  ],
  [
    'qwik',
    'Qwik Starter',
    'Ship a resumable Qwik app that hydrates only what the reader touches.',
    'ai ai-qwik'
  ],
  [
    'opennextjs',
    'OpenNext Starter',
    'Deploy Next.js through the OpenNext adapter, server routes included.',
    'ai-cor ai-next'
  ],
  [
    'nitro',
    'Nitro Starter',
    'Deploy a Nitro server build — the engine behind Nuxt, on its own.',
    'pi pi-server'
  ],
  [
    'gatsby',
    'Gatsby Starter',
    'Publish a Gatsby site built at deploy time and served from the edge.',
    'ai ai-gatsby'
  ],
  [
    'docusaurus',
    'Docusaurus Starter',
    'Publish a Docusaurus documentation site on the edge.',
    'ai ai-docusaurus'
  ],
  [
    'vitepress',
    'VitePress Starter',
    'Publish a VitePress documentation site on the edge.',
    'ai ai-vitepress'
  ],
  [
    'vuepress',
    'VuePress Starter',
    'Publish a VuePress documentation site on the edge.',
    'ai ai-vuepress'
  ],
  [
    'hugo',
    'Hugo Starter',
    'Publish a Hugo site — thousands of pages built in seconds.',
    'ai ai-hugo'
  ],
  [
    'jekyll',
    'Jekyll Starter',
    'Publish a Jekyll site straight from its source.',
    'ai ai-jekyll'
  ],
  ['hexo', 'Hexo Starter', 'Publish a Hexo blog on the edge.', 'ai ai-hexo'],
  [
    'eleventy',
    'Eleventy Starter',
    'Publish an Eleventy site with no framework runtime shipped to the reader.',
    'ai ai-eleventy'
  ],
  [
    'stencil',
    'Stencil Starter',
    'Build framework-agnostic web components with Stencil.',
    'pi pi-code'
  ],
  [
    'html',
    'Static HTML Starter',
    'Serve a folder of HTML, CSS and JavaScript with no build step.',
    'ai-cor ai-html'
  ],
  [
    'javascript',
    'JavaScript Starter',
    'Run plain JavaScript at the edge — no framework, just a handler.',
    'ai-cor ai-js'
  ],
  [
    'typescript',
    'TypeScript Starter',
    'Run a TypeScript handler at the edge, compiled on build.',
    'ai-cor ai-ts'
  ],
  [
    'rustwasm',
    'Rust WASM Starter',
    'Compile Rust to WebAssembly and run it at the edge.',
    'pi pi-microchip'
  ],
  [
    'emscripten',
    'Emscripten Starter',
    'Bring C or C++ to the edge, compiled to WebAssembly with Emscripten.',
    'pi pi-microchip'
  ]
].map(([id, name, description, icon]) => ({
  id,
  name,
  description,
  icon,
  markClass: icon.split(' ').includes('ai-next') ? DARK_INK : ''
}))

const INTEGRATIONS = [
  [
    'ab-tests',
    'A/B Tests',
    'Validate addresses, interfaces, or entire workflows by splitting traffic at the edge.',
    'Azion',
    'applications',
    'Testing and validation'
  ],
  [
    'hello-world',
    'Hello World',
    'A minimal edge function that displays a “Hello World” message to show how the edge works.',
    'Azion',
    'applications',
    'Testing and validation'
  ],
  [
    'send-to-queue',
    'Send Messages to a Queue',
    'Add messages to a queue for asynchronous processing between the components of your system.',
    'Azion',
    'applications',
    'Testing and validation'
  ],
  [
    'content-targeting',
    'Content Targeting',
    'Manipulate cookies and headers to build flexible content-targeting logic.',
    'Azion',
    'applications',
    'Content segmentation and personalization'
  ],
  [
    'signed-cookies',
    'Signed Cookies',
    'Implement cookies with an extra layer of security through cryptographic signing.',
    'Azion',
    'applications',
    'Content segmentation and personalization'
  ],
  [
    'bot-manager-lite',
    'Azion Bot Manager Lite',
    'Analyze incoming requests and assign a score based on rules and behaviors to block bad bots.',
    'Azion',
    'firewall',
    'Bot management'
  ],
  [
    'radware-bot-manager',
    'Radware Bot Manager',
    'Defend your online assets against sophisticated bot-based attacks.',
    'Radware',
    'firewall',
    'Bot management'
  ],
  [
    'axur-cardstream',
    'Axur Cardstream',
    'Protect your e-commerce from fraud by detecting compromised payment cards in real time.',
    'Axur',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'axur-leakstream',
    'Axur Leakstream',
    'Monitor leaked credentials and protect your users from checker attacks.',
    'Axur',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'send-event-endpoint',
    'Send Event to Endpoint',
    'Stream request data to a user-defined HTTP endpoint via the JavaScript fetch API.',
    'Azion',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'recaptcha',
    'reCAPTCHA',
    'Protect your domains against bots and monitor traffic through the Google reCAPTCHA dashboard.',
    'Google',
    'firewall',
    'Security optimization and access control',
    'ai-cor ai-google'
  ],
  [
    'hcaptcha',
    'hCaptcha',
    'Protect your domains against bots and monitor traffic through the hCaptcha dashboard.',
    'hCaptcha',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'liveness-detection',
    'Liveness Detection',
    'Biometric facial recognition that prevents spoofing with photos or videos, powered by Saffe.',
    'Saffe',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'jwt',
    'JWT',
    'Grant and revoke privileges using KIDs and secrets, and set token expiration dates.',
    'Azion',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'secure-token',
    'Secure Token',
    'Make token-based, time-limited URLs to control access to protected content.',
    'Azion',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'scheduled-blocking',
    'Scheduled Blocking',
    'Control access to your application based on a time schedule, according to your needs.',
    'Azion',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'ip-address-reputation',
    'IP Address Reputation',
    'Score incoming IP addresses using a reputation database provided by IPQualityScore.',
    'IPQualityScore',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'ipqs-phone-validation',
    'IPQualityScore Phone Validation',
    'Validate phone numbers at the edge and detect fraudulent activity in real time.',
    'IPQualityScore',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'ipqs-url-validation',
    'IPQualityScore URL Validation',
    'Scan URLs for malware, phishing, and suspicious domains in real time at the edge.',
    'IPQualityScore',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'upstash-rate-limiting',
    'Upstash Rate Limiting',
    'Control incoming traffic right at the edge to protect your applications from abuse.',
    'Upstash',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'add-request-id',
    'Add Request ID',
    'Add an HTTP header that assigns a unique identifier to each incoming request.',
    'Azion',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'method-route-validator',
    'Method and Route Validator',
    'Control access to your application based on the request method and path.',
    'Azion',
    'firewall',
    'Security optimization and access control'
  ],
  [
    'limit-payload-size',
    'Limit Payload Size',
    'Evaluate request data and deny payloads that exceed a predefined limit.',
    'Azion',
    'firewall',
    'Workloads and payloads'
  ],
  [
    'massive-redirect',
    'Massive Redirect',
    'Handle a massive quantity of domain redirects, such as during domain migrations.',
    'Azion',
    'firewall',
    'Workloads and payloads'
  ],
  [
    'process-request-data-headers',
    'Process Request Data Into Headers',
    'Inspect request body fields and stop a request whenever a required field is empty.',
    'Azion',
    'firewall',
    'Workloads and payloads'
  ],
  [
    'request-variation-controller',
    'Request Variation Controller',
    'Track argument variations across requests and block access once a limit is exceeded.',
    'Azion',
    'firewall',
    'Workloads and payloads'
  ],
  [
    'upstash-waiting-room',
    'Upstash Waiting Room',
    'Manage traffic surges and prevent overload on your sites with a virtual waiting room.',
    'Upstash',
    'firewall',
    'Workloads and payloads'
  ]
].map(([id, name, description, vendor, context, group, icon = '']) => ({
  id,
  name,
  description,
  vendor,
  context,
  group,
  icon
}))

const CONTEXT_LABELS = { applications: 'Application', firewall: 'Firewall' }

const FEATURED = ['ab-tests', 'bot-manager-lite', 'recaptcha']

const matching = (items, query, fields) => {
  const term = query.trim().toLowerCase()
  if (!term) return items
  return items.filter((item) =>
    fields
      .map((field) => item[field])
      .join(' ')
      .toLowerCase()
      .includes(term)
  )
}

const SEARCH_ICON = `<template #iconLeft>
  <i class="pi pi-search" aria-hidden="true" />
</template>`

const PAGE_HEADING = `<header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 class="text-balance text-heading-sm text-(--text-default)">Marketplace</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">
      Find, test, and deploy software that runs anywhere.
    </p>
  </div>
  <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full">
    <Button
      label="Documentation"
      icon="pi pi-book"
      kind="outlined"
      size="medium"
      href="${HELP}"
      target="_blank"
      class="w-full md:w-auto"
    />
  </div>
</header>`

const TEMPLATE_CARD = `<CardBox
  v-for="template in filteredTemplates"
  :key="template.id"
  class="group relative cursor-pointer"
  role="button"
  tabindex="0"
>
  <template #content>
    <div class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-left">
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
      >
        <i
          :class="[template.icon, template.markClass]"
          class="text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <h3 class="text-label-md text-(--text-default)">{{ template.name }}</h3>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          {{ template.description }}
        </p>
      </div>
    </div>
  </template>
</CardBox>`

const MARK = `<span
  class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
>
  <i
    v-if="item.icon"
    :class="item.icon"
    class="text-body-lg leading-none text-(--text-default)"
    aria-hidden="true"
  />
  <Min v-else class="h-5 w-auto" aria-label="Azion Marketplace" />
</span>`

const FEATURED_CARD = `<CardBox
  v-for="item in featuredIntegrations"
  :key="item.id"
  class="group relative cursor-pointer bg-(--bg-surface-raised) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) motion-reduce:transition-none"
  role="button"
  tabindex="0"
>
  <template #content>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-10 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-20 motion-reduce:transition-none"
      style="background: radial-gradient(120% 90% at 50% 0%, var(--primary), transparent 62%)"
    />

    <Tag
      class="absolute right-(--spacing-md) top-(--spacing-md) z-10"
      severity="primary"
      size="small"
      :label="contextLabels[item.context]"
    />

    <div
      class="relative z-1 flex flex-col items-center gap-(--spacing-md) px-(--spacing-sm) py-(--spacing-lg) text-center"
    >
${indent(MARK, 3)}
      <div class="flex flex-col items-center gap-(--spacing-xxs)">
        <h3 class="text-heading-xs text-(--text-default)">{{ item.name }}</h3>
        <span class="text-body-xs text-(--text-muted)">by {{ item.vendor }}</span>
      </div>
      <p class="text-pretty text-body-sm text-(--text-muted)">
        {{ item.description }}
      </p>
    </div>
  </template>
</CardBox>`

const INTEGRATION_CARD = `<CardBox
  v-for="item in filteredIntegrations"
  :key="item.id"
  class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
  role="button"
  tabindex="0"
>
  <template #content>
    <div class="flex items-start gap-(--spacing-md)">
${indent(MARK, 3)}
      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
        <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs)">
          <h3 class="text-label-md text-(--text-default)">{{ item.name }}</h3>
          <span class="text-body-xs text-(--text-muted)">by {{ item.vendor }}</span>
        </div>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          {{ item.description }}
        </p>
      </div>
      <Tag class="shrink-0" severity="info" size="small" :label="contextLabels[item.context]" />
    </div>
  </template>
</CardBox>`

const TEMPLATES_PANEL = `<TabView.Panel value="templates">
  <div class="flex flex-col gap-(--spacing-lg)">
    <InputText
      v-model="templateQuery"
      size="medium"
      placeholder="Search templates…"
      aria-label="Search templates"
      class="w-full"
    >
${indent(SEARCH_ICON, 3)}
    </InputText>

    <EmptyState
      v-if="!filteredTemplates.length"
      bordered
      title="No templates found"
      description="No templates match your search. Try a different term."
    />

    <div
      v-else
      class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
    >
${indent(TEMPLATE_CARD, 3)}
    </div>
  </div>
</TabView.Panel>`

const INTEGRATIONS_PANEL = `<TabView.Panel value="integrations">
  <div class="flex flex-col">
    <section class="flex flex-col gap-(--layout-group-gap)">
      <p class="text-heading-xxs text-(--text-default)">Featured</p>
      <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
${indent(FEATURED_CARD, 4)}
      </div>
    </section>

    <div class="layout-section-start flex flex-col gap-(--spacing-sm) md:flex-row md:items-center">
      <div class="flex shrink-0 items-center">
        <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
      </div>
      <InputText
        v-model="integrationQuery"
        size="medium"
        placeholder="Search integrations…"
        aria-label="Search integrations"
        class="w-full md:flex-1"
      >
${indent(SEARCH_ICON, 4)}
      </InputText>
    </div>

    <EmptyState
      v-if="!filteredIntegrations.length"
      class="layout-group-start"
      bordered
      title="No integrations found"
      description="No integrations match your search or filters. Try clearing a filter."
    />

    <div
      v-else
      class="layout-group-start grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
    >
${indent(INTEGRATION_CARD, 3)}
    </div>
  </div>
</TabView.Panel>`

const MAIN = `<main class="layout-column flex flex-col">
${indent(PAGE_HEADING)}

  <TabView v-model:value="activeTab" class="layout-section-start">
    <TabView.List class="justify-center mb-(--spacing-lg)">
      <TabView.Item value="templates" label="Templates" />
      <TabView.Item value="integrations" label="Integrations" />
    </TabView.List>

    <TabView.Content>
${indent(TEMPLATES_PANEL, 3)}

${indent(INTEGRATIONS_PANEL, 3)}
    </TabView.Content>
  </TabView>
</main>`

const TEMPLATE = shell({
  withBreadcrumb: false,
  main: pageScroll(MAIN, 'overflow-auto layout-boundary')
})

const PAGE_SCRIPT = [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Min from '@aziontech/webkit/svg/azion/min'",
  "import TabView from '@aziontech/webkit/tab-view'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed, ref } from 'vue'",
  '',
  declare('templates', TEMPLATES),
  '',
  declare('integrations', INTEGRATIONS),
  '',
  declare('contextLabels', CONTEXT_LABELS),
  '',
  `const featuredIds = ${JSON.stringify(FEATURED).replaceAll('"', "'").replaceAll(',', ', ')}`,
  'const featuredIntegrations = integrations.filter((item) => featuredIds.includes(item.id))',
  '',
  "const templateQuery = ref('')",
  "const integrationQuery = ref('')",
  '',
  'const filteredTemplates = computed(() => {',
  '  const term = templateQuery.value.trim().toLowerCase()',
  '  if (!term) return templates',
  '  return templates.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(term))',
  '})',
  '',
  'const filteredIntegrations = computed(() => {',
  '  const term = integrationQuery.value.trim().toLowerCase()',
  '  if (!term) return integrations',
  '  return integrations.filter((item) =>',
  '    `${item.name} ${item.vendor} ${item.description}`.toLowerCase().includes(term)',
  '  )',
  '})'
]

const components = {
  ...SHELL_COMPONENTS,
  Button,
  CardBox,
  EmptyState,
  InputText,
  Min,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  'TabView.Content': TabView.Content,
  'TabView.Panel': TabView.Panel,
  Tag
}

const pageState = (tab) => {
  const templateQuery = ref('')
  const integrationQuery = ref('')
  return {
    ...shellState('marketplace'),
    activeTab: ref(tab),
    contextLabels: CONTEXT_LABELS,
    featuredIntegrations: INTEGRATIONS.filter((item) => FEATURED.includes(item.id)),
    templateQuery,
    integrationQuery,
    filteredTemplates: computed(() =>
      matching(TEMPLATES, templateQuery.value, ['name', 'description'])
    ),
    filteredIntegrations: computed(() =>
      matching(INTEGRATIONS, integrationQuery.value, ['name', 'vendor', 'description'])
    )
  }
}

const story = (tab, description) => ({
  render: () => ({
    components,
    setup: () => pageState(tab),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: {
        code: toSfc(
          mergeScripts(
            scriptLines({
              parts: ['TabView'],
              active: 'marketplace',
              declarations: [],
              state: [`const activeTab = ref('${tab}')`]
            }),
            PAGE_SCRIPT
          ),
          TEMPLATE
        )
      }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Lists/Marketplace',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Marketplace page as the console draws it at /marketplace: the platform shell with no breadcrumb, a medium page heading with the Documentation action, and a centred Templates and Integrations TabView. Templates is a search field over a grid of framework cards; Integrations opens on three featured cards, then the Filter button and the search field over the full grid of integration cards with their publisher and context Tag, each tab falling back to a bordered EmptyState when the search matches nothing. Picking a template here only announces it; the deploy form lives on the DeployTemplate template. Built from the platform shell, `TabView`, `InputText`, `CardBox`, `Tag`, `EmptyState`, `Button` and the Azion mark.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Templates = story(
  'templates',
  'The Templates tab: the search field over the 25 framework starters, two columns on phones up to five on wide screens, each card greyed until hovered.'
)

export const Integrations = story(
  'integrations',
  'The Integrations tab: A/B Tests, Azion Bot Manager Lite and reCAPTCHA as featured cards, then the Filter button and the search over all 27 integrations with their publisher and Application or Firewall context.'
)
