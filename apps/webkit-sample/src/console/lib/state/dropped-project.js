import { ref } from 'vue'

const dropped = ref(null)

export const rememberDroppedProject = (project) => {
  dropped.value = project
}

export const droppedProjectFor = (name) =>
  dropped.value && dropped.value.name === name ? dropped.value : null
