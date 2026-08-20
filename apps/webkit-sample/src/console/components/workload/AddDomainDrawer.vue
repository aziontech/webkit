<script setup>
  // Add domain — the sub-drawer opened from the Domains section of Create Workload.
  // A MEDIUM drawer whose body chooses between a free azion.app subdomain and a
  // custom ("bring your own") domain, then captures the domain and the environment
  // it serves. On save it emits the domain record back to the parent, which appends
  // it to the Domains list.
  //
  // IT NO LONGER ASKS FOR A CERTIFICATE. `tls.certificate` is a property of the
  // WORKLOAD, not of one domain — a single value on POST /workspace/workloads. Asking
  // per row let two domains on one workload pick two different certificates, a form
  // with no valid request body behind it. The workload asks once, in its Advanced
  // band (../CreateWorkload.vue).
  //
  // Same discipline as every form drawer here: one `submitting` flag locks the
  // scope, validation runs on submit only (amber `required` HelperText, cleared on
  // edit), and the drawer resets when it closes. ONE commit, alone on the right —
  // the X, the overlay and Escape are already the dismissal, so a Cancel button
  // would be a fourth exit competing with the commit for the eye.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import { ENVIRONMENT_OPTIONS } from '../../lib/data/create-resources'

  // Two-way open state; the parent binds v-model:open.
  const open = defineModel('open', { type: Boolean, default: false })

  // `save` carries the finished domain record (event-free — it's a form commit,
  // not a DOM activation).
  const emit = defineEmits(['save'])

  const kindOptions = [
    {
      value: 'free',
      label: 'Get a free Azion Domain',
      description: 'You can use a free azion.app domain.'
    },
    {
      value: 'own',
      label: 'Bring my own Domain',
      description: 'Use your own DNS and point it to your Azion workload.'
    }
  ]

  // The same two the workload's own descriptor offers (../../lib/create-resources.js),
  // imported rather than repeated so the two surfaces cannot disagree on what an
  // environment is.
  const environmentOptions = ENVIRONMENT_OPTIONS

  const labelFor = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''

  const form = reactive({
    kind: 'free',
    domain: '',
    environment: 'Production'
  })
  const errors = reactive({ domain: '' })
  const submitting = ref(false)

  // Reset every field when the drawer closes so the next open starts clean.
  watch(open, (isOpen) => {
    if (isOpen) return
    form.kind = 'free'
    form.domain = ''
    form.environment = 'Production'
    errors.domain = ''
  })

  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    return !errors.domain
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const suffix = form.kind === 'free' ? '.azion.app' : ''
      emit('save', {
        id: `domain-${Date.now()}`,
        domain: `${form.domain.trim()}${suffix}`,
        environment: form.environment
      })
      open.value = false
    } catch (error) {
      // Request-level failure surfaces here (the parent only sees a successful
      // `save`), so report it where the user is looking — never silently.
      toast.error("Couldn't add the domain.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add domain"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Add domain</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Attach a domain to this workload and choose the environment it serves.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add domain</legend>

              <!-- Domain source -->
              <fieldset class="flex flex-col gap-(--spacing-sm)">
                <legend class="sr-only">Domain source</legend>
                <FieldRadioBlock
                  v-for="option in kindOptions"
                  :key="option.value"
                  v-model="form.kind"
                  :value="option.value"
                  name="domain-kind"
                  :input-id="`domain-kind-${option.value}`"
                  :label="option.label"
                  :description="option.description"
                  :disabled="submitting"
                />
              </fieldset>

              <!-- Domain + environment + certificate -->
              <CardBox :padded="false">
                <template #content>
                  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="add-domain-input"
                        required
                        >Domain</Label
                      >
                      <InputGroup :disabled="submitting">
                        <InputText
                          id="add-domain-input"
                          v-model="form.domain"
                          size="large"
                          class="flex-1"
                          placeholder="my-workload"
                          :disabled="submitting"
                          :required="!!errors.domain"
                          :aria-describedby="errors.domain ? 'add-domain-error' : undefined"
                          @update:model-value="errors.domain = ''"
                        />
                        <InputGroupAddon v-if="form.kind === 'free'">.azion.app</InputGroupAddon>
                      </InputGroup>
                      <HelperText
                        v-if="errors.domain"
                        id="add-domain-error"
                        kind="required"
                        :label="errors.domain"
                      />
                    </div>

                    <Message
                      severity="info"
                      label="Your workload is always accessible at an azion.app subdomain based on the workload name. Custom domains allow visitors to reach your project at your own domain."
                    />

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label for="add-domain-environment">Environment</Label>
                      <Select
                        v-model="form.environment"
                        size="large"
                        class="w-full"
                        :disabled="submitting"
                        :display-value="labelFor(environmentOptions)"
                      >
                        <Select.Trigger id="add-domain-environment" />
                        <!-- Select.Content teleports to <body> at z-50; inside the
                             Drawer panel (z-[1001]) it needs a higher z to show. -->
                        <Select.Content class="z-[1002]!">
                          <Select.Option
                            v-for="option in environmentOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </div>
                  </div>
                </template>
              </CardBox>
            </fieldset>
          </PanelContent>

          <!-- One commit, alone on the right. See the note at the top of the file. -->
          <PanelFooter class="md:justify-end">
            <Button
              class="w-full md:w-auto"
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Save
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
