<script setup>
  // Create Environment — opened from the environment picker on the workload's summary
  // card. A workload publishes into one or more environments; this adds one.
  //
  // IT ASKS FOR TWO THINGS, because an environment with no Deployment setting cannot
  // publish anything. A deployment applies exactly one setting (`strategy` is an object in
  // the request body, not a list), so the pairing is 1:1 and the create captures it rather
  // than leaving the environment half-made and the reader to find the other half later.
  //
  // THE SETTINGS ON OFFER ARE THE REAL ONES — the strategies store the Deployments module
  // authors into (../../lib/data/workload-flows.js → `WORKLOAD_DEPLOYMENTS`, projected from
  // ../../lib/data/deployment-strategies.js). Not a fixture here: a setting authored in
  // that drawer is an option here, and one deleted there stops being one.
  //
  // Same discipline as every form drawer in this console: one `submitting` flag locks the
  // scope, validation runs on submit only, and the drawer resets when it closes. ONE
  // commit, alone on the right — the X, the overlay and Escape are already the dismissal.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import { WORKLOAD_DEPLOYMENTS } from '../../lib/data/workload-flows'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    /** Names already taken on this workload — the one rule the create enforces. */
    taken: { type: Array, default: () => [] }
  })

  // `save` carries the finished environment — a form commit, not a DOM activation.
  const emit = defineEmits(['save'])

  const settingsOptions = computed(() => WORKLOAD_DEPLOYMENTS.value)

  const settingsLabel = (value) =>
    settingsOptions.value.find((option) => option.value === value)?.label ?? ''

  const form = reactive({ name: '', settingsId: '' })
  const errors = reactive({ name: '', settingsId: '' })
  const submitting = ref(false)

  watch(open, (isOpen) => {
    if (isOpen) return
    form.name = ''
    form.settingsId = ''
    errors.name = ''
    errors.settingsId = ''
  })

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.name = 'This field is required.'
    } else if (props.taken.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
      errors.name = 'This workload already publishes into an environment with that name.'
    } else {
      errors.name = ''
    }
    errors.settingsId = form.settingsId ? '' : 'This field is required.'
    return !errors.name && !errors.settingsId
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      emit('save', { name: form.name.trim(), settingsId: form.settingsId })
      open.value = false
    } catch (error) {
      toast.error("Couldn't create the environment.", {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
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
          aria-label="Create Environment"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Create Environment</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                Add a place this workload publishes into, and the Deployment Settings its
                deployments apply there.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Environment</legend>

              <CardBox :padded="false">
                <template #content>
                  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="environment-name"
                        required
                        >Name</Label
                      >
                      <InputText
                        id="environment-name"
                        v-model="form.name"
                        size="large"
                        class="w-full"
                        placeholder="Preview"
                        :disabled="submitting"
                        :required="!!errors.name"
                        aria-describedby="environment-name-error"
                        @update:model-value="errors.name = ''"
                      />
                      <HelperText
                        id="environment-name-error"
                        :kind="errors.name ? 'required' : 'helper'"
                        :label="
                          errors.name ||
                          `How this environment is named on the workload's card and in its deployments.`
                        "
                      />
                    </div>

                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Label
                        for="environment-settings"
                        required
                        >Deployment Settings</Label
                      >
                      <Select
                        v-model="form.settingsId"
                        size="large"
                        class="w-full"
                        placeholder="Select Deployment Settings"
                        :disabled="submitting"
                        :invalid="!!errors.settingsId"
                        aria-describedby="environment-settings-error"
                        :display-value="settingsLabel"
                        @update:model-value="errors.settingsId = ''"
                      >
                        <Select.Trigger id="environment-settings" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in settingsOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                      <HelperText
                        id="environment-settings-error"
                        :kind="errors.settingsId ? 'required' : 'helper'"
                        :label="
                          errors.settingsId ||
                          'Every deployment into this environment applies these settings. One environment, one setting.'
                        "
                      />
                    </div>
                  </div>
                </template>
              </CardBox>
            </fieldset>
          </PanelContent>

          <PanelFooter class="md:justify-end">
            <Button
              class="w-full md:w-auto"
              label="Create Environment"
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
              Create Environment
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
