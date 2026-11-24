<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'

  /**
   * A navigational tile. It draws no rule and no radius of its own — DocCardGroup
   * frames the set and its 1px gaps rule between cells — but it must paint an
   * opaque surface fill, or the group's rule colour shows through its whole face.
   */
  defineOptions({ name: 'DocCard', inheritAttrs: false })

  export interface DocCardProps {
    /** Card heading. */
    title?: string
    /** Small muted line above the title — who makes the thing, when the title does not say. */
    eyebrow?: string
    /** Azion icon class for the leading glyph. Ignored when the `icon` slot is filled. */
    icon?: string
    /** Destination; when set the whole card becomes the link. */
    href?: string
    /** Where the link opens. */
    target?: '_self' | '_blank'
    /** Fallback copy when the default slot is empty. */
    label?: string
    /** Call-to-action text; when set the card closes on a link row. */
    linkLabel?: string
  }

  const props = withDefaults(defineProps<DocCardProps>(), {
    title: '',
    eyebrow: '',
    icon: '',
    href: '',
    target: '_self',
    label: '',
    linkLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ common: en.common })

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-card')

  defineSlots<{
    /** Card copy. */
    default(): unknown
    /** The leading mark, when a font glyph will not do. Replaces `icon`. */
    icon(): unknown
  }>()

  const isLink = computed(() => safeHref(props.href) !== null)

  const isExternal = computed(
    () => props.target === '_blank' || /^(https?:)?\/\/|^mailto:/.test(props.href)
  )

  const ROOT_CLASS =
    'group relative flex h-full flex-col bg-(--bg-surface) px-(--spacing-xl) py-5 no-underline transition-colors duration-150 ease-out ' +
    'hover:bg-(--bg-hover) focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    :data-testid="testId"
    data-doc-chrome
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="isLink && target === '_blank' ? 'noreferrer' : undefined"
    :class="ROOT_CLASS"
  >
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
      v-if="eyebrow"
      class="text-overline-sm text-(--text-muted)"
      >{{ eyebrow }}</span
    >
    <span class="text-heading-xs text-(--text-default)"
      >{{ title
      }}<span
        v-if="isLink && target === '_blank'"
        class="sr-only"
        >{{ ` ${t('common.newTab')}` }}</span
      ></span
    >
    <span
      v-if="$slots['default'] || label"
      class="mt-(--spacing-2xs) text-pretty text-body-sm text-(--text-muted) [&>*:first-child]:pt-0! [&_p]:text-body-sm!"
    >
      <slot>{{ label }}</slot>
    </span>
    <span
      v-if="linkLabel"
      class="mt-auto flex items-center gap-(--spacing-2xs) pt-(--spacing-sm) text-label-md text-(--text-link)"
    >
      {{ linkLabel }}
      <i
        :class="
          isExternal
            ? 'az-arrow-up-right group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
            : 'az-chevron-right group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'
        "
        class="az text-body-xs transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
        aria-hidden="true"
      />
    </span>
    <i
      v-else-if="isLink"
      :data-testid="`${testId}__link-glyph`"
      :class="
        isExternal
          ? 'az-arrow-up-right group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
          : 'az-chevron-right group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'
      "
      class="az absolute end-(--spacing-md) top-(--spacing-md) text-body-xs text-(--text-muted) transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover:text-(--text-link) motion-reduce:transition-none"
      aria-hidden="true"
    />
  </component>
</template>
