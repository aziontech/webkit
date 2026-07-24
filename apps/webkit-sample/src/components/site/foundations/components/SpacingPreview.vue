<script setup>
  import { ref, computed } from 'vue'
  import { useViewport } from '../composables/useViewport.js'
  import { getActiveBreakpoint } from '../utils/from-tokens.js'

  const props = defineProps({
    /** Token from spacings.data.js (via from-tokens.js) */
    token: { type: Object, required: true }
  })

  const { breakpoint } = useViewport()

  const BREAKPOINT_LABELS = {
    _: 'Base',
    sm: 'sm ≥640',
    md: 'md ≥768',
    lg: 'lg ≥1024',
    xl: 'xl ≥1280',
    '2xl': '2xl ≥1536'
  }

  const copiedKey = ref(null)
  let copyTimeout = null

  const activeValue = computed(() => {
    if (typeof window === 'undefined') return props.token.responsive._ ?? ''
    const map = props.token.responsive
    const width = window.innerWidth
    const active = getActiveBreakpoint(width)
    const order = ['_', 'sm', 'md', 'lg', 'xl', '2xl']
    const index = order.indexOf(active)
    for (let i = index; i >= 0; i -= 1) {
      const bp = order[i]
      if (map[bp] !== undefined) return map[bp]
    }
    return ''
  })

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
    class="flex w-full flex-col gap-4 py-5 border-b border-subtle items-start last:border-b-0 sm:flex-row sm:gap-6"
  >
    <div class="flex flex-col w-full gap-1.5 sm:w-80 sm:flex-none">
      <p class="text-sm font-semibold text-default m-0">{{ token.label }}</p>
      <button
        class="inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer font-inherit group"
        @click="copyToClipboard(token.cssVar, token.name)"
        :title="'Copy: ' + token.cssVar"
      >
        <code
          class="font-code text-[11px] bg-white/[0.07] border border-white/15 text-code px-1.5 py-0.5 rounded w-fit"
          >{{ token.cssVar }}</code
        >
        <i
          :class="[
            'pi text-[10px] transition-opacity duration-100',
            isCopied(token.name)
              ? 'pi-check text-success'
              : 'pi-copy opacity-0 group-hover:opacity-50'
          ]"
        />
      </button>
      <button
        class="inline-flex items-center gap-1.5 bg-none border-none p-0 cursor-pointer font-inherit group text-left"
        @click="copyToClipboard(token.usageExample, token.name + '-usage')"
        :title="'Copy usage'"
      >
        <code class="font-code text-[10px] text-muted">{{ token.usageExample }}</code>
      </button>
      <p class="text-xs text-muted m-0 mb-2 leading-relaxed">{{ token.description }}</p>
      <p class="text-[10px] text-muted m-0 font-code">
        Source: packages/theme/src/tokens/semantic/spacings.data.js
      </p>

      <div class="grid grid-cols-2 gap-x-3 gap-y-3 w-full m-0 mt-3">
        <div
          v-for="(value, bp) in token.responsive"
          :key="bp"
          class="flex flex-col gap-0.5"
        >
          <span
            :class="[
              'text-[9px] font-semibold uppercase tracking-wider',
              breakpoint === bp ? 'text-primary' : 'text-muted'
            ]"
            >{{ BREAKPOINT_LABELS[bp] ?? bp }}</span
          >
          <span class="font-code text-[10px] text-muted">{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="flex w-full flex-1">
      <div
        class="bg-surface border border-default rounded-lg p-4 min-h-[80px] flex items-center justify-center w-full"
      >
        <div
          class="w-full"
          :style="{ padding: activeValue }"
        >
          <div
            class="bg-[var(--primary)]/20 rounded border-2 border-dashed border-[var(--border-selected)] bg-surface px-3 py-2 text-center"
          >
            <span class="font-code text-[11px] text-default">{{ activeValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
