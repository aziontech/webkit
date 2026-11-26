import { getCurrentInstance, onMounted } from 'vue'

export function whenMounted(start: () => void): void {
  if (getCurrentInstance()) onMounted(start)
  else start()
}
