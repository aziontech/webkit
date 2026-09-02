<script setup>
  // Shared framework-template card: a centered CardBox whose colored brand logo is
  // grayscale until hover, with a soft brand-color glow faded in behind the
  // content. Used by both the Marketplace template grid and the Creation Center
  // recommended templates.
  import CardBox from '@aziontech/webkit/card-box'
  import Tag from '@aziontech/webkit/tag'

  defineProps({
    // Brand logo class (`ai-cor ai-*` colored, or `ai ai-*` monochrome).
    icon: { type: String, required: true },
    // What the MARK needs to survive the dark theme, from the catalog
    // (../../lib/data/frameworks.js → `DARK_INK_MARKS`). Empty for almost every logo:
    // a font glyph paints in `currentColor` and a colored logo carries its own colors,
    // so only the ones drawn in hard-coded dark ink (Next.js) get a filter here.
    markClass: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    // Framework brand hex, used for the soft hover glow.
    color: { type: String, default: 'var(--primary)' },
    // WHAT DEPLOYING IT LEAVES IN THE ACCOUNT — the platform objects the run creates,
    // as tags ('Application', 'Workload', 'Function', 'Object Storage'). Derived once,
    // in the catalog (../../lib/data/frameworks.js → `PROVISIONS`), so every surface
    // that shows a template names the same objects in the same order.
    //
    // OPTIONAL, and absent is a real state: a surface whose grid is too narrow to hold
    // a tag row legibly passes nothing and the card is exactly what it was.
    creates: { type: Array, default: () => [] }
  })

  const emit = defineEmits(['select'])

  // Soft radial glow from the framework's brand color, revealed on hover.
  const glow = (color) => `radial-gradient(120% 90% at 50% 0%, ${color}33, transparent 62%)`

  const activate = (event) => emit('select', event)
</script>

<template>
  <CardBox
    class="group relative cursor-pointer text-center"
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <!-- Brand-color glow, faded in on hover (behind the content). -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-100 motion-reduce:transition-none"
        :style="{ background: glow(color) }"
      />
      <!-- `my-auto` centers the content whenever the card is taller than it needs
           to be — a min-height floor, or a row-mate with a longer description.
           Without it a short card's content hangs off the top edge. -->
      <div
        class="relative z-10 my-auto flex flex-col items-center gap-(--spacing-md) py-(--spacing-sm)"
      >
        <!-- `text-(--text-default)` IS THE MARK'S INK, and it has to be stated. Half this
             catalog's marks are FONT GLYPHS — every Azion product glyph, and the fifteen
             frameworks with no colored logo — which paint in `currentColor`; nothing on
             the way down to this element set a color, so they inherited the document's
             black and rendered black-on-black in the dark theme. Measured: `color:
             rgb(0, 0, 0)` on both themes, with `grayscale(1)` unable to help (grey of
             black is black). The token follows the theme, so the same glyph is near-black
             on light and near-white on dark, and `markClass` handles the other half —
             a colored logo whose ink is hard-coded dark (see the prop above). -->
        <i
          :class="[icon, markClass]"
          class="text-[2.5rem] leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <div class="flex flex-col gap-(--spacing-xxs)">
          <h3 class="text-label-md text-(--text-default)">{{ title }}</h3>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </div>
        <!-- WHAT IT CREATES, named before the reader commits to it. The sentence above
             says what the template is FOR; this row says what the deploy will actually
             put in the account, which is the half a reader used to learn from the log
             after the fact.

             `secondary` — the outlined neutral tag — because these are facts about the
             template, not a status: a filled severity would read as a state the card is
             in. The muted lead word is what keeps four nouns from being mistaken for the
             render tags (SSR / SPA / Static) the same catalog carries. -->
        <div
          v-if="creates.length"
          class="flex flex-wrap items-center justify-center gap-(--spacing-xxs)"
        >
          <span class="text-body-sm text-(--text-muted)">Creates</span>
          <Tag
            v-for="resource in creates"
            :key="resource"
            :label="resource"
            severity="secondary"
            size="small"
          />
        </div>
      </div>
    </template>
  </CardBox>
</template>
