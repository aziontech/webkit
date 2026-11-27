<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { intlLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'

  defineOptions({
    name: 'Rating',
    inheritAttrs: false
  })

  /** Star size: 16, 20 or 24 px glyphs in 24, 28 or 32 px targets. */
  export type RatingSize = 'small' | 'medium' | 'large'

  export interface RatingProps {
    /** Number of stars, the highest score. Rounded to a whole number and kept between 1 and 10. */
    max?: number
    /** Star size: 16, 20 or 24 px glyphs in 24, 28 or 32 px targets. */
    size?: RatingSize
    /** Form field name shared by every star radio; the score submits under it. Empty uses a generated name so the radios still group. */
    name?: string
    /** Shows the score instead of asking for it: no radios, the value rounded to the nearest half star, announced as one image. */
    readonly?: boolean
    /** Disables every star and the clear button; the row shows at 50 % opacity with a not-allowed cursor. */
    disabled?: boolean
    /** Requires a score: sets aria-required on the group and required on the radios, so a native form blocks an empty submit. */
    required?: boolean
    /** Marks the rating invalid: sets aria-invalid on the group and draws the empty stars in the danger mark colour. */
    invalid?: boolean
    /** Shows a clear button after the stars that resets the score to 0 and moves focus to the first star. Not shown while readonly. */
    clearable?: boolean
  }

  const props = withDefaults(defineProps<RatingProps>(), {
    max: 5,
    size: 'medium',
    name: '',
    readonly: false,
    disabled: false,
    required: false,
    invalid: false,
    clearable: false
  })

  const emit = defineEmits<{
    /** A star was picked with a click, a tap, Enter or Space; not fired while the arrow keys move the score. Send the score here when the pick is the answer. */
    select: [event: MouseEvent | KeyboardEvent, value: number]
  }>()

  /** The score; 0 means no score. Picking a star sets its whole number, the clear button sets 0. */
  const model = defineModel<number>({ default: 0 })

  const attrs = useAttrs()
  const attr = (key: string): string | undefined => {
    const value = attrs[key]
    return typeof value === 'string' ? value : undefined
  }
  const uid = useId()
  const generatedName = `rating-${uid}`
  const summaryId = `${uid}-summary`
  const { t, locale } = useTranslate({ rating: en.rating })

  const field = useFieldControl({
    id: () => attr('id'),
    describedBy: () => attr('aria-describedby'),
    labelledBy: () => attr('aria-labelledby'),
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  const hovered = ref<number | null>(null)
  const controlEls = ref<HTMLInputElement[]>([])

  const testId = computed(() => attr('data-testid') ?? 'rating')
  const count = computed(() => Math.min(10, Math.max(1, Math.round(props.max) || 1)))
  const stars = computed(() => Array.from({ length: count.value }, (_, index) => index + 1))
  const groupName = computed(() => props.name || generatedName)
  const score = computed(() => Math.round(model.value || 0))
  const halfScore = computed(() =>
    Math.min(count.value, Math.max(0, Math.round((model.value || 0) * 2) / 2))
  )
  const isInput = computed(() => !props.readonly)
  const isInvalid = computed(() => isInput.value && field.invalid.value)
  const isRequired = computed(() => isInput.value && field.required.value)

  const shown = computed(() => {
    const value = props.readonly ? halfScore.value : (hovered.value ?? score.value)
    return Math.min(count.value, Math.max(0, value))
  })

  const fillOf = (n: number): 'full' | 'half' | 'empty' => {
    if (shown.value >= n) return 'full'
    if (props.readonly && shown.value >= n - 0.5) return 'half'
    return 'empty'
  }

  const glyphOf = (n: number): string => {
    const fill = fillOf(n)
    if (fill === 'full') return 'az az-star-fill'
    if (fill === 'half') return 'az az-star-half-fill rtl:-scale-x-100'
    return 'az az-star'
  }

  const summary = computed(() => {
    if (halfScore.value === 0) return t('rating.empty')
    const format = new Intl.NumberFormat(intlLocale(locale.value), { maximumFractionDigits: 1 })
    return t('rating.value', {
      value: format.format(halfScore.value),
      max: format.format(count.value)
    })
  })

  const labelledBy = computed(() => {
    if (props.readonly) return [field.labelledBy.value, summaryId].filter(Boolean).join(' ')
    return attrs['aria-label'] ? undefined : field.labelledBy.value
  })

  const onPointerenter = (event: PointerEvent, n: number): void => {
    if (event.pointerType !== 'mouse' || field.disabled.value || props.readonly) return
    hovered.value = n
  }

  const onPointerleave = (): void => {
    hovered.value = null
  }

  const onChange = (n: number): void => {
    if (field.disabled.value) return
    model.value = n
  }

  const onClick = (event: MouseEvent, n: number): void => {
    if (event.detail === 0 || field.disabled.value) return
    model.value = n
    emit('select', event, n)
  }

  const onKeydown = (event: KeyboardEvent, n: number): void => {
    if ((event.key !== 'Enter' && event.key !== ' ') || field.disabled.value) return
    model.value = n
    emit('select', event, n)
  }

  const onClear = async (): Promise<void> => {
    model.value = 0
    await nextTick()
    controlEls.value[0]?.focus()
  }

  const ROOT_CLASS =
    'group/rating inline-flex items-center gap-(--spacing-2xs) data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'

  const STAR_CLASS =
    'relative inline-flex shrink-0 items-center justify-center rounded-(--shape-button) ' +
    'group-data-[size=small]/rating:size-6 group-data-[size=medium]/rating:size-7 group-data-[size=large]/rating:size-8'

  const TARGET_CLASS =
    'cursor-pointer pointer-coarse:group-data-[size=small]/rating:size-11 pointer-coarse:group-data-[size=medium]/rating:size-11 ' +
    'pointer-coarse:group-data-[size=large]/rating:size-11 hover:bg-(--bg-hover) has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 ' +
    'has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-(--bg-canvas) ' +
    'group-data-[disabled]/rating:cursor-not-allowed group-data-[disabled]/rating:hover:bg-transparent'

  const GLYPH_CLASS =
    'leading-none transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'group-data-[size=small]/rating:text-[1rem] group-data-[size=medium]/rating:text-[1.25rem] group-data-[size=large]/rating:text-[1.5rem] ' +
    'data-[fill=full]:text-(--warning-mark) data-[fill=half]:text-(--warning-mark) data-[fill=empty]:text-(--text-muted) ' +
    'group-data-[invalid]/rating:data-[fill=empty]:text-(--danger-mark)'
</script>

<template>
  <div
    v-bind="$attrs"
    :role="readonly ? 'img' : 'radiogroup'"
    :id="field.controlId.value"
    :aria-label="readonly ? undefined : attr('aria-label')"
    :aria-labelledby="labelledBy || undefined"
    :aria-describedby="field.describedBy.value"
    :aria-required="isRequired || undefined"
    :aria-invalid="isInvalid || undefined"
    :data-testid="testId"
    :data-size="size"
    :data-readonly="readonly || null"
    :data-disabled="field.disabled.value || null"
    :data-required="isRequired || null"
    :data-invalid="isInvalid || null"
    :data-preview="(isInput && hovered !== null) || null"
    :class="ROOT_CLASS"
  >
    <template v-if="readonly">
      <span
        :id="summaryId"
        class="sr-only"
        :data-testid="`${testId}__summary`"
        >{{ summary }}</span
      >
      <span class="inline-flex items-center">
        <span
          v-for="n in stars"
          :key="n"
          :class="STAR_CLASS"
          :data-testid="`${testId}__star`"
        >
          <i
            aria-hidden="true"
            :data-fill="fillOf(n)"
            :class="[glyphOf(n), GLYPH_CLASS]"
          />
        </span>
      </span>
    </template>
    <template v-else>
      <span
        class="inline-flex items-center"
        @pointerleave="onPointerleave"
      >
        <label
          v-for="n in stars"
          :key="n"
          :class="[STAR_CLASS, TARGET_CLASS]"
          :data-checked="n === score || null"
          :data-testid="`${testId}__star`"
          @pointerenter="(event: PointerEvent) => onPointerenter(event, n)"
        >
          <input
            ref="controlEls"
            type="radio"
            :name="groupName"
            :value="n"
            :checked="n === score"
            :disabled="field.disabled.value"
            :required="isRequired || undefined"
            :aria-label="t('rating.star', { count: n })"
            :data-testid="`${testId}__control`"
            class="absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
            @change="onChange(n)"
            @click="(event: MouseEvent) => onClick(event, n)"
            @keydown="(event: KeyboardEvent) => onKeydown(event, n)"
          />
          <i
            aria-hidden="true"
            :data-fill="fillOf(n)"
            :class="[glyphOf(n), GLYPH_CLASS]"
          />
        </label>
      </span>
      <IconButton
        v-if="clearable"
        icon="az az-x"
        variant="ghost"
        size="small"
        :aria-label="t('rating.clear')"
        :disabled="field.disabled.value || score === 0"
        :data-testid="`${testId}__clear`"
        @click="onClear"
      />
    </template>
  </div>
</template>
