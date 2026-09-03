<script setup>
  // THE MARKER — the deck's one emphasis, defined once and rendered inline.
  //
  // Two layouts now put a highlighted phrase inside a headline (`stack`, `evidence`), and the
  // thing most likely to drift between them is not the splitting — it is what the band LOOKS
  // like. So both the split and the paint live here, and a caller keeps its own element and its
  // own type step: this component renders runs, not a paragraph.
  //
  // THE DATA CARRIES THE PHRASE, NOT A PRE-SPLIT HEADLINE. `emphasis` is a list of phrases as
  // they appear in the sentence, so the sentence stays one readable string an editor can
  // rewrite. A phrase occurring twice is marked twice — the emphasis is on the phrase, not on
  // an occurrence of it.
  //
  // THE INK IS `--bg-canvas`, WHICH IS WHAT A HIGHLIGHTER DOES: the band is the ink and the
  // letters are the paper showing through. The nominal pair for a primary surface is
  // `--primary-contrast`, and it is wrong here — in the dark theme this deck pins, that token
  // is #FFFFFF, and white on #F3652B MEASURES 3.0:1 on the rendered slide; black on the same
  // orange measures 6.71:1. This is reading copy at 56px, not a badge, so the legible pair wins
  // and the nominal one is recorded as the theme gap it is. (On the light theme `--bg-canvas` is #FAFAFA and the band would need the
  // other ink.)
  //
  // `box-decoration-clone` IS WHAT MAKES IT A HIGHLIGHTER rather than one long banner: an
  // inline that wraps across three lines gets its padding on EVERY fragment, so each line
  // carries its own band. Without it the padding lands once, at the start of the run and the
  // end of it, and the middle lines bleed to the column's edges.
  import { computed } from 'vue'

  const props = defineProps({
    /** The sentence, verbatim. */
    text: { type: String, default: '' },
    /** Phrases inside it to highlight, exactly as they are written in `text`. */
    emphasis: { type: Array, default: () => [] }
  })

  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  /** The sentence, split into plain runs and marked ones. */
  const runs = computed(() => {
    const phrases = (props.emphasis ?? []).filter(Boolean)
    if (!phrases.length) return [{ text: props.text, marked: false }]

    const pattern = new RegExp(`(${phrases.map(escape).join('|')})`, 'g')
    return props.text
      .split(pattern)
      .filter((run) => run.length > 0)
      .map((run) => ({ text: run, marked: phrases.includes(run) }))
  })
</script>

<template>
  <!-- An inline wrapper, so the caller's block keeps its own `text-pretty` / `text-balance` and
       its own type step. The runs are hugged against each other: a newline between two inline
       elements is a text node, and every space on this slide belongs to the copy. -->
  <span>
    <template
      v-for="(run, index) in runs"
      :key="index"
      ><mark
        v-if="run.marked"
        class="box-decoration-clone bg-(--primary) px-(--spacing-xs) py-(--spacing-xxs) text-(--bg-canvas)"
        >{{ run.text }}</mark
      ><template v-else>{{ run.text }}</template></template
    >
  </span>
</template>
