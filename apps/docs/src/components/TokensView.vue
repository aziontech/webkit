<script setup lang="ts">
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import tokens from 'virtual:docs-tokens'
  import { computed, ref } from 'vue'

  import { messages } from '../lib/i18n'
  import { titleCase } from '../lib/nav'
  import { copyValue } from '../lib/tokens'
  import ArchitectureIntro from './tokens/ArchitectureIntro.vue'
  import ColorPlayground from './tokens/ColorPlayground.vue'
  import CopyChip from './tokens/CopyChip.vue'
  import PaletteStrips from './tokens/PaletteStrips.vue'
  import SpacingRhythm from './tokens/SpacingRhythm.vue'
  import ThemePairs from './tokens/ThemePairs.vue'
  import TokenTable from './tokens/TokenTable.vue'

  defineProps<{
    kind: 'color' | 'spacing' | 'typography' | 'radius' | 'shadows' | 'motion' | 'z-index'
  }>()

  const t = messages
  const colorView = ref<'table' | 'theme'>('table')
  const views = computed(() => [
    { label: t.value.tableView, value: 'table' },
    { label: t.value.themeView, value: 'theme' }
  ])

  const rhythm = computed(() => tokens.spacing.filter((token) => token.responsive))
  const scale = computed(() => tokens.spacing.filter((token) => !token.responsive))
  const fontFamilies = computed(() =>
    tokens.fonts.filter((token) => token.name.startsWith('--font'))
  )
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <p class="text-body-sm text-(--text-muted)">{{ t.copyHint }}</p>

    <template v-if="kind === 'color'">
      <ArchitectureIntro />
      <ColorPlayground />
      <section
        class="flex flex-col gap-(--spacing-md)"
        aria-labelledby="semantic-colors"
      >
        <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
          <h2
            id="semantic-colors"
            class="text-heading-sm"
          >
            {{ t.semanticColors }}
          </h2>
          <ToggleGroup
            v-model="colorView"
            :options="views"
            :aria-label="t.view"
            size="small"
          />
        </div>
        <section
          v-for="group in tokens.semantic"
          :key="group.id"
          class="flex flex-col gap-(--spacing-sm)"
        >
          <h3 class="text-label-md">{{ titleCase(group.id) }}</h3>
          <TokenTable
            v-if="colorView === 'table'"
            :tokens="group.vars"
            kind="color"
            sample="swatch"
            :caption="titleCase(group.id)"
          />
          <ThemePairs
            v-else
            :tokens="group.vars"
          />
        </section>
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
      <ul class="flex flex-col divide-y divide-(--border-default)">
        <li
          v-for="name in tokens.typography"
          :key="name"
        >
          <button
            type="button"
            class="flex w-full flex-col gap-(--spacing-2xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-sm) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="copyValue(name)"
          >
            <code class="text-label-code-sm text-(--text-muted)">{{ name }}</code>
            <span :class="name">{{ t.sampleText }}</span>
          </button>
        </li>
      </ul>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Font families</h2>
        <TokenTable
          :tokens="fontFamilies"
          kind="font"
          sample="none"
          caption="Font families"
        />
      </section>
    </template>

    <template v-else-if="kind === 'spacing'">
      <section class="flex flex-col gap-(--spacing-sm)">
        <div class="flex flex-col gap-(--spacing-2xs)">
          <h2 class="text-heading-sm">{{ t.spacingRhythm }}</h2>
          <p class="text-body-sm text-(--text-muted)">{{ t.spacingRhythmLead }}</p>
        </div>
        <SpacingRhythm :tokens="rhythm" />
      </section>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">{{ t.spacingScale }}</h2>
        <TokenTable
          :tokens="scale"
          kind="spacing"
          sample="bar"
          :caption="t.spacingScale"
        />
      </section>
    </template>

    <TokenTable
      v-else-if="kind === 'radius'"
      key="radius"
      :tokens="tokens.radius"
      kind="radius"
      sample="radius"
      caption="Radius"
    />

    <TokenTable
      v-else-if="kind === 'shadows'"
      key="shadows"
      :tokens="tokens.shadows"
      kind="shadow"
      sample="shadow"
      caption="Shadows"
    />

    <template v-else-if="kind === 'motion'">
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Easing</h2>
        <TokenTable
          :tokens="tokens.motion.ease"
          kind="ease"
          sample="none"
          caption="Easing"
        />
      </section>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Duration</h2>
        <TokenTable
          :tokens="tokens.motion.duration"
          kind="duration"
          sample="none"
          caption="Duration"
        />
      </section>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Animations</h2>
        <ul class="grid grid-cols-1 gap-(--spacing-xs) md:grid-cols-2">
          <li
            v-for="animation in tokens.motion.animations"
            :key="animation.name"
            class="flex flex-col items-start gap-(--spacing-2xs) rounded-(--shape-card) border border-(--border-default) p-(--spacing-sm)"
          >
            <CopyChip :value="`animate-${animation.name}`" />
            <code class="text-label-code-sm text-(--text-muted)">{{ animation.value }}</code>
            <p class="text-body-sm text-(--text-muted)">{{ animation.useWhen }}</p>
          </li>
        </ul>
      </section>
    </template>

    <template v-else-if="kind === 'z-index'">
      <TokenTable
        :tokens="tokens.zIndex"
        kind="z-index"
        sample="none"
        caption="Z-index"
      />
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Breakpoints</h2>
        <TokenTable
          :tokens="tokens.breakpoints"
          kind="breakpoint"
          sample="none"
          caption="Breakpoints"
        />
      </section>
    </template>
  </div>
</template>
