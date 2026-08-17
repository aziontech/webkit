<script setup>
  // FirstUseCard — one way into a product, with the art carrying the explanation.
  //
  // The earlier shape put a 16px glyph beside the title (ProductEmptyStates.vue, from
  // the Figma frame). A glyph at that size can only repeat what the title already
  // says, so this card drops it and gives the top of the card to a real
  // illustration: the webkit Illustration scene for that product, on its own stage.
  // The art is the only thing on a first-access screen that can show what the
  // product DOES before the reader owns one.
  //
  // ── THE STAGE ──
  //
  // A panel at 4/3, not a shrink-wrap around the art: the three cards in a row have to
  // agree on where their titles start, and an illustration that sized itself would put
  // each title at a different y. A RATIO rather than a fixed height so the stage scales
  // with the card (299×224 in the row, 322×242 standing alone) instead of being a fixed
  // band whose air changes at every breakpoint.
  //
  // A solid hairline, not a dashed one. Dashed reads as a DROP TARGET (the reference
  // this shape came from uses it on a card you can drag a folder onto), and none of
  // these cards accept a drop.
  //
  // ── THE ACTION IS A SLOT ──
  //
  // Because it is not always a button: one of the three core resources starts with a
  // domain the reader types, so that card's action is an input. A `buttonLabel` prop
  // would have forced a second prop for the input, then a third for which one to
  // render — the anatomy is a slot (.claude/rules/compound-api.md § elements vs
  // props, which the sample follows even though it is not the DS itself).
  import CardBox from '@aziontech/webkit/card-box'
  import Illustration from '@aziontech/webkit/illustration'

  import AgentIllustration from './AgentIllustration.vue'
  import DomainIllustration from './DomainIllustration.vue'
  import FrameworkIllustration from './FrameworkIllustration.vue'

  // Scenes composed in this app rather than named from the registry, keyed by the
  // `composed:` sentinel a card passes as its `illustration`. One entry per scene, so
  // the card stays the single place that decides how art is resolved and no call site
  // has to know which of the two kinds it is holding.
  //
  // All three doors are composed now, each because the closest registry asset drew the
  // wrong sentence — the reasons are in the scenes themselves. The registry still backs
  // the returning Overview's other resources (`waf-rules` for Workloads).
  const COMPOSED = {
    'composed:domain': DomainIllustration,
    'composed:frameworks': FrameworkIllustration,
    'composed:agents': AgentIllustration
  }

  defineProps({
    // Either a registered webkit Illustration asset name (`build`, `waf-rules`, …) or a
    // `composed:<name>` sentinel resolved through COMPOSED above.
    illustration: { type: String, required: true },
    // What this way in gets you, as an action rather than a noun.
    title: { type: String, required: true },
    // One or two lines: what it is, and what comes included.
    description: { type: String, required: true },
    // Accessible name for the art. Empty keeps it decorative, which is the default
    // and the right answer whenever the title already says what the picture shows.
    illustrationLabel: { type: String, default: '' }
  })
</script>

<template>
  <!-- No `h-full` on the root: a grid item already stretches to its track, so the row
       gets equal heights for free, while a card standing ALONE in a column keeps its
       content height. With `h-full` the standalone card inherited the whole section's
       height and `flex-1` opened a hole between the description and the action. -->
  <CardBox :padded="false">
    <template #content>
      <div class="flex h-full flex-col p-[var(--spacing-sm)]">
        <!-- The stage, at 4/3. A RATIO rather than a fixed height: the stage then
             scales with the card instead of being a 160px band whose air changes with
             every breakpoint, and three cards in a row still agree on where their
             titles start because they are the same width. `overflow-hidden` because a
             scene is drawn on a fixed 170×128 canvas and the narrowest card is
             narrower than that. -->
        <div
          class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
        >
          <!-- A composed scene brings its own <Illustration> root (it needs one, to
               provide size/active to its parts), so it is rendered directly. -->
          <component
            :is="COMPOSED[illustration]"
            v-if="COMPOSED[illustration]"
            :aria-label="illustrationLabel"
          />
          <!-- No `size`: a REGISTERED asset ignores it. Assets are authored against
               the fixed 170×128 canvas and render at their designed scale, so `size`
               only ever reaches a hand-composed scene. Passing it here would read as
               a knob that does nothing. -->
          <Illustration
            v-else
            :name="illustration"
            :aria-label="illustrationLabel"
          />
        </div>

        <!-- `flex-1` on the text so the actions land on one line across the row
             without pinning the copy to a pixel height. -->
        <div
          class="flex flex-1 flex-col gap-[var(--spacing-md)] px-[var(--spacing-sm)] pb-[var(--spacing-sm)] pt-[var(--spacing-md)]"
        >
          <div class="flex flex-1 flex-col gap-[var(--spacing-xs)]">
            <h3 class="text-label-md text-[var(--text-default)]">{{ title }}</h3>
            <p class="text-pretty text-body-sm text-[var(--text-muted)]">{{ description }}</p>
          </div>
          <div class="flex items-center gap-[var(--spacing-xs)]">
            <slot name="action" />
          </div>
        </div>
      </div>
    </template>
  </CardBox>
</template>
