<script setup>
  import { ref } from 'vue'

  defineProps({
    title: { type: String, required: true },
    items: { type: Array, default: () => [] }
  })

  const copiedKey = ref(null)
  let copyTimeout = null

  function copyToClipboard(value, key) {
    if (!value) return
    navigator.clipboard?.writeText(value).catch(() => {})
    copiedKey.value = key
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedKey.value = null
    }, 1000)
  }

  function isCopied(key) {
    return copiedKey.value === key
  }

  function labelColor(hex) {
    const value = (hex ?? '').replace('#', '').slice(0, 6)
    if (value.length < 6) return '#fff'
    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)
    return 0.299 * r + 0.587 * g + 0.114 * b > 140 ? '#000' : '#fff'
  }
</script>

<template>
  <section class="mb-[var(--spacing-xxl)]">
    <div class="mb-[var(--spacing-md)]">
      <h2
        class="m-0 mb-[var(--spacing-xs)] border-b border-[var(--border-default)] pb-[var(--spacing-xs)] !text-overline-md text-[var(--text-muted)]"
      >
        {{ title }}
      </h2>
    </div>

    <div class="flex w-full flex-row flex-wrap gap-[var(--spacing-sm)]">
      <article
        v-for="item in items"
        :key="item.id"
        class="w-full min-w-[var(--container-3xs)] flex-1 cursor-pointer overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)]"
        role="button"
        tabindex="0"
        :title="isCopied(`${item.id}-value`) ? 'Copied!' : 'Copy variable name'"
        @click="copyToClipboard(item.meta ?? item.value, `${item.id}-value`)"
        @keydown.enter.prevent="copyToClipboard(item.meta ?? item.value, `${item.id}-value`)"
        @keydown.space.prevent="copyToClipboard(item.meta ?? item.value, `${item.id}-value`)"
      >
        <div
          class="flex h-24 flex-col px-[var(--spacing-sm)] py-[var(--spacing-xs)] font-code"
          :style="{ background: item.preview ?? item.value ?? 'transparent' }"
        >
          <span
            class="font-code text-body-xs font-semibold"
            :style="{ color: labelColor(item.preview ?? item.value) }"
          >
            {{ item.label }}
          </span>
          <span
            class="font-code text-body-xs"
            :style="{ color: labelColor(item.preview ?? item.value) }"
          >
            {{ isCopied(`${item.id}-value`) ? 'Copied' : item.value }}
          </span>
        </div>

        <div
          class="flex items-center justify-between gap-[var(--spacing-xs)] bg-[var(--bg-mask)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] font-code"
        >
          <span class="truncate text-body-xs text-[var(--text-muted)]">{{ item.meta }}</span>
        </div>
      </article>
    </div>
  </section>
</template>
