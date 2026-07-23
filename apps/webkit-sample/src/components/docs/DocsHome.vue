<script setup>
  // Docs landing content — an Azion take on the Cloudflare Developer Docs home:
  // a hero with a "get started" CTA and a copyable agent prompt, a tabbed
  // "powerful primitives" panel (Compute / AI / Storage / Security) each showing
  // a one-command deploy snippet and related links, a featured-templates grid,
  // and a developer-tools grid. Composed from @aziontech/webkit + theme tokens.
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CodeBlock from '@aziontech/webkit/code-block'
  import TabView from '@aziontech/webkit/tab-view'
  import { ref } from 'vue'

  import ContrastBanner from '../ui/ContrastBanner.vue'

  const activePrimitive = ref('build')

  // The agent prompt the docs "copy prompt" banner copies — the docs-flavored
  // counterpart to the console Home banner, pointing an AI coding tool at the
  // developer docs.
  const agentPrompt =
    'Help me build on Azion. Read the Azion developer docs at ' +
    'https://www.azion.com/en/documentation/, install the Azion CLI, and scaffold ' +
    'an edge application with an azion.config.js and its build + deploy commands.'

  // Each primitive tab maps to an Azion product pillar (Build / Store / Secure /
  // Observe): the pillar glyph, a one-command deploy story, and the set of
  // product pages it links to. The `code` is a runnable CLI snippet.
  const primitives = [
    {
      value: 'build',
      label: 'Build',
      icon: 'ai ai-build-pillar',
      title: 'Deploy with one command',
      description:
        'Build and run applications on Azion’s global network. Serverless functions, application acceleration, cache, and AI inference — no servers to manage, no cold starts, no region complexity.',
      command: 'npm create azion@latest my-app',
      cta: 'Build an application',
      links: ['AI Inference', 'Application Accelerator', 'Cache', 'Functions', 'Image Processor']
    },
    {
      value: 'store',
      label: 'Store',
      icon: 'ai ai-store',
      title: 'State that scales with you',
      description:
        'Distributed SQL, S3-compatible object storage, and low-latency key-value — all available from your edge functions with millisecond reads worldwide.',
      command: 'azion sql create my-db',
      cta: 'Create a database',
      links: ['Object Storage', 'SQL Database', 'KV Store']
    },
    {
      value: 'secure',
      label: 'Secure',
      icon: 'ai ai-secure-pillar',
      title: 'Protection on every request',
      description:
        'WAF, DDoS protection, bot management, and firewall rules applied at the edge before traffic reaches your origin. Configurable per application, observable in real time.',
      command: 'azion firewall enable --waf managed',
      cta: 'Secure an application',
      links: ['Web Application Firewall', 'Network Shield', 'Bot Manager', 'DDoS Protection', 'Edge DNS']
    },
    {
      value: 'observe',
      label: 'Observe',
      icon: 'ai ai-observe-pillar',
      title: 'Real-time visibility into everything',
      description:
        'Stream events as they happen, query real-time metrics, and monitor the real-user experience across the whole network — all from a single, distributed platform.',
      command: 'azion logs tail --source edge-functions',
      cta: 'Observe your platform',
      links: ['Data Stream', 'Edge Pulse', 'Real-Time Events', 'Real-Time Metrics']
    }
  ]

  // Build the CodeBlock tab payload for one primitive (single bash tab).
  const codeTabs = (primitive) => [
    {
      label: primitive.label,
      value: primitive.value,
      language: 'bash',
      fileName: 'terminal',
      fileIcon: 'pi pi-desktop',
      code: primitive.command
    }
  ]

  // Popular templates from the Azion docs home (colored brand glyphs, grayscale
  // until hover; Gatsby ships only a monochrome mark).
  const templates = [
    { icon: 'ai-cor ai-astro', name: 'Astro Boilerplate', tag: 'Static' },
    { icon: 'ai ai-gatsby', name: 'Gatsby Blog Starter Kit', tag: 'Static' },
    { icon: 'ai-cor ai-react', name: 'React Boilerplate', tag: 'SPA' },
    { icon: 'ai-cor ai-next', name: 'Next.js Static Boilerplate', tag: 'Static' },
    { icon: 'ai-cor ai-vue', name: 'Vue.js Boilerplate', tag: 'SPA' },
    { icon: 'ai-cor ai-angular', name: 'Angular Boilerplate', tag: 'SPA' }
  ]

  // Developer tools from the Azion docs home, with their own descriptions.
  const tools = [
    {
      icon: 'pi pi-desktop',
      name: 'Azion Console',
      description:
        'Azion’s configuration interface where you can access all the available products and their settings.'
    },
    {
      icon: 'ai ai-azion-api',
      name: 'Azion API',
      description:
        'A RESTful API based on HTTPS requests that lets you fully interact with Azion products through API requests.'
    },
    {
      icon: 'ai ai-azion-cli',
      name: 'Azion CLI',
      description:
        'Our open source command-line interface to interact with the Azion Web Platform via terminal.'
    },
    {
      icon: 'ai ai-edge-libraries',
      name: 'Azion Lib',
      description:
        'JavaScript/TypeScript tools designed to work inside the Azion Runtime for enhanced performance.'
    },
    {
      icon: 'ai-cor ai-vue',
      name: 'Webkit',
      description:
        'Front-end kit for building your own Azion Console interfaces using Vue/Vite, Tailwind, and PrimeVue.'
    },
    {
      icon: 'ai ai-graphql',
      name: 'GraphQL API',
      description:
        'A powerful API language that allows precise data retrieval, avoiding overfetching and enhancing performance.'
    }
  ]

  // ── Platform Overview content (the Azion "Platform Overview" doc page) ──

  // "What the platform includes" — the "Use Azion to:" list.
  const platformIncludes = [
    {
      icon: 'ai ai-build-pillar',
      text: 'Run applications and serverless code across a distributed global network'
    },
    {
      icon: 'ai ai-secure-pillar',
      text: 'Protect apps and APIs with WAF, DDoS mitigation, and bot protection'
    },
    {
      icon: 'ai ai-store',
      text: 'Store and access data with distributed storage and database options'
    },
    {
      icon: 'ai ai-observe-pillar',
      text: 'Monitor everything with real-time metrics and events'
    },
    {
      icon: 'ai ai-edge-ai',
      text: 'Build AI-powered experiences using Azion’s AI capabilities on the same platform'
    }
  ]

  // "Platform characteristics" bullets under Core Concepts.
  const platformCharacteristics = [
    'One workflow for build, security, deployment, and observability',
    'Self-service with automation-first operations (NoOps)',
    'Open standards and API-first management',
    'Continuous monitoring with actionable telemetry',
    'Performance controls for traffic, caching, and routing',
    'Global coverage with smart traffic steering'
  ]

  // "How Azion Web Platform handles a request" — the numbered flow.
  const requestSteps = [
    {
      title: 'Route to the nearest location',
      body: 'A user request reaches a service running on Azion Web Platform. Azion selects the best route and forwards it to the nearest location based on latency, network conditions, and load.'
    },
    {
      title: 'Apply your configuration and logic',
      body: 'At that location, Azion applies your security policies, caching behavior, application code, and other rules to generate a response — fetching from your origin only when needed.'
    },
    {
      title: 'Deliver the response',
      body: 'The response is delivered to the user from the best available location.'
    }
  ]

  // Common use cases (from the "What you can build" section).
  const useCases = [
    'Build and deploy applications on Azion’s global infrastructure',
    'Speed up delivery with templates and integrations',
    'Adopt zero trust architectures for apps and content',
    'Configure caching rules and advanced optimizations',
    'Monitor performance with real-time metrics',
    'Develop with supported frameworks and languages',
    'Migrate your architecture and content',
    'Meet regulatory needs with Azion compliance'
  ]

  // FAQ from the Platform Overview page.
  const faqs = [
    {
      value: 'what',
      question: 'What is Azion Web Platform?',
      answer:
        'Azion Web Platform is a fully managed developer platform to build, secure, deploy, and observe modern applications on a distributed global infrastructure.'
    },
    {
      value: 'cdn',
      question: 'Is Azion a CDN?',
      answer:
        'Azion includes content delivery and caching capabilities, but it is broader than a CDN: it also provides application execution (including serverless), security, storage, and real-time observability.'
    },
    {
      value: 'security',
      question: 'What security features does Azion provide?',
      answer:
        'Azion provides protections for applications and APIs, including WAF, DDoS mitigation, and bot protection, plus policy-driven controls you can automate via API and IaC.'
    },
    {
      value: 'automate',
      question: 'How do I automate Azion?',
      answer: 'You can automate Azion using Azion API, Azion CLI, and the Azion Terraform Provider.'
    },
    {
      value: 'where',
      question: 'Where does Azion run?',
      answer:
        'Azion runs across multiple locations worldwide through a distributed global network to improve performance and reliability for end users.'
    }
  ]
