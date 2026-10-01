<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Avatar from '../../avatar/avatar.vue'

  defineOptions({
    name: 'Quote',
    inheritAttrs: false
  })

  /** Register of the quote. */
  export type QuoteKind = 'inline' | 'signed' | 'highlight'

  interface Props {
    /** The quotation itself, rendered as the `blockquote` body; overridden by the default slot. */
    text: string
    /** Who said it — the attribution's lead, set in the accent. */
    name?: string
    /** Their role and company, as one line — the attribution's second part. Named jobTitle, not role, because role is the ARIA attribute and a prop of that name reads as one to both tooling and the consumer. */
    jobTitle?: string
    /** URL of the person's likeness, drawn beside the attribution by `highlight`; without one the attribution stands alone. */
    photo?: string
    /** URL of the company mark; ignored when the mark slot is filled. */
    logo?: string
    /** Alternative text for the mark; falls back to `jobTitle` when empty. */
    logoAlt?: string
    /** Phrases of `text` kept in the default ink while the rest of the quotation recedes to the muted one; each is matched verbatim, and an empty list leaves the whole quotation in the default ink. Ignored when the default slot is filled. */
    highlights?: string[]
    /** Register of the quote: `inline` is the quiet unit inside a larger band, `signed` the band-sized client sentence, `highlight` the featured one. */
    kind?: QuoteKind
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    jobTitle: '',
    photo: '',
    logo: '',
    logoAlt: '',
    highlights: () => [],
    kind: 'inline'
  })

  const slots = defineSlots<{
    /** Quotation body; replaces the `text` prop when provided. */
    default?(): unknown
    /** The company mark; replaces the image built from `logo`, for a mark that owns its own theming. */
    mark?(): unknown
    /** A trailing control under the attribution, floored so a row of quotes aligns on it. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-quote')

  const hasMark = computed<boolean>(() => Boolean(slots.mark) || props.logo.length > 0)

  const hasAttribution = computed<boolean>(() => props.name.length > 0 || props.jobTitle.length > 0)

  interface QuoteSegment {
    text: string
    highlight: boolean
  }

  const phrases = computed<string[]>(() =>
    [...new Set(props.highlights.filter((phrase) => phrase.length > 0))].sort(
      (a, b) => b.length - a.length
    )
  )

  const segments = computed<QuoteSegment[]>(() => {
    if (phrases.value.length === 0) return [{ text: props.text, highlight: false }]
    const escaped = phrases.value.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    return props.text
      .split(new RegExp(`(${escaped.join('|')})`))
      .filter((part) => part.length > 0)
      .map((part) => ({ text: part, highlight: phrases.value.includes(part) }))
  })

  const highlighted = computed<boolean>(() => segments.value.some((segment) => segment.highlight))
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    class="group m-0 flex flex-col data-[kind=inline]:gap-(--spacing-lg) data-[kind=signed]:gap-(--spacing-sm) data-[kind=highlight]:gap-(--spacing-xl) data-[kind=highlight]:md:flex-row data-[kind=highlight]:md:flex-wrap data-[kind=highlight]:md:items-start"
  >
    <div
      v-if="hasMark"
      class="group-data-[kind=inline]:flex group-data-[kind=inline]:h-6 group-data-[kind=inline]:items-center group-data-[kind=signed]:pb-(--spacing-md) group-data-[kind=highlight]:md:order-last group-data-[kind=highlight]:md:w-72 group-data-[kind=highlight]:md:shrink-0 group-data-[kind=highlight]:md:pt-[calc(1.5rem+var(--spacing-md))]"
    >
      <slot name="mark">
        <img
          :src="logo"
          :alt="logoAlt || jobTitle"
          loading="lazy"
          decoding="async"
          class="h-8 w-fit max-w-(--size-40) object-contain group-data-[kind=inline]:h-full group-data-[kind=highlight]:md:h-auto group-data-[kind=highlight]:md:max-h-24 group-data-[kind=highlight]:md:w-full group-data-[kind=highlight]:md:max-w-none"
        />
      </slot>
    </div>

    <div
      class="flex min-w-0 flex-col group-data-[kind=inline]:gap-(--spacing-md) group-data-[kind=signed]:gap-(--spacing-sm) group-data-[kind=highlight]:flex-1 group-data-[kind=highlight]:gap-(--spacing-xl)"
    >
      <div
        class="flex flex-col group-data-[kind=signed]:gap-(--spacing-xs) group-data-[kind=highlight]:gap-(--spacing-md)"
      >
        <svg
          v-if="kind !== 'inline'"
          viewBox="0 0 34 22"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          class="w-auto shrink-0 self-start text-(--text-muted) group-data-[kind=signed]:h-4 group-data-[kind=highlight]:h-6"
        >
          <path
            d="M29.56 21.89H25.81C24.62 21.89 23.59 21.44 22.72 20.53C21.84 19.66 21.41 18.62 21.41 17.44V8.16C21.41 6.97 21.84 5.94 22.72 5.06L26.75 1.03C27.44 0.34 28.31 0 29.38 0C30.34 0 31.17 0.34 31.86 1.03C32.55 1.72 32.89 2.55 32.89 3.52C32.89 4.58 32.55 5.45 31.86 6.14L28.58 9.38H29.56C30.75 9.38 31.77 9.8 32.61 10.64C33.45 11.52 33.88 12.55 33.88 13.73V17.44C33.88 18.66 33.45 19.7 32.61 20.58C31.77 21.45 30.75 21.89 29.56 21.89Z"
          />
          <path
            d="M8.16 21.89H4.41C3.22 21.89 2.19 21.44 1.31 20.53C0.44 19.66 0 18.62 0 17.44L0 8.16C0 6.97 0.44 5.94 1.31 5.06L5.34 1.03C6.03 0.34 6.91 0 7.97 0C8.94 0 9.77 0.34 10.45 1.03C11.14 1.72 11.48 2.55 11.48 3.52C11.48 4.58 11.14 5.45 10.45 6.14L7.17 9.38H8.16C9.34 9.38 10.36 9.8 11.2 10.64C12.05 11.52 12.47 12.55 12.47 13.73V17.44C12.47 18.66 12.05 19.7 11.2 20.58C10.36 21.45 9.34 21.89 8.16 21.89Z"
          />
        </svg>

        <blockquote
          :data-highlighted="(!slots.default && highlighted) || null"
          class="m-0 text-(--text-default) data-[highlighted]:text-(--text-muted) group-data-[kind=inline]:text-heading-xs group-data-[kind=signed]:text-body-lg group-data-[kind=highlight]:max-w-(--container-2xl) group-data-[kind=highlight]:text-heading-lg"
        >
          <slot
            ><template v-if="highlighted"
              ><span
                v-for="(segment, index) in segments"
                :key="index"
                :data-highlight="segment.highlight || null"
                class="data-[highlight]:text-(--text-default)"
                >{{ segment.text }}</span
              ></template
            ><template v-else>{{ text }}</template></slot
          >
        </blockquote>
      </div>

      <figcaption
        v-if="hasAttribution"
        class="flex items-center gap-(--spacing-md)"
      >
        <span
          v-if="kind === 'highlight' && photo"
          aria-hidden="true"
        >
          <Avatar
            :src="photo"
            kind="square"
            size="large"
          />
        </span>
        <span
          class="flex min-w-0 flex-col text-overline-md group-data-[kind=inline]:gap-(--spacing-md) group-data-[kind=signed]:gap-(--spacing-md)"
        >
          <span
            v-if="name"
            class="px-(--spacing-xxs) text-(--primary)"
            >{{ name }}</span
          >
          <span
            v-if="jobTitle"
            class="px-(--spacing-xxs) text-(--text-muted)"
            >{{ jobTitle }}</span
          >
        </span>
      </figcaption>
    </div>

    <div
      v-if="slots.actions"
      class="mt-auto pt-(--spacing-md) group-data-[kind=highlight]:md:order-last group-data-[kind=highlight]:md:basis-full"
    >
      <slot name="actions" />
    </div>
  </figure>
</template>
