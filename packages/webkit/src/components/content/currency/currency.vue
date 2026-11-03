<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'

  defineOptions({
    name: 'Currency',
    inheritAttrs: false
  })

  /** Reading distance of the amount, on the house size ladder. */
  export type CurrencySize = 'small' | 'medium' | 'large'

  interface CurrencyProps {
    /** Monetary value content. */
    value?: string
    /** Text displayed before the value. Empty hides the symbol entirely. */
    prefix?: string
    /** Text displayed after the value. Empty hides the unit entirely. */
    suffix?: string
    /** Size token; affects typography and the gap between the figure and the suffix. */
    size?: CurrencySize
    /** Rolls the changed characters of the figure into place when value changes. */
    animated?: boolean
  }

  interface CurrencyRollColumn {
    glyphs: string[]
    from: string
    to: string
    delay: string
  }

  const props = withDefaults(defineProps<CurrencyProps>(), {
    value: '',
    prefix: '$',
    suffix: '',
    size: 'small',
    animated: false
  })

  const attrs = useAttrs()

  const DIGITS = '0123456789'

  const columns = ref<CurrencyRollColumn[]>([])
  const rollKey = ref(0)
  const rolling = ref(false)
  let frame = 0

  const testId = computed(() => attrs['data-testid'] ?? 'content-currency')

  const rolled = computed(() => props.animated && columns.value.length > 0)

  watch(
    () => props.value,
    (next, previous) => {
      if (!props.animated) {
        columns.value = []
        return
      }
      if (next !== previous) roll(previous, next)
    }
  )

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  function amountOf(text: string): number {
    return Number(text.replace(/[^\d.]/g, ''))
  }

  function stepGlyphs(from: string, to: string, upward: boolean): string[] {
    if (from === to) return [to]
    const start = DIGITS.indexOf(from)
    const end = DIGITS.indexOf(to)
    if (!from || start < 0 || end < 0) return [from, to]
    const direction = upward ? 1 : -1
    const steps = (direction * (end - start) + DIGITS.length) % DIGITS.length
    return Array.from(
      { length: steps + 1 },
      (_, step) => DIGITS[(start + direction * step + DIGITS.length) % DIGITS.length]
    )
  }

  function roll(previous: string, next: string) {
    const upward = !(amountOf(next) < amountOf(previous))
    const before = Array.from(previous)
    const after = Array.from(next)
    const offset = after.length - before.length
    let order = 0
    columns.value = after.map((to, index) => {
      const glyphs = stepGlyphs(before[index - offset] ?? '', to, upward)
      const travel = `${(-(glyphs.length - 1) / glyphs.length) * 100}%`
      const delay = `calc(${glyphs.length > 1 ? order++ : 0} * ${duration['fast-01']})`
      return upward
        ? { glyphs, from: '0%', to: travel, delay }
        : { glyphs: [...glyphs].reverse(), from: travel, to: '0%', delay }
    })
    rollKey.value += 1
    rolling.value = false
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        rolling.value = true
      })
    })
  }
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group/currency inline-flex items-center whitespace-nowrap data-[size=small]:gap-(--spacing-xxs) data-[size=medium]:gap-(--spacing-xs) data-[size=large]:items-end data-[size=large]:gap-(--spacing-xs)"
  >
    <span
      class="inline-flex items-center gap-(--spacing-xxs) tabular-nums group-data-[size=large]/currency:gap-0"
    >
      <span
        v-if="prefix"
        class="text-(--text-default) group-data-[size=small]/currency:text-amount-sm group-data-[size=medium]/currency:text-amount-md group-data-[size=large]/currency:text-amount-lg"
        :data-testid="`${testId}__prefix`"
      >
        {{ prefix }}
      </span>
      <span
        class="text-(--text-default) group-data-[size=small]/currency:text-amount-sm group-data-[size=medium]/currency:text-amount-md group-data-[size=large]/currency:text-amount-lg"
        :data-testid="`${testId}__value`"
      >
        <template v-if="rolled">
          <span class="sr-only">{{ value }}</span>
          <span
            aria-hidden="true"
            class="inline-flex align-top"
            :data-testid="`${testId}__roll`"
          >
            <span
              v-for="(column, index) in columns"
              :key="`${rollKey}-${index}`"
              class="inline-block h-[1lh] overflow-hidden"
            >
              <span
                :data-rolling="rolling || null"
                :style="{
                  '--currency-roll-from': column.from,
                  '--currency-roll-to': column.to,
                  transitionDelay: column.delay
                }"
                class="flex translate-y-(--currency-roll-from) flex-col transition-[translate] duration-slow-01 ease-expressive-entrance motion-reduce:transition-none data-rolling:translate-y-(--currency-roll-to)"
              >
                <span
                  v-for="(glyph, step) in column.glyphs"
                  :key="step"
                  class="block h-[1lh] whitespace-pre"
                >
                  {{ glyph }}
                </span>
              </span>
            </span>
          </span>
        </template>
        <template v-else>
          {{ value }}
        </template>
      </span>
    </span>
    <span
      v-if="suffix"
      class="text-(--text-muted) group-data-[size=small]/currency:text-label-code-sm group-data-[size=medium]/currency:text-label-code-md group-data-[size=large]/currency:text-label-code-md group-data-[size=large]/currency:pb-(--spacing-md)"
      :data-testid="`${testId}__suffix`"
    >
      {{ suffix }}
    </span>
  </span>
</template>
