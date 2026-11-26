<script setup lang="ts">
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import PasswordInput from '@aziontech/ui/password-input'
  import SettingsRow from '@aziontech/ui/settings-row'

  import { type DataStreamRecord, useDataStreamContext } from '../use-data-stream'

  /** A data stream field that holds text. */
  export type DataStreamTextField = {
    [K in keyof DataStreamRecord]: DataStreamRecord[K] extends string ? K : never
  }[keyof DataStreamRecord]

  export interface DataStreamInputRowProps {
    /** The field the row edits. */
    field: DataStreamTextField
    /** The row title. */
    title: string
    /** The sentence under the title. */
    description: string
    /** The accessible name of the input. */
    label: string
    /** The placeholder of the input. */
    placeholder: string
    /** The row stacks its control under the copy on narrow screens. */
    stackable?: boolean
    /** The value is a credential, typed in a password input. */
    secret?: boolean
    /** The field belongs to the destination: editing it also drops the destination error. */
    destination?: boolean
  }

  const props = withDefaults(defineProps<DataStreamInputRowProps>(), {
    stackable: false,
    secret: false,
    destination: false
  })

  const { form, errors, saving, clear, onDestinationChange } = useDataStreamContext()

  const id = `data-stream-${props.field}`
  const onUpdate = () => (props.destination ? onDestinationChange(props.field) : clear(props.field))
</script>

<template>
  <SettingsRow
    :title="title"
    :description="description"
    :stackable="stackable"
  >
    <PasswordInput
      v-if="secret"
      :id="id"
      v-model="form[field]"
      class="w-full"
      :aria-label="label"
      :placeholder="placeholder"
      autocomplete="off"
      required
      :invalid="!!errors[field]"
      :aria-describedby="errors[field] ? `${id}-message` : undefined"
      :readonly="saving"
      @update:model-value="onUpdate"
    />
    <Input
      v-else
      :id="id"
      v-model="form[field]"
      size="large"
      class="w-full"
      :aria-label="label"
      :placeholder="placeholder"
      autocomplete="off"
      required
      :invalid="!!errors[field]"
      :aria-describedby="errors[field] ? `${id}-message` : undefined"
      :readonly="saving"
      @update:model-value="onUpdate"
    />
    <FieldError
      v-if="errors[field]"
      :id="`${id}-message`"
      >{{ errors[field]?.message }}</FieldError
    >
  </SettingsRow>
</template>
