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
  import Switch from '@aziontech/webkit/switch'
  import { reactive, ref, watch } from 'vue'

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
  }
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
          icon="pi pi-plus"
          kind="outlined"
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

    <Drawer
      v-model:open="drawerOpen"
      size="large"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Add Origin"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Add Origin</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  An origin is a server storefront fetches content from. Name it, then say how to
                  reach it.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Add Origin</legend>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
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
                                  :required="!!errors.name && !form.name.trim()"
                                  :invalid="!!errors.name && !!form.name.trim()"
                                  :aria-describedby="errors.name ? 'origin-name-error' : undefined"
                                  @update:model-value="errors.name = ''"
                                />
                              </div>
                              <HelperText
                                v-if="errors.name"
                                id="origin-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :label="errors.name"
                              />
                            </div>
                          </div>
                        </SettingRow>
                        <SettingRow
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
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </section>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Connection</p>
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
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
                                :required="!!errors.protocol"
                                :display-value="protocolLabel"
                                @update:model-value="errors.protocol = ''"
                              >
                                <Select.Trigger
                                  id="origin-protocol"
                                  aria-label="Protocol"
                                  :aria-describedby="
                                    errors.protocol ? 'origin-protocol-error' : undefined
                                  "
                                />
                                <Select.Content>
                                  <Select.Option
                                    v-for="option in protocols"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                              <HelperText
                                v-if="errors.protocol"
                                id="origin-protocol-error"
                                kind="required"
                                :label="errors.protocol"
                              />
                            </div>
                          </div>
                        </SettingRow>
                        <SettingRow
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
                                <Select.Option
                                  v-for="option in regions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </div>
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </section>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Options</p>
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          title="Active"
                          description="Send traffic to the origin as soon as it is added."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="submitting"
                          />
                        </SettingRow>
                        <SettingRow
                          title="Request logging"
                          description="Record the requests storefront sends to this origin."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.logging"
                            aria-label="Request logging"
                            :disabled="submitting"
                          />
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
                    label="Add Origin"
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
  </div>
</template>
