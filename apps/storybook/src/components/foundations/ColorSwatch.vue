<template>
  <div class="flex flex-col gap-1">
    <!-- Color chip(s) -->
    <div
      v-if="darkValue && darkValue !== value"
      class="flex rounded overflow-hidden"
      :class="chipClass"
    >
      <div
        class="flex-1"
        :style="{ backgroundColor: value }"
        :title="`Light: ${value}`"
      />
      <div
        class="flex-1"
        :style="{ backgroundColor: darkValue }"
        :title="`Dark: ${darkValue}`"
      />
    </div>
    <div
      v-else
      class="rounded"
      :class="chipClass"
      :style="{ backgroundColor: value }"
      :title="value"
    />

    <!-- Labels -->
    <div class="flex flex-col gap-0.5">
      <span class="text-body-xs font-medium text-default truncate" :title="name">{{ name }}</span>
      <span v-if="cssVar" class="text-body-xss text-muted font-mono truncate">{{ cssVar }}</span>
      <span class="text-body-xss text-muted font-mono">{{ value }}</span>
      <span v-if="darkValue && darkValue !== value" class="text-body-xss text-muted font-mono">{{ darkValue }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorSwatch',
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    darkValue: {
      type: String,
      default: null,
    },
    cssVar: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
  },
  computed: {
    chipClass() {
      return {
        sm: 'h-8',
        md: 'h-12',
        lg: 'h-16',
      }[this.size]
    },
  },
}
</script>
