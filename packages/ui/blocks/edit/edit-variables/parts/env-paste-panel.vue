<script setup lang="ts">
  import FieldDescription from '@aziontech/ui/field-description'
  import FieldError from '@aziontech/ui/field-error'
  import { computed } from 'vue'

  import { useVariablesFormContext } from '../composables/use-variables-form'
  import { lineList } from '../lib/paste-report'
  import { envPasteReport, plural, type VariablesPair } from '../lib/variables-format'
  import PastePanel from './paste-panel.vue'

  export interface EnvPastePanelProps {
    /** The id of the text field. */
    id: string
  }

  defineProps<EnvPastePanelProps>()

  const text = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    apply: [event: MouseEvent, pairs: VariablesPair[]]
    cancel: [event: MouseEvent]
  }>()

  const { filledEntries } = useVariablesFormContext()

  const report = computed(() =>
    envPasteReport(
      text.value,
      filledEntries.value.map((entry) => entry.key.trim())
    )
  )
  const found = computed(() => plural(report.value.pairs.length, 'variable', 'variables'))
</script>

<template>
  <PastePanel
    :id="id"
    v-model="text"
    label="Paste .env contents"
    :rows="6"
    monospace
    :invalid="report.invalidLines.length > 0"
    :apply-label="`Add ${found}`"
    apply-testid="paste-env-apply"
    :apply-disabled="!report.pairs.length"
    data-testid="paste-env-panel"
    @apply="(event) => emit('apply', event, report.pairs)"
    @cancel="(event) => emit('cancel', event)"
  >
    <template #report>
      <FieldError
        v-if="report.invalidLines.length"
        key="invalid"
        >{{
          `${lineList(report.invalidLines)} not KEY=value with an uppercase key and will be skipped.`
        }}</FieldError
      >
      <FieldDescription
        v-if="report.repeated.length"
        key="repeated"
        >{{
          `${report.repeated.join(', ')} appears more than once; the last value is kept.`
        }}</FieldDescription
      >
      <FieldDescription
        v-if="report.replaced.length"
        key="replaced"
        >{{
          `${report.replaced.join(', ')} is already in the list; its value will be replaced.`
        }}</FieldDescription
      >
      <FieldDescription key="found">{{
        `${found} found. Lines starting with # are ignored.`
      }}</FieldDescription>
    </template>
  </PastePanel>
</template>
