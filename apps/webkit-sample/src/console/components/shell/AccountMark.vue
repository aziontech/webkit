<script setup lang="ts">
  import {
    CLIENTS,
    clientSymbolFor,
    normalizeClientName
  } from '@aziontech/webkit/assets/client-registry'
  import Avatar from '@aziontech/webkit/avatar'
  import { computed } from 'vue'

  import { accountInitials } from '../../lib/state/accounts.js'

  interface Props {
    name?: string
    size?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    size: 'medium'
  })

  const tile = computed(() => clientSymbolFor(props.name))

  const client = computed(() => {
    if (tile.value) return null
    const key = normalizeClientName(props.name)
    return CLIENTS.find((entry) => entry.symbol && normalizeClientName(entry.name) === key) ?? null
  })

  const isWhiteArtwork = computed(() => client.value?.artwork === 'light')

  const boxClasses =
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-(--shape-button)'

  const sizeClasses = {
    small: 'size-(--size-5)',
    medium: 'size-(--size-6)',
    large: 'size-(--size-12)'
  }

  const symbolClasses = {
    small: 'size-3',
    medium: 'size-3.5',
    large: 'size-7'
  }
</script>

<template>
  <span
    v-if="tile"
    role="img"
    :aria-label="name"
    :class="[sizeClasses[size] ?? sizeClasses.medium, boxClasses]"
  >
    <img
      :src="tile"
      alt=""
      aria-hidden="true"
      decoding="async"
      class="size-full object-cover"
    />
  </span>

  <span
    v-else-if="client && isWhiteArtwork"
    role="img"
    :aria-label="name"
    :style="{ backgroundColor: client.brand.base }"
    :class="[sizeClasses[size] ?? sizeClasses.medium, boxClasses]"
  >
    <img
      :src="client.symbol"
      alt=""
      aria-hidden="true"
      decoding="async"
      :class="[symbolClasses[size] ?? symbolClasses.medium, 'object-contain']"
    />
  </span>

  <span
    v-else-if="client"
    role="img"
    :aria-label="name"
    :class="[sizeClasses[size] ?? sizeClasses.medium, boxClasses]"
  >
    <img
      :src="client.symbol"
      alt=""
      aria-hidden="true"
      decoding="async"
      class="size-full object-cover"
    />
  </span>

  <Avatar
    v-else
    :label="accountInitials(name)"
    size="small"
    kind="square"
    class="border-(length:--border-width-default) border-(--border-default)"
  />
</template>
