<script setup>
  // The Webkit Hub's "Assets" content views — Brand, Icons and Illustrations — one
  // per sidebar item under the Assets group. Each renders on the Hub's responsive
  // grid, and every tile uses the Documentation card style (bordered surface card
  // that lifts on hover), so the asset pages read like the developer-docs cards.
  //   • Brand — the three Brand lockups (default / reduced / extended).
  //   • Icons — the full @aziontech/icons gallery, reusing the Foundations IconGrid.
  //   • Illustrations — the shipped @aziontech/webkit SVG illustrations.
  import icons from '@aziontech/icons/catalog'
  import colorIcons from '@aziontech/icons/color-catalog'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Error403 from '@aziontech/webkit/svg/error-403'
  import Error404 from '@aziontech/webkit/svg/error-404'
  import IllustrationLayers from '@aziontech/webkit/svg/illustration-layers'

  import IconGrid from './foundations/components/IconGrid.vue'
  import BannerContainer from './foundations/components/layout/BannerContainer.vue'
  import CardGrid from './foundations/components/layout/CardGrid.vue'
  import PageHeader from './foundations/components/layout/PageHeader.vue'
  import SectionContainer from './foundations/components/layout/SectionContainer.vue'
  import SectionModule from './foundations/components/layout/SectionModule.vue'
  import PlatformIllustrations from './PlatformIllustrations.vue'

  defineProps({
    // Which asset gallery to render: 'brand' | 'icons' | 'illustrations'.
    section: { type: String, default: 'brand' }
  })

  // The three Brand lockups the component ships. Each gets its own full-bleed
  // showcase panel (not a card) so the lockup reads at size, edge to edge — the
  // way a brand-guideline page presents a mark. The Azion wordmark carries white
  // strokes, so every panel is a deep, theme-independent dark surface (its proper
  // home): a distinct-but-cohesive on-brand background per lockup.
  const brandLockups = [
    {
      kind: 'default',
      label: 'Default',
      description: 'The AZION wordmark — the primary lockup for most surfaces.',
      background: 'bg-[#0b0b0c]'
    },
    {
      kind: 'reduced',
      label: 'Reduced',
      description: 'The “A” glyph, for tight spaces like avatars and favicons.',
      background:
        'bg-[radial-gradient(80%_80%_at_50%_50%,color-mix(in_srgb,var(--primary)_16%,#0b0b0c),#0b0b0c)]'
    },
    {
      kind: 'extended',
      label: 'Extended',
      description: 'The wordmark with the “move to the edge” technologies tagline.',
      background: 'bg-[linear-gradient(180deg,#141416,#0b0b0c)]'
    }
  ]

  // Shipped @aziontech/webkit SVG illustrations, rendered as live components.
  const illustrations = [
    {
      component: IllustrationLayers,
      label: 'Layers',
      description: 'Layered platform illustration for empty states and onboarding.'
    },
    {
      component: Error404,
      label: 'Error 404',
      description: 'Not-found illustration for missing-page states.'
    },
    {
      component: Error403,
      label: 'Error 403',
      description: 'Forbidden illustration for access-denied states.'
    }
  ]
</script>

