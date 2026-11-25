<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed } from 'vue'

  import { useNetworkListFormContext } from '../composables/use-network-list-form'
  import {
    COUNTRIES,
    createListEntry,
    NETWORK_LIST_LIMIT,
    NETWORK_LIST_TYPES
  } from '../lib/network-list'
  import { lineList } from '../lib/paste-report'
  import { plural } from '../lib/variables-format'
  import PastePanel from './paste-panel.vue'

  const {
    name,
    type,
    countries,
    rows,
    copy,
    columns,
    rowErrors,
    nameMissing,
    countriesMissing,
    countryDisplay,
    pasteId,
    pasteOpen,
    pasteText,
    status,
    pasteToggleEl,
    pasteReport,
    pasteOverflow,
    cancelPaste,
    applyPaste
  } = useNetworkListFormContext()

  const setPasteToggle = (el: unknown) => {
    pasteToggleEl.value = el as { $el?: HTMLElement } | null
  }

  const found = computed(() => plural(pasteReport.value.lines.length, 'entry', 'entries'))
</script>

<template>
  <SettingsGroup
    label="General"
    hint="Names the list where firewall rules pick it."
  >
    <Field
      required
      :invalid="nameMissing"
    >
      <Field.Label>Name</Field.Label>
      <Input
        v-model="name"
        size="large"
        placeholder="Office and partners"
        autocomplete="off"
      />
      <Field.Error v-if="nameMissing">Name is required.</Field.Error>
    </Field>
  </SettingsGroup>

  <SettingsGroup
    label="Entries"
    :hint="copy?.hint ?? 'The countries the list matches, by where the request comes from.'"
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div class="flex flex-wrap items-center justify-between gap-(--spacing-xs)">
        <ToggleGroup
          v-model="type"
          :options="NETWORK_LIST_TYPES"
          aria-label="List type"
          size="medium"
        />
        <Button
          v-if="copy"
          :ref="setPasteToggle"
          label="Paste list"
          icon="az az-clipboard"
          variant="outline"
          size="medium"
          :aria-expanded="pasteOpen"
          :aria-controls="pasteOpen ? `${pasteId}-panel` : undefined"
          @click="pasteOpen = !pasteOpen"
        />
      </div>

      <template v-if="copy">
        <PastePanel
          v-if="pasteOpen"
          :id="pasteId"
          v-model="pasteText"
          :label="`Paste one ${copy.noun} per line`"
          :rows="7"
          monospace
          :apply-label="`Add ${found}`"
          apply-testid="network-list-paste-apply"
          :apply-disabled="!pasteReport.lines.length"
          data-testid="network-list-paste-panel"
          @apply="applyPaste"
          @cancel="cancelPaste"
        >
          <template #report>
            <FieldDescription key="found">{{
              `${found} found. Text after # is kept as the comment.`
            }}</FieldDescription>
            <FieldError
              v-if="pasteReport.invalid.length"
              key="invalid"
              >{{
                `${lineList(pasteReport.invalid)} not ${copy.rule}; ${pasteReport.invalid.length === 1 ? 'it is' : 'they are'} added with an error to fix.`
              }}</FieldError
            >
            <FieldDescription
              v-if="pasteReport.duplicates.length"
              key="duplicates"
              >{{
                `${lineList(pasteReport.duplicates)} already in the list and will be skipped.`
              }}</FieldDescription
            >
            <FieldError
              v-if="pasteOverflow"
              key="overflow"
              >{{
                `A list holds at most ${NETWORK_LIST_LIMIT} entries; the last ${pasteOverflow} will be skipped.`
              }}</FieldError
            >
          </template>
        </PastePanel>
        <p
          class="sr-only"
          role="status"
          aria-live="polite"
        >
          {{ status }}
        </p>
        <AttributeEditor
          v-model:items="rows"
          :definition="columns"
          :errors="rowErrors"
          :new-item="() => createListEntry()"
          :min-items="1"
          :limit="NETWORK_LIST_LIMIT"
          size="large"
          :add-button-label="`Add ${copy.noun}`"
          :remove-button-label="`Remove ${copy.noun}`"
          :aria-label="`${copy.column} entries`"
        >
          <template #cell-value="{ value, update, invalid }">
            <Input
              :model-value="value"
              size="large"
              :placeholder="copy.placeholder"
              autocomplete="off"
              :spellcheck="false"
              monospace
              :invalid="invalid"
              @update:model-value="update"
            />
          </template>
        </AttributeEditor>
      </template>

      <Field
        v-else
        required
        :invalid="countriesMissing"
      >
        <Field.Label>Countries</Field.Label>
        <MultiSelect
          v-model="countries"
          size="large"
          placeholder="Select countries"
          :display-value="countryDisplay"
        >
          <MultiSelect.Trigger aria-label="Countries" />
          <MultiSelect.Content>
            <MultiSelect.Item
              v-for="option in COUNTRIES"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>
        <Field.Error v-if="countriesMissing">Select at least one country.</Field.Error>
      </Field>
    </div>
  </SettingsGroup>
</template>
