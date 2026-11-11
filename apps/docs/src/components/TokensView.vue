<script setup lang="ts">
  import tokens from 'virtual:docs-tokens'

  import { titleCase } from '../lib/nav'
  import TokenList from './TokenList.vue'

  defineProps<{
    kind: 'color' | 'spacing' | 'typography' | 'radius' | 'shadows' | 'motion' | 'z-index'
  }>()
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <template v-if="kind === 'color'">
      <section
        v-for="group in tokens.semantic"
        :key="group.id"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-sm">{{ titleCase(group.id) }}</h2>
        <TokenList
          :tokens="group.vars"
          sample="swatch"
          show-dark
        />
      </section>
      <section
        v-for="group in tokens.palette"
        :key="`palette-${group.id}`"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <h2 class="text-heading-sm">Palette: {{ titleCase(group.id) }}</h2>
        <TokenList
          :tokens="group.vars"
          sample="swatch"
        />
      </section>
    </template>

    <template v-else-if="kind === 'typography'">
      <ul class="flex flex-col divide-y divide-(--border-default)">
        <li
          v-for="name in tokens.typography"
          :key="name"
          class="flex flex-col gap-(--spacing-xxs) py-(--spacing-sm)"
        >
          <code class="text-label-code-sm text-(--text-muted)">{{ name }}</code>
          <span :class="name">The edge is where your users are</span>
        </li>
      </ul>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Font, tracking and leading</h2>
        <TokenList
          :tokens="tokens.fonts"
          sample="none"
        />
      </section>
    </template>

    <TokenList
      key="token-list-1"
      v-else-if="kind === 'spacing'"
      :tokens="tokens.spacing"
      sample="bar"
    />

    <template v-else-if="kind === 'radius'">
      <TokenList
        :tokens="tokens.radius"
        sample="radius"
      />
    </template>

    <TokenList
      key="token-list-2"
      v-else-if="kind === 'shadows'"
      :tokens="tokens.shadows"
      sample="shadow"
    />

    <template v-else-if="kind === 'motion'">
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Easing</h2>
        <TokenList
          :tokens="tokens.motion.ease"
          sample="none"
        />
      </section>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Duration</h2>
        <TokenList
          :tokens="tokens.motion.duration"
          sample="none"
        />
      </section>
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Animations</h2>
        <ul class="grid grid-cols-1 gap-(--spacing-xs) md:grid-cols-2">
          <li
            v-for="animation in tokens.motion.animations"
            :key="animation.name"
            class="flex flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) p-(--spacing-sm)"
          >
            <code class="text-label-code-sm">animate-{{ animation.name }}</code>
            <code class="text-label-code-sm text-(--text-muted)">{{ animation.value }}</code>
            <p class="text-body-sm text-(--text-muted)">{{ animation.useWhen }}</p>
          </li>
        </ul>
      </section>
    </template>

    <template v-else-if="kind === 'z-index'">
      <TokenList
        :tokens="tokens.zIndex"
        sample="none"
      />
      <section class="flex flex-col gap-(--spacing-sm)">
        <h2 class="text-heading-sm">Breakpoints</h2>
        <TokenList
          :tokens="tokens.breakpoints"
          sample="none"
        />
      </section>
    </template>
  </div>
</template>
