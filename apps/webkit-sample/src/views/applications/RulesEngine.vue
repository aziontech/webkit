<script setup>
  // Application → Rules Engine. Conditional rules applied to requests and responses.
  //
  // An INTERNAL page on the DATA measure — see DeviceGroups.vue for the page shape
  // (one band: the controls row over the table it narrows, carrying the band step).
  //
  // Creation does NOT go through the shared ResourceDrawer: a rule is built from
  // repeaters (criteria conditions joined And/Or, plus behaviors — each add / remove /
  // reorder) and phase radios, which is a whole form of its own. That lives in
  // CreateRuleDrawer.vue; this tab just owns when it opens and what it does with the
  // result.
  //
  // The "Rule" button itself is on the page's tab row, not in this heading
  // (ApplicationDetail owns that row). The flow stays here: the shell calls the
  // `openCreate` this view exposes.
  import InputText from '@aziontech/webkit/input-text'
  import CardBox from '@aziontech/webkit/card-box'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  import CreateRuleDrawer from '../../components/CreateRuleDrawer.vue'
  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
    { accessorKey: 'phase', header: 'Phase' },
    { accessorKey: 'criteria', header: 'Criteria', grow: 2 },
    { accessorKey: 'status', header: 'Status' }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.
  const search = ref('')

  const rules = ref([
    {
      id: 're-www',
      name: 'Redirect www',
      phase: 'Request',
      criteria: 'host = www.*',
      status: 'Active'
    },
    {
      id: 're-api',
      name: 'Cache bypass',
      phase: 'Response',
      criteria: 'path ~ /api',
      status: 'Active'
    }
  ])

  const createOpen = ref(false)

  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate: () => (createOpen.value = true) })
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Rules Engine"
      description="Conditional rules applied to requests and responses."
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
            placeholder="Search rules engine..."
            aria-label="Search rules"
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
              :data="rules"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
            >
              <!-- Status is a chip, Active/Inactive, the same pair every console list
                   reads (Applications.vue) — never bare text in a cell. -->
              <template #cell-status="{ value }">
                <Tag
                  :label="value"
                  :severity="value === 'Active' ? 'success' : 'secondary'"
                  size="medium"
                />
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </section>

    <!-- Rules Engine create — its own rich, repeater-driven large drawer. -->
    <CreateRuleDrawer v-model:open="createOpen" />
  </div>
</template>
