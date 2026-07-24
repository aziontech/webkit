<script setup>
  // "Da origem ao destino" — a six-panel platform showcase built in the same visual
  // language as PlatformShowcase.vue: schematic routing graphs drawn entirely with
  // theme tokens (no hex, no Tailwind palette), so both light and dark themes stay
  // correct. Every scene shares one grammar — a ruled grid, an accent main line, gray
  // branch connectors, accent commit nodes, and labeled chips — and each retells a
  // different chapter of the Azion Web Platform: Version, Deploy, Network, AI, Secure
  // and Observe.
  //
  // Accents use the theme's global `--color-<hue>-*` palettes (constant across themes,
  // so text on the filled chips is `--color-base-white`); everything structural uses
  // the semantic surface / border / text tokens. Coordinates are percentages so the
  // chips stay pinned to the connector paths regardless of the panel's aspect ratio.

  defineProps({
    // When false, render only the bordered grid — no section max-width / padding
    // or heading — so a host page can supply its own frame (e.g. the Hub's
    // PageContainer + PageHeader). Framed (default) renders the standalone
    // home-page section with its own overline + heading.
    framed: { type: Boolean, default: true }
  })

  // The six ruled guide lines every panel shares (percent of the 0–100 viewBox).
  const guideLines = [12, 26, 40, 55, 69, 83]

  // Resolve an accent color from a hue name to its global token.
  const accent = (hue, shade = 500) => `var(--color-${hue}-${shade})`

  const scenes = [
    {
      key: 'version',
      title: 'Version',
      hue: 'orange',
      main: { kind: 'line' },
      nodes: [18, 26, 42, 60, 78],
      connectors: [
        { d: 'M30 55 C40 55 40 33 50 33 L64 33' },
        { d: 'M42 55 C58 55 58 20 68 20 L84 20' },
        { d: 'M22 55 C34 55 34 80 44 80 L60 80' }
      ],
      chips: [
        { label: 'main', left: '8%', top: '55%', variant: 'primary' },
        { label: 'feat/edge', left: '52%', top: '33%', variant: 'plain' },
        { label: 'v2.4.0', left: '70%', top: '20%', variant: 'plain' },
        { label: 'hotfix', left: '33%', top: '80%', variant: 'plain' }
      ],
      lead: 'Mais rápido para publicar.',
      body: 'Do código à API no ar em minutos — teste com segurança, promova quando quiser e reverta se precisar.'
    },
    {
      key: 'deploy',
      title: 'Deploy',
      hue: 'green',
      main: { kind: 'line' },
      nodes: [16, 40, 64],
      connectors: [{ d: 'M42 55 C54 55 54 33 64 33 L78 33' }],
      chips: [
        { label: 'build', left: '14%', top: '55%', variant: 'plain' },
        { label: 'deploy', left: '42%', top: '55%', variant: 'plain' },
        { label: 'live', left: '84%', top: '55%', variant: 'primary' },
        { label: 'preview', left: '70%', top: '33%', variant: 'plain' }
      ],
      lead: 'Publique uma vez.',
      body: 'Um único deploy propaga o build para toda a borda global — sem cold starts, sem espera.'
    },
    {
      key: 'network',
      title: 'Network',
      hue: 'blue',
      main: { kind: 'line' },
      nodes: [12, 22],
      connectors: [
        { d: 'M42 55 C54 55 54 26 64 26 L78 26' },
        { d: 'M40 55 C50 55 50 40 60 40 L74 40' },
        { d: 'M40 55 C50 55 50 69 60 69 L74 69' },
        { d: 'M42 55 C54 55 54 83 64 83 L78 83' }
      ],
      chips: [
        { label: 'anycast', left: '30%', top: '55%', variant: 'primary' },
        { label: 'gru', left: '80%', top: '26%', variant: 'plain' },
        { label: 'iad', left: '76%', top: '40%', variant: 'plain' },
        { label: 'fra', left: '76%', top: '69%', variant: 'plain' },
        { label: 'gig', left: '80%', top: '83%', variant: 'plain' }
      ],
      lead: 'Sempre no ponto mais próximo.',
      body: 'Roteamento anycast entrega cada requisição no PoP de menor latência, em toda a rede distribuída.'
    },
    {
      key: 'ai',
      title: 'AI',
      hue: 'violet',
      main: { kind: 'line' },
      nodes: [12, 20],
      connectors: [
        { d: 'M40 55 C52 55 52 33 62 33 L76 33' },
        { d: 'M46 55 C60 55 60 20 70 20 L84 20' },
        { d: 'M40 55 C52 55 52 80 62 80 L76 80' }
      ],
      chips: [
        { label: 'model', left: '28%', top: '55%', variant: 'primary' },
        { label: 'embed', left: '66%', top: '33%', variant: 'plain' },
        { label: 'rag', left: '74%', top: '20%', variant: 'plain' },
        { label: 'agent', left: '66%', top: '80%', variant: 'plain' }
      ],
      lead: 'IA na mesma plataforma.',
      body: 'Inferência, embeddings e agentes executados na borda, próximos ao usuário e aos seus dados.'
    },
    {
      key: 'secure',
      title: 'Secure',
      hue: 'red',
      main: { kind: 'split', at: 55, before: 'red', after: 'green' },
      nodes: [14, 26, { x: 55, emphasis: true }],
      connectors: [
        { d: 'M55 55 C60 55 60 33 66 33 L78 33', stroke: 'red', dashed: true },
        { d: 'M55 55 C62 55 62 20 70 20 L84 20', stroke: 'red', dashed: true },
        { d: 'M55 55 C60 55 60 80 66 80 L78 80', stroke: 'red', dashed: true }
      ],
      chips: [
        { label: 'app 200', left: '82%', top: '55%', variant: 'primary', colorHue: 'green' },
        { label: 'SQLi', left: '70%', top: '33%', variant: 'blocked' },
        { label: 'DDoS', left: '78%', top: '20%', variant: 'blocked' },
        { label: 'bot', left: '70%', top: '80%', variant: 'blocked' }
      ],
      lead: 'Protegido por padrão.',
      body: 'WAF, mitigação de DDoS e proteção contra bots aplicados antes da sua origem — o tráfego limpo segue.'
    },
    {
      key: 'observe',
      title: 'Observe',
      hue: 'yellow',
      main: { kind: 'spark', points: '4,60 14,54 24,62 34,46 44,56 54,40 64,52 74,38 86,46' },
      nodes: [],
      connectors: [
        { d: 'M28 50 C40 50 40 26 50 26 L64 26' },
        { d: 'M42 45 C56 45 56 33 66 33 L80 33' },
        { d: 'M24 56 C36 56 36 80 46 80 L60 80' }
      ],
      chips: [
        { label: 'p99 · 24ms', left: '84%', top: '46%', variant: 'primary' },
        { label: 'events', left: '52%', top: '26%', variant: 'plain' },
        { label: 'logs', left: '68%', top: '33%', variant: 'plain' },
        { label: 'errors', left: '33%', top: '80%', variant: 'blocked' }
      ],
      lead: 'Visível desde o primeiro dia.',
      body: 'Métricas, eventos e logs em tempo real — cada requisição registrada e cada decisão rastreável.'
    }
  ]

  // Normalize a node entry (a bare number sits on the mid line at y=55).
  const nodeOf = (node) => (typeof node === 'number' ? { x: node } : node)

  // Chip presentation from its variant (primary fill / plain outline / blocked).
  const chipStyle = (chip, hue) => {
    if (chip.variant === 'primary') {
      return { backgroundColor: accent(chip.colorHue || hue), color: 'var(--color-base-white)' }
    }
    if (chip.variant === 'blocked') return { borderColor: accent('red') }
    return {}
  }
