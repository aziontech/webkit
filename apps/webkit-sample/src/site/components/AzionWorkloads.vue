<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Currency from '@aziontech/webkit/currency'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import Overline from '@aziontech/webkit/overline'
  import Quote from '@aziontech/webkit/quote'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { useRouter } from 'vue-router'

  import { ON_DEMAND_LINK, PLANS } from '../data/pricing.js'
  import { NavColumn, NavItem } from '../ui/index.js'
  import WorkloadTopologyScene from '../ui/WorkloadTopologyScene.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const DOCS = '/site/docs'

  const BENEFITS = [
    {
      title: 'Pay for what you serve',
      description:
        'You are billed for the requests a workload answers and the compute it runs, not for the hours a hostname sits waiting for traffic.'
    },
    {
      title: 'Close to your users, by default',
      description:
        'One create puts the workload in every Azion location. There is no region to pick, no replica to add, and no traffic manager to keep in step.'
    },
    {
      title: 'No cold starts',
      description:
        'Azion Runtime starts an isolate per request, so there is nothing to pre-warm and no first-request penalty to design around.'
    },
    {
      title: 'Scale without pre-provisioning',
      description:
        'Concurrency is not capacity you buy in advance. A launch day scales the same way an ordinary Tuesday does.'
    },
    {
      title: 'Run it locally first',
      description:
        'The Azion CLI runs your application against the same runtime on your machine, so what you test is what the workload serves.'
    },
    {
      title: 'JavaScript, TypeScript or WebAssembly',
      description:
        'Ship the language you already write, or start from a framework preset and let the build produce the bundle the workload runs.'
    }
  ]

  const USE_CASES = [
    {
      title: 'Serve a web application',
      description:
        'Point a domain at an application and let every location answer it. Static assets, server-rendered pages and API routes all come from the same workload.'
    },
    {
      title: 'Front an origin you already have',
      description:
        'Keep the infrastructure you run today. The workload terminates TLS, applies the rules, caches what it can, and forwards only what it has to.'
    },
    {
      title: 'Split traffic across environments',
      description:
        'Give staging its own hostname on the same application, or point a second workload at a new deployment and move traffic to it when you are ready.'
    },
    {
      title: 'Protect what you expose',
      description:
        'Bind a firewall to the workload and every request that reaches the hostname passes WAF, rate limiting and network lists before anything else runs.'
    }
  ]

  const AZION_CONFIG = `export default {
  build: { preset: 'vue' },
  rules: {
    request: [
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|svg|png|webp|woff2)$',
        behavior: {
          setOrigin: { name: 'origin-storage-default' },
          deliver: true
        }
      },
      {
        name: 'Redirect to index.html',
        match: '^\\/',
        behavior: { rewrite: '/index.html' }
      }
    ]
  }
}`

  const HANDLER = `export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/status') {
      return Response.json({ region: 'edge', ok: true })
    }

    return fetch(request)
  }
}`

  const STORAGE = `export default {
  async fetch(request) {
    const url = new URL(request.url)
    const asset = await fetch(new URL(url.pathname, 'file://assets-prod/'))

    return new Response(asset.body, {
      headers: { 'cache-control': 'public, max-age=86400' }
    })
  }
}`

  const CODE_TABS = [
    {
      label: 'azion.config.js',
      value: 'config',
      language: 'javascript',
      code: AZION_CONFIG,
      fileName: 'azion.config.js',
      fileIcon: 'pi pi-code'
    },
    {
      label: 'main.js',
      value: 'handler',
      language: 'javascript',
      code: HANDLER,
      fileName: 'main.js',
      fileIcon: 'pi pi-code'
    },
    {
      label: 'assets.js',
      value: 'storage',
      language: 'javascript',
      code: STORAGE,
      fileName: 'assets.js',
      fileIcon: 'pi pi-code'
    }
  ]

  const RECIPES = [
    {
      title: 'Declare the workload in code',
      description:
        'The hostname, the build preset and the routing live in the repository, so shipping a change is a commit rather than a console session.'
    },
    {
      title: 'Answer the request yourself',
      description:
        'Return a response from the handler when a route needs logic — an auth check, a redirect, a shaped payload — instead of sending it to the origin.'
    },
    {
      title: 'Serve objects from storage',
      description:
        'Bind a bucket to the workload and let it answer with the object directly, with no server in front of it and no egress charge behind it.'
    }
  ]

  const DEPLOY_TABS = [
    {
      label: 'npm',
      value: 'npm',
      language: 'bash',
      code: `npm install -D azion
npx azion deploy`,
      fileName: 'terminal',
      fileIcon: 'pi pi-code'
    },
    {
      label: 'pnpm',
      value: 'pnpm',
      language: 'bash',
      code: `pnpm add -D azion
pnpm azion deploy`,
      fileName: 'terminal',
      fileIcon: 'pi pi-code'
    },
    {
      label: 'yarn',
      value: 'yarn',
      language: 'bash',
      code: `yarn add -D azion
yarn azion deploy`,
      fileName: 'terminal',
      fileIcon: 'pi pi-code'
    }
  ]

  const QUOTED_CLIENT = { name: 'HeroSpark', artwork: 'light' }

  const PRICING = PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    ...plan.price.monthly
  }))

  const PRODUCT_GROUPS = [
    {
      label: 'Compute',
      items: [
        {
          icon: 'ai ai-edge-application',
          title: 'Applications',
          description: 'The code and rules a workload serves'
        },
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run serverless code closer to users',
          href: '/site/products/functions'
        },
        {
          icon: 'ai ai-edge-orchestrator',
          title: 'Rules Engine',
          description: 'Automate request handling with programmable rules'
        },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Distribute traffic for performance and availability'
        }
      ]
    },
    {
      label: 'Deliver',
      items: [
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Speed up content delivery',
          href: '/site/products/cache'
        },
        {
          icon: 'ai ai-edge-application',
          title: 'Application Accelerator',
          description: 'Optimize dynamic applications',
          href: '/site/products/application-accelerator'
        },
        {
          icon: 'ai ai-edge-dns',
          title: 'Edge DNS',
          description: 'Distributed authoritative DNS'
        },
        {
          icon: 'ai ai-layers',
          title: 'Image Processor',
          description: 'Optimize and transform images in real time'
        }
      ]
    },
    {
      label: 'Store',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Store and serve objects at the edge'
        },
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'A distributed SQL database'
        },
        {
          icon: 'ai ai-edge-kv',
          title: 'KV Store',
          description: 'Low-latency key-value store'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        {
          icon: 'ai ai-edge-firewall',
          title: 'Edge Firewall',
          description: 'Filter every request before it reaches your code'
        },
        {
          icon: 'ai ai-waf-rules',
          title: 'WAF',
          description: 'Web application firewall'
        },
        {
          icon: 'ai ai-network-lists',
          title: 'Network Shield',
          description: 'Network and DDoS protection'
        },
        {
          icon: 'ai ai-real-time-metrics',
          title: 'Real-Time Metrics',
          description: 'Watch traffic, errors and latency as they happen'
        }
      ]
    }
  ]
