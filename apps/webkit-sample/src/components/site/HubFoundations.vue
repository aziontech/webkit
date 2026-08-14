<script setup>
  // The Webkit Hub's documentation body — a faithful replica of the Storybook
  // "Foundations" tree (Get Started, Style Guide, Colors, Typography, Theme,
  // Icons), rebuilt as in-page sections so the header nav anchors land on real
  // content. Each section reuses the same foundation helper components and the
  // same @aziontech/theme + @aziontech/icons data sources the stories use, so the
  // catalog can never drift from what ships. Section ids match HubSidebar's nav items.
  import icons from '@aziontech/icons/catalog'
  import colorIcons from '@aziontech/icons/color-catalog'
  import { primitives } from '@aziontech/theme/colors'
  import CodeBlock from '@aziontech/webkit/code-block'

  import ColorPaletteSection from './foundations/components/ColorPaletteSection.vue'
  import IconGrid from './foundations/components/IconGrid.vue'
  import BannerContainer from './foundations/components/layout/BannerContainer.vue'
  import CardGrid from './foundations/components/layout/CardGrid.vue'
  import PageHeader from './foundations/components/layout/PageHeader.vue'
  import SectionContainer from './foundations/components/layout/SectionContainer.vue'
  import SectionModule from './foundations/components/layout/SectionModule.vue'
  import SemanticSwatchGroup from './foundations/components/SemanticSwatchGroup.vue'
  import TypographyPreview from './foundations/components/TypographyPreview.vue'
  import { themeColorGroups } from './foundations/data/theme.js'

  // Which documentation view to render — one per sidebar item so no page is a
  // multi-section wall:
  //   • 'getting-started' — the onboarding docs (Get Started + Style Guide).
  //   • 'tokens'          — All Tokens (Globals) source map.
  //   • 'colors'          — primitive shade scales + brand palettes.
  //   • 'typography'      — the semantic text styles.
  //   • 'theme'           — semantic color tokens (light/dark aware).
  //   • 'icons'           — the icon system + gallery.
  // The Hub sidebar fans "Foundations" out into these, driving one per view.
  defineProps({
    section: {
      type: String,
      default: 'tokens',
      validator: (v) =>
        ['getting-started', 'tokens', 'colors', 'typography', 'theme', 'icons'].includes(v)
    }
  })

  // ── Colors: primitive shade scales + brand palettes (Foundations/Colors) ──────
  const shadeScaleKeys = [
    'orange',
    'violet',
    'blue',
    'green',
    'yellow',
    'red',
    'gray',
    'slate',
    'surface'
  ]

  const shadePaletteSections = shadeScaleKeys
    .map((scaleKey) => {
      const scale = primitives[scaleKey]
      if (!scale || typeof scale !== 'object') return null
      const items = Object.entries(scale).map(([shade, hex]) => ({
        id: `${scaleKey}-${shade}`,
        label: `${scaleKey} ${shade}`,
        value: hex,
        preview: hex,
        meta: `--${scaleKey}-${shade}`
      }))
      return {
        id: `primitive-${scaleKey}`,
        title: scaleKey,
        description: `${scaleKey} primitive scale from theme tokens.`,
        items
      }
    })
    .filter(Boolean)

  const brandPaletteSections = Object.entries(primitives.brand ?? {})
    .map(([familyName, scale]) => {
      if (!scale || typeof scale !== 'object') return null
      const items = Object.entries(scale).map(([shade, hex]) => ({
        id: `brand-${familyName}-${shade}`,
        label: `${familyName} ${shade}`,
        value: hex,
        preview: hex,
        meta: `--brand-${familyName}-${shade}`
      }))
      return {
        id: `brand-${familyName}`,
        title: familyName,
        description: `Brand ${familyName} primitive scale.`,
        items
      }
    })
    .filter(Boolean)

  // ── Where the foundation tokens live (Get Started) ────────────────────────────
  const tokenSources = [
    { page: 'Primitive Colors', source: 'src/tokens/primitives/colors/' },
    { page: 'Theme Colors', source: 'src/tokens/theme/ + semantic/colors.js' },
    { page: 'Typography', source: 'src/tokens/semantic/texts.data.js' },
    { page: 'Spacing', source: 'src/tokens/semantic/spacings.data.js' },
    { page: 'Responsive', source: 'src/tokens/primitives/breakpoints.js' }
  ]

  // The pattern families enforced by the design system (Style Guide summary).
  const standards = [
    {
      title: 'Composition & compound API',
      body: 'Composition components expose a compound API (Table.Row, Table.Cell) plus a tree-shakeable root import.'
    },
    {
      title: 'One prop vocabulary',
      body: 'One name, type and default per concept — kind, size, severity, disabled, loading — across every component.'
    },
    {
      title: 'Styling on data-*',
      body: 'Variant styles live inline on the root and switch on data-* attributes — no JS class presets, no scoped CSS.'
    },
    {
      title: 'Tokens only',
      body: 'Every color, space and type value is a var(--*) token — never a raw hex or an off-scale size.'
    },
    {
      title: 'Accessible by construction',
      body: 'Role, keyboard model, focus management and a motion-reduce fallback ship with the component, not the consumer.'
    },
    {
      title: 'A test per component',
      body: 'Every component ships a real-browser functional test (Vitest + axe) that moves with it.'
    }
  ]

  // ── Get Started / Icons code snippets ─────────────────────────────────────────
  const installTabs = [
    {
      label: 'npm',
      value: 'npm',
      language: 'bash',
      code: 'npm install @aziontech/webkit @aziontech/theme @aziontech/icons\n\n# then wire lint, MCP, pre-commit and agent docs in one command\nnpx @aziontech/webkit init'
    },
    {
      label: 'pnpm',
      value: 'pnpm',
      language: 'bash',
      code: 'pnpm add @aziontech/webkit @aziontech/theme @aziontech/icons\n\n# then wire lint, MCP, pre-commit and agent docs in one command\npnpm dlx @aziontech/webkit init'
    },
    {
      label: 'yarn',
      value: 'yarn',
      language: 'bash',
      code: 'yarn add @aziontech/webkit @aziontech/theme @aziontech/icons\n\n# then wire lint, MCP, pre-commit and agent docs in one command\nyarn dlx @aziontech/webkit init'
    }
  ]

  const themeTabs = [
    {
      label: 'main.js',
      value: 'entry',
      language: 'javascript',
      code: "import '@aziontech/theme' // design tokens (light/dark aware)\nimport '@aziontech/icons' // the icon font"
    }
  ]

  const usageComponentTabs = [
    {
      label: 'App.vue',
      value: 'app',
      language: 'html',
      code: [
        '<script setup>',
        "import Button from '@aziontech/webkit/button'",
        "import FieldText from '@aziontech/webkit/field-text'",
        '<\/script>',
        '',
        '<template>',
        '  <FieldText name="email" label="Email" />',
        '  <Button kind="primary" @click="submit">Create account</Button>',
        '</template>'
      ].join('\n')
    }
  ]

  const iconImportTabs = [
    {
      label: 'JavaScript',
      value: 'js',
      language: 'javascript',
      code: "import '@aziontech/icons';"
    }
  ]

  const iconUsageTabs = [
    {
      label: 'HTML',
      value: 'html',
      language: 'html',
      fileName: 'index.html',
      code: [
        '<i class="ai ai-azion"></i>',
        '<i class="ai ai-edge-functions text-default text-2xl"></i>',
        '<i class="pi pi-check"></i>',
        '<i class="pi pi-times text-default text-2xl"></i>'
      ].join('\n')
    }
  ]
