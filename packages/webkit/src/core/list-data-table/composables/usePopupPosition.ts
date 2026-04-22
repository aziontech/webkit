import type { ComputedRef, Ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface PopupPositionOptions {
  triggerRef?: Ref<HTMLElement | null>
  popupRef?: Ref<HTMLElement | null>
  hoverDelay?: number
  hideDelay?: number
  maxWidth?: number
  clickToFix?: boolean
}

interface PopupPositionReturn {
  showPopup: Ref<boolean>
  popupStyle: ComputedRef<{ left: string; top: string; maxWidth: string }>
  popupPosition: Ref<{ posX: number; posY: number }>
  isFixed: Ref<boolean>
  handleTriggerMouseEnter: () => void
  handleTriggerMouseLeave: () => void
  handlePopupMouseEnter: () => void
  handlePopupMouseLeave: () => void
  handleTriggerClick: () => void
  hide: () => void
}

/**
 * Composable for managing popup positioning with hover/click behavior.
 * Shared by CellClipboard (popup mode) and CellExpand (popup variant).
 */
export function usePopupPosition(options: PopupPositionOptions = {}): PopupPositionReturn {
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
  const hoverTimeout = ref<number | null>(null)
  const popupHovered = ref(false)
  const isFixed = ref(false)

  const popupStyle = computed(() => ({
    left: `${popupPosition.value.posX}px`,
    top: `${popupPosition.value.posY}px`,
    maxWidth: `${maxWidth}px`
  }))

  function updatePosition() {
    const el = triggerRef.value
    // @ts-expect-error - Handle both HTMLElement and Vue component with $el property
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

  function handleClickOutside(event: MouseEvent): void {
    if (!isFixed.value) return

    const clickedInsideTrigger = triggerRef.value?.contains?.(event.target as Node | null)
    const clickedInsidePopup = popupRef.value?.contains?.(event.target as Node | null)

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
