<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import NumberInput from '@aziontech/webkit/number-input'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import Switch from '@aziontech/webkit/switch'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { sampleOriginError, sampleOrigins } from '../sample'
  import type { FormValidationOrigin, FormValidationService } from '../types'
  import OriginSection from './origin-section.vue'
  import ProtocolSection from './protocol-section.vue'
  import ServiceHeader from './service-header.vue'

  export type { FormValidationOrigin, FormValidationService } from '../types'

  export interface FormValidationSectionProps {
    /** The origins the select offers; a chosen origin missing from the list is cleared and the select turns invalid. Left out, the sample renders. */
    origins?: FormValidationOrigin[]
    /** Why the server refused the save; the danger Alert under the Origin heading says it and the select turns invalid. Left out, the sample message renders; pass an empty string for none. */
    originError?: string
    /** Reload origins is in flight: its button spins, a Skeleton replaces the select and Save is disabled. */
    reloading?: boolean
    /** The save request is in flight: Save spins and the fields are disabled. */
    submitting?: boolean
  }

  const props = withDefaults(defineProps<FormValidationSectionProps>(), {
    origins: undefined,
    originError: undefined,
    reloading: false,
    submitting: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FormValidationService]
    cancel: [event: MouseEvent]
    'reload-origins': [event: MouseEvent]
  }>()

  const origins = computed<FormValidationOrigin[]>(() => props.origins ?? sampleOrigins)
  const rejection = computed(() => props.originError ?? sampleOriginError)
  const form = reactive<FormValidationService>({
    name: 'checkout-web',
    protocolUsage: 'https',
    httpPorts: ['80'],
    compression: true,
    rateLimiting: false,
    imageOptimization: false,
    secondaryCache: false,
    originId: 'origin-web-prod',
    hostHeader: '${host}',
    browserMaxTtl: 0,
    cacheMaxTtl: 60,
    debugRules: false
  })
  const errors = reactive({
    name: '',
    httpPorts: '',
    originId: '',
    hostHeader: ''
  })
  const alertMessage = ref('')

  const focusOrigin = async () => {
    await nextTick()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById('ev-origin-heading')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById('ev-origin')?.focus({ preventScroll: true })
  }

  watch(
    rejection,
    (next) => {
      alertMessage.value = next
      if (next) errors.originId = 'This origin no longer exists.'
    },
    { immediate: true }
  )

  watch(
    origins,
    (next) => {
      if (form.originId && !next.some((origin) => origin.value === form.originId)) {
        form.originId = ''
        errors.originId = 'Select an origin to continue.'
      }
    },
    { immediate: true }
  )

  watch(rejection, (next) => {
    if (next && !props.reloading) focusOrigin()
  })

  onMounted(() => {
    if (alertMessage.value && !props.reloading) focusOrigin()
  })

  const reloadOrigins = (event: MouseEvent) => {
    if (props.reloading) return
    emit('reload-origins', event)
  }

  const onOriginChange = () => {
    errors.originId = ''
    alertMessage.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.originId = form.originId ? '' : 'Select an origin.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'Host header is required.'
    return !errors.name && !errors.httpPorts && !errors.originId && !errors.hostHeader
  }

  const submit = (event: Event) => {
    if (props.submitting || props.reloading) return
    alertMessage.value = ''
    if (!validate()) return
    emit('submit', event, { ...form, httpPorts: [...form.httpPorts] })
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <ServiceHeader />
    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Service"
        novalidate
        @submit.prevent="submit"
      >
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create service</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <Subheader title="General" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Name"
                      description="Give a unique and descriptive name to identify the service."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            required
                            :invalid="!!errors.name"
                            :aria-describedby="errors.name ? 'ev-name-error' : undefined"
                            :disabled="submitting"
                            @update:model-value="errors.name = ''"
                          />
                          <FieldError
                            v-if="errors.name"
                            id="ev-name-error"
                            >{{ errors.name }}</FieldError
                          >
                        </div>
                      </div>
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <ProtocolSection
              v-model:form="form"
              v-model:errors="errors"
              :submitting="submitting"
            />

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <Subheader title="Features" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Compression"
                      description="Compress responses with gzip or Brotli before they are sent."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.compression"
                        aria-label="Compression"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                    <SettingsRow
                      title="Rate limiting"
                      description="Limit how many requests a single client can send per minute."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.rateLimiting"
                        aria-label="Rate limiting"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                    <SettingsRow
                      title="Image optimization"
                      description="Resize, crop, and convert images on the fly through URL parameters."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.imageOptimization"
                        aria-label="Image optimization"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                    <SettingsRow
                      title="Secondary cache"
                      description="Add a second caching layer to reduce requests to the origin."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.secondaryCache"
                        aria-label="Secondary cache"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <OriginSection
              v-model:form="form"
              :origins="origins"
              :alert-message="alertMessage"
              v-model:errors="errors"
              :reloading="reloading"
              :submitting="submitting"
              @reload="reloadOrigins"
              @origin-change="onOriginChange"
            />

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <Subheader title="Cache expiration policies" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Browser maximum TTL"
                      description="How long browsers may keep a cached response, in seconds."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <NumberInput
                          v-model="form.browserMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Browser maximum TTL in seconds"
                        />
                      </div>
                    </SettingsRow>
                    <SettingsRow
                      title="Cache maximum TTL"
                      description="How long the cache may keep a response, in seconds. A secondary cache requires a TTL of at least 3 seconds."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <NumberInput
                          v-model="form.cacheMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Cache maximum TTL in seconds"
                        />
                      </div>
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <Subheader title="Debug rules" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Active"
                      description="Rules that were successfully executed will be listed in the request logs and in the trace of each event."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.debugRules"
                        aria-label="Active"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>
          </fieldset>
        </div>

        <SaveBar
          variant="plain"
          @save="submit"
        >
          <template #actions>
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              :disabled="submitting"
              @click="emit('cancel', $event)"
            />
            <Button
              variant="primary"
              size="medium"
              :loading="submitting"
              :disabled="reloading"
              type="submit"
              aria-keyshortcuts="Meta+S Control+S"
            >
              Save
              <Kbd
                meta
                size="small"
                aria-hidden="true"
                >S</Kbd
              >
            </Button>
          </template>
        </SaveBar>
      </form>
    </main>
  </div>
</template>
