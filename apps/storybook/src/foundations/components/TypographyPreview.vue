<script setup>
import { ref } from 'vue'

import { typographyCatalog, typographyLinkDemo } from '../data/typography.js'

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
</script>

<template>
  <div
    class="flex w-full flex-col gap-[var(--spacing-sm)] rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] p-[var(--spacing-xs)]"
  >
    <article
      v-for="item in typographyCatalog"
      :key="item.className"
      class="w-full min-w-0 cursor-pointer overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)]"
      role="button"
      tabindex="0"
      :title="isCopied(item.className) ? 'Copied!' : 'Copy class name'"
      @click="copyToClipboard(item.className, item.className)"
      @keydown.enter.prevent="copyToClipboard(item.className, item.className)"
      @keydown.space.prevent="copyToClipboard(item.className, item.className)"
    >
      <div class="flex min-h-24 w-full items-center px-[var(--spacing-lg)] py-[var(--spacing-md)]">
        <p :class="[item.className, 'm-0 w-full break-words text-[var(--text-default)]']">
          {{ item.sample }}
        </p>
      </div>

      <div
        class="flex items-center justify-between gap-[var(--spacing-xs)] bg-[var(--bg-mask)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] font-code"
      >
        <span class="truncate text-body-xs text-[var(--text-muted)]">{{
          isCopied(item.className) ? 'Copied' : item.className
        }}</span>
      </div>
    </article>

    <article
      class="w-full min-w-0 cursor-pointer overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)]"
      role="button"
      tabindex="0"
      :title="isCopied('text-link') ? 'Copied!' : 'Copy class name'"
      @click="copyToClipboard(typographyLinkDemo.linkClass, 'text-link')"
      @keydown.enter.prevent="copyToClipboard(typographyLinkDemo.linkClass, 'text-link')"
      @keydown.space.prevent="copyToClipboard(typographyLinkDemo.linkClass, 'text-link')"
    >
      <div class="flex min-h-24 w-full items-center px-[var(--spacing-lg)] py-[var(--spacing-md)]">
        <p
          :class="[typographyLinkDemo.parentClass, 'm-0 w-full break-words text-[var(--text-default)]']"
        >
          {{ typographyLinkDemo.beforeLink }}
          <span :class="typographyLinkDemo.linkClass">{{ typographyLinkDemo.linkLabel }}</span
          >{{ typographyLinkDemo.afterLink }}
        </p>
      </div>

      <div
        class="flex items-center justify-between gap-[var(--spacing-xs)] bg-[var(--bg-mask)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] font-code"
      >
        <span class="truncate text-body-xs text-[var(--text-muted)]">{{
          isCopied('text-link') ? 'Copied' : typographyLinkDemo.linkClass
        }}</span>
      </div>
    </article>
  </div>
</template>
