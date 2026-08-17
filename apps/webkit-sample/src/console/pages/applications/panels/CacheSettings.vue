<script setup>
  // Application → Cache Settings. How content is cached at the edge and in browsers.
  //
  // An INTERNAL page on the DATA measure — see DeviceGroups.vue for the page shape
  // (one band: the controls row over the table it narrows, carrying the band step).
  //
  // Creation is the console's second-level pattern: a Drawer of `Section` bands
  // committed by ONE scoped save (ResourceDrawer owns that shell), with FIELDS
  // SEPARATED — a real `<Label for>` over a full-width control (../../components/ui/
  // FieldStack.vue, the shape ../../components/AddVariableDrawer.vue set). The band's
  // guidance is said once, in the `Section` hint, rather than under every row. A cache
  // setting is created by name here and tuned afterwards, so the drawer carries the
  // General band only.
  //
  // The "Cache Setting" button itself is on the page's tab row, not in this heading
  // (ApplicationDetail owns that row). The flow stays here: the shell calls the
  // `openCreate` this view exposes.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { sleep } from '../../../lib/behavior/forms'

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
            placeholder="Search cache settings"
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
      title="Create cache setting"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        hint="A cache setting is created by name and tuned afterwards — the TTLs, the cache key and the query-string rules all live on the setting once it exists."
      >
        <FieldStack
          label="Name"
          :message="errors.name"
          :message-kind="form.name.trim() ? 'invalid' : 'required'"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              :disabled="submitting"
              class="w-full"
              placeholder="My cache setting"
              :required="!!errors.name && !form.name.trim()"
              :invalid="!!errors.name && !!form.name.trim()"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>
      </Section>
    </ResourceDrawer>
  </div>
</template>
