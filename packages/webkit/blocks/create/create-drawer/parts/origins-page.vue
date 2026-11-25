<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import FormDrawer from './form-drawer.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

  const protocols = [
    { label: 'HTTPS only', value: 'https' },
    { label: 'HTTP only', value: 'http' },
    { label: 'Match the request', value: 'match' }
  ]
  const protocolLabel = (value: string) =>
    protocols.find((option) => option.value === value)?.label ?? ''
  const regions = [
    { label: 'US East (Washington)', value: 'us-east' },
    { label: 'South America (São Paulo)', value: 'sa-east' },
    { label: 'Europe (Frankfurt)', value: 'eu-west' }
  ]
  const regionLabel = (value: string) =>
    regions.find((option) => option.value === value)?.label ?? ''

  const origins = ref([
    { id: 'origin-1', name: 'storefront-bucket', protocol: 'https' },
    { id: 'origin-2', name: 'legacy-cms', protocol: 'http' }
  ])
  let nextOrigin = 3

  const drawerOpen = ref(false)
  const blankForm = {
    name: '',
    description: '',
    protocol: '',
    region: 'us-east',
    active: true,
    logging: false
  }
  const form = reactive({ ...blankForm })
  const errors = reactive({ name: '', protocol: '' })
  const submitting = ref(false)

  const openCreate = () => {
    drawerOpen.value = true
  }

  watch(drawerOpen, (open) => {
    if (!open) return
    Object.assign(form, blankForm)
    errors.name = ''
    errors.protocol = ''
    nextTick(() => guard.commit())
  })

  const NAME_PATTERN = /^[a-z0-9-]+$/

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (!NAME_PATTERN.test(name))
      errors.name = 'Use lower-case letters, numbers, and hyphen only.'
    else errors.name = ''
    errors.protocol = form.protocol ? '' : 'This field is required.'
    return !errors.name && !errors.protocol
  }

  const submit = () => {
    if (!validate()) return
    origins.value = [
      { id: `origin-${nextOrigin++}`, name: form.name.trim(), protocol: form.protocol },
      ...origins.value
    ]
    drawerOpen.value = false
    toast.success(`${form.name.trim()} added.`)
  }

  const { guard, onOpenChange: onDrawerOpenChange } = useDrawerGuard({
    open: drawerOpen,
    busy: () => submitting.value,
    source: () => form,
    onDiscard: (baseline) => Object.assign(form, baseline)
  })
</script>

<template>
  <div class="layout-boundary flex min-h-0 flex-1 flex-col">
    <PageHeader
      title="Origins"
      description="Where storefront fetches the content it serves."
      size="small"
    >
      <template #actions>
        <Button
          label="Add Origin"
          icon="az az-plus"
          variant="outline"
          size="medium"
          @click="openCreate"
        />
      </template>
    </PageHeader>

    <ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
      <li
        v-for="origin in origins"
        :key="origin.id"
        class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
      >
        <span class="text-label-code-sm text-(--text-default)">{{ origin.name }}</span>
        <span class="text-body-xs text-(--text-muted)">{{ protocolLabel(origin.protocol) }}</span>
      </li>
    </ul>

    <FormDrawer
      :open="drawerOpen"
      title="Add Origin"
      description="An origin is a server storefront fetches content from. Name it, then say how to reach it."
      shortcut-label="Add origin"
      :busy="submitting"
      spaced
      @update:open="onDrawerOpenChange"
      @submit="submit"
    >
      <section class="flex flex-col gap-(--layout-group-gap)">
        <p class="text-heading-2xs text-(--text-default)">General</p>
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                required
                title="Name"
                description="A unique identifier. Lower-case letters, numbers, and hyphen."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <div class="contents font-code">
                      <Input
                        v-model="form.name"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Name"
                        placeholder="my-origin"
                        required
                        :invalid="!!errors.name"
                        :aria-describedby="errors.name ? 'origin-name-error' : undefined"
                        @update:model-value="errors.name = ''"
                      />
                    </div>
                    <FieldError
                      v-if="errors.name"
                      id="origin-name-error"
                      >{{ errors.name }}</FieldError
                    >
                  </div>
                </div>
              </SettingsRow>
              <SettingsRow
                title="Description"
                description="A short note about what this origin serves."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <Input
                    v-model="form.description"
                    size="large"
                    :disabled="submitting"
                    class="w-full"
                    aria-label="Description"
                    placeholder="Optional"
                  />
                </div>
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </section>

      <section class="flex flex-col gap-(--layout-group-gap)">
        <p class="text-heading-2xs text-(--text-default)">Connection</p>
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                required
                title="Protocol"
                description="How storefront connects to the origin."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <Select
                      v-model="form.protocol"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      placeholder="Select a protocol"
                      required
                      :invalid="!!errors.protocol"
                      :display-value="protocolLabel"
                      @update:model-value="errors.protocol = ''"
                    >
                      <Select.Trigger
                        id="origin-protocol"
                        aria-label="Protocol"
                        :aria-describedby="errors.protocol ? 'origin-protocol-error' : undefined"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="option in protocols"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <FieldError
                      v-if="errors.protocol"
                      id="origin-protocol-error"
                      >{{ errors.protocol }}</FieldError
                    >
                  </div>
                </div>
              </SettingsRow>
              <SettingsRow
                title="Region"
                description="Where the origin server runs."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <Select
                    v-model="form.region"
                    size="large"
                    :disabled="submitting"
                    class="w-full"
                    :display-value="regionLabel"
                  >
                    <Select.Trigger
                      id="origin-region"
                      aria-label="Region"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="option in regions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </section>

      <section class="flex flex-col gap-(--layout-group-gap)">
        <p class="text-heading-2xs text-(--text-default)">Options</p>
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Active"
                description="Send traffic to the origin as soon as it is added."
                variant="compact"
              >
                <Switch
                  v-model="form.active"
                  aria-label="Active"
                  :disabled="submitting"
                />
              </SettingsRow>
              <SettingsRow
                title="Request logging"
                description="Record the requests storefront sends to this origin."
                variant="compact"
              >
                <Switch
                  v-model="form.logging"
                  aria-label="Request logging"
                  :disabled="submitting"
                />
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </section>
    </FormDrawer>

    <UnsavedChangesDialog
      :guard="guard"
      data-testid="unsaved-changes-dialog"
    />
  </div>
</template>
