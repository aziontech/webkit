import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/**
 * Composable for managing popup positioning with hover/click behavior.
 * Shared by CellClipboard (popup mode) and CellExpand (popup variant).
 *
 * @param {Object} options
 * @param {import('vue').Ref<HTMLElement|null>} options.triggerRef - Element that triggers the popup
 * @param {import('vue').Ref<HTMLElement|null>} options.popupRef - The popup element itself
 * @param {number} [options.hoverDelay=1000] - Delay before showing popup on hover (ms)
 * @param {number} [options.hideDelay=100] - Delay before hiding popup after mouse leaves (ms)
 * @param {number} [options.maxWidth=320] - Max popup width for viewport calculations
 * @param {boolean} [options.clickToFix=false] - Allow clicking trigger to fix popup open
 */
export function usePopupPosition(options = {}) {
  const {
    triggerRef = ref(null),
    popupRef = ref(null),
    hoverDelay = 1000,
    hideDelay = 100,
    maxWidth = 320,
    clickToFix = false
  } = options

  const showPopup = ref(false)
  const popupPosition = ref({ posX: 0, posY: 0 })
  const hoverTimeout = ref(null)
  const popupHovered = ref(false)
  const isFixed = ref(false)

  const popupStyle = computed(() => ({
    left: `${popupPosition.value.posX}px`,
    top: `${popupPosition.value.posY}px`,
    maxWidth: `${maxWidth}px`
  }))

  function updatePosition() {
    const el = triggerRef.value
    const rect = el?.getBoundingClientRect?.() ?? el?.$el?.getBoundingClientRect?.()
    if (!rect) return

    const viewportWidth = window.innerWidth
    let posX = rect.right + 6

    if (posX + maxWidth > viewportWidth) {
      posX = rect.left - maxWidth - 6
    }

    popupPosition.value = {
      posX,
      posY: rect.top
    }
  }

  function handleTriggerMouseEnter() {
    if (isFixed.value) return

    hoverTimeout.value = setTimeout(() => {
      updatePosition()
      showPopup.value = true
    }, hoverDelay)
  }

  function handleTriggerMouseLeave() {
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
      hoverTimeout.value = null
    }

    if (isFixed.value) return

    setTimeout(() => {
      if (!popupHovered.value) {
        showPopup.value = false
      }
    }, hideDelay)
  }

  function handlePopupMouseEnter() {
    popupHovered.value = true
  }

  function handlePopupMouseLeave() {
    popupHovered.value = false
    if (!isFixed.value) {
      showPopup.value = false
    }
  }

  function handleTriggerClick() {
    if (!clickToFix) return

    isFixed.value = !isFixed.value
    if (isFixed.value) {
      updatePosition()
      showPopup.value = true
    } else {
      showPopup.value = false
    }
  }

  function handleClickOutside(event) {
    if (!isFixed.value) return

    const clickedInsideTrigger = triggerRef.value?.contains?.(event.target)
    const clickedInsidePopup = popupRef.value?.contains?.(event.target)

    if (!clickedInsideTrigger && !clickedInsidePopup) {
      isFixed.value = false
      showPopup.value = false
    }
  }

  function hide() {
    showPopup.value = false
    isFixed.value = false
    popupHovered.value = false
  }

  if (clickToFix) {
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  }

  onBeforeUnmount(() => {
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
    }
  })

  return {
    showPopup,
    popupStyle,
    popupPosition,
    isFixed,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
    handlePopupMouseEnter,
    handlePopupMouseLeave,
    handleTriggerClick,
    hide
  }
}