<template>
  <!-- ── Brand ──────────────────────────────────────────────────────────────
       Banner header (with the download CTA) closes the top of the framed
       column; the lockup showcase is one edge-to-edge module of stacked
       full-width bands, each on its own deep on-brand surface. -->
  <template v-if="section === 'brand'">
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Brand"
        margin-bottom=""
      >
        The Azion brand lockups shipped by @aziontech/webkit/brand. Keep the mark clear and
        unmodified: don’t recolor, stretch, or crowd it, and place it on a dark, high-contrast
        surface so the wordmark reads. Pick the lockup that fits the space — full wordmark, reduced
        glyph, or the extended tagline — and let the size token scale it.
        <template #actions>
          <Button
            label="Download Brand Assets"
            kind="secondary"
            size="large"
            icon="pi pi-download"
          />
        </template>
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        :padded="false"
        title="Lockups"
        description="The three brand lockups, each shown at size on its own on-brand surface."
      >
        <!-- Flat showcase: stacked full-width bands separated by hairline
             dividers — no card rounding, flush to the module edges. -->
        <div class="divide-y divide-white/[0.08]">
          <div
            v-for="lockup in brandLockups"
            :key="lockup.kind"
            :class="lockup.background"
            class="relative flex min-h-[clamp(240px,34vh,380px)] items-center justify-center overflow-hidden px-[var(--spacing-xl)] py-[var(--spacing-xxl)]"
          >
            <!-- Corner caption, brand-guide style. -->
            <div
              class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-[var(--spacing-md)] px-[var(--spacing-xl)] py-[var(--spacing-lg)]"
            >
              <div class="flex flex-col gap-[var(--spacing-xxs)]">
                <h3 class="text-heading-xxs text-white">{{ lockup.label }}</h3>
                <p class="max-w-sm text-pretty text-body-xs text-white/60">
                  {{ lockup.description }}
                </p>
              </div>
              <span class="shrink-0 text-overline-xs text-white/40"> @aziontech/webkit/brand </span>
            </div>

            <!-- The lockup, rendered large and centered (override the size token's
                 fixed height so the mark fills the showcase). -->
            <Brand
              :kind="lockup.kind"
              size="large"
              class="[&>svg]:!h-14 md:[&>svg]:!h-20 lg:[&>svg]:!h-28"
            />
          </div>
        </div>
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
        The Azion icon system combines custom product icons with the PrimeIcons library, distributed
        via @aziontech/icons. Search by name, adjust the preview size, and click any icon to copy
        its class name.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <SectionModule
        :divided="false"
        title="Icon Gallery"
        :description="`Browse all ${icons.length + colorIcons.length} icons across the font and colored sets.`"
      >
        <IconGrid
          :icons="icons"
          :color-icons="colorIcons"
          :initial-size="24"
        />
      </SectionModule>
    </SectionContainer>
  </template>

  <!-- ── Illustrations ────────────────────────────────────────────────── -->
  <template v-else>
    <BannerContainer max-width="7xl">
      <PageHeader
        size="page"
        title="Illustrations"
        margin-bottom=""
      >
        Two illustration systems: the platform scenes that retell build, deploy, network, AI, secure
        and observe in one token-driven visual language, and the theme-aware SVGs @aziontech/webkit
        ships for empty, error and onboarding states.
      </PageHeader>
    </BannerContainer>

    <SectionContainer max-width="7xl">
      <!-- Platform scenes — token-driven routing graphs. -->
      <SectionModule
        :divided="false"
        title="Platform scenes"
        description="Six views of one platform — a request enters at a source, is routed across the network, and reaches its destinations."
      >
        <PlatformIllustrations :framed="false" />
      </SectionModule>

      <!-- Shipped @aziontech/webkit SVG illustrations. -->
      <SectionModule
        title="Shipped illustrations"
        description="The SVG scenes @aziontech/webkit ships for empty, error and onboarding states. Each scales to its container and follows the active theme."
      >
        <CardGrid :columns="3">
          <div
            v-for="illustration in illustrations"
            :key="illustration.label"
            class="flex flex-col gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-[var(--border-muted)] bg-[var(--bg-surface)] p-[var(--spacing-lg)] transition-[border-color] duration-moderate-01 ease-productive-entrance hover:border-[var(--border-default)] motion-reduce:transition-none"
          >
            <div
              class="flex min-h-48 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)] p-[var(--spacing-lg)]"
            >
              <component
                :is="illustration.component"
                aria-hidden="true"
                class="max-h-40 w-auto max-w-full"
              />
            </div>
            <div class="flex flex-col gap-[var(--spacing-xxs)]">
              <h3 class="text-heading-xxs text-[var(--text-default)]">{{ illustration.label }}</h3>
              <p class="text-pretty text-body-sm text-[var(--text-muted)]">
                {{ illustration.description }}
              </p>
            </div>
          </div>
        </CardGrid>
      </SectionModule>
    </SectionContainer>
  </template>
</template>
