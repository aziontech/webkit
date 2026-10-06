<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { hostOptions, hostRecords } from '../../lib/behavior/application-binding'
  import { hostHasModule, moduleRequirementFor } from '../../lib/data/resource-dependencies'
  import HostChooser from './HostChooser.vue'

  interface Props {
    resource: string
    title?: string
    icon?: string
    binding: Record<string, unknown>
    host: Record<string, unknown>
    unit?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    icon: 'pi pi-box',
    unit: 'resource',
    disabled: false
  })

  const emit = defineEmits<{
    'empty-action': []
    answer: []
  }>()

  const choice = defineModel('choice', { type: Object, default: null })

  const enableModule = defineModel('enableModule', { type: Boolean, default: false })

  const kind = computed(() => props.binding.host)
  const requirement = computed(() => moduleRequirementFor(props.resource, kind.value))
  const options = computed(() => hostOptions(kind.value))
  const chosenName = computed(() => choice.value?.name ?? '')

  const readiness = computed(() => {
    const records = hostRecords(kind.value)
    const map = new Map()
    for (const option of options.value) {
      const record = records.find((item) => item.name === option.value)
      map.set(option.value, hostHasModule(record, requirement.value))
    }
    return map
  })

  const onChoose = (next) => {
    choice.value = next
    enableModule.value = false
    emit('answer')
  }

  const onSkip = () => {
    choice.value = null
    enableModule.value = false
    emit('answer')
  }
</script>

<template>
  <HostChooser
    :title="title"
    :icon="icon"
    :noun="host.noun"
    :host-icon="host.icon"
    :options="options"
    :can-create="host.canCreate"
    :empty-label="host.emptyLabel"
    :selected="chosenName"
    :disabled="disabled"
    wide
    class="mx-auto"
    @choose="onChoose"
    @skip="onSkip"
    @empty-action="emit('empty-action')"
  >
    <template #row="{ option }">
      <Tag
        v-if="requirement && !readiness.get(option.value)"
        :label="`${requirement.label} off`"
        severity="warning"
        size="small"
      />
    </template>

  </HostChooser>
</template>
