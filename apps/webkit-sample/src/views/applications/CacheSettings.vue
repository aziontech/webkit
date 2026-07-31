<script setup>
  // Application → Cache Settings. How content is cached at the edge and in browsers.
  //
  // An INTERNAL page on the DATA measure — see DeviceGroups.vue for the page shape
  // (one band: the controls row over the table it narrows, carrying the band step).
  //
  // Creation is the console's second-level pattern: a LARGE Drawer of section-titled
  // ItemGroup sections committed by ONE scoped save (ResourceDrawer owns that
  // shell). A cache setting is created by name here and tuned afterwards, so the
  // drawer carries the General section only.
  //
  // The "Cache Setting" button itself is on the page's tab row, not in this heading
  // (ApplicationDetail owns that row). The flow stays here: the shell calls the
  // `openCreate` this view exposes.
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'
  import ResourceDrawer from '../../components/ui/ResourceDrawer.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'
  import { sleep } from '../../lib/forms'

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
    { accessorKey: 'browserTtl', header: 'Browser TTL' },
    { accessorKey: 'edgeTtl', header: 'Edge TTL' }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.
  const search = ref('')

  const cacheSettings = ref([
    { id: 'cs-default', name: 'Default Cache', browserTtl: '0s', edgeTtl: '60s' },
    { id: 'cs-static', name: 'Static Assets', browserTtl: '7 days', edgeTtl: '30 days' }
  ])

  // ── Create ────────────────────────────────────────────────────────────────
  const createOpen = ref(false)
  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate: () => (createOpen.value = true) })
  const form = reactive({ name: '' })
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  watch(createOpen, (open) => {
    if (open) return
    form.name = ''
    errors.name = ''
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    return !errors.name
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      toast.success(`Cache Setting "${form.name.trim()}" created.`)
      createOpen.value = false
    } catch (error) {
      toast.error('Could not create the cache setting.', {
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
      title="Cache Settings"
      description="Define how content is cached at the edge and in browsers."
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
            placeholder="Search cache settings..."
            aria-label="Search cache settings"
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
              :data="cacheSettings"
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
      title="Create Cache Setting"
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
                      placeholder="My cache setting"
                      :required="!!errors.name && !form.name.trim()"
                      :invalid="!!errors.name && !!form.name.trim()"
                      :aria-describedby="errors.name ? 'cs-name-error' : undefined"
                      @update:model-value="errors.name = ''"
                    />
                    <HelperText
                      v-if="errors.name"
                      id="cs-name-error"
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
    </ResourceDrawer>
  </div>
</template>
