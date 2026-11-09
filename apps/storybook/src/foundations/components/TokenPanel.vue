<script setup>
  import TokenTable from './TokenTable.vue'

  const props = defineProps({
    /** One token family from data/primitives.js: { title, description, preview, largest, tokens }. */
    family: {
      type: Object,
      required: true
    }
  })

  function scaledWidth(token) {
    if (!props.family.largest || token.px === null) return '0'
    return (token.px / props.family.largest) * 100 + '%'
  }
</script>

<template>
  <TokenTable :rows="family.tokens">
    <template #sample="{ row: token }">
      <span
        v-if="family.preview === 'font-family'"
        class="truncate text-(--text-default)"
        :style="{ fontFamily: token.value, fontSize: 'var(--text-2xl)' }"
        >Azion Web Platform 0123</span
      >

      <span
        v-else-if="family.preview === 'font-size'"
        class="truncate text-(--text-default)"
        :style="{ fontSize: token.value, lineHeight: 'var(--leading-tight)' }"
        >Ag</span
      >

      <span
        v-else-if="family.preview === 'font-weight'"
        class="truncate text-(--text-default)"
        :style="{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-xl)',
          fontWeight: token.value
        }"
        >Azion Web Platform</span
      >

      <span
        v-else-if="family.preview === 'line-height'"
        class="inline-block bg-(--accent-mask) text-(--text-default)"
        :style="{ fontSize: 'var(--text-base)', lineHeight: token.value }"
        >Edge first. Latency last.</span
      >

      <span
        v-else-if="family.preview === 'tracking'"
        class="truncate text-(--text-default)"
        :style="{ fontSize: 'var(--text-2xl)', letterSpacing: token.value }"
        >Azion Web Platform</span
      >

      <span
        v-else-if="family.preview === 'length'"
        class="block h-2 shrink-0 rounded-full bg-(--accent)"
        :style="{ width: token.value }"
      />

      <span
        v-else-if="family.preview === 'square'"
        class="block shrink-0 rounded-(--shape-flat) border border-solid border-(--accent) bg-(--accent-mask)"
        :style="{ width: token.value, height: token.value }"
      />

      <span
        v-else-if="family.preview === 'scaled'"
        class="block h-2 w-full min-w-(--container-3xs) rounded-full bg-(--bg-surface-raised)"
      >
        <span
          class="block h-full rounded-full bg-(--accent)"
          :style="{ width: scaledWidth(token) }"
        />
      </span>

      <span
        v-else-if="family.preview === 'aspect'"
        class="block w-32 shrink-0 rounded-(--shape-elements) border border-solid border-(--accent) bg-(--accent-mask)"
        :style="{ aspectRatio: token.value }"
      />

      <span
        v-else-if="family.preview === 'radius'"
        class="block size-16 shrink-0 border border-solid border-(--accent) bg-(--accent-mask)"
        :style="{ borderRadius: token.value }"
      />

      <span
        v-else-if="family.preview === 'border'"
        class="block size-10 shrink-0 rounded-(--shape-elements) border-solid border-(--accent) bg-(--accent-mask)"
        :style="{ borderWidth: token.value }"
      />

      <span
        v-else-if="family.preview === 'shadow' || family.preview === 'drop-shadow'"
        data-theme="light"
        class="flex size-16 shrink-0 items-center justify-center rounded-(--shape-elements) bg-(--bg-canvas)"
      >
        <span
          v-if="family.preview === 'shadow'"
          class="block size-10 rounded-(--shape-elements) bg-(--bg-surface)"
          :style="{ boxShadow: token.value }"
        />
        <i
          v-else
          class="ai ai-azion text-(--text-default)"
          :style="{ fontSize: 'var(--text-4xl)', filter: 'drop-shadow(' + token.value + ')' }"
        />
      </span>

      <span
        v-else-if="family.preview === 'blur'"
        class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-solid border-(--border-default)"
      >
        <i
          class="ai ai-azion text-(--text-default)"
          :style="{ fontSize: 'var(--text-4xl)', filter: 'blur(' + token.value + ')' }"
        />
      </span>

      <span
        v-else-if="family.preview === 'opacity'"
        class="block size-10 shrink-0 rounded-(--shape-elements) bg-(--accent)"
        :style="{ opacity: token.value }"
      />

      <span
        v-else-if="family.preview === 'perspective'"
        class="flex size-16 shrink-0 items-center justify-center"
        :style="{ perspective: token.value }"
      >
        <span
          class="block size-10 rounded-(--shape-elements) border border-solid border-(--accent) bg-(--accent-mask)"
          :style="{ transform: 'rotateY(50deg)' }"
        />
      </span>

      <span
        v-else-if="family.preview === 'ring-offset'"
        class="block size-10 shrink-0 rounded-(--shape-elements) bg-(--bg-surface-raised)"
        :style="{ outline: '2px solid var(--ring-color)', outlineOffset: token.value }"
      />

      <span
        v-else
        class="font-code text-heading-md text-(--text-default)"
        >{{ token.value }}</span
      >
    </template>
  </TokenTable>
</template>
