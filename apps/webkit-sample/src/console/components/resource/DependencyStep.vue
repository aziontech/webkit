<script setup lang="ts">
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { hostOptions, hostRecords,HOSTS } from '../../lib/behavior/application-binding'
  import { hostHasModule, moduleRequirementFor } from '../../lib/data/resource-dependencies'
  import HostChooser from './HostChooser.vue'

  interface Props {
    resource: string
    title?: string
    icon?: string
    binding: Record<string, unknown>
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
    'empty-action': [kind: string]
    answer: []
  }>()

  const choice = defineModel('choice', { type: Object, default: null })

  const enableModule = defineModel('enableModule', { type: Boolean, default: false })

  const kind = defineModel<string>('kind', { default: '' })

  const kinds = computed(() => props.binding.kinds ?? [props.binding.host])
  const activeKind = computed(() =>
    kinds.value.includes(kind.value) ? kind.value : kinds.value[0]
  )
  const host = computed(() => HOSTS[activeKind.value] ?? HOSTS.application)

  const kindOptions = computed(() =>
    kinds.value.map((value) => ({
      value,
      label: HOSTS[value]?.label ?? capitalize(HOSTS[value]?.noun ?? value)
    }))
  )

  const requirement = computed(() => moduleRequirementFor(props.resource, activeKind.value))
  const options = computed(() => hostOptions(activeKind.value))
  const chosenName = computed(() =>
    choice.value?.kind && choice.value.kind !== activeKind.value ? '' : (choice.value?.name ?? '')
  )

  const readiness = computed(() => {
    const records = hostRecords(activeKind.value)
    const map = new Map()
    for (const option of options.value) {
      const record = records.find((item) => item.name === option.value)
      map.set(option.value, hostHasModule(record, requirement.value))
    }
    return map
  })

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const onKind = (next) => {
    kind.value = next
  }

  const onChoose = (next) => {
    choice.value = { ...next, kind: activeKind.value }
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
    :can-create="binding.canCreate ?? host.canCreate"
    :empty-label="host.emptyLabel"
    :selected="chosenName"
    :disabled="disabled"
    wide
    class="mx-auto"
    @choose="onChoose"
    @skip="onSkip"
    @empty-action="emit('empty-action', activeKind)"
  >
    <template
      v-if="kindOptions.length > 1"
      #kinds
    >
      <SegmentedButton
        :model-value="activeKind"
        :options="kindOptions"
        :aria-label="`Where the ${unit} is used`"
        size="medium"
        fluid
        @update:model-value="onKind"
      />
    </template>

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
