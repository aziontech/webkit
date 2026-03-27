<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import CopyBlock from '../../../../components/buttons/button-copy/button-copy.vue'
  import { usePopupPosition } from '../../composables/usePopupPosition.js'

  const props = defineProps({
    value: {
      type: [String, Array],
      required: true
    },
    variant: {
      type: String,
      default: '',
      validator: (v) => ['', 'list', 'text', 'popup'].includes(v)
    },
    limit: {
      type: Number,
      default: 0
    },
    showCopy: {
      type: Boolean,
      default: false
    }
  })

  // Infer variant from value type if not provided
  const resolvedVariant = computed(() => {
    if (props.variant) return props.variant
    return Array.isArray(props.value) ? 'list' : 'text'
  })

  const resolvedLimit = computed(() => {
    if (props.limit > 0) return props.limit
    return resolvedVariant.value === 'text' ? 25 : 2
  })

  // Shared state
  const showAllItems = ref(false)
  const isCellHovered = ref(false)

  // === LIST variant ===
  const arrayValue = computed(() => {
    return Array.isArray(props.value) ? props.value : []
  })

  const visibleItems = computed(() => {
    if (showAllItems.value) return arrayValue.value
    return arrayValue.value.slice(0, resolvedLimit.value)
  })

  const hasMoreItems = computed(() => {
    return arrayValue.value.length > resolvedLimit.value
  })

  const remainingCount = computed(() => {
    return arrayValue.value.length - resolvedLimit.value
  })

  const listToggleText = computed(() => {
    return showAllItems.value ? 'Show less' : `Show more (${remainingCount.value})`
  })

  const listCopyValue = computed(() => {
    return arrayValue.value.join('\n')
  })

  const shouldShowListCopy = computed(() => {
    return props.showCopy && arrayValue.value.length > 0
  })

  // === TEXT variant ===
  const textValue = computed(() => {
    return typeof props.value === 'string' ? props.value : ''
  })

  const isTextLong = computed(() => {
    return textValue.value.length > resolvedLimit.value
  })

  const visibleText = computed(() => {
    if (showAllItems.value || !isTextLong.value) return textValue.value
    return `${textValue.value.slice(0, resolvedLimit.value)}...`
  })

  const textToggleText = computed(() => {
    return showAllItems.value ? 'Show less' : 'Show more'
  })

  // === POPUP variant ===
  const tagElement = ref(null)
  const popupElement = ref(null)

  const {
    showPopup,
    popupStyle,
    handleTriggerMouseEnter: handleTagMouseEnter,
    handleTriggerMouseLeave: handleTagMouseLeave,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
    handleTriggerClick: handleTagClick
  } = usePopupPosition({
    triggerRef: tagElement,
    popupRef: popupElement,
    clickToFix: true
  })

  const remainingPopupItems = computed(() => {
    return arrayValue.value.slice(1)
  })

  const allItemsAsString = computed(() => {
    return arrayValue.value.join('\n')
  })

  const shouldShowPopupCopy = computed(() => {
    return props.showCopy && arrayValue.value.length > 0
  })

  // Shared handlers
  const toggleShowAll = () => {
    showAllItems.value = !showAllItems.value
  }

  const handleCellMouseEnter = () => {
    isCellHovered.value = true
  }

  const handleCellMouseLeave = () => {
    isCellHovered.value = false
  }
</script>

<template>
  <!-- Variant: list — show N items + "Show more" toggle -->
  <div
    v-if="resolvedVariant === 'list'"
    class="flex gap-2 align-center"
  >
    <ul class="flex flex-col gap-1">
      <li
        v-for="(item, index) in visibleItems"
        :key="index"
      >
        {{ item }}
      </li>
      <li
        v-if="hasMoreItems"
        class="underline cursor-pointer"
        @click.stop="toggleShowAll"
      >
        {{ listToggleText }}
      </li>
    </ul>
    <CopyBlock
      v-if="shouldShowListCopy"
      :value="listCopyValue"
      v-tooltip.top="{ value: 'Copy to clipboard', showDelay: 200 }"
    />
  </div>

  <!-- Variant: text — show N chars + "Show more" toggle -->
  <ul
    v-else-if="resolvedVariant === 'text'"
    class="flex flex-col gap-1"
    :class="{ 'py-2': isTextLong }"
  >
    <li class="whitespace-pre">{{ visibleText }}</li>
    <li
      v-if="isTextLong"
      class="underline cursor-pointer"
      @click.stop="toggleShowAll"
    >
      {{ textToggleText }}
    </li>
  </ul>

  <!-- Variant: popup — empty state -->
  <span v-else-if="resolvedVariant === 'popup' && arrayValue.length === 0">-</span>

  <!-- Variant: popup — first item + "+N" badge + teleport popup -->
  <div
    v-else-if="resolvedVariant === 'popup' && arrayValue.length > 0"
    class="flex items-center gap-1 relative w-full pr-1"
    @mouseenter="handleCellMouseEnter"
    @mouseleave="handleCellMouseLeave"
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <p class="overflow-hidden whitespace-nowrap text-ellipsis">
        {{ arrayValue[0] }}
      </p>
      <span
        v-if="arrayValue.length > 1"
        ref="tagElement"
        class="text-xs bg-[var(--surface-section)] px-2 py-1 rounded-md border border-[var(--surface-border)] cursor-pointer"
        @mouseenter="handleTagMouseEnter"
        @mouseleave="handleTagMouseLeave"
        @click.stop="handleTagClick"
      >
        +{{ arrayValue.length - 1 }}
      </span>
    </div>
    <CopyBlock
      v-if="shouldShowPopupCopy"
      :value="allItemsAsString"
      :isCopyVisible="isCellHovered"
      v-tooltip.top="{ value: 'Copy to clipboard', showDelay: 200 }"
    />
    <template v-if="showPopup">
      <Teleport to="body">
        <div
          ref="popupElement"
          class="absolute z-[9999] w-fit rounded-md py-2 px-3 bg-[var(--surface-100)] border border-[var(--surface-border)] overflow-y-auto"
          :style="popupStyle"
          style="max-height: 216px"
          @mouseenter="handlePopupMouseEnter"
          @mouseleave="handlePopupMouseLeave"
        >
          <ul class="text-xs space-y-1">
            <li
              v-for="(item, index) in remainingPopupItems"
              :key="index"
              class="break-words"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </Teleport>
    </template>
  </div>
</template>

<style scoped>
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: var(--surface-800) var(--surface-100);
  }
</style>
