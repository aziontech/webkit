<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import { reactive, ref, watch } from 'vue'

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
  }

  watch(childOpen, (open) => {
    if (!open) return
    childForm.name = ''
    childForm.address = ''
    childErrors.name = ''
    childErrors.address = ''
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
</script>

<template>
  <div class="layout-boundary flex min-h-0 flex-1 flex-col">
    <PageHeader
      title="Rules Engine"
      description="The rules of the storefront resource, run in order on every request they match. A rule that sends requests to an origin the resource does not have yet creates it in a second drawer."
      size="small"
    >
      <template #actions>
        <Button
          label="Add Rule"
          icon="pi pi-plus"
          kind="outlined"
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

    <Drawer
      v-model:open="parentOpen"
      size="large"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Add Rule"
            novalidate
            @submit.prevent="submitParent"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Add Rule</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  A rule sends the requests it matches to one origin of this resource. Select the
                  origin, or create it here.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Add Rule</legend>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
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
                                :required="!!errors.name && !form.name.trim()"
                                :invalid="!!errors.name && !!form.name.trim()"
                                :aria-describedby="errors.name ? 'rule-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="rule-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :label="errors.name"
                              />
                            </div>
                          </div>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </section>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Behavior</p>
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
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
                                :required="!!errors.originId"
                                :display-value="originLabel"
                                @update:model-value="onOriginModel"
                              >
                                <Select.Trigger
                                  id="rule-origin"
                                  aria-label="Origin"
                                  :aria-describedby="
                                    errors.originId ? 'rule-origin-error' : undefined
                                  "
                                />
                                <Select.Content>
                                  <Select.Option
                                    v-for="origin in origins"
                                    :key="origin.value"
                                    :value="origin.value"
                                  >
                                    {{ origin.label }}
                                  </Select.Option>
                                  <template #footer>
                                    <Select.Option
                                      :value="CREATE_ORIGIN"
                                      icon="pi pi-plus-circle"
                                      class="w-full"
                                    >
                                      Create Origin
                                    </Select.Option>
                                  </template>
                                </Select.Content>
                              </Select>
                              <HelperText
                                v-if="errors.originId"
                                id="rule-origin-error"
                                kind="required"
                                :label="errors.originId"
                              />
                            </div>
                          </div>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </section>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div
                class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
              >
                <div class="w-full md:w-fit">
                  <Button
                    class="w-full"
                    label="Add Rule"
                    kind="primary"
                    size="medium"
                    :loading="submitting"
                    type="submit"
                  />
                </div>
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Drawer
      v-model:open="childOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Origin"
            novalidate
            @submit.prevent="submitChild"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Create Origin</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  An origin is a host this resource fetches content from. Once saved, the rule sends
                  its requests to it.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="childSubmitting"
              >
                <legend class="sr-only">Create Origin</legend>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
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
                                :required="!!childErrors.name && !childForm.name.trim()"
                                :invalid="!!childErrors.name && !!childForm.name.trim()"
                                :aria-describedby="
                                  childErrors.name ? 'origin-name-error' : undefined
                                "
                                @update:model-value="childErrors.name = ''"
                              />
                              <HelperText
                                v-if="childErrors.name"
                                id="origin-name-error"
                                :kind="childForm.name.trim() ? 'invalid' : 'required'"
                                :label="childErrors.name"
                              />
                            </div>
                          </div>
                        </SettingRow>
                        <SettingRow
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
                                :required="!!childErrors.address && !childForm.address.trim()"
                                :invalid="!!childErrors.address && !!childForm.address.trim()"
                                :aria-describedby="
                                  childErrors.address ? 'origin-address-error' : undefined
                                "
                                @update:model-value="childErrors.address = ''"
                              />
                              <HelperText
                                v-if="childErrors.address"
                                id="origin-address-error"
                                :kind="childForm.address.trim() ? 'invalid' : 'required'"
                                :label="childErrors.address"
                              />
                            </div>
                          </div>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </section>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div
                class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
              >
                <div class="w-full md:w-fit">
                  <Button
                    class="w-full"
                    label="Create Origin"
                    kind="primary"
                    size="medium"
                    :loading="childSubmitting"
                    type="submit"
                  />
                </div>
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
