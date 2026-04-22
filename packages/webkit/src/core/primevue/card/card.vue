<script setup>
  import Card from 'primevue/card'

  defineOptions({ name: 'Card' })

  const props = defineProps({
    class: {
      type: String,
      default: ''
    },
    pt: {
      type: Object,
      default: undefined
    }
  })
</script>

<template>
  <Card
    :class="props.class"
    :pt="props.pt"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>
    <template
      v-if="$slots.title"
      #title
    >
      <slot name="title" />
    </template>
    <template
      v-if="$slots.subtitle"
      #subtitle
    >
      <slot name="subtitle" />
    </template>
    <template
      v-if="$slots.content"
      #content
    >
      <slot name="content" />
    </template>
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </Card>
</template>
