<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Item from '../../content/item/item.vue'
  import ItemActions from '../../content/item/item-actions.vue'
  import ItemContent from '../../content/item/item-content.vue'
  import ItemDescription from '../../content/item/item-description.vue'
  import ItemMedia from '../../content/item/item-media.vue'
  import ItemTitle from '../../content/item/item-title.vue'

  /**
   * One row of the documentation's related-content list: a glyph, a name, and
   * the sentence that says what the thing is. It is the "Related products"
   * shape — the list a page ends on, where the reader is choosing what to read
   * next rather than scanning a grid of sections.
   *
   * IT IS A ROW, NOT A CARD. `DocCard` is a cell in a grid and claims a whole
   * tile; this claims one line of the framed list it sits in. So it reuses the
   * webkit `Item` anatomy — media, content, title, description — which is the
   * same row the console lists resources with, and `ItemList` (the list the
   * page composes, inside a `FrameBox`) rules between the rows. The docs layer
   * only decides what goes in each region.
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
   * THE ROW IS THE CONSOLE'S WIZARD ROW. A "how do you want to start?" row in the
   * application create is the same object as this one — a glyph, a name, a
   * sentence, and a chevron saying the row goes somewhere — so it wears the same
   * clothes: the framed 32px tile (`--shape-elements` / `--border-muted` /
   * `--bg-surface-raised`, glyph in `--text-default`) rather than `ItemMedia`'s
   * own `kind="icon"` frame, and `pi-chevron-right` in `ItemActions` rather than
   * an arrow floating at the row's end — unless the row LEAVES the documentation
   * (an absolute URL, or an explicit `target="_blank"`), where the glyph becomes
   * `pi-arrow-up-right` and travels its own diagonal on hover, the same pair
   * `DocCard`'s closing link draws for the same distinction. The tile classes ride on `ItemMedia`
   * itself instead of a nested span — one element fewer for the same box, since
   * the default region already centres its child and top-aligns beside a
   * description.
   *
   * BOTH FLANKS ARE THE SAME 32px SQUARE. The chevron gets the tile's footprint
   * rather than only its own 14px glyph, so the row is bracketed evenly instead
   * of trailing off, and every row's text starts and ends on the same two lines
   * however long its sentence runs. The width is `min-w-8`, not `size-8`:
   * `ItemActions` ships `w-fit`, and a `w-8` next to it is a coin-toss on
   * stylesheet order, while a min-width simply wins.
   *
   * The density is NOT the wizard's `size="small"`. That row is a control in a
   * compact card, tight on purpose; this one is read, and at an 8px gap the tile
   * crowds the name it labels. It keeps the list's default 16px — the same step
   * the card pads with, so the tile, the text and the card edge share one rhythm.
   *
   * `data-doc-chrome` stops `DocProse` at the row's edge: the description is a
   * real paragraph and the title a heading-ish line, and prose rules would give
   * them body-copy spacing and colour, undoing the row. The one thing carried
   * back in is the inline-code chip, which the author writes inside the sentence.
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

  // Leaves the documentation: an absolute URL (http(s) or protocol-relative), a
  // `mailto:`, or a row the page has explicitly told to open in a new tab.
  const isExternal = computed(
    () => props.target === '_blank' || /^(https?:)?\/\/|^mailto:/.test(props.href)
  )
</script>

<template>
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
