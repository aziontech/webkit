<script setup lang="ts">
  import tokens from 'virtual:docs-tokens'
  import { computed } from 'vue'

  import { messages } from '../lib/i18n'
  import { titleCase } from '../lib/nav'
  import { typeGroups, usageSections } from '../lib/tokens'
  import ArchitectureIntro from './tokens/architecture-intro.vue'
  import ColorPlayground from './tokens/color-playground.vue'
  import PaletteStrips from './tokens/palette-strips.vue'
  import TokenTable from './tokens/token-table.vue'

  defineProps<{
    kind: 'color' | 'spacing' | 'typography' | 'radius' | 'shadows' | 'motion' | 'z-index'
  }>()

  const t = messages

  const colorGroups = computed(() =>
    usageSections(tokens.semantic).map((section) => ({
      ...section,
      id: section.ids.join('-'),
      title: section.ids.map(titleCase).join(', ')
    }))
  )
  const rhythm = computed(() => tokens.spacing.filter((token) => token.responsive))
  const scale = computed(() => tokens.spacing.filter((token) => !token.responsive))
  const fontFamilies = computed(() =>
    tokens.fonts.filter((token) => /^--font-(?!weight)/.test(token.name))
  )
  const fontWeights = computed(() =>
    tokens.fonts.filter((token) => token.name.startsWith('--font-weight'))
  )
  const radii = computed(() => tokens.radius.filter((token) => token.name.startsWith('--radius')))
  const shapes = computed(() => tokens.radius.filter((token) => token.name.startsWith('--shape')))
  const shadowGroups = computed(() =>
    [
      { id: 'box', title: t.value.boxShadows, prefix: '--shadow' },
      { id: 'drop', title: t.value.dropShadows, prefix: '--drop-shadow' },
      { id: 'inset', title: t.value.insetShadows, prefix: '--inset-shadow' }
    ]
      .map((group) => ({
        ...group,
        tokens: tokens.shadows.filter((token) => token.name.startsWith(group.prefix))
      }))
      .filter((group) => group.tokens.length)
  )
  const typeSample = computed<Record<string, string>>(() => ({
    heading: t.value.sampleHeading,
    title: t.value.sampleHeading,
    body: t.value.sampleParagraph,
    label: t.value.sampleLabel,
    button: t.value.sampleButton,
    link: t.value.sampleLink,
    tag: t.value.sampleTag,
    overline: t.value.sampleOverline,
    amount: '$1,249.00',
    'big-number': '12,480',
    other: t.value.sampleHeading
  }))

  const sampleFor = (family: string) => typeSample.value[family] ?? t.value.sampleHeading
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <template v-if="kind === 'color'">
      <ArchitectureIntro />
      <ColorPlayground />
      <section
        class="flex flex-col gap-(--spacing-lg)"
        aria-labelledby="semantic-colors"
      >
        <h2
          id="semantic-colors"
          class="text-heading-sm"
        >
          {{ t.semanticColors }}
        </h2>
        <TokenTable
          v-for="group in colorGroups"
          :key="group.id"
          :tokens="group.tokens"
          kind="color"
          sample="swatch"
          :title="group.title"
          :usage="group.usage"
          :caption="group.title"
        />
      </section>
      <section
        class="flex flex-col gap-(--spacing-sm)"
        aria-labelledby="primitive-palette"
      >
        <div class="flex flex-col gap-(--spacing-2xs)">
          <h2
            id="primitive-palette"
            class="text-heading-sm"
          >
            {{ t.primitivePalette }}
          </h2>
          <p class="text-body-sm text-(--text-muted)">{{ t.primitivePaletteLead }}</p>
        </div>
        <PaletteStrips :groups="tokens.palette" />
      </section>
    </template>

    <template v-else-if="kind === 'typography'">
      <TokenTable
        :tokens="fontFamilies"
        kind="font"
        sample="font"
        sample-text="Aa Bb Cc 0123"
        :title="t.fontFamilies"
        :caption="t.fontFamilies"
        :heading-level="2"
      />
      <TokenTable
        :tokens="fontWeights"
        kind="font"
        sample="weight"
        sample-text="Aa"
        :title="t.fontWeights"
        :caption="t.fontWeights"
        :heading-level="2"
      />
      <section class="flex flex-col gap-(--spacing-lg)">
        <div class="flex flex-col gap-(--spacing-2xs)">
          <h2 class="text-heading-sm">{{ t.typeStyles }}</h2>
          <p class="text-body-sm text-(--text-muted)">{{ t.typeStylesLead }}</p>
        </div>
        <TokenTable
          v-for="group in typeGroups(tokens.typography)"
          :key="group.id"
          :tokens="group.vars"
          kind="type"
          sample="type"
          :sample-text="sampleFor(group.id)"
          :title="titleCase(group.id)"
          :caption="titleCase(group.id)"
        />
      </section>
    </template>

    <template v-else-if="kind === 'spacing'">
      <TokenTable
        :tokens="rhythm"
        kind="spacing"
        sample="bar"
        :title="t.spacingRhythm"
        :description="t.spacingRhythmLead"
        :caption="t.spacingRhythm"
        :heading-level="2"
      />
      <TokenTable
        :tokens="scale"
        kind="spacing"
        sample="bar"
        :title="t.spacingScale"
        :caption="t.spacingScale"
        :heading-level="2"
      />
    </template>

    <template v-else-if="kind === 'radius'">
      <TokenTable
        :tokens="radii"
        kind="radius"
        sample="radius"
        :title="t.radiusScale"
        :description="t.radiusScaleLead"
        :caption="t.radiusScale"
        :heading-level="2"
      />
      <TokenTable
        :tokens="shapes"
        kind="radius"
        sample="radius"
        :title="t.shapeTokens"
        :description="t.shapeTokensLead"
        :caption="t.shapeTokens"
        :heading-level="2"
      />
    </template>

    <template v-else-if="kind === 'shadows'">
      <TokenTable
        v-for="group in shadowGroups"
        :key="group.id"
        :tokens="group.tokens"
        kind="shadow"
        sample="shadow"
        :title="group.title"
        :caption="group.title"
        :heading-level="2"
      />
    </template>

    <template v-else-if="kind === 'motion'">
      <TokenTable
        :tokens="tokens.motion.ease"
        kind="ease"
        sample="ease"
        :title="t.easing"
        :caption="t.easing"
        :heading-level="2"
      />
      <TokenTable
        :tokens="tokens.motion.duration"
        kind="duration"
        sample="duration"
        :title="t.duration"
        :caption="t.duration"
        :heading-level="2"
      />
      <TokenTable
        :tokens="tokens.motion.animations"
        kind="animation"
        sample="animation"
        :title="t.animations"
        :description="t.animationsLead"
        :caption="t.animations"
        :heading-level="2"
      />
    </template>

    <TokenTable
      v-else-if="kind === 'z-index'"
      key="z-index"
      :tokens="tokens.zIndex"
      kind="z-index"
      caption="Z-index"
    />
  </div>
</template>
