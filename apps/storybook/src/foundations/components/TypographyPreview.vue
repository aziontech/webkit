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
    class="flex w-full flex-col gap-(--spacing-sm) rounded-(--shape-elements) bg-(--bg-canvas) p-(--spacing-xs)"
  >
    <article
      v-for="item in typographyCatalog"
      :key="item.className"
      class="w-full min-w-0 cursor-pointer overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
      role="button"
      tabindex="0"
      :title="isCopied(item.className) ? 'Copied!' : 'Copy class name'"
      @click="copyToClipboard(item.className, item.className)"
      @keydown.enter.prevent="copyToClipboard(item.className, item.className)"
      @keydown.space.prevent="copyToClipboard(item.className, item.className)"
    >
      <div class="flex min-h-24 w-full items-center px-(--spacing-lg) py-(--spacing-md)">
        <p :class="[item.className, 'm-0 w-full break-words text-(--text-default)']">
          {{ item.sample }}
        </p>
      </div>

      <div
        class="flex items-center justify-between gap-(--spacing-xs) bg-(--bg-mask) px-(--spacing-sm) py-(--spacing-xs) font-code"
      >
        <span class="truncate text-body-xs text-(--text-muted)">{{
          isCopied(item.className) ? 'Copied' : item.className
        }}</span>
      </div>
    </article>

    <article
      class="w-full min-w-0 cursor-pointer overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
      role="button"
      tabindex="0"
      :title="isCopied('text-link') ? 'Copied!' : 'Copy class name'"
      @click="copyToClipboard(typographyLinkDemo.linkClass, 'text-link')"
      @keydown.enter.prevent="copyToClipboard(typographyLinkDemo.linkClass, 'text-link')"
      @keydown.space.prevent="copyToClipboard(typographyLinkDemo.linkClass, 'text-link')"
    >
      <div class="flex min-h-24 w-full items-center px-(--spacing-lg) py-(--spacing-md)">
        <p
          :class="[
            typographyLinkDemo.parentClass,
            'm-0 w-full break-words text-(--text-default)'
          ]"
        >
          {{ typographyLinkDemo.beforeLink }}
          <span :class="typographyLinkDemo.linkClass">{{ typographyLinkDemo.linkLabel }}</span
          >{{ typographyLinkDemo.afterLink }}
        </p>
      </div>

      <div
        class="flex items-center justify-between gap-(--spacing-xs) bg-(--bg-mask) px-(--spacing-sm) py-(--spacing-xs) font-code"
      >
        <span class="truncate text-body-xs text-(--text-muted)">{{
          isCopied('text-link') ? 'Copied' : typographyLinkDemo.linkClass
        }}</span>
      </div>
    </article>
  </div>
</template>
