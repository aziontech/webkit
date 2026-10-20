import { toast } from '@aziontech/webkit/toast'
import { computed, ref } from 'vue'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const saveGroup = async (flag, message, commit) => {
  if (flag.value) return
  flag.value = true
  try {
    await sleep(900)
    commit()
    toast.success(message)
  } catch (error) {
    toast.error('Could not save the settings.', {
      description: error?.message ?? 'Check your connection and try again.'
    })
  } finally {
    flag.value = false
  }
}

export const useBaseline = (group) => {
  const snapshot = () => JSON.stringify(typeof group === 'function' ? group() : group)
  const baseline = ref(snapshot())
  return {
    dirty: computed(() => snapshot() !== baseline.value),
    commit: () => {
      baseline.value = snapshot()
    }
  }
}
