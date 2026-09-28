<script setup>
  // One cell of the illustrations bento: an official scene from the webkit illustration
  // library under its title, with the claim it illustrates below.
  //
  // It lives in its own component because the bento renders it from two places: the main
  // grid loops the scenes, and the closing 50/50 row places the Deploy scene beside the
  // live deploy log. One definition, so the two can never drift.
  import Illustration from '@aziontech/webkit/illustration'

  defineProps({
    // { key, title, icon, illustration, lead, body }
    scene: {
      type: Object,
      required: true
    },
    // Render the lead + body caption under the visual. Off for a scene whose caption
    // would repeat what the cell beside it already says.
    captioned: {
      type: Boolean,
      default: true
    }
  })
</script>

<template>
  <!-- `bg-(--bg-canvas)` is required of every divider-grid child: the grid's 1px gaps ARE
       its rules, and a cell that does not fill its own background lets the wrapper's
       border colour flood it. -->
  <article class="flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-lg)">
    <header
      class="flex items-center gap-(--spacing-xs) text-label-code-md text-(--text-muted)"
    >
      <i
        :class="scene.icon"
        class="leading-none text-(--primary)"
        aria-hidden="true"
      />
      {{ scene.title }}
    </header>

    <!-- `my-auto` only when there is no caption: the header stays on the top edge and the
         drawing centres in whatever height the cell beside it forces (the live deploy log
         is far taller than the art). With a caption the three blocks stack from the top. -->
    <Illustration
      :name="scene.illustration"
      :aria-label="`${scene.title}: ${scene.lead}`"
      :class="captioned ? '' : 'my-auto'"
    />

    <p
      v-if="captioned"
      class="text-pretty text-body-sm text-(--text-muted)"
    >
      <span class="font-medium text-(--text-default)">{{ scene.lead }}</span>
      {{ ' ' }}{{ scene.body }}
    </p>
  </article>
</template>
