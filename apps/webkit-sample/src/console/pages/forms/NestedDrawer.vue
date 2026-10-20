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
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  let nextId = 0
  const uid = () => (nextId += 1)

  const functions = ref([
    { value: 'fn-auth', label: 'auth-handler' },
    { value: 'fn-img', label: 'image-optimizer' }
  ])
  const functionLabel = (value) => functions.value.find((fn) => fn.value === value)?.label ?? ''

  const runtimes = [
    { value: 'azion-js', label: 'Azion Runtime (JavaScript)' },
    { value: 'node20', label: 'Node.js 20' }
  ]
  const runtimeLabel = (value) => runtimes.find((r) => r.value === value)?.label ?? ''

  const instances = ref([{ id: 'fi-1', name: 'auth-guard', functionId: 'fn-auth' }])

  const parentOpen = ref(false)
  const form = reactive({ name: '', functionId: '' })
  const errors = reactive({ name: '', functionId: '' })
  const submitting = ref(false)

  const CREATE_FUNCTION = '__create-function__'
  const functionSelectOpen = ref(false)

  const onFunctionModel = (value) => {
    if (value === CREATE_FUNCTION) {
      functionSelectOpen.value = false
      childOpen.value = true
      return
    }
    form.functionId = value
    errors.functionId = ''
  }

  const openParent = () => {
    parentOpen.value = true
  }
  const cancelParent = () => {
    parentOpen.value = false
  }

  watch(parentOpen, (open) => {
    if (open) return
    form.name = ''
    form.functionId = ''
    errors.name = ''
    errors.functionId = ''
  })

  const validateParent = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    return !errors.name && !errors.functionId
  }

  const submitParent = async () => {
    if (submitting.value) return
    if (!validateParent()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      instances.value = [
        { id: `fi-${uid()}`, name: form.name.trim(), functionId: form.functionId },
        ...instances.value
      ]
      toast.success(`Functions Instance "${form.name.trim()}" created.`)
      parentOpen.value = false
    } catch (error) {
      toast.error('Could not create the functions instance.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submitParent() }
      })
    } finally {
      submitting.value = false
    }
  }

  const childOpen = ref(false)
  const childForm = reactive({ name: '', runtime: '' })
  const childErrors = reactive({ name: '', runtime: '' })
  const childSubmitting = ref(false)

  const cancelChild = () => {
    childOpen.value = false
  }

  watch(childOpen, (open) => {
    if (open) return
    childForm.name = ''
    childForm.runtime = ''
    childErrors.name = ''
    childErrors.runtime = ''
  })

  const validateChild = () => {
    childErrors.name = childForm.name.trim() ? '' : 'Name is required.'
    childErrors.runtime = childForm.runtime ? '' : 'Runtime is required.'
    return !childErrors.name && !childErrors.runtime
  }

  const submitChild = async () => {
    if (childSubmitting.value) return
    if (!validateChild()) return

    childSubmitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const value = `fn-${uid()}`
      functions.value = [{ value, label: childForm.name.trim() }, ...functions.value]
      form.functionId = value
      errors.functionId = ''
      toast.success(`Function "${childForm.name.trim()}" created.`)
      childOpen.value = false
    } catch (error) {
      toast.error('Could not create the function.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submitChild() }
      })
    } finally {
      childSubmitting.value = false
    }
  }
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Nested drawer' }]"
  >
    <main class="flex h-full flex-col">
      <PageHeading
        title="Functions Instances"
        description="Create a resource whose Select needs a related resource that may not exist yet — the quick-add opens a second drawer, then selects the new resource back into the parent. Each drawer is its own scoped save."
      >
        <template #actions>
          <HeadingAction
            label="Add Functions Instance"
            kind="outlined"
            icon="pi pi-plus"
            @click="openParent"
          />
        </template>
      </PageHeading>

      <ul class="layout-section-start flex flex-col gap-(--spacing-xs)">
        <li
          v-for="instance in instances"
          :key="instance.id"
          class="flex items-center justify-between rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm)"
        >
          <span class="text-label-code-sm text-(--text-default)">{{ instance.name }}</span>
          <span class="text-body-xs text-(--text-muted)">{{
            functionLabel(instance.functionId)
          }}</span>
        </li>
      </ul>
    </main>

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
            aria-label="Add Functions Instance"
            novalidate
            @submit.prevent="submitParent"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Add Functions Instance</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Instantiate an edge function on this application — pick an existing function or
                  create a new one inline.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create functions instance</legend>

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
                              Give a unique and descriptive name to identify the instance.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <InputText
                                v-model="form.name"
                                size="large"
                                :disabled="submitting"
                                class="w-full"
                                aria-label="Name"
                                placeholder="my-instance"
                                :required="!!errors.name && !form.name.trim()"
                                :invalid="!!errors.name && !!form.name.trim()"
                                :aria-describedby="errors.name ? 'instance-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="instance-name-error"
                                :kind="form.name.trim() ? 'invalid' : 'required'"
                                :label="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Function</p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Edge Function</Item.Title>
                            <Item.Description>
                              Pick the function to instantiate, or create a new one.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Select
                                :model-value="form.functionId"
                                v-model:open="functionSelectOpen"
                                size="large"
                                :disabled="submitting"
                                class="w-full"
                                placeholder="Select a function"
                                :required="!!errors.functionId"
                                :display-value="functionLabel"
                                @update:model-value="onFunctionModel"
                              >
                                <Select.Trigger
                                  id="instance-function"
                                  aria-label="Edge Function"
                                  :aria-describedby="
                                    errors.functionId ? 'instance-function-error' : undefined
                                  "
                                />
                                <Select.Content class="z-[1002]!">
                                  <Select.Option
                                    v-for="fn in functions"
                                    :key="fn.value"
                                    :value="fn.value"
                                  >
                                    {{ fn.label }}
                                  </Select.Option>
                                  <template #footer>
                                    <Select.Option
                                      :value="CREATE_FUNCTION"
                                      icon="pi pi-plus-circle"
                                      class="w-full"
                                    >
                                      Create Function
                                    </Select.Option>
                                  </template>
                                </Select.Content>
                              </Select>
                              <HelperText
                                v-if="errors.functionId"
                                id="instance-function-error"
                                kind="required"
                                :label="errors.functionId"
                              />
                            </div>
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
                @click="cancelParent"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submitParent"
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

    <Drawer
      v-model:open="childOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay class="z-[1002]" />
        <DrawerContent class="z-[1003]">
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Function"
            novalidate
            @submit.prevent="submitChild"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Create function</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Create a function to instantiate — it becomes available in the selector when
                  saved.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="childSubmitting"
              >
                <legend class="sr-only">Create function</legend>

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
                            <Item.Description>A unique name for the function.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <InputText
                                v-model="childForm.name"
                                size="large"
                                :disabled="childSubmitting"
                                class="w-full"
                                aria-label="Name"
                                placeholder="my-function"
                                :required="!!childErrors.name && !childForm.name.trim()"
                                :invalid="!!childErrors.name && !!childForm.name.trim()"
                                :aria-describedby="childErrors.name ? 'fn-name-error' : undefined"
                                @update:model-value="childErrors.name = ''"
                              />
                              <HelperText
                                v-if="childErrors.name"
                                id="fn-name-error"
                                :kind="childForm.name.trim() ? 'invalid' : 'required'"
                                :label="childErrors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Runtime</Item.Title>
                            <Item.Description>The language the function runs on.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Select
                                v-model="childForm.runtime"
                                size="large"
                                :disabled="childSubmitting"
                                class="w-full"
                                placeholder="Select a runtime"
                                :required="!!childErrors.runtime"
                                :display-value="runtimeLabel"
                                @update:model-value="childErrors.runtime = ''"
                              >
                                <Select.Trigger
                                  id="fn-runtime"
                                  aria-label="Runtime"
                                  :aria-describedby="
                                    childErrors.runtime ? 'fn-runtime-error' : undefined
                                  "
                                />
                                <Select.Content class="z-[1004]!">
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
                                v-if="childErrors.runtime"
                                id="fn-runtime-error"
                                kind="required"
                                :label="childErrors.runtime"
                              />
                            </div>
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
                :disabled="childSubmitting"
                @click="cancelChild"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="childSubmitting"
                @click="submitChild"
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
  </AppLayout>
</template>
