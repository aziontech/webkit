<script setup lang="ts">
  import ItemContent from '@aziontech/webkit/item-content'
  import ItemDescription from '@aziontech/webkit/item-description'
  import ItemMedia from '@aziontech/webkit/item-media'
  import Item from '@aziontech/webkit/item-root'
  import ItemTitle from '@aziontech/webkit/item-title'
  import { computed } from 'vue'

  /**
   * One row of a `DocItemGroup`: a glyph, a name, and the sentence that says
   * what the thing is. It is the "Related products" shape — the list a page ends
   * on, where the reader is choosing what to read next rather than scanning a
   * grid of sections.
   *
   * IT IS A ROW, NOT A CARD. `DocCard` is a cell in a grid and claims a whole
   * tile; this claims one line of the card its group draws. So it reuses the
   * webkit `Item` anatomy — media, content, title, description — which is the
   * same row the console lists resources with, and `ItemList` (its group) rules
   * between the rows. The docs layer only decides what goes in each region.
   *
   * THE LINK IS THE TITLE, STRETCHED OVER THE ROW. The anchor wraps the name, so
   * its accessible name is that name and nothing has to be duplicated into an
   * `aria-label`; a full-bleed `::after` then makes the whole row its hit area.
   * That is what lets the row be a real list item — `role="listitem"` is not a
   * role an anchor may take (axe `aria-allowed-role`), and an anchor wrapping
   * the whole row would leave the list's `role="list"` with no allowed children.
   * Hover and the focus ring are driven off that one link (`has-[a:…]`), which
   * is also how `Item` is specified to work: the shell draws no interaction of
   * its own and the slotted link owns it.
   *
   * `data-doc-chrome` stops `DocProse` at the row's edge: the description is a
   * real paragraph and the title a heading-ish line, and prose rules would give
   * them body-copy spacing and colour, undoing the row. The one thing carried
   * back in is the inline-code chip, which the author writes inside the sentence.
   */
  defineOptions({ name: 'DocItem' })

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

  defineSlots<{
    /** The row's copy: one or two sentences of inline prose. */
    default(): unknown
  }>()

  const isLink = computed(() => props.href.length > 0)
</script>

<template>
  <Item
    role="listitem"
    data-testid="doc-item"
    data-doc-chrome
    class="items-start transition-colors duration-150 ease-out has-[a:hover]:bg-(--bg-hover) has-[a:focus-visible]:outline-none has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-inset has-[a:focus-visible]:ring-(--ring-color) motion-reduce:transition-none"
  >
    <ItemMedia
      v-if="icon"
      kind="icon"
    >
      <i
        :class="icon"
        class="text-[1rem] leading-none text-(--text-muted)"
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
        class="line-clamp-none text-pretty [&_code]:rounded-(--shape-flat) [&_code]:border [&_code]:border-(--border-default) [&_code]:bg-(--bg-hover) [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-label-code-sm [&_code]:text-(--text-default)"
      >
        <slot>{{ label }}</slot>
      </ItemDescription>
    </ItemContent>
    <i
      v-if="isLink"
      class="pi pi-arrow-right shrink-0 self-center text-(--text-muted)"
      aria-hidden="true"
    />
  </Item>
</template>
