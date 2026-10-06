import { ref } from 'vue'

const channels = new WeakMap()

export const openChannel = (fields) => {
  let channel = channels.get(fields)
  if (!channel) {
    channel = ref(null)
    channels.set(fields, channel)
  }
  return channel
}

export const requestOpen = (fields, fieldId) => {
  const channel = openChannel(fields)
  channel.value = { field: fieldId, token: (channel.value?.token ?? 0) + 1 }
}
