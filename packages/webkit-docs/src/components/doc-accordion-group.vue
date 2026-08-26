<script setup lang="ts">
  import Accordion, {
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  } from '@aziontech/webkit/accordion'
  import { computed, useSlots } from 'vue'

  import { flattenSlot } from '../lib/slot'

  /**
   * A set of collapsible answers — the FAQ / "expand for detail" block. It
   * reads the `title` off each `DocAccordionItem` child to build the triggers,
   * and renders the child's own body inside the panel, so an author writes
   * nothing but titles and prose.
   *
   * It always ships as a CARD, never flush. The bare webkit Accordion is a
   * flush stack of ruled rows, which is right inside a panel that already has
   * edges — but a documentation page is an open column of prose, and a run of
   * full-bleed rules there reads as a horizontal rule with words on it rather
   * than as one object the reader can open. The surface, the outer rule and the
   * radius are what say "this is a group, and it is closed"; so the group owns
   * them and an author can never get the flush form by accident.
   *
   * Two consequences the box forces, both handled here. The last row drops its
   * own rule while closed, so it does not double the box's bottom edge. And the
   * trigger's focus ring moves inside the button (`ring-inset`), because the
   * clipping that keeps a hover fill inside the radius would otherwise cut the
   * ring's left and right sides away.
   *
   * The panel body is padded to the box (never flush to its edges), on an inner
   * wrapper rather than on `AccordionContent` itself: the open/close transition
   * animates height to 0, and padding on the animated element does not collapse
   * with it, so a closed row would keep a strip of empty space. The first block
   * inside drops its own top space, which the wrapper has already supplied.
   */
  defineOptions({ name: 'DocAccordionGroup' })

  interface Props {
    /** Whether one or several entries can be open at once. */
    type?: 'single' | 'multiple'
  }

  const props = withDefaults(defineProps<Props>(), { type: 'single' })

  defineSlots<{
    /** The `DocAccordionItem` children. */
    default(): unknown
  }>()

  const slots = useSlots()

  const entries = computed(() =>
    flattenSlot(slots.default?.() ?? []).map((child, position) => ({
      value: `entry-${position}`,
      title: (child.props?.title as string) ?? '',
      open: child.props?.defaultOpen === '' || child.props?.defaultOpen === true,
      node: child
    }))
  )

  const defaultValue = computed(() => {
    const open = entries.value.filter((entry) => entry.open).map((entry) => entry.value)
    if (props.type === 'multiple') return open
    return open[0] ?? ''
  })
</script>

<template>
  <div
    data-doc-block
    data-testid="doc-accordion-group"
    class="w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <!-- `large`, the DS accordion's roomier step: a docs FAQ row is a full question, not
         a settings label, and at `medium` (min-h-8, `body-sm`) the strip read as a dense
         list of controls rather than as a section of the page. Large gives the row its
         40px floor and the body copy its own size — which is also what lets the question
         carry heading weight over the answer without the row looking cramped. -->
    <Accordion
      :type="type"
      :default-value="defaultValue"
      size="large"
      collapsible
    >
      <AccordionItem
        v-for="entry in entries"
        :key="entry.value"
        :value="entry.value"
        class="last:border-b-0 last:data-[state=closed]:[&_button]:border-b-0"
      >
        <!-- AccordionTrigger forwards $attrs to its button, so the heading it
             renders is marked through a display:contents wrapper instead.

             THE QUESTION OUTRANKS ITS OWN ANSWER. The DS trigger sets its label at
             `text-body-md` — the same size and weight as the prose that opens
             underneath it — so a three-line answer read louder than the heading it
             belongs to, and a closed list of questions read as a list of paragraphs.
             `text-heading-xs` (the step-title rung) puts the weight back on the
             question. It is set on the label SPAN rather than on the button, because
             the button paints its type through a `data-[size]` variant that outranks a
             plain utility — and the chevron beside the label keeps sizing from the
             button, which is what keeps it a glyph and not a second heading.

             THE HEADING RUNG ALSO CARRIES `text-wrap-style: balance`, and that is wrong
             HERE. Balancing is for a heading that owns its line box; this label shares a
             flex row with a chevron, so on a phone it balanced every two-line question
             into two short ragged lines with ~100px of dead gutter before the glyph
             ("The server never / connects in Claude Code"). `pretty` fills the measure
             and still refuses to leave a one-word last line. It is the LONGHAND, matching
             the token it overrides: the `text-pretty` shorthand would also set
             `text-wrap-mode`, which decides THAT the text wraps and beats a `truncate`
             the DS may put on the same element (see texts.data.js).

             AND THE TRIGGER NEEDS VERTICAL PADDING, which the DS gives it none of: it
             carries `px-[--accordion-inset]` and a `min-h-10` floor, so a one-line
             question is centred in the floor and a question that WRAPS is 44px of text
             in a 44px box — flush against the border, top and bottom. `--spacing-xs`
             costs the one-line rows nothing (22px of text + 16px still sits under the
             40px floor, so they stay exactly 40px) and gives a wrapped question 8px of
             air on each side. -->
        <div
          data-doc-chrome
          class="contents"
        >
          <AccordionTrigger
            :level="3"
            class="py-(--spacing-xs) focus-visible:ring-inset [&>span]:text-heading-xs [&>span]:[text-wrap-style:pretty]"
            >{{ entry.title }}</AccordionTrigger
          >
        </div>
        <AccordionContent>
          <div
            class="px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md) [&>*>*:first-child]:mt-0 [&>*>*:first-child]:pt-0"
          >
            <component :is="entry.node" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
