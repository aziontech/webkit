<script setup>
  // Application → Device Groups. Group requests by User-Agent so rules can apply
  // custom behaviors per device class.
  //
  // LAYOUT — the console page shape (see src/styles/layout.css): the page stack has
  // no vertical gap and holds the heading plus the PARENT SECTION, which carries the
  // boundary step and spaces the sections inside it with --layout-section-gap. This
  // tab holds one such section — the controls row over the table it narrows, at the
  // group step, tighter than the step above it. A multi-section tab (Build, Main
  // Settings) is the same shape with more children. Same rhythm on every tab and on
  // the first-level module lists, so moving between them cannot re-space the page
  // under you.
  // The measure is DATA (`.layout-column`, 1620px).
  //
  // Creation follows the console's second-level pattern: a LARGE Drawer of
  // section-titled ItemGroup sections committed by ONE scoped save (ResourceDrawer
  // owns that shell). This tab owns its own create because what a Device Group asks
  // for — a name and a User-Agent regex — is nothing like what the tabs beside it
  // ask for. Validation runs on submit only; `submitting` locks the whole scope.
  //
  // The "Device Group" button itself is on the page's tab row, not in this heading
  // (ApplicationDetail owns that row). The flow stays here: the shell calls the
  // `openCreate` this view exposes.
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Table from '@aziontech/webkit/table'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import ResourceDrawer from '../../components/ui/ResourceDrawer.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'
  import { sleep } from '../../lib/forms'

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
    { accessorKey: 'regex', header: 'User-Agent Match', grow: 2 }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.
  const search = ref('')

  // Seeded so the tab lands on a populated table like every other tab. The create
  // drawer below prepends to this list, so a new group appears without a reload.
  const deviceGroups = ref([
    { id: 'dg-mobile', name: 'Mobile', regex: '(Mobile|iPhone|Android|BlackBerry)' },
    { id: 'dg-desktop', name: 'Desktop', regex: 'Mozilla.*(Windows|Macintosh)' }
  ])

  // ── Create ────────────────────────────────────────────────────────────────
  const createOpen = ref(false)
  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate: () => (createOpen.value = true) })
  const form = reactive({ name: '', regex: '' })
  const errors = reactive({ name: '', regex: '' })
  const submitting = ref(false)

  // Reset on close, so reopening never shows the last attempt's values or errors.
  watch(createOpen, (open) => {
    if (open) return
    form.name = ''
    form.regex = ''
    errors.name = ''
    errors.regex = ''
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.regex = form.regex.trim() ? '' : 'A regular expression is required.'
    return !errors.name && !errors.regex
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      deviceGroups.value = [
        { id: `dg-${Date.now()}`, name: form.name.trim(), regex: form.regex.trim() },
        ...deviceGroups.value
      ]
      toast.success(`Device Group "${form.name.trim()}" created.`)
      createOpen.value = false
    } catch (error) {
      toast.error('Could not create the device group.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Device Groups"
      description="Group requests by User-Agent to apply custom application behaviors."
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
            placeholder="Search device groups..."
            aria-label="Search device groups"
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

        <CardBox :padded="false">
          <template #content>
            <Table
              v-model:globalFilter="search"
              :data="deviceGroups"
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
      title="Create Device Group"
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
                      placeholder="My device group"
                      :required="!!errors.name && !form.name.trim()"
                      :invalid="!!errors.name && !!form.name.trim()"
                      :aria-describedby="errors.name ? 'dg-name-error' : undefined"
                      @update:model-value="errors.name = ''"
                    />
                    <HelperText
                      v-if="errors.name"
                      id="dg-name-error"
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

      <section class="flex flex-col gap-[var(--layout-group-gap)]">
        <SectionHeading title="Match to User-Agent" />
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item
                size="small"
                class="items-start"
              >
                <Item.Content>
                  <Item.Title>Regular Expression</Item.Title>
                  <Item.Description>
                    Add the regular expression you want to match to the content of the User-Agent
                    header.
                  </Item.Description>
                </Item.Content>
                <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                  <div class="flex w-full flex-col gap-[var(--spacing-xs)]">
                    <Textarea
                      v-model="form.regex"
                      :disabled="submitting"
                      class="w-full font-code"
                      aria-label="Regular Expression"
                      placeholder="(Mobile|iP(hone|od)|BlackBerry|IEMobile)"
                      :required="!!errors.regex"
                      :aria-describedby="errors.regex ? 'dg-regex-error' : undefined"
                      @update:model-value="errors.regex = ''"
                    />
                    <HelperText
                      v-if="errors.regex"
                      id="dg-regex-error"
                      kind="required"
                      :label="errors.regex"
                    />
                  </div>
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
      </section>
    </ResourceDrawer>
  </div>
</template>
