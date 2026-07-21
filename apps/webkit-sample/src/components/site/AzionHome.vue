<script setup>
  // Landing-page example: a faithful recreation of the azion.com/pt-br homepage
  // structure, composed entirely from @aziontech/webkit components and theme
  // tokens. Rendered inside SiteLayout (website nav + footer, no console
  // sidebar). Sections, top to bottom: hero → framework strip → platform pillars
  // → feature highlights → stats band → developer/CLI section → customers
  // (#clientes) → pricing teaser (#precos) → final CTA (#contato).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CardPricing from '@aziontech/webkit/card-pricing'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Tag from '@aziontech/webkit/tag'
  import { useRouter } from 'vue-router'

  import PlatformShowcase from './PlatformShowcase.vue'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // Frameworks the platform deploys — rendered as a quiet trust strip under the
  // hero. Uses the multicolor brand glyphs (`ai-cor ai-*`, background-image) from
  // @aziontech/icons so each framework keeps its real brand colors.
  const frameworks = [
    { icon: 'ai-cor ai-next', label: 'Next.js' },
    { icon: 'ai-cor ai-vue', label: 'Vue' },
    { icon: 'ai-cor ai-react', label: 'React' },
    { icon: 'ai-cor ai-astro', label: 'Astro' },
    { icon: 'ai-cor ai-svelte', label: 'Svelte' },
    { icon: 'ai-cor ai-angular', label: 'Angular' },
    { icon: 'ai-cor ai-nuxt', label: 'Nuxt' },
    { icon: 'ai-cor ai-solidjs', label: 'SolidJS' }
  ]

  // The four platform pillars from azion.com, each with its product line-up.
  const pillars = [
    {
      icon: 'ai ai-build-pillar',
      title: 'Build',
      description: 'Crie e execute aplicações serverless na borda, próximas ao usuário.',
      products: ['Functions', 'Cache', 'Application Accelerator', 'AI Inference']
    },
    {
      icon: 'ai ai-store',
      title: 'Store',
      description: 'Armazene e sirva dados com baixa latência, distribuídos globalmente.',
      products: ['SQL Database', 'Object Storage', 'KV Store']
    },
    {
      icon: 'ai ai-secure-pillar',
      title: 'Protect',
      description: 'Proteja aplicações e redes com segurança nativa da plataforma.',
      products: ['WAF', 'Network Shield', 'Edge DNS', 'Load Balancer']
    },
    {
      icon: 'ai ai-observe-pillar',
      title: 'Observe',
      description: 'Meça e monitore tudo em tempo real, com dados acionáveis.',
      products: ['Data Stream', 'Real-Time Metrics', 'Edge Pulse']
    }
  ]

  // Alternating feature highlights (text + supporting metric card).
  const features = [
    {
      overline: 'Performance',
      title: 'Deploy global instantâneo, com zero downtime',
      description:
        'Publique em toda a rede distribuída em segundos. Cada release entra no ar simultaneamente em centenas de pontos de presença, sem janelas de manutenção.',
      bullets: ['Rollout atômico em toda a rede', 'Rollback em um clique', 'Cache inteligente na borda'],
      stat: { value: '<10', unit: 'ms', label: 'Latência mediana até o usuário' }
    },
    {
      overline: 'Segurança',
      title: 'Segurança nativa em cada requisição',
      description:
        'WAF, mitigação de DDoS e regras de firewall aplicadas na borda, antes que o tráfego chegue à sua origem. Configurável por aplicação, observável em tempo real.',
      bullets: ['WAF com regras gerenciadas', 'Mitigação de DDoS sempre ativa', 'TLS e certificados automáticos'],
      stat: { value: '99.999', unit: '%', label: 'Disponibilidade da plataforma' }
    }
  ]

  const stats = [
    { value: '100+', label: 'Pontos de presença' },
    { value: '<10ms', label: 'Latência mediana' },
    { value: '99.999%', label: 'Uptime da plataforma' },
    { value: '25B+', label: 'Requisições por dia' }
  ]

  const deployTabs = [
    {
      label: 'Terminal',
      value: 'cli',
      language: 'bash',
      fileName: 'deploy.sh',
      fileIcon: 'pi pi-desktop',
      code: [
        '# Instale a CLI e faça o deploy do seu projeto',
        'npm install -g azion',
        '',
        'azion login',
        'azion deploy',
        '',
        '✓ Build concluído',
        '✓ Publicado em 100+ pontos de presença',
        '✓ Aplicação no ar: https://my-app.azion.app'
      ].join('\n')
    },
    {
      label: 'azion.config',
      value: 'config',
      language: 'javascript',
      fileName: 'azion.config.js',
      fileIcon: 'pi pi-code',
      code: [
        'export default {',
        '  build: {',
        "    preset: 'vue',",
        '  },',
        '  functions: [',
        "    { name: 'handler', path: './src/index.js' },",
        '  ],',
        '  rules: {',
        "    request: [{ match: '/api/*', behavior: { runFunction: 'handler' } }],",
        '  },',
        '}'
      ].join('\n')
    }
  ]

  const customers = [
    {
      quote:
        'Migramos para a Azion e cortamos a latência pela metade. O deploy global deixou de ser um projeto de infraestrutura e virou parte do nosso fluxo diário.',
      name: 'Head de Engenharia',
      company: 'Fintech · América Latina'
    },
    {
      quote:
        'A segurança na borda nos deu tranquilidade em picos de tráfego. WAF e mitigação de DDoS funcionam sem que a gente precise pensar nisso.',
      name: 'CTO',
      company: 'Varejo digital'
    }
  ]

  // Pricing plans mapped to the CardPricing component's contract: title +
  // description, a Currency reading (prefix/value/suffix + details line), an
  // optional "popular" tag, the feature list (default slot) and the CTA (#actions
  // slot). Enterprise hides the numeric affordances and shows a text value.
  const plans = [
    {
      title: 'Free',
      description: 'Para começar a construir na borda hoje mesmo.',
      prefix: 'US$',
      value: '0',
      suffix: '/mês',
      showPrefix: true,
      showSuffix: true,
      details: 'Grátis para sempre, sem cartão.',
      features: ['Deploy global', 'Functions e Cache', 'Certificados TLS automáticos'],
      cta: 'Começar Gratuitamente',
      highlight: false
    },
    {
      title: 'Business',
      description: 'Para equipes em produção com escala e suporte.',
      prefix: 'US$',
      value: '300',
      suffix: '/mês',
      showPrefix: true,
      showSuffix: true,
      details: 'Cobrado mensalmente, cancele quando quiser.',
      features: ['Tudo do Free', 'WAF e Network Shield', 'Observabilidade em tempo real', 'Suporte prioritário'],
      cta: 'Falar com Vendas',
      highlight: true
    },
    {
      title: 'Enterprise',
      description: 'Para requisitos de compliance, SLA e escala global.',
      prefix: '',
      value: 'Sob consulta',
      suffix: '',
      showPrefix: false,
      showSuffix: false,
      details: 'Faturamento e SLA personalizados.',
      features: ['SLA de 99.999%', 'Onboarding dedicado', 'Suporte 24/7', 'Faturamento personalizado'],
      cta: 'Contato',
      highlight: false
    }
  ]
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────────────── -->
  <section class="relative overflow-hidden border-b border-[var(--border-muted)]">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent"
    />
    <div class="mx-auto flex w-full max-w-[var(--container-5xl)] flex-col items-center gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xxl)] text-center">
      <Tag
        label="Plataforma de Edge Computing"
        severity="contrast"
        size="medium"
      />
      <h1 class="max-w-[var(--container-4xl)] text-balance text-heading-2xl text-[var(--text-default)]">
        Infraestrutura Distribuída para Workloads Modernos
      </h1>
      <p class="max-w-[var(--container-2xl)] text-pretty text-body-lg text-[var(--text-muted)]">
        Faça o deploy instantaneamente em escala global, com zero downtime, alta performance e
        segurança nativa. Do código à borda em segundos.
      </p>
      <div class="mt-[var(--spacing-xs)] flex flex-col items-center gap-[var(--spacing-sm)] sm:flex-row">
        <Button
          label="Começar Gratuitamente"
          kind="primary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Falar com um Especialista"
          kind="secondary"
          size="large"
          href="#contato"
        />
      </div>
      <p class="text-body-xs text-[var(--text-muted)]">
        Sem cartão de crédito · Deploy em minutos · Cancele quando quiser
      </p>
    </div>
  </section>

  <!-- ── Framework trust strip ────────────────────────────────────────── -->
  <section class="border-b border-[var(--border-muted)] bg-[var(--bg-surface)]">
    <div class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-col items-center gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xl)]">
      <p class="text-overline-sm text-[var(--text-muted)]">Compatível com o seu framework</p>
      <ul class="flex flex-wrap items-center justify-center gap-x-[var(--spacing-xl)] gap-y-[var(--spacing-md)]">
        <li
          v-for="framework in frameworks"
          :key="framework.label"
          class="flex items-center gap-[var(--spacing-xs)] text-[var(--text-muted)] transition-colors duration-fast-02 ease-productive-entrance hover:text-[var(--text-default)] motion-reduce:transition-none"
        >
          <i
            :class="[framework.icon, 'size-6']"
            aria-hidden="true"
          />
          <span class="text-label-md">{{ framework.label }}</span>
        </li>
      </ul>
    </div>
  </section>

  <!-- ── Platform pillars ─────────────────────────────────────────────── -->
  <section class="mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]">
    <div class="flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-sm)]">
      <p class="text-overline-sm text-[var(--text-muted)]">A plataforma completa</p>
      <h2 class="text-balance text-heading-xl text-[var(--text-default)]">
        Tudo o que você precisa para construir, armazenar, proteger e observar
      </h2>
      <p class="text-pretty text-body-md text-[var(--text-muted)]">
        Uma única plataforma distribuída, com produtos que trabalham juntos e escalam com você.
      </p>
    </div>

    <div class="mt-[var(--spacing-xl)] grid gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-4">
      <CardBox
        v-for="pillar in pillars"
        :key="pillar.title"
        class="h-full transition-[transform,border-color] duration-moderate-01 ease-productive-entrance hover:-translate-y-1 hover:border-[var(--border-default)] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <template #content>
          <div class="flex flex-col gap-[var(--spacing-md)]">
            <span class="flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]">
              <i
                :class="[pillar.icon, 'text-heading-sm text-[var(--text-default)]']"
                aria-hidden="true"
              />
            </span>
            <div class="flex flex-col gap-[var(--spacing-xxs)]">
              <h3 class="text-heading-sm text-[var(--text-default)]">{{ pillar.title }}</h3>
              <p class="text-pretty text-body-sm text-[var(--text-muted)]">{{ pillar.description }}</p>
            </div>
            <ul class="flex flex-col gap-[var(--spacing-xs)] border-t border-[var(--border-muted)] pt-[var(--spacing-md)]">
              <li
                v-for="product in pillar.products"
                :key="product"
                class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]"
              >
                <i
                  class="pi pi-check text-body-xs text-[var(--success)]"
                  aria-hidden="true"
                />
                {{ product }}
              </li>
            </ul>
          </div>
        </template>
      </CardBox>
    </div>
  </section>

  <!-- ── Feature highlights ───────────────────────────────────────────── -->
  <section class="border-y border-[var(--border-muted)] bg-[var(--bg-surface)]">
    <div class="mx-auto flex w-full max-w-[var(--container-7xl)] flex-col gap-[var(--spacing-xxl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]">
      <div
        v-for="(feature, index) in features"
        :key="feature.title"
        class="grid items-center gap-[var(--spacing-xl)] lg:grid-cols-2"
      >
        <div
          class="flex flex-col gap-[var(--spacing-md)]"
          :class="{ 'lg:order-2': index % 2 === 1 }"
        >
          <p class="text-overline-sm text-[var(--text-muted)]">{{ feature.overline }}</p>
          <h2 class="text-balance text-heading-lg text-[var(--text-default)]">{{ feature.title }}</h2>
          <p class="text-pretty text-body-md text-[var(--text-muted)]">{{ feature.description }}</p>
          <ul class="flex flex-col gap-[var(--spacing-xs)]">
            <li
              v-for="bullet in feature.bullets"
              :key="bullet"
              class="flex items-center gap-[var(--spacing-xs)] text-body-md text-[var(--text-default)]"
            >
              <i
                class="pi pi-check-circle text-body-md text-[var(--success)]"
                aria-hidden="true"
              />
              {{ bullet }}
            </li>
          </ul>
        </div>

        <div :class="{ 'lg:order-1': index % 2 === 1 }">
          <CardBox class="bg-[var(--bg-canvas)]">
            <template #content>
              <div class="flex flex-col items-start gap-[var(--spacing-sm)] py-[var(--spacing-lg)]">
                <div class="flex items-baseline gap-[var(--spacing-xxs)]">
                  <span class="text-big-number-lg tabular-nums text-[var(--text-default)]">{{ feature.stat.value }}</span>
                  <span class="text-heading-sm text-[var(--text-muted)]">{{ feature.stat.unit }}</span>
                </div>
                <p class="text-body-sm text-[var(--text-muted)]">{{ feature.stat.label }}</p>
              </div>
            </template>
          </CardBox>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Platform showcase (git graph · API keys · control plane · usage) ─ -->
  <PlatformShowcase />

  <!-- ── Stats band ───────────────────────────────────────────────────── -->
  <section class="mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]">
    <dl class="grid grid-cols-2 gap-[var(--spacing-lg)] lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex flex-col items-center gap-[var(--spacing-xxs)] text-center"
      >
        <dt class="text-big-number-md tabular-nums text-[var(--text-default)]">{{ stat.value }}</dt>
        <dd class="text-body-sm text-[var(--text-muted)]">{{ stat.label }}</dd>
      </div>
    </dl>
  </section>

  <!-- ── Developer / CLI section ──────────────────────────────────────── -->
  <section class="border-y border-[var(--border-muted)] bg-[var(--bg-surface)]">
    <div class="mx-auto grid w-full max-w-[var(--container-7xl)] items-center gap-[var(--spacing-xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)] lg:grid-cols-2">
      <div class="flex flex-col gap-[var(--spacing-md)]">
        <p class="text-overline-sm text-[var(--text-muted)]">Feito para desenvolvedores</p>
        <h2 class="text-balance text-heading-lg text-[var(--text-default)]">Do commit ao deploy global, sem sair do terminal</h2>
        <p class="text-pretty text-body-md text-[var(--text-muted)]">
          Uma CLI, um arquivo de configuração e integração nativa com Git. Traga seu framework
          favorito e publique na borda com um único comando.
        </p>
        <div class="mt-[var(--spacing-xs)] flex flex-col gap-[var(--spacing-sm)] sm:flex-row">
          <Button
            label="Ler a Documentação"
            kind="secondary"
            size="medium"
            icon="pi pi-book"
            href="#"
          />
          <Button
            label="Ver no GitHub"
            kind="text"
            size="medium"
            icon="pi pi-github"
            href="#"
          />
        </div>
      </div>

      <CodeBlock
        :tabs="deployTabs"
        default-value="cli"
        :show-line-numbers="false"
        copy-aria-label="Copiar comando de deploy"
      />
    </div>
  </section>

  <!-- ── Customers (#clientes) ────────────────────────────────────────── -->
  <section
    id="clientes"
    class="mx-auto w-full max-w-[var(--container-7xl)] scroll-mt-[var(--spacing-xxl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]"
  >
    <div class="flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-sm)]">
      <p class="text-overline-sm text-[var(--text-muted)]">Clientes</p>
      <h2 class="text-balance text-heading-xl text-[var(--text-default)]">Equipes de engenharia constroem sobre a Azion</h2>
    </div>

    <div class="mt-[var(--spacing-xl)] grid gap-[var(--spacing-md)] lg:grid-cols-2">
      <CardBox
        v-for="customer in customers"
        :key="customer.company"
        class="h-full"
      >
        <template #content>
          <figure class="flex h-full flex-col gap-[var(--spacing-md)]">
            <i
              class="pi pi-verified text-heading-sm text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <blockquote class="flex-1 text-pretty text-body-lg text-[var(--text-default)]">
              “{{ customer.quote }}”
            </blockquote>
            <figcaption class="flex flex-col gap-[var(--spacing-xxs)] border-t border-[var(--border-muted)] pt-[var(--spacing-md)]">
              <span class="text-label-md text-[var(--text-default)]">{{ customer.name }}</span>
              <span class="text-body-sm text-[var(--text-muted)]">{{ customer.company }}</span>
            </figcaption>
          </figure>
        </template>
      </CardBox>
    </div>
  </section>

  <!-- ── Pricing teaser (#precos) ─────────────────────────────────────── -->
  <!-- Canvas band so the `contained` (surface) CardPricing cards contrast
       against it — same figure/ground as the pillars and customers sections.
       On a surface band the cards share the band's fill and read flat. -->
  <section
    id="precos"
    class="border-t border-[var(--border-muted)] bg-[var(--bg-canvas)]"
  >
    <div class="mx-auto w-full max-w-[var(--container-7xl)] scroll-mt-[var(--spacing-xxl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]">
      <div class="flex flex-col items-center gap-[var(--spacing-sm)] text-center">
        <p class="text-overline-sm text-[var(--text-muted)]">Preços</p>
        <h2 class="text-balance text-heading-xl text-[var(--text-default)]">Pague apenas pelo que usar</h2>
        <p class="max-w-[var(--container-2xl)] text-pretty text-body-md text-[var(--text-muted)]">
          Comece de graça e escale conforme cresce. Sem taxas de setup, sem surpresas.
        </p>
      </div>

      <div class="mt-[var(--spacing-xl)] grid gap-[var(--spacing-md)] lg:grid-cols-3">
        <CardPricing
          v-for="plan in plans"
          :key="plan.title"
          slot-position="middle"
          kind="contained"
          :plan-title="plan.title"
          :description="plan.description"
          :prefix="plan.prefix"
          :value="plan.value"
          :suffix="plan.suffix"
          :show-prefix="plan.showPrefix"
          :show-suffix="plan.showSuffix"
          :pricing-details="plan.details"
          :show-tag="plan.highlight"
          tag-label="Mais popular"
          :class="plan.highlight ? 'ring-1 ring-[var(--border-selected)]' : ''"
        >
          <ul class="flex flex-col gap-[var(--spacing-xs)]">
            <li
              v-for="item in plan.features"
              :key="item"
              class="flex items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]"
            >
              <i
                class="pi pi-check text-body-xs text-[var(--success)]"
                aria-hidden="true"
              />
              {{ item }}
            </li>
          </ul>

          <template #actions>
            <Button
              :label="plan.cta"
              :kind="plan.highlight ? 'primary' : 'secondary'"
              size="large"
              class="w-full"
              @click="goSignup"
            />
          </template>
        </CardPricing>
      </div>
    </div>
  </section>

  <!-- ── Final CTA (#contato) ─────────────────────────────────────────── -->
  <section
    id="contato"
    class="border-t border-[var(--border-muted)]"
  >
    <div class="mx-auto flex w-full max-w-[var(--container-5xl)] scroll-mt-[var(--spacing-xxl)] flex-col items-center gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xxl)] text-center">
      <h2 class="max-w-[var(--container-3xl)] text-balance text-heading-xl text-[var(--text-default)]">
        Pronto para levar seus workloads para a borda?
      </h2>
      <p class="max-w-[var(--container-2xl)] text-pretty text-body-lg text-[var(--text-muted)]">
        Crie sua conta gratuita e faça o primeiro deploy global em minutos. Precisa de ajuda para
        escalar? Fale com nossos especialistas.
      </p>
      <div class="flex flex-col items-center gap-[var(--spacing-sm)] sm:flex-row">
        <Button
          label="Começar Gratuitamente"
          kind="primary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Falar com um Especialista"
          kind="secondary"
          size="large"
          href="#"
        />
      </div>
    </div>
  </section>
</template>
