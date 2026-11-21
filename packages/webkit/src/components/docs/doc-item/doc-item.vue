<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../utils/safe-href'
  import Item from '../../content/item/item.vue'
  import ItemActions from '../../content/item/item-actions.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemMedia from '../../content/item/item-media.vue'
  import ItemTitle from '../../content/item/item-title.vue'

  /**
   * One row of the docs related-content list, on the webkit Item anatomy. The
   * anchor wraps only the title, and a full-bleed after-pseudo makes the row its
   * hit area: listitem is not a role an anchor may take (axe aria-allowed-role).
   */
  defineOptions({ name: 'DocItem', inheritAttrs: false })

  export interface DocItemProps {
    /** The row's name — what the reader is choosing. */
    title?: string
    /** Azion icon class for the leading glyph. */
    icon?: string
    /** Destination; when set the whole row becomes the link. */
    href?: string
    /** Where the link opens. */
    target?: '_self' | '_blank'
    /** Fallback copy when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<DocItemProps>(), {
    title: '',
    icon: '',
    href: '',
    target: '_self',
    label: ''
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-item')

  defineSlots<{
    /** The row's copy: one or two sentences of inline prose. */
    default(): unknown
  }>()

  const isLink = computed(() => safeHref(props.href) !== null)

  const isExternal = computed(
    () => props.target === '_blank' || /^(https?:)?\/\/|^mailto:/.test(props.href)
  )

  const ROOT_CLASS =
    'group/item items-start transition-colors duration-150 ease-out has-[a:hover]:bg-(--bg-hover) has-[a:focus-visible]:outline-none has-[a:focus-visible]:ring-2 ' +
    'has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-(--ring-color) motion-reduce:transition-none'

  const DESCRIPTION_CLASS =
    'line-clamp-none text-pretty [&_code:not(pre_*)]:rounded-(--shape-control) [&_code:not(pre_*)]:inset-ring [&_code:not(pre_*)]:inset-ring-(--border-default) ' +
    '[&_code:not(pre_*)]:forced-colors:border [&_code:not(pre_*)]:bg-(--bg-hover) [&_code:not(pre_*)]:px-(--spacing-2xs) [&_code:not(pre_*)]:text-label-code-sm ' +
    '[&_code:not(pre_*)]:text-(--text-default) [&_code:not(pre_*)]:wrap-anywhere [&_code:not(pre_*)]:box-decoration-clone'
</script>

<template>
  <Item
    v-bind="$attrs"
    role="listitem"
    :data-testid="testId"
    data-doc-chrome
    :class="ROOT_CLASS"
  >
    <ItemMedia
      v-if="icon"
      class="size-8 rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
    >
      <i
        :class="icon"
        class="text-[1rem] leading-none text-(--text-default)"
        aria-hidden="true"
      />
    </ItemMedia>
    <ItemContent class="gap-(--spacing-2xs)">
      <ItemTitle>
        <a
          v-if="isLink"
          :href="safeHref(href) ?? undefined"
          :target="target"
          :rel="target === '_blank' ? 'noreferrer' : undefined"
          class="text-inherit no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {{ title }}
        </a>
        <template v-else>{{ title }}</template>
      </ItemTitle>
      <ItemDescription :class="DESCRIPTION_CLASS">
        <slot>{{ label }}</slot>
      </ItemDescription>
    </ItemContent>
    <ItemActions
      v-if="isLink"
      class="h-8 min-w-8 justify-center self-center"
    >
      <i
        :class="
          isExternal
            ? 'az-arrow-up-right group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5 group-hover/item:-translate-y-0.5'
            : 'az-chevron-right group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5'
        "
        class="az text-(--text-muted) transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
        aria-hidden="true"
      />
    </ItemActions>
  </Item>
</template>
