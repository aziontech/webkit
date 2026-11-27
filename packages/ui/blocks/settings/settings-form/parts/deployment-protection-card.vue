<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Field from '@aziontech/ui/field'
  import Select from '@aziontech/ui/select'
  import Switch from '@aziontech/ui/switch'
  import { reactive } from 'vue'

  import { useCardSave } from '../composables/use-card-save'

  /** The saved Deployment Protection card, and the values its Save sends. */
  export interface DeploymentProtectionValues {
    /** Authentication level option value. */
    level: string
    /** Bypass protection with a generated link. */
    shareableLinks: boolean
  }

  export interface DeploymentProtectionCardProps {
    /** The saved values; Save stays disabled until the card differs from them. */
    values?: DeploymentProtectionValues
    /** Unsaved edits the card opens with, so it starts dirty. */
    defaultDraft?: Partial<DeploymentProtectionValues>
    /** The save of this card is in flight: its fields lock and its Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<DeploymentProtectionCardProps>(), {
    values: () => ({ level: 'standard', shareableLinks: true }),
    defaultDraft: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{ submit: [event: Event, values: DeploymentProtectionValues] }>()

  const protection = reactive<DeploymentProtectionValues>({
    ...props.values,
    ...props.defaultDraft
  })

  const { dirty, submitting, submit } = useCardSave({
    id: 'deployment-protection',
    values: protection,
    saved: () => props.values,
    loading: () => props.loading,
    error: () => props.error,
    savedMessage: 'Deployment Protection saved.',
    failedMessage: "The Deployment Protection settings weren't saved.",
    onSubmit: (event, values) => emit('submit', event, values)
  })

  const protectionOptions = [
    { label: 'Standard protection', value: 'standard' },
    { label: 'Only preview deployments', value: 'preview' },
    { label: 'All deployments', value: 'all' }
  ]
  const protectionLabel = (value: string) =>
    protectionOptions.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <form
    class="layout-section-start"
    aria-label="Deployment Protection"
    novalidate
    @submit.prevent="submit"
  >
    <Card title="Deployment Protection">
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Deployment Protection</legend>

          <Alert
            severity="info"
            label="Control who can access your deployments. Standard protection challenges every visitor before a deployment loads; shareable links let you grant bypass access with a generated URL."
          />

          <Field>
            <Field.Label for="dp-level">Authentication</Field.Label>
            <div class="sm:max-w-(--container-sm)">
              <Select
                v-model="protection.level"
                size="large"
                :disabled="submitting"
                :display-value="protectionLabel"
              >
                <Select.Trigger id="dp-level" />
                <Select.Content>
                  <Select.Item
                    v-for="option in protectionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
          </Field>

          <Field orientation="horizontal">
            <Field.Content>
              <Field.Label>Shareable links</Field.Label>
              <p class="text-body-sm text-(--text-muted)">
                Allow bypassing protection with a generated link.
              </p>
            </Field.Content>
            <Switch
              v-model="protection.shareableLinks"
              :disabled="submitting"
            />
          </Field>
        </fieldset>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
          <Button
            label="Save"
            variant="secondary"
            size="medium"
            type="submit"
            :loading="submitting"
            :disabled="!dirty"
          />
        </div>
      </template>
    </Card>
  </form>
</template>