</script>

<template>
  <Hero
    kind="screen"
    align="center"
    max-width="site"
    class="[--banner-offset:3.5rem] [--banner-top-height:46%]"
  >
    <template #background>
      <TextureMaterial
        kind="dots"
        size="small"
        fade="bottom"
      />
    </template>

    <template #top>
      <WorkloadTopologyScene />
    </template>

    <Hero.Title
      centered
      eyebrow="Workloads"
      title="Put your application on the edge in seconds"
      description="A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion location — no servers to size, no regions to pick."
    >
      <template #actions>
        <Button
          label="Start free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Docs"
          kind="outlined"
          size="large"
          :href="DOCS"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <div
            v-for="benefit in BENEFITS"
            :key="benefit.title"
            class="flex flex-col gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <h2 class="m-0 text-balance text-heading-xs text-(--text-default)">
              {{ benefit.title }}
            </h2>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ benefit.description }}
            </p>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <MediaSplit
          :media-href="DOCS"
          eyebrow="Architecture"
          title="Serverless from the ground up: isolates, not containers"
          description="A workload does not reserve a container per deployment. Azion Runtime runs your code in an isolate — a sandbox measured in kilobytes rather than gigabytes — so one location holds thousands of them and starts another the moment a request arrives."
        >
          <template #media>
            <Illustration
              name="runtime"
              aria-label="One request reaching a workload, which starts an isolate per request"
            />
          </template>

          <template #actions>
            <Button
              label="Read the architecture"
              kind="secondary"
              size="small"
              :href="DOCS"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-3">
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-xl)">
            <Overline>Workloads</Overline>
            <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
              You can use workloads to:
            </h2>
            <p class="m-0 text-pretty text-body-md text-(--text-muted)">
              See how teams put an application in front of real traffic.
            </p>
            <div>
              <Button
                label="See more"
                kind="text"
                size="large"
                :href="DOCS"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </div>
          </div>

          <CardGrid
            kind="divider"
            :columns="2"
            class="lg:col-span-2"
          >
            <div
              v-for="useCase in USE_CASES"
              :key="useCase.title"
              class="flex flex-col gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
            >
              <h3 class="m-0 text-balance text-heading-xs text-(--text-default)">
                {{ useCase.title }}
              </h3>
              <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                {{ useCase.description }}
              </p>
            </div>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="horizontal"
          title="From a hostname to a full stack, on one platform"
          description="Go past hello world: storage, a database, a firewall and a cache policy all bind to the same workload — each one a binding, not another deployment to operate."
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-2">
          <div class="relative min-w-0 overflow-hidden p-(--spacing-xl)">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 opacity-65 [--texture-pool-a:20%_106%] [--texture-pool-b:80%_102%] mask-[linear-gradient(to_top,black_0,black_16%,transparent_80%)]"
            >
              <TextureMaterial kind="pixelate" />
            </div>

            <div class="relative z-10 min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="CODE_TABS"
                default-value="config"
                show-line-numbers
                animate-lines
                copy-aria-label="Copy the workload sample"
              />
            </div>
          </div>

          <ul
            class="m-0 flex list-none flex-col gap-(--spacing-xl) border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
          >
            <li
              v-for="recipe in RECIPES"
              :key="recipe.title"
              class="flex flex-col gap-(--spacing-sm)"
            >
              <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                {{ recipe.title }}
              </h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                {{ recipe.description }}
              </p>
            </li>
          </ul>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <MediaSplit
          title="Deploy with confidence, even on Fridays"
          description="Go from localhost to every location with one command. The CLI builds the application, creates the workload the first time, and updates it after that."
        >
          <template #media>
            <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="DEPLOY_TABS"
                default-value="npm"
                copy-aria-label="Copy the deploy command"
              />
            </div>
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          class="flex flex-col gap-(--spacing-xs) p-(--spacing-xl) lg:flex-row lg:items-baseline lg:gap-(--spacing-xl)"
        >
          <h2 class="m-0 shrink-0 text-balance text-heading-xs text-(--text-default)">
            …or by clicking merge
          </h2>
          <p class="m-0 text-pretty text-body-md text-(--text-muted)">
            Connect the repository once and a merge to your production branch builds the application
            and promotes it to the workload, with the deployment recorded either way.
          </p>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <MediaSplit
          :media-href="DOCS"
          title="Go fast, or slow"
          description="Promote a deployment to every location at once, or move a share of traffic to it and watch the metrics first. If errors rise, roll back to the deployment that was serving before — from the same screen that shipped it."
        >
          <template #media>
            <Illustration
              name="preview"
              aria-label="Traffic split between the deployment that is live and the one being rolled out"
            />
          </template>

          <template #actions>
            <Button
              label="Deployment strategies"
              kind="secondary"
              size="small"
              :href="DOCS"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <Quote
          kind="signed"
          text='"Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development."'
          name="Mateus Leonardi"
          job-title="CTO at HeroSpark"
          class="p-(--spacing-xl) lg:max-w-(--container-5xl)"
        >
          <template #mark>
            <ClientMark
              :client="QUOTED_CLIENT"
              mark="h-8 w-auto max-w-40 object-contain"
            />
          </template>
          <template #actions>
            <Button
              label="View success story"
              kind="outlined"
              size="large"
              href="https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </Quote>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="horizontal"
          title="Workloads pricing"
          description="Every plan includes workloads. You are billed for what the platform serves, and the on-demand rates apply past the included limits."
        >
          <template #actions>
            <Button
              :label="ON_DEMAND_LINK.label"
              kind="outlined"
              size="large"
              :href="ON_DEMAND_LINK.href"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </SectionTitle>
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <div
            v-for="plan in PRICING"
            :key="plan.id"
            class="flex flex-col gap-(--spacing-sm) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <Overline>{{ plan.name }}</Overline>
            <Currency
              :value="plan.value"
              :prefix="plan.prefix"
              :suffix="plan.suffix"
              size="medium"
            />
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ plan.details }}
            </p>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Complete, not complex"
          title="Powerful primitives, seamlessly integrated"
          description="A workload is the way in. Everything it binds to runs on the same platform, under the same account, billed on the same invoice."
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="4"
        >
          <NavColumn
            v-for="group in PRODUCT_GROUPS"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="product in group.items"
              :key="product.title"
              :icon="product.icon"
              :title="product.title"
              :description="product.description"
              :href="product.href || '#'"
            />
          </NavColumn>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            href="#"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
