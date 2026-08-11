<script setup>
  // Application → Functions Instances. Edge functions instantiated on this
  // application.
  //
  // An INTERNAL page on the DATA measure — see DeviceGroups.vue for the page shape
  // (one band: the controls row over the table it narrows, carrying the band step).
  //
  // This tab carries the console's NESTED creation pattern. The create drawer is the
  // standard LARGE one (ResourceDrawer), but its Function field is a Select for a
  // RELATED resource — so a "Create Function" affordance in the Select's footer opens
  // a second, MEDIUM Drawer to create that function; on save it is appended to the
  // Select's options and selected back in the parent form. The nested drawer keeps
  // its own Drawer chrome here rather than reusing ResourceDrawer, because it is
  // deliberately `medium` and has to stack ABOVE the large drawer.
  //
  // The "Functions Instance" button itself is on the page's tab row, not in this
  // heading (ApplicationDetail owns that row). The flow stays here: the shell calls
  // the `openCreate` this view exposes.
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
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import FilterBar from '../../components/ui/FilterBar.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import ResourceDrawer from '../../components/ui/ResourceDrawer.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'
  import { sleep } from '../../lib/forms'
  import { useListFilters } from '../../lib/list-state'

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
    { accessorKey: 'edgeFunction', header: 'Function' },
    { accessorKey: 'args', header: 'Arguments', grow: 2 }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.

  const instances = ref([
    { id: 'fi-auth', name: 'auth-guard', edgeFunction: 'auth-handler', args: '{}' },
    {
      id: 'fi-img',
      name: 'img-resize',
      edgeFunction: 'image-optimizer',
      args: '{ "quality": 80 }'
    }
  ])

  // Edge functions available to instantiate. The nested medium drawer appends here.
  const functions = ref([
    { value: 'fn-auth', label: 'auth-handler' },
    { value: 'fn-img', label: 'image-optimizer' }
  ])
  const functionLabel = (value) => functions.value.find((fn) => fn.value === value)?.label ?? ''

  // ── LARGE create drawer — the Functions Instance itself ───────────────────
  const createOpen = ref(false)
  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate: () => (createOpen.value = true) })
  const form = reactive({ name: '', functionId: '' })
  const errors = reactive({ name: '', functionId: '' })
  const submitting = ref(false)

  // Controls the Function Select's dropdown so the quick-add (its footer slot) can
  // close it before the nested drawer opens over the top.
  const functionSelectOpen = ref(false)

  // Sentinel value for the "Create Function" option in the Select footer. The Select
  // is controlled (`:model-value`), so picking it never commits — the nested drawer
  // opens instead and the real selection is left untouched.
  const CREATE_FUNCTION = '__create-function__'
  const onFunctionModel = (value) => {
    if (value === CREATE_FUNCTION) {
      openFunctionCreate()
      return
    }
    form.functionId = value
    errors.functionId = ''
  }

  watch(createOpen, (open) => {
    if (open) return
    form.name = ''
    form.functionId = ''
    errors.name = ''
    errors.functionId = ''
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    return !errors.name && !errors.functionId
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      toast.success(`Functions Instance "${form.name.trim()}" created.`)
      createOpen.value = false
    } catch (error) {
      toast.error('Could not create the functions instance.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }

  // ── MEDIUM nested drawer — Create Function ────────────────────────────────
  const runtimes = [
    { value: 'azion-js', label: 'Azion Runtime (JavaScript)' },
    { value: 'node20', label: 'Node.js 20' }
  ]
  const runtimeLabel = (value) => runtimes.find((r) => r.value === value)?.label ?? ''

  const functionOpen = ref(false)
  const functionForm = reactive({ name: '', runtime: '' })
  const functionErrors = reactive({ name: '', runtime: '' })
  const functionSubmitting = ref(false)

  const openFunctionCreate = () => {
    functionSelectOpen.value = false
    functionOpen.value = true
  }
  const cancelFunction = () => {
    functionOpen.value = false
  }

  watch(functionOpen, (open) => {
    if (open) return
    functionForm.name = ''
    functionForm.runtime = ''
    functionErrors.name = ''
    functionErrors.runtime = ''
  })

  const validateFunction = () => {
    functionErrors.name = functionForm.name.trim() ? '' : 'Name is required.'
    functionErrors.runtime = functionForm.runtime ? '' : 'Runtime is required.'
    return !functionErrors.name && !functionErrors.runtime
  }

  const submitFunction = async () => {
    if (functionSubmitting.value) return
    if (!validateFunction()) return

    functionSubmitting.value = true
    try {
      await sleep(700)
      const value = `fn-${Date.now()}`
      functions.value = [{ value, label: functionForm.name.trim() }, ...functions.value]
      form.functionId = value // select the newly created function back in the parent
      errors.functionId = ''
      toast.success(`Function "${functionForm.name.trim()}" created.`)
      functionOpen.value = false
    } catch (error) {
      toast.error('Could not create the function.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submitFunction() }
      })
    } finally {
      functionSubmitting.value = false
    }
  }
  // ── The filter catalog ────────────────────────────────────────────────────
  // Function is the one enumerable column — which function an instance runs is
  // what people narrow by. Name and Arguments are free text, covered by the search.
  const filterFields = [
    {
      id: 'edgeFunction',
      label: 'Function',
      kind: 'options',
      get options() {
        return [...new Set(instances.value.map((instance) => instance.edgeFunction))]
          .sort((a, b) => a.localeCompare(b))
          .map((fn) => ({ value: fn, label: fn }))
      },
      match: (instance, values) => values.includes(instance.edgeFunction)
    }
  ]

  // No pagination model: this table lists every row, so there is no page offset a
  // narrowed set could strand.
  const {
    filters,
    search,
    visibleRows: visibleInstances
  } = useListFilters(filterFields, instances)

</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Functions Instances"
      description="Edge functions instantiated on this application."
      size="small"
    />

    <!-- The page's parent section. It holds one section here — the controls row
         over the table it narrows, at the GROUP step — and spaces whatever sits
         inside it at --layout-section-gap. -->
    <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
      <section class="flex min-w-0 flex-col gap-[var(--layout-group-gap)]">
        <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
             right, above the card — the same row every list in the console opens with. -->
        <ControlsHeader>
          <!-- Search drives the table's global filter from outside the card, so the field is
               a plain InputText (`Table.Search` is context-aware and only works inside
               `<Table>`). One horizontal band: it grows into the row's slack and compresses
               rather than wrapping (see ui/ControlsHeader.vue). -->
          <InputText
            v-model="search"
            size="large"
            placeholder="Search functions instances..."
            aria-label="Search functions instances"
            class="min-w-36 grow basis-[var(--container-2xs)]"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
          <FilterBar
            v-model="filters"
            :fields="filterFields"
          />

        <CardBox :padded="false">
          <template #content>
            <Table
              v-model:globalFilter="search"
              :data="visibleInstances"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
            >
            </Table>
          </template>
        </CardBox>
      </section>
    </section>

    <ResourceDrawer
      v-model:open="createOpen"
      title="Create Functions Instance"
      :submitting="submitting"
      @submit="submit"
    >
      <section class="flex flex-col gap-[var(--layout-group-gap)]">
        <SectionHeading title="General" />
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
                    Give a unique and descriptive name to identify the resource.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <InputText
                      v-model="form.name"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      aria-label="Name"
                      placeholder="My functions instance"
                      :required="!!errors.name && !form.name.trim()"
                      :invalid="!!errors.name && !!form.name.trim()"
                      :aria-describedby="errors.name ? 'fi-name-error' : undefined"
                      @update:model-value="errors.name = ''"
                    />
                    <HelperText
                      v-if="errors.name"
                      id="fi-name-error"
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

      <!-- The nested-create case: a Select for a RELATED resource, with a
           "Create Function" quick-add in its footer. -->
      <section class="flex flex-col gap-[var(--layout-group-gap)]">
        <SectionHeading title="Function" />
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
                <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Select
                      v-model:open="functionSelectOpen"
                      :model-value="form.functionId"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      placeholder="Select a function"
                      :required="!!errors.functionId"
                      :display-value="functionLabel"
                      @update:model-value="onFunctionModel"
                    >
                      <Select.Trigger
                        id="fi-function"
                        aria-label="Edge Function"
                        :aria-describedby="errors.functionId ? 'fi-function-error' : undefined"
                      />
                      <!-- TEMPORARY WORKAROUND (webkit bug): Select.Content
                           teleports to <body> at z-50, so inside the Drawer panel
                           (z-[1001]) it renders behind and is invisible. Remove
                           once webkit stacks overlay popups above Drawer. -->
                      <Select.Content class="!z-[1002]">
                        <Select.Option
                          v-for="fn in functions"
                          :key="fn.value"
                          :value="fn.value"
                        >
                          {{ fn.label }}
                        </Select.Option>
                        <!-- Quick-add lives in the Select's bottom (footer) slot as
                             a normal option; picking it opens the nested drawer
                             instead of committing a value. -->
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
                      id="fi-function-error"
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
    </ResourceDrawer>

    <!-- MEDIUM nested drawer — Create Function, spawned from the Function Select.
         On save the new function is added to the Select and selected in the parent
         form. It stacks above the large drawer. -->
    <Drawer
      v-model:open="functionOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <!-- Raise the nested drawer above the large drawer's content (z-[1001]):
             its overlay covers the first drawer, and clicking it (or Escape)
             dismisses the nested drawer (closeable is true by default). -->
        <DrawerOverlay class="z-[1002]" />
        <DrawerContent class="z-[1003]">
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create Function"
            novalidate
            @submit.prevent="submitFunction"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
                <DrawerTitle>Create Function</DrawerTitle>
                <p class="text-body-sm text-[var(--text-muted)]">
                  Create a function to instantiate — it becomes available in the selector when
                  saved.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
                :disabled="functionSubmitting"
              >
                <legend class="sr-only">Create function</legend>

                <section class="flex flex-col gap-[var(--layout-group-gap)]">
                  <SectionHeading title="General" />
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
                          <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                              <InputText
                                v-model="functionForm.name"
                                size="large"
                                :disabled="functionSubmitting"
                                class="w-full"
                                aria-label="Name"
                                placeholder="my-function"
                                :required="!!functionErrors.name && !functionForm.name.trim()"
                                :invalid="!!functionErrors.name && !!functionForm.name.trim()"
                                :aria-describedby="
                                  functionErrors.name ? 'fn-name-error' : undefined
                                "
                                @update:model-value="functionErrors.name = ''"
                              />
                              <HelperText
                                v-if="functionErrors.name"
                                id="fn-name-error"
                                :kind="functionForm.name.trim() ? 'invalid' : 'required'"
                                :label="functionErrors.name"
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
                          <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                            <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                              <Select
                                v-model="functionForm.runtime"
                                size="large"
                                :disabled="functionSubmitting"
                                class="w-full"
                                placeholder="Select a runtime"
                                :required="!!functionErrors.runtime"
                                :display-value="runtimeLabel"
                                @update:model-value="functionErrors.runtime = ''"
                              >
                                <Select.Trigger
                                  id="fn-runtime"
                                  aria-label="Runtime"
                                  :aria-describedby="
                                    functionErrors.runtime ? 'fn-runtime-error' : undefined
                                  "
                                />
                                <!-- Above the nested drawer's content (z-[1003]) so
                                     this Select shows on top of the medium drawer. -->
                                <Select.Content class="!z-[1004]">
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
                                v-if="functionErrors.runtime"
                                id="fn-runtime-error"
                                kind="required"
                                :label="functionErrors.runtime"
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
                :disabled="functionSubmitting"
                @click="cancelFunction"
              />
              <Button
                class="w-full md:w-auto"
                label="Save"
                kind="primary"
                size="medium"
                :loading="functionSubmitting"
                @click="submitFunction"
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
  </div>
</template>
