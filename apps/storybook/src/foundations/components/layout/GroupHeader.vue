<script setup>
  defineProps({
    /** Group label inside a section — one token family or ramp. */
    title: {
      type: String,
      required: true
    },
    /** Optional one-line note under the label. */
    description: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <div class="mb-(--spacing-sm) flex flex-col gap-(--spacing-xs)">
    <h3
      class="m-0 border-b border-solid border-(--border-default) pb-(--spacing-xs) text-overline-md text-(--text-muted)"
    >
      {{ title }}
    </h3>
    <p
      v-if="description"
      class="m-0 max-w-(--container-3xl) text-body-sm text-(--text-muted)"
    >
      {{ description }}
    </p>
  </div>
</template>
