<script setup lang="ts">
  import { computed } from 'vue'

  import CreationHeader from '../page/CreationHeader.vue'
  import HostChooser from './HostChooser.vue'

  interface Props {
    title: string
    icon?: string
    noun?: string
    hostIcon?: string
    options?: unknown[]
    canCreate?: boolean
    emptyLabel?: string
    breadcrumb?: unknown[]
    backLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    icon: 'pi pi-box',
    noun: 'application',
    hostIcon: 'ai ai-edge-application',
    options: () => [],
    canCreate: true,
    emptyLabel: '',
    breadcrumb: () => [],
    backLabel: 'Back'
  })

  const emit = defineEmits<{
    choose: []
    skip: []
    'empty-action': []
    back: []
    navigate: []
  }>()

  const chooser = computed(() => ({
    title: props.title,
    icon: props.icon,
    noun: props.noun,
    hostIcon: props.hostIcon,
    options: props.options,
    canCreate: props.canCreate,
    emptyLabel: props.emptyLabel
  }))
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <CreationHeader
      :breadcrumb="breadcrumb"
      :back-label="backLabel"
      @back="emit('back')"
      @navigate="(event, href) => emit('navigate', event, href)"
    />

    <main
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col items-center overflow-auto px-(--spacing-md) py-(--spacing-xl)"
    >
      <HostChooser
        v-bind="chooser"
        class="m-auto"
        @choose="(choice) => emit('choose', choice)"
        @skip="emit('skip')"
        @empty-action="emit('empty-action')"
      />
    </main>
  </div>
</template>
