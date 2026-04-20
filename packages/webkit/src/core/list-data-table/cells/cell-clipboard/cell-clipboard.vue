<script setup>
  import { computed, ref } from 'vue'

  import CopyBlock from '../../../../components/buttons/button-copy/button-copy.vue'
  import { usePopupPosition } from '../../composables/usePopupPosition.js'

  const props = defineProps({
    content: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'full',
      validator: (v) => ['full', 'hover', 'popup'].includes(v)
    },
    showCopy: {
      type: Boolean,
      default: true
    },
    sliceValue: {
      type: Number,
      default: 25
    },
    emptyValue: {
      type: String,
      default: '-'
    },
    asLink: {
      type: Boolean,
      default: false
    }
  })

  const isCellHovered = ref(false)
  const textElement = ref(null)
  const popupRef = ref(null)
  const showAllText = ref(false)

  // Popup positioning (for popup mode)
  const {
    showPopup,
    popupStyle,
    handleTriggerMouseEnter: handleTextMouseEnter,
    handleTriggerMouseLeave: handleTextMouseLeave,
    handlePopupMouseEnter,
    handlePopupMouseLeave
  } = usePopupPosition({
    triggerRef: textElement,
    popupRef
  })

  const shouldShowCopy = computed(() => {
    return props.showCopy && props.content
  })

  // Hover mode: truncated text with toggle
  const isTruncated = computed(() => {
    return props.content?.length > props.sliceValue
  })

  const truncatedText = computed(() => {
    if (!isTruncated.value || showAllText.value) return props.content
    return `${props.content.slice(0, props.sliceValue)}...`
  })

  const toggleText = computed(() => {
    return showAllText.value ? 'Show less' : 'Show more'
  })

  // Popup mode: check if text is actually truncated by CSS
  const isTextOverflowing = () => {
    if (!textElement.value) return false
    return textElement.value.scrollWidth > textElement.value.clientWidth
  }

  const handlePopupTriggerEnter = () => {
    if (!isTextOverflowing()) return
    handleTextMouseEnter()
  }

  const handleCellMouseEnter = () => {
    isCellHovered.value = true
  }

  const handleCellMouseLeave = () => {
    isCellHovered.value = false
  }
</script>

<template>
  <!-- Mode: full — always show text + copy -->
  <div
    v-if="mode === 'full'"
    class="gap-2 flex items-center"
  >
    <span :class="{ 'text-[var(--text-color)] hover:underline cursor-pointer': asLink }">{{
      content || emptyValue
    }}</span>
    <CopyBlock
      v-if="shouldShowCopy"
      :value="content"
      v-tooltip.top="{ value: 'Copy to clipboard', showDelay: 200 }"
    />
  </div>

  <!-- Mode: hover — truncated text + hover-visible copy -->
  <div
    v-else-if="mode === 'hover'"
    class="gap-2 flex items-center w-full justify-between pr-1"
    @mouseenter="handleCellMouseEnter"
    @mouseleave="handleCellMouseLeave"
  >
    <ul class="flex flex-col gap-1">
      <li class="whitespace-pre">{{ truncatedText }}</li>
      <li
        v-if="isTruncated"
        class="underline cursor-pointer"
        @click.stop="showAllText = !showAllText"
      >
        {{ toggleText }}
      </li>
    </ul>
    <CopyBlock
      v-if="shouldShowCopy"
      :value="content"
      :isCopyVisible="isCellHovered"
      v-tooltip.top="{ value: 'Copy to clipboard', showDelay: 200 }"
    />
  </div>

  <!-- Mode: popup — truncated by CSS + hover popup + copy -->
  <div
    v-else-if="mode === 'popup'"
    class="flex items-center gap-1 relative w-full pr-1"
    @mouseenter="handleCellMouseEnter"
    @mouseleave="handleCellMouseLeave"
  >
    <p
      ref="textElement"
      class="overflow-hidden whitespace-nowrap text-ellipsis flex-1 min-w-0"
      :class="{ 'text-[var(--text-color)] hover:underline cursor-pointer': asLink }"
      @mouseenter="handlePopupTriggerEnter"
      @mouseleave="handleTextMouseLeave"
    >
      {{ content }}
    </p>
    <CopyBlock
      v-if="shouldShowCopy"
      :value="content"
      :isCopyVisible="isCellHovered"
      v-tooltip.top="{ value: 'Copy to clipboard', showDelay: 200 }"
    />
    <template v-if="showPopup">
      <Teleport to="body">
        <div
          ref="popupRef"
          class="absolute z-[9999] max-w-80 rounded-md py-2 px-3 bg-[var(--surface-100)] border border-[var(--surface-border)]"
          :style="popupStyle"
          @mouseenter="handlePopupMouseEnter"
          @mouseleave="handlePopupMouseLeave"
        >
          <p class="text-xs break-words">{{ content }}</p>
        </div>
      </Teleport>
    </template>
  </div>
</template>
