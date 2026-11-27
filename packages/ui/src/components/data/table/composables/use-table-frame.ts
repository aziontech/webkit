import { computed, type ComputedRef, ref, useId } from 'vue'

export interface UseTableFrameReturn {
  /** Id a TableCaption takes, so the table is labelled by it. */
  captionId: string
  /** A TableCaption registers while mounted; returns the unregister function. */
  registerCaption: () => () => void
  /** Attributes for the root frame: everything but `aria-*`. */
  frameAttrs: ComputedRef<Record<string, unknown>>
  /** Attributes for the `role="table"` element: the `aria-*` ones, labelled by the caption when nothing names it. */
  tableAttrs: () => Record<string, unknown>
}

export function useTableFrame(
  attrs: Record<string, unknown>,
  captioned: () => boolean
): UseTableFrameReturn {
  const captionId = `${useId()}-caption`
  const captions = ref<number>(0)
  const split = computed<[Record<string, unknown>, Record<string, unknown>]>(() => {
    const frame: Record<string, unknown> = {}
    const own: Record<string, unknown> = {}
    for (const name in attrs) (name.startsWith('aria-') ? own : frame)[name] = attrs[name]
    return [frame, own]
  })
  return {
    captionId,
    registerCaption: () => {
      captions.value++
      return () => captions.value--
    },
    frameAttrs: computed(() => split.value[0]),
    tableAttrs: () => {
      const own = split.value[1]
      return (captions.value || captioned()) && !own['aria-label'] && !own['aria-labelledby']
        ? { ...own, 'aria-labelledby': captionId }
        : own
    }
  }
}
