import { computed, type ComputedRef, nextTick, ref } from 'vue'

/** The message the list's live region reads out. */
export interface UseRuleListAnnouncementReturn {
  /** The last message. */
  announcement: ComputedRef<string>
  /** Reads a message out, even when it repeats. */
  announce: (text: string) => void
}

export function useRuleListAnnouncement(): UseRuleListAnnouncementReturn {
  const announcement = ref('')
  const announce = (text: string) => {
    announcement.value = ''
    nextTick(() => {
      announcement.value = text
    })
  }
  return { announcement: computed(() => announcement.value), announce }
}