</script>

<template>
  <!-- ══ Getting Started: onboarding docs (install steps + Style Guide) ═══ -->
  <template v-if="section === 'getting-started'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Get Started"
        margin-bottom=""
      >
        Azion's design system for Vue 3 — 100+ accessible, token-driven components, plus the tooling
        that keeps every project on-pattern: an ESLint plugin where every rule is an error, a
        Stylelint config, an MCP server that guides AI coding tools, and a CLI that wires it all in
        one command.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Installation"
        description="Install the packages, then wire lint, MCP, pre-commit and agent docs."
      >
        <CodeBlock
          :tabs="installTabs"
          :border="true"
          :show-line-numbers="false"
          class="h-fit"
        />
      </SectionModule>

      <SectionModule
        title="Add the Azion Theme"
        description="Import the tokens and the icon font in your app entry."
      >
        <CodeBlock
          :tabs="themeTabs"
          :border="true"
          :show-line-numbers="false"
          class="h-fit"
        />
      </SectionModule>

      <SectionModule
        title="Your first component"
        description="Every component is a flat, tree-shakeable import — @aziontech/webkit/name."
      >
        <CodeBlock
          :tabs="usageComponentTabs"
          :border="true"
          :show-line-numbers="false"
          class="h-fit"
        />
        <p class="m-0 mt-[var(--spacing-md)] max-w-[620px] text-body-sm leading-relaxed text-muted">
          Requirements: Vue 3.5+ (components use defineModel and useId) and VeeValidate 4.x for form
          fields.
        </p>
      </SectionModule>

      <SectionModule
        title="Style Guide"
        description="The pattern catalog every component follows — the same rule set the AI pipeline receives, enforced at write time and in CI so off-pattern code never merges."
        :padded="false"
      >
        <CardGrid
          :columns="3"
          variant="divider"
          divider-color="muted"
        >
          <div
            v-for="standard in standards"
            :key="standard.title"
            class="flex flex-col bg-[var(--bg-canvas)] p-[var(--spacing-xl)]"
          >
            <p class="m-0 mb-1.5 text-heading-xxs text-default">{{ standard.title }}</p>
            <p class="m-0 text-body-xxs leading-relaxed text-muted">{{ standard.body }}</p>
          </div>
        </CardGrid>
      </SectionModule>
    </SectionContainer>
  </template>

  <!-- ══ Foundations: one token catalog page per sidebar item ══════════ -->
  <!-- ── All Tokens (Globals) ─────────────────────────────────────────── -->
  <template v-else-if="section === 'tokens'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="All Tokens (Globals)"
        margin-bottom=""
      >
        The global design tokens shipped in @aziontech/theme drive every component. Consume the
        semantic var(--*) tokens (or their Tailwind utilities) — never a raw value — so a single
        source drives both light and dark. Here's where each foundation lives.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Where each foundation lives"
        description="The source of every token family in @aziontech/theme."
      >
        <div
          class="overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)]"
        >
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-[var(--bg-surface)]">
                <th class="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-sm text-muted">
                  Foundation
                </th>
                <th class="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-sm text-muted">
                  Source in @aziontech/theme
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in tokenSources"
                :key="row.page"
                class="border-t border-[var(--border-muted)]"
              >
                <td class="px-[var(--spacing-md)] py-[var(--spacing-sm)] text-body-sm text-default">
                  {{ row.page }}
                </td>
                <td
                  class="px-[var(--spacing-md)] py-[var(--spacing-sm)] font-code text-code text-muted"
                >
                  {{ row.source }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionModule>
    </SectionContainer>
  </template>

  <!-- ── Colors ───────────────────────────────────────────────────────── -->
  <template v-else-if="section === 'colors'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Colors"
        margin-bottom=""
      >
        Every primitive shade scale and brand palette in the Azion theme. Click a swatch value to
        copy its hex; use the semantic tokens in components and keep the primitive shades for
        reference.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Primitives"
        description="The raw shade scales the semantic theme is built from."
      >
        <ColorPaletteSection
          v-for="palette in shadePaletteSections"
          :key="palette.id"
          :title="palette.title"
          :description="palette.description"
          :items="palette.items"
        />
      </SectionModule>

      <SectionModule
        title="Brand"
        description="The Azion brand primitive scales."
      >
        <ColorPaletteSection
          v-for="palette in brandPaletteSections"
          :key="palette.id"
          :title="palette.title"
          :description="palette.description"
          :items="palette.items"
        />
      </SectionModule>
    </SectionContainer>
  </template>

  <!-- ── Typography ───────────────────────────────────────────────────── -->
  <template v-else-if="section === 'typography'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Typography"
        margin-bottom=""
      >
        Semantic text styles generated from the theme text tokens. Each row applies the matching
        .text-* class — click a row to copy its class name.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Text styles"
        description="Every semantic text token, previewed at its own scale."
      >
        <TypographyPreview />
      </SectionModule>
    </SectionContainer>
  </template>

  <!-- ── Theme ────────────────────────────────────────────────────────── -->
  <template v-else-if="section === 'theme'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Theme"
        margin-bottom=""
      >
        Semantic color tokens layered on the primitive palette. Consume these var(--*) tokens (or
        the matching Tailwind utilities) so one theme drives both light and dark — use the header
        theme switcher to preview each token. Click a row to copy its CSS variable.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Semantic tokens"
        description="The theme layer every component consumes, grouped by role."
      >
        <SemanticSwatchGroup
          v-for="group in themeColorGroups"
          :key="group.id"
          :title="group.title"
          :description="group.description"
          :items="group.items"
        />
      </SectionModule>
    </SectionContainer>
  </template>

  <!-- ── Icons ────────────────────────────────────────────────────────── -->
  <template v-else-if="section === 'icons'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Icons"
        margin-bottom=""
      >
        The Azion icon system combines custom product icons with the PrimeIcons library for
        general-purpose UI icons, distributed via @aziontech/icons.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Import"
        description="Pull in the icon font once, in your app entry."
      >
        <CodeBlock
          :tabs="iconImportTabs"
          :border="true"
          :show-line-numbers="false"
          class="h-fit"
        />
      </SectionModule>

      <SectionModule
        title="Usage"
        description="Icons are a font, so they inherit text properties."
      >
        <CodeBlock
          :tabs="iconUsageTabs"
          :border="true"
          :show-line-numbers="false"
          class="h-fit"
        />
        <p class="m-0 mt-[var(--spacing-md)] max-w-[620px] text-body-sm leading-relaxed text-muted">
          Colored brand icons (the -cor set) ship as inline SVG via @aziontech/icons/color-catalog
          and keep their own palette.
        </p>
      </SectionModule>

      <SectionModule
        title="Icon Gallery"
        :description="`Browse all ${icons.length + colorIcons.length} icons. Search by name, and use the slider to adjust preview size.`"
      >
        <IconGrid
          :icons="icons"
          :color-icons="colorIcons"
          :initial-size="24"
        />
      </SectionModule>
    </SectionContainer>
  </template>
</template>
