<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /**
   * A navigational tile. It draws no rule and no radius of its own — DocCardGroup
   * frames the set and its 1px gaps rule between cells — but it must paint an
   * opaque surface fill, or the group's rule colour shows through its whole face.
   */
  defineOptions({ name: 'DocCard', inheritAttrs: false })

  interface Props {
    /** Card heading. */
    title?: string
    /** Small muted line above the title — who makes the thing, when the title does not say. */
    overline?: string
    /** PrimeIcons class for the leading glyph. Ignored when the `icon` slot is filled. */
    icon?: string
    /** Destination; when set the whole card becomes the link. */
    href?: string
    /** Where the link opens. */
    target?: '_self' | '_blank'
    /** Fallback copy when the default slot is empty. */
    label?: string
    /** Call-to-action text; when set the card closes on a link row. */
    link?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    overline: '',
    icon: '',
    href: '',
    target: '_self',
    label: '',
    link: ''
  })

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-card')

  defineSlots<{
    /** Card copy. */
    default(): unknown
    /** The leading mark, when a font glyph will not do. Replaces `icon`. */
    icon(): unknown
  }>()

  const isLink = computed(() => props.href.length > 0)

  // External: an absolute or protocol-relative URL, a mailto, or an explicit new tab.
  const isExternal = computed(
    () => props.target === '_blank' || /^(https?:)?\/\/|^mailto:/.test(props.href)
  )
</script>

<template>
  <!-- The inset is fixed at 24/20px, not a responsive step: the responsive token
       peaked exactly where the grid packs the cells narrowest. -->
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    :data-testid="testId"
    data-doc-chrome
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="isLink && target === '_blank' ? 'noreferrer' : undefined"
    class="group relative flex h-full flex-col bg-(--bg-surface) px-6 py-5 no-underline transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <!-- One 24px box for either glyph path, so a grid mixing a font glyph and a brand
         mark keeps its titles on one line; the mark keeps its own colour. -->
    <span
      v-if="$slots['icon']"
      class="mb-(--spacing-md) flex size-6 items-center [&>svg]:size-6"
    >
      <slot name="icon" />
    </span>
    <i
      v-else-if="icon"
      :class="icon"
      class="mb-(--spacing-md) size-6 text-[1.5rem] leading-none text-(--text-muted) transition-colors duration-150 ease-out group-hover:text-(--primary) motion-reduce:transition-none"
      aria-hidden="true"
    />
    <span
      v-if="overline"
      class="text-overline-sm text-(--text-muted)"
      >{{ overline }}</span
    >
    <span class="text-heading-xs text-(--text-default)">{{ title }}</span>
    <!-- No copy, no element: an empty copy line would add its top gap as trailing space. -->
    <span
      v-if="$slots['default'] || label"
      class="mt-(--spacing-xxs) text-pretty text-body-sm text-(--text-muted) [&>*:first-child]:pt-0! [&_p]:text-body-sm!"
    >
      <slot>{{ label }}</slot>
    </span>
    <!-- Foot of the cell, so every card's call-to-action lands on one line. A span,
         never a nested anchor: the card is the link, and browsers un-nest nested anchors. -->
    <span
      v-if="link"
      class="mt-auto flex items-center gap-(--spacing-xxs) pt-(--spacing-sm) text-label-md text-(--text-link)"
    >
      {{ link }}
      <i
        :class="
          isExternal
            ? 'pi-arrow-up-right group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
            : 'pi-chevron-right group-hover:translate-x-0.5'
        "
        class="pi text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
        aria-hidden="true"
      />
    </span>
  </component>
</template>
