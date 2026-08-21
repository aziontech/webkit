<script setup lang="ts">
  import { useHeadingNav } from '../lib/heading-nav'

  /**
   * A section heading that is also the link to itself — the one shape every
   * heading in the documentation takes, whichever way the page was authored.
   *
   * A heading is an anchor: the whole text is the link to its own id, so a reader
   * can click the section they are reading and copy the URL to it. The affordance
   * stays out of the way until it is wanted — the rule under the text and the
   * chain glyph after it appear on hover or keyboard focus, and never occupy
   * layout, so the heading's measure does not shift. `DocProse` skips
   * `[data-doc-anchor]` in its link rules, so the heading keeps its own colour
   * and weight instead of turning into body-copy link blue.
   *
   * Plain inline flow (not `inline-flex`): a long heading has to wrap the way a
   * heading wraps, with the glyph trailing the last word.
   *
   * IT IS A COMPONENT RATHER THAN A BLOCK OF CLASSES INSIDE `DocMarkdown` because
   * MDX is not the only way a docs page gets written. A page that is a DESIGNED
   * OBJECT — a tool picker, a landing band, anything whose sections are composed
   * in Vue rather than typed as prose — needs its `h2`s to behave exactly like the
   * `h2`s on every prose page: same anchor, same glyph, same scroll offset, same
   * id for the rail to point at. Left inside the renderer, the only way to get
   * that was to copy the markup, and a copied heading is one that drifts.
   *
   * `DocMarkdown` renders through this too, so there is one definition and the two
   * authoring paths cannot diverge.
   *
   * THE SCROLL IS THE PAGE'S, NOT THE BROWSER'S. The handler comes from
   * `useHeadingNav`, which the page provides; with no page (a bare heading in a
   * story) it is a no-op and the native hash jump takes over, which is the right
   * fallback rather than a dead link.
   */
  defineOptions({ name: 'DocHeading' })

  interface Props {
    /** Heading level; drives both the tag and the prose type scale. */
    level?: 1 | 2 | 3 | 4
    /** Anchor id — what the rail's entry and the copied URL point at. */
    id?: string
    /** Fallback text when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    level: 2,
    id: '',
    label: ''
  })

  defineSlots<{
    /** The heading text. */
    default(): unknown
  }>()

  const nav = useHeadingNav()
</script>

<template>
  <component
    :is="`h${level}`"
    :id="id"
    :data-doc-heading="level"
    class="scroll-mt-(--spacing-lg)"
  >
    <a
      :href="`#${id}`"
      data-doc-anchor
      class="group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="nav($event, { id: props.id })"
    >
      <span class="decoration-(--border-strong) underline-offset-4 group-hover/anchor:underline">
        <slot>{{ label }}</slot>
      </span>
      <i
        class="pi pi-link ml-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </a>
  </component>
</template>
