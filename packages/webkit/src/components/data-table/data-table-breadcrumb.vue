<template>
  <div
    class="flex items-center gap-1 text-sm overflow-hidden"
    data-testid="data-table-breadcrumb"
    ref="breadcrumbRef"
  >
    <template v-if="hiddenSegments.length > 0">
      <button
        class="text-color-secondary hover:text-color cursor-pointer px-1"
        @mouseenter="showOverflow"
        @mouseleave="hideOverflowDebounced"
        ref="overflowTrigger"
        data-testid="data-table-breadcrumb-overflow"
      >
        ...
      </button>
      <span class="text-color-secondary">{{ separator }}</span>

      <OverlayPanel
        ref="overflowPanel"
        :pt="{ content: { class: 'p-2' } }"
      >
        <div class="flex flex-col gap-1">
          <button
            v-for="(segment, index) in hiddenSegments"
            :key="index"
            class="text-left text-sm px-2 py-1 rounded hover:bg-[var(--surface-hover)] cursor-pointer whitespace-nowrap"
            @click="handleNavigate(segment.path)"
          >
            {{ segment.label }}
          </button>
        </div>
      </OverlayPanel>
    </template>

    <template
      v-for="(segment, index) in visibleSegments"
      :key="index"
    >
      <button
        class="text-color-secondary hover:text-color cursor-pointer truncate max-w-[200px]"
        :class="{ 'text-color font-medium': index === visibleSegments.length - 1 }"
        @click="handleNavigate(segment.path)"
        :title="segment.label"
        data-testid="data-table-breadcrumb-segment"
      >
        {{ segment.label }}
      </button>
      <span
        v-if="index < visibleSegments.length - 1"
        class="text-color-secondary flex-shrink-0"
      >
        {{ separator }}
      </span>
    </template>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import OverlayPanel from 'primevue/overlaypanel'

  defineOptions({ name: 'DataTableBreadcrumb' })

  const props = defineProps({
    path: {
      type: String,
      default: ''
    },
    containerWidth: {
      type: Number,
      default: 600
    },
    separator: {
      type: String,
      default: '/'
    }
  })

  const emit = defineEmits(['navigate'])

  const overflowPanel = ref(null)
  const overflowTrigger = ref(null)
  let hideTimeout = null

  const segments = computed(() => {
    if (!props.path) return []

    const parts = props.path.split('/').filter(Boolean)
    return parts.map((part, index) => ({
      label: part,
      path: '/' + parts.slice(0, index + 1).join('/')
    }))
  })

  const maxVisibleItems = computed(() => {
    const avgCharWidth = 10
    const separatorWidth = 20
    const overflowButtonWidth = 40
    const availableWidth = props.containerWidth - overflowButtonWidth
    let count = 0
    let usedWidth = 0

    for (let i = segments.value.length - 1; i >= 0; i--) {
      const segmentWidth = Math.min(segments.value[i].label.length * avgCharWidth, 200) + separatorWidth
      if (usedWidth + segmentWidth > availableWidth && count > 0) {
        break
      }
      usedWidth += segmentWidth
      count++
    }

    return Math.max(1, count)
  })

  const visibleSegments = computed(() => {
    if (segments.value.length <= maxVisibleItems.value) {
      return segments.value
    }
    return segments.value.slice(segments.value.length - maxVisibleItems.value)
  })

  const hiddenSegments = computed(() => {
    if (segments.value.length <= maxVisibleItems.value) {
      return []
    }
    return segments.value.slice(0, segments.value.length - maxVisibleItems.value)
  })

  const handleNavigate = (segmentPath) => {
    emit('navigate', segmentPath)
    if (overflowPanel.value) {
      overflowPanel.value.hide()
    }
  }

  const showOverflow = (event) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    overflowPanel.value?.show(event)
  }

  const hideOverflowDebounced = () => {
    hideTimeout = setTimeout(() => {
      overflowPanel.value?.hide()
    }, 300)
  }
</script>
