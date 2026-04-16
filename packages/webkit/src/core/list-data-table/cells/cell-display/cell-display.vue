<script setup>
  import Avatar from 'primevue/avatar'
  import Button from 'primevue/button'
  import Tag from 'primevue/tag'
  import { computed } from 'vue'

  const props = defineProps({
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (v) => ['left', 'right'].includes(v)
    },
    avatar: {
      type: String,
      default: ''
    },
    tag: {
      type: Object,
      default: null
    },
    tooltip: {
      type: String,
      default: ''
    },
    tooltipPosition: {
      type: String,
      default: 'top',
      validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v)
    },
    clickable: {
      type: Boolean,
      default: false
    },
    clickVariant: {
      type: String,
      default: 'text',
      validator: (v) => ['text', 'link', 'tag'].includes(v)
    },
    onClick: {
      type: Function,
      default: null
    },
    clickProps: {
      type: Object,
      default: () => ({})
    },
    emptyValue: {
      type: String,
      default: '-'
    }
  })

  const hasTag = computed(() => {
    return !!(props.tag && Object.keys(props.tag).length)
  })

  const tooltipDirective = computed(() => {
    if (!props.tooltip) return undefined
    return { value: props.tooltip, showDelay: 200 }
  })

  const hasContent = computed(() => {
    return !!(props.text || props.avatar || props.icon || hasTag.value)
  })

  function handleClick() {
    if (props.onClick) {
      props.onClick(props.clickProps)
    }
  }
</script>

<template>
  <!-- Clickable Tag variant -->
  <Tag
    v-if="clickable && clickVariant === 'tag' && hasTag"
    v-bind="tag"
    class="cursor-pointer"
    @click.stop="handleClick"
  />

  <!-- Clickable Text/Link variant -->
  <Button
    v-else-if="clickable && (clickVariant === 'text' || clickVariant === 'link')"
    :text="clickVariant === 'text'"
    :link="clickVariant === 'link'"
    @click.stop="handleClick"
  >
    <p :class="{ 'p-link underline': clickVariant === 'link' }">{{ text }}</p>
  </Button>

  <!-- Standard display -->
  <div
    v-else-if="hasContent"
    class="gap-2 flex items-center"
    v-tooltip:[tooltipPosition]="avatar && tooltipDirective ? tooltipDirective : undefined"
  >
    <Avatar
      v-if="avatar"
      :label="avatar"
    />
    <i
      v-if="icon && iconPosition === 'left'"
      :class="icon"
      v-tooltip:[tooltipPosition]="!avatar && tooltipDirective ? tooltipDirective : undefined"
      :style="tooltip ? 'cursor: pointer' : undefined"
    />
    <p v-if="text">{{ text }}</p>
    <i
      v-if="icon && iconPosition === 'right'"
      :class="icon"
    />
    <Tag
      v-if="hasTag"
      v-bind="tag"
      v-tooltip:[tooltipPosition]="!text && tooltipDirective ? tooltipDirective : undefined"
    />
  </div>

  <!-- Empty state -->
  <span v-else>{{ emptyValue }}</span>
</template>
