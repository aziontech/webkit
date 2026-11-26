<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DatePickerRoot from '@aziontech/ui/date-picker-root'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import FieldDescription from '@aziontech/ui/field-description'
  import Input from '@aziontech/ui/input'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Textarea from '@aziontech/ui/textarea'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import type { PersonalTokensCreateValues } from '../account-personal-tokens.vue'

  const props = defineProps<{
    submitting: boolean
    names: string[]
    formatDate: (date: Date) => string
    daysFrom: (days: number) => Date
  }>()

  const emit = defineEmits<{ create: [event: Event, values: PersonalTokensCreateValues] }>()

  const open = defineModel<boolean>('open', { required: true })

  const DAY = 86_400_000
  const CUSTOM_EXPIRY = 'custom'
  const expiryOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' },
    { value: CUSTOM_EXPIRY, label: 'Custom date and time' }
  ]
  const expiryLabel = (value: string) =>
    expiryOptions.find((option) => option.value === value)?.label ?? ''

  const form = reactive<{
    name: string
    description: string
    expiresIn: string
    expiresAt: Date | null
  }>({ name: '', description: '', expiresIn: '30', expiresAt: null })
  const errors = reactive({ name: '', expiresAt: '' })
  const expiresAtEl = ref<InstanceType<typeof DatePickerRoot> | null>(null)
  const customExpiry = computed(() => form.expiresIn === CUSTOM_EXPIRY)
  const earliestExpiry = computed(() => props.daysFrom(0))
  const expiryMoment = computed(() =>
    customExpiry.value ? form.expiresAt : props.daysFrom(Number(form.expiresIn))
  )
  const expiryHint = computed(() =>
    customExpiry.value
      ? 'Pick the date and time the token stops working.'
      : `The token stops working on ${props.formatDate(props.daysFrom(Number(form.expiresIn)))}. Create a new one before then.`
  )

  watch(open, (now) => {
    if (!now) return
    Object.assign(form, { name: '', description: '', expiresIn: '30', expiresAt: null })
    errors.name = ''
    errors.expiresAt = ''
  })

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const submit = (event: Event) => {
    if (props.submitting) return
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (props.names.some((other) => other.toLowerCase() === name.toLowerCase())) {
      errors.name = 'A token with this name already exists. Use another name.'
    } else errors.name = ''
    const now = props.daysFrom(0).getTime()
    const expiresAt = expiryMoment.value
    if (!expiresAt) errors.expiresAt = 'Pick the date and time the token expires.'
    else if (expiresAt.getTime() <= now) errors.expiresAt = 'Pick a date and time in the future.'
    else errors.expiresAt = ''
    if (errors.name) {
      focusById('token-name')
      return
    }
    if (!expiresAt || errors.expiresAt) {
      nextTick(() => expiresAtEl.value?.focus())
      return
    }
    emit('create', event, {
      name,
      description: form.description.trim(),
      expiresInDays: Math.ceil((expiresAt.getTime() - now) / DAY),
      expiresAt
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Create Personal Token"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Create Personal Token</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              The token acts as you, with your permissions, until it expires or you revoke it.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create Personal Token</legend>
            <SettingsGroup
              label="General"
              hint="How you will recognise the token in this list."
            >
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-lg)">
                <Field
                  required
                  :invalid="!!errors.name"
                >
                  <Field.Label for="token-name">Name</Field.Label>
                  <Input
                    id="token-name"
                    v-model="form.name"
                    placeholder="deploy-pipeline"
                    autocomplete="off"
                    @update:model-value="errors.name = ''"
                  />
                  <Field.Description>{{
                    errors.name || 'Name it after where it is used, such as the job or the tool.'
                  }}</Field.Description>
                </Field>
                <Field>
                  <Field.Label for="token-description">Description</Field.Label>
                  <Textarea
                    id="token-description"
                    v-model="form.description"
                    :rows="3"
                  />
                </Field>
              </div>
            </SettingsGroup>
            <SettingsGroup
              label="Expiration"
              hint="Shorter is safer. A token cannot be extended."
            >
              <Field>
                <Field.Label for="token-expiry">Expires in</Field.Label>
                <Select
                  v-model="form.expiresIn"
                  size="large"
                  class="w-full"
                  :display-value="expiryLabel"
                >
                  <Select.Trigger
                    id="token-expiry"
                    aria-describedby="token-expiry-hint"
                  />
                  <Select.Content>
                    <Select.Item
                      v-for="option in expiryOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
                <FieldDescription id="token-expiry-hint">{{ expiryHint }}</FieldDescription>
              </Field>
              <Field
                v-if="customExpiry"
                required
                :invalid="!!errors.expiresAt"
              >
                <Field.Label>Expires at</Field.Label>
                <DatePickerRoot
                  ref="expiresAtEl"
                  v-model="form.expiresAt"
                  show-time
                  size="large"
                  :min="earliestExpiry"
                  @update:model-value="errors.expiresAt = ''"
                />
                <Field.Error v-if="errors.expiresAt">{{ errors.expiresAt }}</Field.Error>
              </Field>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Cancel"
              variant="outline"
              size="medium"
              type="button"
              :disabled="submitting"
              @click="open = false"
            />
            <Button
              label="Create Personal Token"
              variant="primary"
              size="medium"
              type="submit"
              :loading="submitting"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
