<script setup>
import { computed, ref } from 'vue'
import { typographyCatalog, typographyLinkDemo } from '@aziontech/theme/tokens/semantic/texts.data'
import { useViewport } from '../composables/useViewport.js'

const { breakpoint } = useViewport()

const viewportTitle = computed(() => {
  if (breakpoint.value === 'tablet') return 'Tablet'
  if (breakpoint.value === 'mobile') return 'Mobile'
  return 'Desktop'
})

const copiedKey = ref(null)
let copyTimeout = null

function copyToClipboard(text, key) {
  navigator.clipboard?.writeText(text).catch(() => {})
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
    class="flex w-full flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] p-[var(--spacing-xs)]"
  >
    <header
      class="flex w-full items-start rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] p-[var(--spacing-lg)]"
    >
      <p class="text-heading-xl m-0 whitespace-nowrap text-[var(--text-default)]">
        {{ viewportTitle }}
      </p>
    </header>

    <div
      v-for="item in typographyCatalog"
      :key="item.className"
      class="flex w-full shrink-0 flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] bg-[var(--bg-surface)] p-[var(--spacing-lg)]"
    >
      <button
        type="button"
        class="group inline-flex w-fit cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 font-inherit"
        :title="`Copy: ${item.className}`"
        @click="copyToClipboard(item.className, item.className)"
      >
        <code
          class="font-code w-fit rounded border border-white/15 bg-white/[0.07] px-1.5 py-0.5 text-[11px] text-code"
        >
          {{ item.className }}
        </code>
        <i
          :class="[
            'pi text-[10px] transition-opacity duration-100',
            isCopied(item.className)
              ? 'pi-check text-success'
              : 'pi-copy opacity-0 group-hover:opacity-50'
          ]"
        />
      </button>

      <p :class="[item.className, 'm-0 break-words text-[var(--text-default)]']">
        {{ item.styleLabel }}
      </p>
    </div>

    <div
      class="flex w-full shrink-0 flex-col gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] bg-[var(--bg-surface)] p-[var(--spacing-lg)]"
    >
      <button
        type="button"
        class="group inline-flex w-fit cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 font-inherit"
        :title="`Copy: ${typographyLinkDemo.linkClass}`"
        @click="copyToClipboard(typographyLinkDemo.linkClass, typographyLinkDemo.linkClass)"
      >
        <code
          class="font-code w-fit rounded border border-white/15 bg-white/[0.07] px-1.5 py-0.5 text-[11px] text-code"
        >
          {{ typographyLinkDemo.linkClass }}
        </code>
        <i
          :class="[
            'pi text-[10px] transition-opacity duration-100',
            isCopied(typographyLinkDemo.linkClass)
              ? 'pi-check text-success'
              : 'pi-copy opacity-0 group-hover:opacity-50'
          ]"
        />
      </button>

      <p :class="[typographyLinkDemo.parentClass, 'm-0 break-words text-[var(--text-default)]']">
        Typography/Body/md with
        <a href="#" class="text-link" @click.prevent>{{ typographyLinkDemo.linkLabel }}</a>
      </p>
    </div>
  </div>
</template>
