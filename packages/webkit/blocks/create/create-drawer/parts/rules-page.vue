<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { toast } from '@aziontech/webkit/toast'
  import { nextTick, reactive, ref, watch } from 'vue'

  import { useDrawerGuard } from '../composables/use-drawer-guard'
  import FormDrawer from './form-drawer.vue'
  import UnsavedChangesDialog from './unsaved-changes-dialog.vue'

  let nextId = 0
  const uid = () => (nextId += 1)

  const origins = ref([
    { value: 'origin-api', label: 'api-backend' },
    { value: 'origin-static', label: 'static-assets' }
  ])
  const originLabel = (value: string) =>
    origins.value.find((origin) => origin.value === value)?.label ?? ''

  const rules = ref([{ id: 'rule-1', name: 'route-api', originId: 'origin-api' }])

  const parentOpen = ref(false)
  const form = reactive({ name: '', originId: '' })
  const errors = reactive({ name: '', originId: '' })
  const submitting = ref(false)

  const CREATE_ORIGIN = '__create-origin__'
  const originSelectOpen = ref(false)

  const childOpen = ref(false)
  const childForm = reactive({ name: '', address: '' })
  const childErrors = reactive({ name: '', address: '' })
  const childSubmitting = ref(false)

  const onOriginModel = (value: string) => {
    if (value === CREATE_ORIGIN) {
      originSelectOpen.value = false
      childOpen.value = true
      return
    }
    form.originId = value
    errors.originId = ''
  }

  const openParent = () => {
    parentOpen.value = true
  }

  watch(parentOpen, (open) => {
    if (!open) return
    form.name = ''
    form.originId = ''
    errors.name = ''
    errors.originId = ''
    nextTick(() => guard.commit())
  })

  const submitParent = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.originId = form.originId ? '' : 'Select an origin.'
    if (errors.name || errors.originId) return
    rules.value = [
      ...rules.value,
      { id: `rule-${uid()}`, name: form.name.trim(), originId: form.originId }
    ]
    parentOpen.value = false
    toast.success(`${form.name.trim()} added.`)
  }

  watch(childOpen, (open) => {
    if (!open) return
    childForm.name = ''
    childForm.address = ''
    childErrors.name = ''
    childErrors.address = ''
    nextTick(() => childGuard.commit())
  })

  const submitChild = () => {
    childErrors.name = childForm.name.trim() ? '' : 'This field is required.'
    childErrors.address = childForm.address.trim() ? '' : 'This field is required.'
    if (childErrors.name || childErrors.address) return
    const value = `origin-${uid()}`
    origins.value = [{ value, label: childForm.name.trim() }, ...origins.value]
    form.originId = value
    errors.originId = ''
    childOpen.value = false
  }

  const { guard, onOpenChange: onParentOpenChange } = useDrawerGuard({
    open: parentOpen,
    busy: () => submitting.value,
    source: () => form,
    onDiscard: (baseline) => Object.assign(form, baseline)
  })

  const { guard: childGuard, onOpenChange: onChildOpenChange } = useDrawerGuard({
    open: childOpen,
    busy: () => childSubmitting.value,
    source: () => childForm,
    onDiscard: (baseline) => Object.assign(childForm, baseline)
  })

  const PAGE_DESCRIPTION =
    'The rules of the storefront resource, run in order on every request they match. A rule that sends requests to an origin the resource does not have yet creates it in a second ' +
    'drawer.'
</script>

