<script setup>
  // "Why Azion" proof strip — a four-panel showcase recreated from the reference
  // asset entirely with theme tokens (no hex, no Tailwind palette): a git branch
  // graph, a Personal Tokens table, a control-plane selection diagram, and a
  // usage chart. The accent uses the theme's global `--color-orange-*` palette
  // (constant across themes, so text on the orange fills is `--color-base-white`);
  // everything structural uses semantic surface / border / text tokens so both
  // light and dark themes stay correct.

  // Panel 1 — commit nodes sitting on the `main` line (left %, on the mid rule).
  const commitNodes = [18, 26, 42, 60, 78]

  // Panel 1 — branch chips overlaid on the SVG connectors (percent coordinates
  // matched to the connector paths below).
  const branchChips = [
    { label: 'main', left: '7%', top: '55%', primary: true },
    { label: 'test-1', left: '50%', top: '33%', primary: false },
    { label: 'test-2', left: '69%', top: '20%', primary: false },
    { label: 'dev-branch', left: '31%', top: '80%', primary: false }
  ]

  // Panel 2 — Personal Tokens list (mirrors PersonalTokens.vue: a token id prefix
  // shown in place of the one-time plaintext, plus an active/revoked/expired
  // lifecycle). The `terraform` row is the highlighted/selected one.
  const tokens = [
    { name: 'cli-local', token: 'pat_01F8A3', status: 'active' },
    { name: 'ci-cd', token: 'pat_02C9B7', status: 'active' },
    { name: 'terraform', token: 'pat_03E41D', status: 'active', highlight: true },
    { name: 'staging', token: 'pat_04A92F', status: 'revoked' },
    { name: 'backup', token: 'pat_05D77C', status: 'expired' },
    { name: 'web-hook', token: 'pat_06B2E9', status: 'active' }
  ]

  // Panel 4 — usage bars (height as % of the chart area) and the overlaid line's
  // node positions (y as % from the top). `4w` is the tall, highlighted bar.
  const usageBars = [
    { label: '1w', height: 45, y: 60 },
    { label: '2w', height: 60, y: 52 },
    { label: '3w', height: 40, y: 58 },
    { label: '4w', height: 100, y: 30, peak: true },
    { label: '5w', height: 62, y: 50 },
    { label: '1w', height: 42, y: 62 }
  ]

  // Line polyline points + node markers, x centered per bar column (6 columns).
  const lineNodes = usageBars.map((bar, i) => ({
    x: ((i + 0.5) / usageBars.length) * 100,
    y: bar.y,
    peak: bar.peak
  }))
  const linePoints = lineNodes.map((node) => `${node.x},${node.y}`).join(' ')

  const panels = [
    {
      key: 'branch',
      title: 'Branch Overview',
      lead: 'Mais rápido para publicar.',
      body: 'Do código à API no ar em minutos. Teste com segurança, promova quando quiser e reverta se precisar.'
    },
    {
      key: 'tokens',
      title: 'Personal Tokens',
      lead: 'Seguro por padrão.',
      body: 'Acesse a API com tokens pessoais escopados, com expiração definida e revogação instantânea. A chave aparece uma única vez.'
    },
    {
      key: 'control',
      title: 'Control Plane',
      lead: 'Mais simples de operar.',
      body: 'Uma única plataforma unificada para deploys, gateways e observabilidade completa.'
    },
    {
      key: 'usage',
      title: 'Usage 30 Days',
      lead: 'Visível desde o primeiro dia.',
      body: 'Cada requisição registrada. Cada decisão rastreada. Depure antes que o usuário perceba.'
    }
  ]
</script>

