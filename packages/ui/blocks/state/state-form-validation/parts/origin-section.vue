<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import Select from '@aziontech/ui/select'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Skeleton from '@aziontech/ui/skeleton'

  import type { FormValidationOrigin, FormValidationService } from '../types'

  export interface OriginSectionProps {
    /** The origins the select offers. */
    origins: FormValidationOrigin[]
    /** Why the server refused the save, in the danger Alert under the heading. */
    alertMessage: string
    /** Reload origins is in flight. */
    reloading?: boolean
    /** The save is in flight: the fields are disabled. */
    submitting?: boolean
  }

  const props = withDefaults(defineProps<OriginSectionProps>(), {
    reloading: false,
    submitting: false
  })

  const emit = defineEmits<{
    reload: [event: MouseEvent]
    'origin-change': []
  }>()

  /** The messages of the fields a save flagged; typing clears them. */
  const errors = defineModel<{ originId: string; hostHeader: string }>('errors', { required: true })

  /** The entries of the form. */
  const form = defineModel<FormValidationService>('form', { required: true })

  const originLabel = (value: string) =>
    props.origins.find((origin) => origin.value === value)?.label ?? ''
</script>

<template>
  <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
    <header class="group/heading flex flex-col">
      <div class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)">
        <div class="flex min-w-0 grow flex-col gap-(--spacing-2xs)">
          <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
            <h2
              id="ev-origin-heading"
              class="scroll-mt-(--spacing-xl) text-balance text-title-sm text-(--text-default)"
            >
              Origin
            </h2>
          </div>
        </div>
      </div>
      <div
        class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div class="min-w-0 overflow-hidden">
          <div class="pt-(--spacing-sm)">
            <Transition
              enter-active-class="transition duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-fast-02 ease-productive-exit motion-reduce:transition-none"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="-translate-y-2 opacity-0"
            >
              <div v-if="alertMessage">
                <Alert
                  severity="danger"
                  :label="alertMessage"
                >
                  <template #actions>
                    <Button
                      label="Reload origins"
                      variant="secondary"
                      size="medium"
                      :loading="reloading"
                      @click="(event: MouseEvent) => emit('reload', event)"
                    />
                  </template>
                </Alert>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Origin"
            description="The origin that serves this service’s content. Origins are shared across the account, so anyone on it can change one."
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <Skeleton
                  v-if="reloading"
                  variant="rectangle"
                  width="100%"
                  height="var(--size-10)"
                  aria-label="Loading origins"
                />
                <template v-else>
                  <Select
                    v-model="form.originId"
                    size="large"
                    class="w-full"
                    placeholder="Select an origin"
                    :display-value="originLabel"
                    required
                    :invalid="!!errors.originId"
                    :disabled="submitting"
                    @update:model-value="emit('origin-change')"
                  >
                    <Select.Trigger
                      id="ev-origin"
                      aria-label="Origin"
                      :aria-describedby="errors.originId ? 'ev-origin-error' : undefined"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="origin in origins"
                        :key="origin.value"
                        :value="origin.value"
                      >
                        {{ origin.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                  <FieldError
                    v-if="errors.originId"
                    id="ev-origin-error"
                    >{{ errors.originId }}</FieldError
                  >
                </template>
              </div>
            </div>
          </SettingsRow>
          <SettingsRow
            title="Host header"
            description="Identify a virtualhost sent in the Host header to the origin."
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <Input
                  v-model="form.hostHeader"
                  size="large"
                  class="w-full"
                  aria-label="Host header"
                  required
                  :invalid="!!errors.hostHeader"
                  :aria-describedby="errors.hostHeader ? 'ev-hostHeader-error' : undefined"
                  :disabled="submitting"
                  @update:model-value="errors.hostHeader = ''"
                />
                <FieldError
                  v-if="errors.hostHeader"
                  id="ev-hostHeader-error"
                  >{{ errors.hostHeader }}</FieldError
                >
              </div>
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </section>
</template>
