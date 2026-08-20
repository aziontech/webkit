<script setup>
  // THE SUCCESS MARK — a filled disc with a check in it, and the one place this console
  // draws "this is done".
  //
  // It is the mark the deployment pipeline already uses for a finished step
  // (../../../shared/ui/deployment/DeploymentLogs.vue). Copying its treatment rather than
  // inventing a second one matters here specifically: the application create flow ENDS in
  // that pipeline, so a reader watches this mark on the wizard's progress and then watches
  // the deploy's steps settle a few seconds later. Two different green affordances for the
  // same idea, back to back in one flow, reads as two unrelated systems.
  //
  // A FILLED disc, not an outline glyph (`pi-check-circle`): a finished thing should
  // register as a solid mark at a glance rather than as one more stroke among strokes,
  // which is the whole reason the pipeline draws it this way.
  //
  // The glyph is `aria-hidden` — it is never the only thing saying a step is done. Callers
  // carry that in text (`aria-current`, a "Created" Tag, the part's own label).

  defineProps({
    // Outer box, so the mark occupies the same column as whatever sits in the rows
    // around it. The disc inside is one step smaller, as in the pipeline.
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium'].includes(value)
    }
  })
</script>

<template>
  <span
    :data-size="size"
    class="flex shrink-0 items-center justify-center data-[size=small]:size-4 data-[size=medium]:size-5"
  >
    <span
      :data-size="size"
      class="flex items-center justify-center rounded-full bg-(--success) data-[size=small]:size-3.5 data-[size=medium]:size-4"
    >
      <i
        :data-size="size"
        class="pi pi-check leading-none text-(--success-contrast) data-[size=small]:text-[8px] data-[size=medium]:text-[9px]"
        aria-hidden="true"
      />
    </span>
  </span>
</template>