</script>

<template>
  <div class="mx-auto w-full max-w-[var(--container-6xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]">
    <!-- ── Hero ───────────────────────────────────────────────────────── -->
    <section class="flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-md)]">
      <h1 class="text-balance text-heading-2xl text-[var(--text-default)]">Welcome to Azion Docs</h1>
      <p class="text-pretty text-body-lg text-[var(--text-muted)]">
        We make every application fast and reliable. Deploy your projects instantly on the most
        reliable global network, leverage enterprise-grade security, and scale from zero to peak
        without cold starts.
      </p>
      <div class="mt-[var(--spacing-sm)] flex flex-col items-stretch gap-[var(--spacing-sm)] sm:flex-row sm:items-center">
        <Button
          label="Get started"
          kind="primary"
          size="large"
          href="#get-started"
        />
        <!-- Copy-prompt affordance, built on the same contrast-pill banner as the
             console Home page: one button that copies a ready-to-paste agent
             prompt pointing at the docs. -->
        <ContrastBanner
          label="Copy Prompt"
          :show-logo="false"
          :prompt="agentPrompt"
        />
      </div>
    </section>

    <!-- ── What the platform includes ─────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <div class="flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-sm)]">
        <p class="text-overline-sm text-[var(--text-muted)]">Platform Overview</p>
        <h2 class="text-balance text-heading-lg text-[var(--text-default)]">
          A fully managed platform to build, secure, deploy, and observe
        </h2>
        <p class="text-pretty text-body-md text-[var(--text-muted)]">
          Azion Web Platform unifies serverless, security, content delivery and acceleration,
          storage, and real-time observability so teams can ship applications worldwide with
          consistent performance.
        </p>
      </div>

      <ul class="mt-[var(--spacing-lg)] grid gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="item in platformIncludes"
          :key="item.text"
          class="flex items-start gap-[var(--spacing-sm)] rounded-[var(--shape-card)] border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-md)]"
        >
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
          >
            <i
              :class="[item.icon, 'text-body-lg text-[var(--text-default)]']"
              aria-hidden="true"
            />
          </span>
          <span class="text-pretty text-body-sm text-[var(--text-default)]">{{ item.text }}</span>
        </li>
      </ul>
    </section>

    <!-- ── Core concepts ──────────────────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <h2 class="text-heading-lg text-[var(--text-default)]">Core concepts</h2>

      <div class="mt-[var(--spacing-lg)] grid gap-[var(--spacing-md)] lg:grid-cols-2">
        <CardBox class="h-full">
          <template #content>
            <div class="flex flex-col gap-[var(--spacing-sm)]">
              <h3 class="text-heading-sm text-[var(--text-default)]">Distributed computing</h3>
              <p class="text-pretty text-body-sm text-[var(--text-muted)]">
                Azion runs workloads across multiple locations worldwide to reduce latency and
                improve reliability. This places compute and data closer to where they’re needed —
                near your users on a global network of points of presence.
              </p>
            </div>
          </template>
        </CardBox>

        <CardBox class="h-full">
          <template #content>
            <div class="flex flex-col gap-[var(--spacing-sm)]">
              <h3 class="text-heading-sm text-[var(--text-default)]">Platform characteristics</h3>
              <ul class="flex flex-col gap-[var(--spacing-xs)]">
                <li
                  v-for="characteristic in platformCharacteristics"
                  :key="characteristic"
                  class="flex items-start gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]"
                >
                  <i
                    class="pi pi-check mt-0.5 text-body-xs text-[var(--success)]"
                    aria-hidden="true"
                  />
                  {{ characteristic }}
                </li>
              </ul>
            </div>
          </template>
        </CardBox>
      </div>
    </section>

    <!-- ── How Azion handles a request ────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <div class="flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-xxs)]">
        <h2 class="text-heading-lg text-[var(--text-default)]">How Azion handles a request</h2>
        <p class="text-body-md text-[var(--text-muted)]">
          Azion Web Platform routes each request through its global network to serve users from the
          best available location.
        </p>
      </div>

      <ol class="mt-[var(--spacing-lg)] grid gap-[var(--spacing-md)] lg:grid-cols-3">
        <li
          v-for="(step, index) in requestSteps"
          :key="step.title"
          class="relative flex flex-col gap-[var(--spacing-sm)] rounded-[var(--shape-card)] border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-lg)]"
        >
          <span
            class="flex size-8 items-center justify-center rounded-full bg-[var(--bg-contrast)] text-label-md tabular-nums text-[var(--text-contrast)]"
          >
            {{ index + 1 }}
          </span>
          <h3 class="text-label-lg text-[var(--text-default)]">{{ step.title }}</h3>
          <p class="text-pretty text-body-sm text-[var(--text-muted)]">{{ step.body }}</p>
        </li>
      </ol>
    </section>

    <!-- ── Powerful primitives ────────────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <h2 class="text-balance text-heading-lg text-[var(--text-default)]">
        Powerful primitives, seamlessly integrated
      </h2>

      <div class="mt-[var(--spacing-lg)]">
        <TabView v-model:value="activePrimitive">
          <TabView.List>
            <TabView.Item
              v-for="primitive in primitives"
              :key="primitive.value"
              :value="primitive.value"
              :label="primitive.label"
            />
          </TabView.List>

          <TabView.Content>
            <TabView.Panel
              v-for="primitive in primitives"
              :key="primitive.value"
              :value="primitive.value"
            >
              <div
                class="rounded-[var(--shape-card)] border border-[var(--border-muted)] mt-[var(--spacing-md)] bg-[var(--bg-surface)] p-[var(--spacing-lg)]"
              >
                <div class="flex flex-col gap-[var(--spacing-md)]">
                  <div class="flex items-center gap-[var(--spacing-sm)]">
                    <span
                      class="flex size-9 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                    >
                      <i
                        :class="[primitive.icon, 'text-heading-sm text-[var(--text-default)]']"
                        aria-hidden="true"
                      />
                    </span>
                    <h3 class="text-heading-sm text-[var(--text-default)]">{{ primitive.title }}</h3>
                  </div>

                  <p class="max-w-[var(--container-2xl)] text-pretty text-body-md text-[var(--text-muted)]">
                    {{ primitive.description }}
                  </p>

                  <CodeBlock
                    :tabs="codeTabs(primitive)"
                    :default-value="primitive.value"
                    :show-line-numbers="false"
                    copy-aria-label="Copy command"
                  />

                  <div class="flex flex-wrap items-center gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-sm)] pt-[var(--spacing-xs)]">
                    <Button
                      :label="primitive.cta"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-chevron-right"
                      href="#get-started"
                    />
                    <a
                      v-for="link in primitive.links"
                      :key="link"
                      href="#"
                      class="text-label-md text-link  transition-colors duration-fast-02 ease-productive-entrance  motion-reduce:transition-none"
                    >
                      {{ link }}
                    </a>
                  </div>
                </div>
              </div>
            </TabView.Panel>
          </TabView.Content>
        </TabView>
      </div>
    </section>

    <!-- ── Common use cases ───────────────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <h2 class="text-heading-lg text-[var(--text-default)]">What you can build</h2>
      <ul class="mt-[var(--spacing-lg)] grid gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-sm)] sm:grid-cols-2">
        <li
          v-for="useCase in useCases"
          :key="useCase"
          class="flex items-start gap-[var(--spacing-sm)] border-t border-[var(--border-muted)] py-[var(--spacing-sm)] text-body-md text-[var(--text-default)]"
        >
          <i
            class="pi pi-arrow-right mt-1 text-body-xs text-[var(--text-muted)]"
            aria-hidden="true"
          />
          {{ useCase }}
        </li>
      </ul>
    </section>

    <!-- ── Featured templates ─────────────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <div class="flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-sm)]">
        <h2 class="text-balance text-heading-lg text-[var(--text-default)]">
          Start Here: Kick Off Your Project with Ready-to-Use Templates
        </h2>
        <p class="text-pretty text-body-md text-[var(--text-muted)]">
          The fastest way to start using the Azion Web Platform. Deploy instantly from dozens of
          templates, including e-commerce, blogs, APIs, full-stack SSR, and more; leverage
          integrations by connecting to Sanity, Cosmic, ButterCMS, Turso, or bringing your own
          RESTful CMS or database. CI/CD is auto-configured so you can focus on your code, not the
          pipeline.
        </p>
        <p class="text-pretty text-body-md text-[var(--text-muted)]">
          Here are a few of our most popular templates to get you started. For more information,
          you can visit our
          <a
            href="#"
            class="text-link underline-offset-2 hover:underline"
          >documentation page on using templates</a>.
        </p>
      </div>

      <div class="mt-[var(--spacing-lg)] grid gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="template in templates"
          :key="template.name"
          href="#"
          class="group flex items-center gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-md)] transition-[border-color,transform] duration-moderate-01 ease-productive-entrance hover:-translate-y-0.5 hover:border-[var(--border-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] motion-reduce:transform-none motion-reduce:transition-none"
        >
          <i
            :class="[template.icon, 'size-8 shrink-0 opacity-70 transition-opacity duration-fast-02 group-hover:opacity-100 motion-reduce:transition-none']"
            aria-hidden="true"
          />
          <span class="flex min-w-0 flex-col">
            <span class="truncate text-label-lg text-[var(--text-default)]">{{ template.name }}</span>
            <span class="text-body-sm text-[var(--text-muted)]">{{ template.tag }}</span>
          </span>
          <i
            class="pi pi-arrow-up-right ml-auto text-body-sm text-[var(--text-muted)] transition-transform duration-fast-02 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>

    <!-- ── Developer tools ────────────────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <div class="flex flex-col gap-[var(--spacing-xxs)]">
        <h2 class="text-heading-lg text-[var(--text-default)]">Developer tools</h2>
        <p class="text-body-md text-[var(--text-muted)]">
          Everything you need to build, automate, and observe on the platform.
        </p>
      </div>

      <div class="mt-[var(--spacing-lg)] grid gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
        <CardBox
          v-for="tool in tools"
          :key="tool.name"
          class="h-full transition-[border-color] duration-moderate-01 ease-productive-entrance hover:border-[var(--border-default)] motion-reduce:transition-none"
        >
          <template #content>
            <div class="flex flex-col ">
              <span class="mb-[var(--spacing-md)]"
              >
                <i
                  :class="[tool.icon, 'text-heading-sm text-[var(--text-default)]']"
                  aria-hidden="true"
                />
              </span>
              <h3 class="text-heading-xxs mb-[var(--spacing-sm)] text-[var(--text-default)]">{{ tool.name }}</h3>
              <p class="text-pretty text-body-xxs mb-[var(--spacing-sm)] text-[var(--text-muted)]">{{ tool.description }}</p>
            </div>
          </template>
        </CardBox>
      </div>
    </section>

    <!-- ── FAQ ────────────────────────────────────────────────────────── -->
    <section class="mt-[var(--spacing-xxl)]">
      <h2 class="text-heading-lg text-[var(--text-default)]">Frequently asked questions</h2>

      <div class="mt-[var(--spacing-lg)] max-w-[var(--container-3xl)]">
        <Accordion
          type="single"
          collapsible
          default-value="what"
        >
          <Accordion.Item
            v-for="faq in faqs"
            :key="faq.value"
            :value="faq.value"
          >
            <Accordion.Trigger>
              <span class="text-label-lg text-[var(--text-default)]">{{ faq.question }}</span>
            </Accordion.Trigger>
            <Accordion.Content>
              <p class="text-pretty text-body-md text-[var(--text-muted)]">{{ faq.answer }}</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </section>
  </div>
</template>