</script>

<template>
  <component
    :is="framed ? 'section' : 'div'"
    :class="
      framed ? 'mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]' : ''
    "
  >
    <div
      v-if="framed"
      class="mb-[var(--spacing-xl)] flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-sm)]"
    >
      <p class="text-overline-sm text-[var(--text-muted)]">Ilustrações da plataforma</p>
      <h2 class="text-balance text-heading-xl text-[var(--text-default)]">
        Da origem ao destino, em uma só linguagem visual
      </h2>
    </div>

    <!-- One bordered surface; the gap-px reveals the muted divider between panels. -->
    <div class="overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-muted)]">
      <div class="grid grid-cols-1 gap-px bg-[var(--border-muted)] sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="scene in scenes"
          :key="scene.key"
          class="flex flex-col gap-[var(--spacing-lg)] bg-[var(--bg-canvas)] p-[var(--spacing-lg)]"
        >
          <header class="flex items-center gap-[var(--spacing-xs)] text-label-code-md text-[var(--text-muted)]">
            <span
              class="size-2 shrink-0 rounded-[var(--shape-flat)]"
              :style="{ backgroundColor: accent(scene.hue) }"
              aria-hidden="true"
            />
            {{ scene.title }}
          </header>

          <!-- ── Visual ─────────────────────────────────────────────────── -->
          <div class="relative h-48">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              class="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <!-- ruled guide lines -->
              <line
                v-for="y in guideLines"
                :key="`rule-${scene.key}-${y}`"
                x1="3"
                :y1="y"
                x2="97"
                :y2="y"
                stroke="var(--border-muted)"
                stroke-width="1"
                vector-effect="non-scaling-stroke"
              />

              <!-- branch connectors (neutral, or accent + dashed when blocked) -->
              <path
                v-for="(c, i) in scene.connectors"
                :key="`conn-${scene.key}-${i}`"
                :d="c.d"
                fill="none"
                :stroke="c.stroke ? accent(c.stroke) : 'var(--border-strong)'"
                stroke-width="1"
                :stroke-dasharray="c.dashed ? '3 3' : undefined"
                vector-effect="non-scaling-stroke"
              />

              <!-- main line — straight, split (secure), or a sparkline (observe) -->
              <template v-if="scene.main.kind === 'split'">
                <line
                  x1="4"
                  y1="55"
                  :x2="scene.main.at"
                  y2="55"
                  :stroke="accent(scene.main.before)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                />
                <line
                  :x1="scene.main.at"
                  y1="55"
                  x2="94"
                  y2="55"
                  :stroke="accent(scene.main.after)"
                  stroke-width="1.5"
                  vector-effect="non-scaling-stroke"
                />
              </template>
              <polyline
                v-else-if="scene.main.kind === 'spark'"
                :points="scene.main.points"
                fill="none"
                :stroke="accent(scene.hue)"
                stroke-width="1.5"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
              <line
                v-else
                x1="4"
                y1="55"
                x2="94"
                y2="55"
                :stroke="accent(scene.hue)"
                stroke-width="1.5"
                vector-effect="non-scaling-stroke"
              />
            </svg>

            <!-- commit / hop nodes on the mid line -->
            <span
              v-for="(node, i) in scene.nodes.map(nodeOf)"
              :key="`node-${scene.key}-${i}`"
              class="absolute -translate-x-1/2 -translate-y-1/2"
              :class="node.emphasis ? 'size-2.5' : 'size-1.5'"
              :style="{
                backgroundColor: accent(node.hue || scene.hue),
                left: node.x + '%',
                top: (node.y || 55) + '%'
              }"
              aria-hidden="true"
            />

            <!-- labeled chips pinned to the connector endpoints -->
            <span
              v-for="chip in scene.chips"
              :key="`chip-${scene.key}-${chip.label}`"
              class="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-code-sm"
              :class="{
                'border border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-[var(--text-default)]':
                  chip.variant === 'plain',
                'border bg-[var(--bg-surface)] text-[var(--text-muted)]': chip.variant === 'blocked'
              }"
              :style="[{ left: chip.left, top: chip.top }, chipStyle(chip, scene.hue)]"
            >
              <span
                v-if="chip.variant === 'blocked'"
                aria-hidden="true"
                :style="{ color: accent('red') }"
              >✕ </span>{{ chip.label }}
            </span>
          </div>

          <!-- ── Caption ────────────────────────────────────────────────── -->
          <p class="text-pretty text-body-sm text-[var(--text-muted)]">
            <span class="font-medium text-[var(--text-default)]">{{ scene.lead }}</span>
            {{ ' ' }}{{ scene.body }}
          </p>
        </article>
      </div>
    </div>
  </component>
</template>
