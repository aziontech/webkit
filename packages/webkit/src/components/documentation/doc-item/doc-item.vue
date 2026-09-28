<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

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

  interface Props {
    /** The row's name — what the reader is choosing. */
    title?: string
    /** PrimeIcons class for the leading glyph. */
    icon?: string
    /** Destination; when set the whole row becomes the link. */
    href?: string
    /** Where the link opens. */
    target?: '_self' | '_blank'
    /** Fallback copy when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    icon: '',
    href: '',
    target: '_self',
    label: ''
  })

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-item')

  defineSlots<{
    /** The row's copy: one or two sentences of inline prose. */
    default(): unknown
  }>()

  const isLink = computed(() => props.href.length > 0)

  // External: an absolute or protocol-relative URL, a mailto, or an explicit new tab.
  const isExternal = computed(
    () => props.target === '_blank' || /^(https?:)?\/\/|^mailto:/.test(props.href)
  )
</script>

<template>
  <!-- data-doc-chrome stops DocProse at the row's edge: prose rules would restyle
       the title and description as body copy. -->
  <Item
    v-bind="$attrs"
    role="listitem"
    :data-testid="testId"
    data-doc-chrome
    class="group/item items-start transition-colors duration-150 ease-out has-[a:hover]:bg-(--bg-hover) has-[a:focus-visible]:outline-none has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-(--ring-color) motion-reduce:transition-none"
  >
    <ItemMedia
      v-if="icon"
      class="size-8 rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
    >
      <i
        :class="icon"
        class="text-[1rem] leading-none text-(--text-default)"
        aria-hidden="true"
      />
    </ItemMedia>
    <ItemContent class="gap-(--spacing-xxs)">
      <ItemTitle>
        <a
          v-if="isLink"
          :href="href"
          :target="target"
          :rel="target === '_blank' ? 'noreferrer' : undefined"
          class="text-inherit no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {{ title }}
        </a>
        <template v-else>{{ title }}</template>
      </ItemTitle>
      <ItemDescription
        class="line-clamp-none text-pretty [&_code]:rounded-(--shape-elements) [&_code]:border [&_code]:border-(--border-default) [&_code]:bg-(--bg-hover) [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default)"
      >
        <slot>{{ label }}</slot>
      </ItemDescription>
    </ItemContent>
    <!-- A min-width, not a fixed width: ItemActions sets its own fit width, and a
         fixed width beside it would fall to stylesheet order. -->
    <ItemActions
      v-if="isLink"
      class="h-8 min-w-8 justify-center self-center"
    >
      <i
        :class="
          isExternal
            ? 'pi-arrow-up-right group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5'
            : 'pi-chevron-right group-hover/item:translate-x-0.5'
        "
        class="pi text-(--text-muted) transition-[translate] duration-moderate-02 ease-expressive-entrance motion-reduce:transition-none"
        aria-hidden="true"
      />
    </ItemActions>
  </Item>
</template>