<template>
  <div class="layout-boundary flex min-h-0 flex-1 flex-col">
    <PageHeader
      title="Rules Engine"
      :description="PAGE_DESCRIPTION"
      size="small"
    >
      <template #actions>
        <Button
          label="Add Rule"
          icon="az az-plus"
          variant="outline"
          size="medium"
          @click="openParent"
        />
      </template>
    </PageHeader>

    <ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
      <li
        v-for="rule in rules"
        :key="rule.id"
        class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
      >
        <span class="text-label-code-sm text-(--text-default)">{{ rule.name }}</span>
        <span class="text-body-xs text-(--text-muted)">{{ originLabel(rule.originId) }}</span>
      </li>
    </ul>

    <FormDrawer
      :open="parentOpen"
      title="Add Rule"
      description="A rule sends the requests it matches to one origin of this resource. Select the origin, or create it here."
      shortcut-label="Add rule"
      :busy="submitting"
      spaced
      @update:open="onParentOpenChange"
      @submit="submitParent"
    >
      <section class="flex flex-col gap-(--layout-group-gap)">
        <p class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">General</p>
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                required
                title="Name"
                description="Give a unique and descriptive name to identify the rule."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <Input
                      v-model="form.name"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      aria-label="Name"
                      placeholder="my-rule"
                      required
                      :invalid="!!errors.name"
                      :aria-describedby="errors.name ? 'rule-name-error' : undefined"
                      @update:model-value="errors.name = ''"
                    />
                    <FieldError
                      v-if="errors.name"
                      id="rule-name-error"
                      >{{ errors.name }}</FieldError
                    >
                  </div>
                </div>
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </section>

      <section class="flex flex-col gap-(--layout-group-gap)">
        <p class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">Behavior</p>
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                required
                title="Origin"
                description="Select the origin matching requests go to, or create one."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <Select
                      :model-value="form.originId"
                      v-model:open="originSelectOpen"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      placeholder="Select an origin"
                      required
                      :invalid="!!errors.originId"
                      :display-value="originLabel"
                      @update:model-value="onOriginModel"
                    >
                      <Select.Trigger
                        id="rule-origin"
                        aria-label="Origin"
                        :aria-describedby="errors.originId ? 'rule-origin-error' : undefined"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="origin in origins"
                          :key="origin.value"
                          :value="origin.value"
                        >
                          {{ origin.label }}
                        </Select.Item>
                        <template #footer>
                          <Select.Item
                            :value="CREATE_ORIGIN"
                            icon="az az-circle-plus"
                            class="w-full"
                          >
                            Create Origin
                          </Select.Item>
                        </template>
                      </Select.Content>
                    </Select>
                    <FieldError
                      v-if="errors.originId"
                      id="rule-origin-error"
                      >{{ errors.originId }}</FieldError
                    >
                  </div>
                </div>
              </SettingsRow>
            </Item.List>
          </template>
        </Card>
      </section>
    </FormDrawer>

    <FormDrawer
      :open="childOpen"
      title="Create Origin"
      description="An origin is a host this resource fetches content from. Once saved, the rule sends its requests to it."
      shortcut-label="Create origin"
      :busy="childSubmitting"
      size="medium"
      spaced
      @update:open="onChildOpenChange"
      @submit="submitChild"
    >
      <section class="flex flex-col gap-(--layout-group-gap)">
        <p class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">General</p>
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                required
                title="Name"
                description="A unique name for the origin."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <Input
                      v-model="childForm.name"
                      size="large"
                      :disabled="childSubmitting"
                      class="w-full"
                      aria-label="Name"
                      placeholder="my-origin"
                      required
                      :invalid="!!childErrors.name"
                      :aria-describedby="childErrors.name ? 'origin-name-error' : undefined"
                      @update:model-value="childErrors.name = ''"
                    />
                    <FieldError
                      v-if="childErrors.name"
                      id="origin-name-error"
                      >{{ childErrors.name }}</FieldError
                    >
                  </div>
                </div>
              </SettingsRow>
              <SettingsRow
                required
                title="Address"
                description="The host this resource fetches content from."
                stackable
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <Input
                      v-model="childForm.address"
                      size="large"
                      :disabled="childSubmitting"
                      class="w-full"
                      aria-label="Address"
                      placeholder="origin.example.com"
                      required
                      :invalid="!!childErrors.address"
                      :aria-describedby="childErrors.address ? 'origin-address-error' : undefined"
                      @update:model-value="childErrors.address = ''"
                    />
                    <FieldError
                      v-if="childErrors.address"
                      id="origin-address-error"
                      >{{ childErrors.address }}</FieldError
                    >
                  </div>
                </div>
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

    <UnsavedChangesDialog
      :guard="childGuard"
      data-testid="child-unsaved-changes-dialog"
    />
  </div>
</template>
