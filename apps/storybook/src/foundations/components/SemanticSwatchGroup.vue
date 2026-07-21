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
  // the color has to be a utility (bg-/text-/border-[var(--…)]) — inline styles
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
      return 'bg-[var(--swatch-on)] text-[var(--swatch-color)] border-2 border-solid border-[var(--border-muted)]'
    }
    if (item.kind === 'border') {
      return 'bg-[var(--bg-canvas)] border-4 border-solid border-[var(--swatch-color)]'
    }
    return 'bg-[var(--swatch-color)] border-2 border-solid border-[var(--border-muted)]'
  }
</script>

<template>
  <section class="mb-[var(--spacing-xxl)]">
    <div class="mb-[var(--spacing-md)]">
      <h2
        class="m-0 mb-[var(--spacing-xs)] border-b border-solid border-[var(--border-default)] pb-[var(--spacing-xs)] text-overline-md! text-[var(--text-muted)]"
      >
        {{ title }}
      </h2>
      <p v-if="description" class="m-0 max-w-[var(--container-3xl)] text-body-sm text-[var(--text-muted)]">
        {{ description }}
      </p>
    </div>

    <div class="overflow-hidden rounded-[var(--shape-card)] border border-solid border-[var(--border-default)] bg-[var(--bg-surface)]">
      <button
        v-for="item in items"
        :key="item.name"
        type="button"
        class="flex w-full items-center gap-[var(--spacing-md)] border-b border-solid border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left last:border-b-0 hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-inset"
        :title="copiedKey === item.name ? 'Copied!' : 'Copy CSS variable'"
        @click="copyToClipboard(item.name)"
      >
        <span
          :style="swatchVars(item)"
          :class="[
            'flex h-9 w-14 shrink-0 items-center justify-center rounded-[var(--shape-elements)] font-code text-body-xs',
            swatchKindClass(item)
          ]"
        >
          <span v-if="item.kind === 'text'">Aa</span>
        </span>

        <code class="w-[var(--container-3xs)] shrink-0 truncate font-code text-body-sm text-[var(--text-default)]">
          {{ copiedKey === item.name ? 'Copied!' : item.name }}
        </code>

        <span class="text-body-sm text-[var(--text-muted)]">{{ item.description }}</span>
      </button>
    </div>
  </section>
</template>
