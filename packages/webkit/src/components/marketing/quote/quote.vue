<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Avatar from '../../avatar/avatar.vue'
  import Overline from '../../overline/overline.vue'
  import TextureMaterial from '../texture-material/texture-material.vue'

  defineOptions({
    name: 'Quote',
    inheritAttrs: false
  })

  /** Register of the quote. */
  export type QuoteKind = 'inline' | 'signed' | 'highlight'

  interface Props {
    /** The quotation itself, rendered as the `blockquote` body; overridden by the default slot. */
    text: string
    /** Who said it — the attribution's lead, and the source of the initials fallback in `highlight`. */
    name?: string
    /** Their role and company, as one line — the attribution's second part. Named jobTitle, not role, because role is the ARIA attribute and a prop of that name reads as one to both tooling and the consumer. */
    jobTitle?: string
    /** URL of the person's likeness, drawn by `highlight`; without one that register shows their initials. */
    photo?: string
    /** URL of the company mark; ignored when the mark slot is filled. */
    logo?: string
    /** Alternative text for the mark; falls back to `jobTitle` when empty. */
    logoAlt?: string
    /** Register of the quote: `inline` is the quiet unit inside a larger band, `signed` the band-sized client sentence, `highlight` the featured one. */
    kind?: QuoteKind
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    jobTitle: '',
    photo: '',
    logo: '',
    logoAlt: '',
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

  const initials = computed(() => {
    const words = props.name.trim().split(/\s+/)
    const first = words.at(0)?.at(0) ?? ''
    const last = words.length > 1 ? (words.at(-1)?.at(0) ?? '') : ''
    return `${first}${last}`
  })
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    class="group m-0 flex flex-col data-[kind=inline]:gap-(--spacing-sm) data-[kind=signed]:gap-(--spacing-xl) data-[kind=highlight]:gap-(--spacing-xl)"
  >
    <div
      v-if="kind === 'highlight' && hasMark"
      class="relative flex size-48 items-center justify-center self-start"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 [--texture-ink:color-mix(in_srgb,var(--text-default)_32%,transparent)] mask-[radial-gradient(closest-side,black_10%,transparent_100%)]"
      >
        <TextureMaterial
          kind="grid"
          size="small"
        />
      </div>

      <div class="relative">
        <slot name="mark">
          <img
            :src="logo"
            :alt="logoAlt || jobTitle"
            loading="lazy"
            decoding="async"
            class="size-24 rounded-(--shape-card) object-contain shadow-(--shadow-sm)"
          />
        </slot>
      </div>
    </div>

    <div
      v-else-if="hasMark"
      class="group-data-[kind=inline]:mb-(--spacing-md)"
    >
      <slot name="mark">
        <img
          :src="logo"
          :alt="logoAlt || jobTitle"
          loading="lazy"
          decoding="async"
          class="w-fit object-contain group-data-[kind=inline]:h-8 group-data-[kind=signed]:h-8 group-data-[kind=signed]:max-w-40"
        />
      </slot>
    </div>

    <div
      class="flex flex-col group-data-[kind=inline]:gap-(--spacing-xs) group-data-[kind=signed]:gap-(--spacing-md) group-data-[kind=highlight]:gap-(--spacing-md)"
    >
      <svg
        viewBox="0 0 34 22"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        class="w-auto shrink-0 self-start text-(--text-muted) group-data-[kind=inline]:h-4 group-data-[kind=signed]:h-5 group-data-[kind=highlight]:h-6"
      >
        <path
          d="M29.56 21.89H25.81C24.62 21.89 23.59 21.44 22.72 20.53C21.84 19.66 21.41 18.62 21.41 17.44V8.16C21.41 6.97 21.84 5.94 22.72 5.06L26.75 1.03C27.44 0.34 28.31 0 29.38 0C30.34 0 31.17 0.34 31.86 1.03C32.55 1.72 32.89 2.55 32.89 3.52C32.89 4.58 32.55 5.45 31.86 6.14L28.58 9.38H29.56C30.75 9.38 31.77 9.8 32.61 10.64C33.45 11.52 33.88 12.55 33.88 13.73V17.44C33.88 18.66 33.45 19.7 32.61 20.58C31.77 21.45 30.75 21.89 29.56 21.89Z"
        />
        <path
          d="M8.16 21.89H4.41C3.22 21.89 2.19 21.44 1.31 20.53C0.44 19.66 0 18.62 0 17.44L0 8.16C0 6.97 0.44 5.94 1.31 5.06L5.34 1.03C6.03 0.34 6.91 0 7.97 0C8.94 0 9.77 0.34 10.45 1.03C11.14 1.72 11.48 2.55 11.48 3.52C11.48 4.58 11.14 5.45 10.45 6.14L7.17 9.38H8.16C9.34 9.38 10.36 9.8 11.2 10.64C12.05 11.52 12.47 12.55 12.47 13.73V17.44C12.47 18.66 12.05 19.7 11.2 20.58C10.36 21.45 9.34 21.89 8.16 21.89Z"
        />
      </svg>

      <blockquote
        class="m-0 text-(--text-default) group-data-[kind=inline]:text-pretty group-data-[kind=inline]:text-body-lg group-data-[kind=signed]:max-w-(--container-2xl) group-data-[kind=signed]:text-heading-md group-data-[kind=highlight]:max-w-(--container-2xl) group-data-[kind=highlight]:text-heading-lg"
      >
        <slot>{{ text }}</slot>
      </blockquote>
    </div>

    <figcaption
      v-if="kind === 'highlight'"
      class="flex items-center gap-(--spacing-md)"
    >
      <span aria-hidden="true">
        <Avatar
          :src="photo || undefined"
          :label="photo ? undefined : initials"
          kind="square"
          size="large"
        />
      </span>
      <span class="flex min-w-0 flex-col">
        <span class="text-body-md text-(--text-default)">{{ name }}</span>
        <span class="text-body-sm text-(--text-muted)">{{ jobTitle }}</span>
      </span>
    </figcaption>

    <figcaption
      v-else-if="kind === 'signed'"
      class="flex flex-col gap-(--spacing-xs) sm:flex-row sm:items-center sm:gap-(--spacing-xl)"
    >
      <Overline>{{ name }}</Overline>
      <span class="px-1 text-overline-md uppercase text-(--text-default)">{{ jobTitle }}</span>
    </figcaption>

    <figcaption
      v-else
      class="text-body-sm text-(--text-muted)"
    >
      {{ [name, jobTitle].filter(Boolean).join(' — ') }}
    </figcaption>

    <div
      v-if="slots.actions"
      class="mt-auto"
    >
      <slot name="actions" />
    </div>
  </figure>
</template>
