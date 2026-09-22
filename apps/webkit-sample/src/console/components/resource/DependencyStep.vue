<script setup>
  // THE FIRST STEP OF A STEPPED CREATE — the same host question the full-screen gate asks
  // (./ApplicationGate.vue), in the same column (./HostChooser.vue), because a reader who
  // has met one of them has met both.
  //
  // What this step adds is the MODULE. A reference the matrix marks `exige modules.*` is
  // read by the host only while that module is on (../../lib/data/resource-dependencies.js),
  // so a host that has it off is the first friction of the whole create — stated on the row
  // that carries it, and answerable without leaving the step.
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { hostOptions, hostRecords } from '../../lib/behavior/application-binding'
  import { hostHasModule, moduleRequirementFor } from '../../lib/data/resource-dependencies'
  import HostChooser from './HostChooser.vue'

  const props = defineProps({
    /** The `createResources` id being created. */
    resource: { type: String, required: true },
    /** The create page's own title, so the tile above the list names the object being made. */
    title: { type: String, default: '' },
    /** The glyph of the object being created. */
    icon: { type: String, default: 'pi pi-box' },
    /** The binding descriptor — which host, and how the reference is carried. */
    binding: { type: Object, required: true },
    /** The host descriptor from `HOSTS` — noun, icon, whether one can be named here. */
    host: { type: Object, required: true },
    /** The resource's own noun, for the copy that explains what is inert without a host. */
    unit: { type: String, default: 'resource' },
    /** Locks every control while the create request is in flight. */
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['empty-action', 'answer'])

  /** The chosen host as `{ mode, name }`, or null while the reader has not answered. */
  const choice = defineModel('choice', { type: Object, default: null })

  /** True when the reader has agreed to switch the missing module on with this create. */
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
    <!-- The module a row is missing, said ON that row: the reader picks a host already
         knowing what picking it will cost, instead of finding out underneath. -->
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
