<script setup>
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
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  const runtimes = [
    { label: 'Node.js 20', value: 'node20' },
    { label: 'Python 3.12', value: 'python312' },
    { label: 'Go 1.22', value: 'go122' }
  ]
  const runtimeLabel = (value) => runtimes.find((option) => option.value === value)?.label ?? ''

  const regions = [
    { label: 'US East (Washington)', value: 'us-east' },
    { label: 'South America (São Paulo)', value: 'sa-east' },
    { label: 'Europe (Frankfurt)', value: 'eu-west' }
  ]
  const regionLabel = (value) => regions.find((option) => option.value === value)?.label ?? ''

  const services = ref([
    { id: 'svc-1', name: 'checkout-api', runtime: 'node20' },
    { id: 'svc-2', name: 'image-resizer', runtime: 'go122' }
  ])

  const drawerOpen = ref(false)

  const form = reactive({
    name: '',
    description: '',
    runtime: '',
    region: 'us-east',
    active: true,
    logging: false
  })

  const errors = reactive({ name: '', runtime: '' })

  const submitting = ref(false)

  const openCreate = () => {
    drawerOpen.value = true
  }

  watch(drawerOpen, (open) => {
    if (open) return
    form.name = ''
    form.description = ''
    form.runtime = ''
    form.region = 'us-east'
    form.active = true
    form.logging = false
    errors.name = ''
    errors.runtime = ''
  })

  const NAME_PATTERN = /^[a-z0-9-]+$/

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'Name is required.'
    else if (!NAME_PATTERN.test(name))
      errors.name = 'Use lower-case letters, numbers, and hyphen only.'
    else errors.name = ''

    errors.runtime = form.runtime ? '' : 'Runtime is required.'

    return !errors.name && !errors.runtime
  }

  const cancel = () => {
    drawerOpen.value = false
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      services.value = [
        { id: `svc-${Date.now()}`, name: form.name.trim(), runtime: form.runtime },
        ...services.value
      ]
      toast.success(`Service "${form.name.trim()}" created.`)
      drawerOpen.value = false
    } catch (error) {
      toast.error('Could not create the service.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'ItemGroups in a drawer' }]"
  >
    <main class="flex h-full flex-col">
      <PageHeading
        title="Services"
        description="Drawer create whose body is several section-titled ItemGroup sections: the settings layout, in context, with one scoped save."
      >
        <template #actions>
          <HeadingAction
            label="Create Service"
            kind="outlined"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
        <li
          v-for="service in services"
          :key="service.id"
          class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
        >
          <span class="text-label-code-sm text-(--text-default)">{{ service.name }}</span>
          <span class="text-body-xs text-(--text-muted)">{{ runtimeLabel(service.runtime) }}</span>
        </li>
      </ul>
    </main>

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
            aria-label="Create Service"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Create service</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Define a service across grouped sections — all saved together.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create service</legend>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Name</Item.Title>
                            <Item.Description>
                              A unique identifier. Lower-case letters, numbers, and hyphen.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <InputText
                                v-model="form.name"
                                size="large"
                                :disabled="submitting"
                                class="w-full font-code"
                                aria-label="Name"
                                placeholder="my-service"
                                :required="!!errors.name && !form.name.trim()"
                                :invalid="!!errors.name && !!form.name.trim()"
                                :aria-describedby="errors.name ? 'service-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="service-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :label="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Description</Item.Title>
                            <Item.Description>
                              A short note about what this service does.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <InputText
                              v-model="form.description"
                              size="large"
                              :disabled="submitting"
                              class="w-full"
                              aria-label="Description"
                              placeholder="Optional"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Runtime</p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Runtime</Item.Title>
                            <Item.Description>The language the service runs on.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Select
                                v-model="form.runtime"
                                size="large"
                                :disabled="submitting"
                                class="w-full"
                                placeholder="Select a runtime"
                                :required="!!errors.runtime"
                                :display-value="runtimeLabel"
                                @update:model-value="errors.runtime = ''"
                              >
                                <Select.Trigger
                                  id="service-runtime"
                                  aria-label="Runtime"
                                  :aria-describedby="
                                    errors.runtime ? 'service-runtime-error' : undefined
                                  "
                                />
                                <Select.Content class="z-[1002]!">
                                  <Select.Option
                                    v-for="option in runtimes"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Option>
                                </Select.Content>
                              </Select>
                              <HelperText
                                v-if="errors.runtime"
                                id="service-runtime-error"
                                kind="required"
                                :label="errors.runtime"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Region</Item.Title>
                            <Item.Description>Where the service is deployed.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <Select
                              v-model="form.region"
                              size="large"
                              :disabled="submitting"
                              class="w-full"
                              :display-value="regionLabel"
                            >
                              <Select.Trigger
                                id="service-region"
                                aria-label="Region"
                              />
                              <Select.Content class="z-[1002]!">
                                <Select.Option
                                  v-for="option in regions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Options</p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small">
                          <Item.Content>
                            <Item.Title>Active</Item.Title>
                            <Item.Description
                              >Start the service immediately after creation.</Item.Description
                            >
                          </Item.Content>
                          <Item.Actions class="justify-end">
                            <Switch
                              v-model="form.active"
                              aria-label="Active"
                              :disabled="submitting"
                            />
                          </Item.Actions>
                        </Item>

                        <Item size="small">
                          <Item.Content>
                            <Item.Title>Request logging</Item.Title>
                            <Item.Description
                              >Record incoming requests for this service.</Item.Description
                            >
                          </Item.Content>
                          <Item.Actions class="justify-end">
                            <Switch
                              v-model="form.logging"
                              aria-label="Request logging"
                              :disabled="submitting"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>
              </fieldset>
            </PanelContent>

            <PanelFooter class="flex-col md:flex-row md:justify-end">
              <Button
                class="w-full md:w-auto"
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="cancel"
              />
              <Button
                class="w-full md:w-auto"
                label="Create"
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
                Create
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </AppLayout>
</template>
