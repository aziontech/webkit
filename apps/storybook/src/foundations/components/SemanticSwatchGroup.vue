<script setup>
  import { ref } from 'vue'

  defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    /** Array of { name, description, kind, on }. */
    items: { type: Array, default: () => [] }
  })

  const copiedKey = ref(null)
  let copyTimeout = null

  function copyToClipboard(value) {
    if (!value) return
    navigator.clipboard?.writeText(value).catch(() => {})
    copiedKey.value = value
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedKey.value = null
    }, 1000)
  }

  // The live token is passed as a CSS custom property, then consumed by the
  // token utilities below. Storybook's Tailwind runs with `important: true`, so
  // the color has to be a utility (bg-/text-/border-(--…)) — inline styles
  // would lose to the !important utilities on the same element.
  function swatchVars(item) {
    return {
      '--swatch-color': `var(${item.name})`,
      '--swatch-on': item.on ?? 'var(--bg-surface)'
    }
  }

  // Swatch renders the live token, so it follows the Storybook theme toggle.
  function swatchKindClass(item) {
    if (item.kind === 'text') {
      return 'bg-(--swatch-on) text-(--swatch-color) border-2 border-solid border-(--border-muted)'
    }
    if (item.kind === 'border') {
      return 'bg-(--bg-canvas) border-4 border-solid border-(--swatch-color)'
    }
    return 'bg-(--swatch-color) border-2 border-solid border-(--border-muted)'
  }
</script>

<template>
  <section class="mb-(--spacing-xxl)">
    <div class="mb-(--spacing-md)">
      <h2
        class="m-0 mb-(--spacing-xs) border-b border-solid border-(--border-default) pb-(--spacing-xs) text-overline-md! text-(--text-muted)"
      >
        {{ title }}
      </h2>
      <p v-if="description" class="m-0 max-w-(--container-3xl) text-body-sm text-(--text-muted)">
        {{ description }}
      </p>
    </div>

    <div class="overflow-hidden rounded-(--shape-card) border border-solid border-(--border-default) bg-(--bg-surface)">
      <button
        v-for="item in items"
        :key="item.name"
        type="button"
        class="flex w-full items-center gap-(--spacing-md) border-b border-solid border-(--border-muted) px-(--spacing-md) py-(--spacing-sm) text-left last:border-b-0 hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
        :title="copiedKey === item.name ? 'Copied!' : 'Copy CSS variable'"
        @click="copyToClipboard(item.name)"
      >
        <span
          :style="swatchVars(item)"
          :class="[
            'flex h-9 w-14 shrink-0 items-center justify-center rounded-(--shape-elements) font-code text-body-xs',
            swatchKindClass(item)
          ]"
        >
          <span v-if="item.kind === 'text'">Aa</span>
        </span>

        <code class="w-(--container-3xs) shrink-0 truncate font-code text-body-sm text-(--text-default)">
          {{ copiedKey === item.name ? 'Copied!' : item.name }}
        </code>

        <span class="text-body-sm text-(--text-muted)">{{ item.description }}</span>
      </button>
    </div>
  </section>
</template>
