<script setup lang="ts">
  import { type Component, computed, defineAsyncComponent, useAttrs } from 'vue'

  import { brandMarkLabel, resolveBrandMark } from '../../../svg/brands/registry'

  defineOptions({
    name: 'ClientKpiQuote',
    inheritAttrs: false
  })

  interface Props {
    /** Registry name of the client's brand mark, as `brand-carousel` names one; a name the registry does not carry falls back to the typographic wordmark. */
    client?: string
    /** The client's name in prose — the mark's accessible name, and the wordmark drawn when the registry has no artwork; falls back to the registry's own label for `client`. */
    clientName?: string
    /** The result itself — the figure or short phrase the claim leads with, set in the default ink. */
    kpi?: string
    /** The rest of the claim, set muted after the `kpi` and read as one sentence with it. */
    text?: string
    /** When set, the whole cell renders as an anchor link to this URL and takes hover and focus states; the `actions` slot is then not rendered, since a link cannot nest another. */
    href?: string
    /** Accessible name of a linked cell, replacing the claim read as the link text; use it to state the destination, since a cell that is its own link shows no link label. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    client: '',
    clientName: '',
    kpi: '',
    text: '',
    href: '',
    ariaLabel: ''
  })

  const slots = defineSlots<{
    /** The client's mark; replaces the registry artwork, for a page that owns the file. */
    mark?(): unknown
    /** A trailing control under the claim, floored so a row of cells aligns on it. Not rendered when `href` makes the cell itself the link. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-client-kpi-quote'
  )

  const label = computed(
    () => props.clientName || (props.client ? brandMarkLabel(props.client) : '')
  )

  const art = computed<Component | null>(() => {
    const loader = props.client ? resolveBrandMark(props.client) : null
    return loader ? defineAsyncComponent(loader) : null
  })

  const hasArtwork = computed(() => Boolean(slots.mark) || art.value !== null)

  const hasSignature = computed(() => hasArtwork.value || label.value.length > 0)

  const isLink = computed(() => props.href.length > 0)

  const hasActions = computed(() => Boolean(slots.actions) && !isLink.value)
</script>

<template>
  <component
    :is="isLink ? 'a' : 'figure'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :aria-label="isLink && ariaLabel ? ariaLabel : undefined"
    :data-testid="testId"
    :data-linked="isLink || null"
    class="relative m-0 flex h-full flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-xl) no-underline transition-colors duration-150 ease-out motion-reduce:transition-none data-[linked]:hover:bg-(--bg-mask) data-[linked]:focus-visible:z-10 data-[linked]:focus-visible:outline-none data-[linked]:focus-visible:ring-2 data-[linked]:focus-visible:ring-inset data-[linked]:focus-visible:ring-(--ring-color)"
  >
    <!-- A fixed band, so every cell in a row starts its claim on one line whatever
         aspect ratio the mark inside it has. `figcaption` is only legal inside a
         `figure`, so it follows the root element. -->
    <component
      :is="isLink ? 'div' : 'figcaption'"
      v-if="hasSignature"
      class="flex h-6 items-center text-(--text-default)"
    >
      <slot name="mark">
        <component
          :is="art"
          v-if="art"
          :data-mark="client"
          class="h-full w-auto max-w-32 object-contain"
        />
      </slot>
      <!-- Registry artwork is aria-hidden, so the name is the caption's only text;
           with artwork it is read, not shown. -->
      <span
        v-if="label"
        :data-artwork="hasArtwork || null"
        class="whitespace-nowrap text-heading-xxs data-[artwork]:sr-only"
        >{{ label }}</span
      >
    </component>

    <p class="m-0 flex-1 text-pretty text-heading-xs text-(--text-muted)">
      <span
        v-if="kpi"
        class="font-medium text-(--text-default)"
        >{{ kpi }}</span
      >
      {{ text }}
    </p>

    <div v-if="hasActions">
      <slot name="actions" />
    </div>
  </component>
</template>