<template>
  <section class="mx-auto w-full max-w-[var(--container-7xl)] px-[var(--spacing-md)] py-[var(--spacing-xxl)]">
    <div class="mb-[var(--spacing-xl)] flex max-w-[var(--container-3xl)] flex-col gap-[var(--spacing-sm)]">
      <p class="text-overline-sm text-[var(--text-muted)]">Por que Azion</p>
      <h2 class="text-balance text-heading-xl text-[var(--text-default)]">
        Do commit à observabilidade, em uma só plataforma
      </h2>
    </div>

    <div class="grid grid-cols-1 overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-muted)] bg-[var(--bg-canvas)] lg:grid-cols-4">
      <article
        v-for="(panel, index) in panels"
        :key="panel.key"
        class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)] border-[var(--border-muted)]"
        :class="index > 0 ? 'border-t lg:border-t-0 lg:border-l' : ''"
      >
        <header class="text-label-code-md text-[var(--text-muted)]">{{ panel.title }}</header>

        <!-- ── Visual ─────────────────────────────────────────────────── -->
        <!-- Panel 1: git branch graph -->
        <div
          v-if="panel.key === 'branch'"
          class="relative h-48"
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            class="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <!-- ruled guide lines -->
            <line
              v-for="y in [12, 26, 40, 55, 69, 83]"
              :key="`rule-${y}`"
              x1="3"
              :y1="y"
              x2="97"
              :y2="y"
              stroke="var(--border-muted)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <!-- main branch line -->
            <line
              x1="4"
              y1="55"
              x2="94"
              y2="55"
              stroke="var(--color-orange-500)"
              stroke-width="1.5"
              vector-effect="non-scaling-stroke"
            />
            <!-- branch connectors -->
            <path
              d="M30 55 C40 55 40 33 50 33 L64 33"
              fill="none"
              stroke="var(--border-strong)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <path
              d="M42 55 C58 55 58 20 68 20 L84 20"
              fill="none"
              stroke="var(--border-strong)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <path
              d="M22 55 C34 55 34 80 44 80 L60 80"
              fill="none"
              stroke="var(--border-strong)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <!-- commit nodes on the main line -->
          <span
            v-for="node in commitNodes"
            :key="`node-${node}`"
            class="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-orange-500)]"
            :style="{ left: node + '%', top: '55%' }"
            aria-hidden="true"
          />

          <!-- branch chips -->
          <span
            v-for="chip in branchChips"
            :key="chip.label"
            class="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-code-sm"
            :class="
              chip.primary
                ? 'bg-[var(--color-orange-500)] text-[var(--color-base-white)]'
                : 'border border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-[var(--text-default)]'
            "
            :style="{ left: chip.left, top: chip.top }"
          >
            {{ chip.label }}
          </span>
        </div>

        <!-- Panel 2: Personal Tokens table -->
        <div
          v-else-if="panel.key === 'tokens'"
          class="flex h-48 flex-col"
        >
          <div class="border-b border-[var(--border-default)]" />
          <div class="flex flex-1 flex-col justify-center gap-[var(--spacing-xxs)] pt-[var(--spacing-sm)]">
            <div
              v-for="row in tokens"
              :key="row.token"
              class="grid grid-cols-[1fr_1.5fr_auto] items-center gap-[var(--spacing-sm)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-code-sm"
              :class="
                row.highlight
                  ? 'bg-gradient-to-r from-[var(--color-orange-500)] to-[var(--color-orange-600)] text-[var(--color-base-white)]'
                  : 'text-[var(--text-muted)]'
              "
            >
              <span :class="row.highlight ? '' : 'text-[var(--text-default)]'">{{ row.name }}</span>
              <span>{{ row.token }}</span>
              <span class="text-right">{{ row.status }}</span>
            </div>
          </div>
        </div>

        <!-- Panel 3: control plane selection diagram -->
        <div class="flex h-48 items-center justify-center" v-else-if="panel.key === 'control'">
          <svg
            viewBox="0 0 100 100"
            class="h-full w-auto"
            aria-hidden="true"
          >
            <!-- outer gray frames -->
            <rect
              x="30"
              y="12"
              width="56"
              height="56"
              fill="none"
              stroke="var(--border-default)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <rect
              x="14"
              y="30"
              width="56"
              height="56"
              fill="none"
              stroke="var(--border-strong)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <!-- gray corner handles -->
            <rect
              v-for="handle in [
                { x: 83, y: 9 },
                { x: 11, y: 83 }
              ]"
              :key="`gh-${handle.x}`"
              :x="handle.x"
              :y="handle.y"
              width="6"
              height="6"
              fill="var(--bg-surface)"
              stroke="var(--border-strong)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <!-- blue selection frame -->
            <rect
              x="22"
              y="22"
              width="48"
              height="48"
              fill="none"
              stroke="var(--color-orange-500)"
              stroke-width="1.5"
              vector-effect="non-scaling-stroke"
            />
            <!-- center filled square -->
            <rect
              x="38"
              y="38"
              width="16"
              height="16"
              fill="var(--color-orange-500)"
            />
            <!-- blue corner handles -->
            <rect
              v-for="handle in [
                { x: 19, y: 19 },
                { x: 67, y: 19 },
                { x: 19, y: 67 },
                { x: 67, y: 67 }
              ]"
              :key="`bh-${handle.x}-${handle.y}`"
              :x="handle.x"
              :y="handle.y"
              width="6"
              height="6"
              fill="var(--color-orange-500)"
              stroke="var(--color-base-white)"
              stroke-width="0.75"
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>

        <!-- Panel 4: usage chart -->
        <div v-else-if="panel.key === 'usage'" class="flex h-48 flex-col gap-[var(--spacing-sm)]">
          <div class="text-big-number-sm tabular-nums text-[var(--text-default)]">12</div>

          <div class="relative flex-1">
            <!-- bars -->
            <div class="absolute inset-0 flex items-end justify-between gap-[var(--spacing-xs)]">
              <div
                v-for="(bar, i) in usageBars"
                :key="`bar-${i}`"
                class="min-w-0 flex-1"
                :class="
                  bar.peak
                    ? 'bg-gradient-to-t from-[var(--color-orange-600)] to-[var(--color-orange-400)]'
                    : 'bg-[var(--bg-surface-raised)]'
                "
                :style="{ height: bar.height + '%' }"
              />
            </div>

            <!-- line overlay -->
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              class="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <polyline
                :points="linePoints"
                fill="none"
                stroke="var(--color-orange-400)"
                stroke-width="1.5"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
              />
            </svg>

            <!-- line node markers -->
            <span
              v-for="(node, i) in lineNodes"
              :key="`ln-${i}`"
              class="absolute size-2 -translate-x-1/2 -translate-y-1/2 border"
              :class="
                node.peak
                  ? 'border-[var(--color-base-white)] bg-[var(--color-base-white)]'
                  : 'border-[var(--color-orange-400)] bg-[var(--bg-canvas)]'
              "
              :style="{ left: node.x + '%', top: node.y + '%' }"
              aria-hidden="true"
            />
          </div>

          <!-- x-axis labels -->
          <div class="flex items-center justify-between text-label-code-sm text-[var(--text-muted)]">
            <span
              v-for="(bar, i) in usageBars"
              :key="`x-${i}`"
            >{{ bar.label }}</span>
          </div>
        </div>

        <!-- ── Caption ────────────────────────────────────────────────── -->
        <p class="text-pretty text-body-sm text-[var(--text-muted)]">
          <span class="font-medium text-[var(--text-default)]">{{ panel.lead }}</span>
          {{ ' ' }}{{ panel.body }}
        </p>
      </article>
    </div>
  </section>
</template>
