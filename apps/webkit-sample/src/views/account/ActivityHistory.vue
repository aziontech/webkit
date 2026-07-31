<script setup>
  // Settings → Activity History. The recent account audit log.
  //
  // LAYOUT — a LIST band on the DATA measure (`.layout-column`). The page stack has
  // no vertical gap: it holds the heading plus ONE band below it — the controls row
  // over the table it narrows — which carries the band step and stacks its two parts
  // at the group step (see src/styles/layout.css). It owns its
  // own scroll region because the shell hands each tab a plain flex column (see
  // AccountSettings.vue).
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  import ControlsHeader from '../../components/ui/ControlsHeader.vue'
  import PageHeading from '../../components/ui/PageHeading.vue'

  // Free-text search, hoisted into the ControlsHeader above the card.
  const search = ref('')

  const activity = ref([
    {
      id: 'a-1',
      action: 'Signed in',
      category: 'Auth',
      user: 'gabriel@cerne.digital',
      ip: '189.6.44.12',
      date: 'July 16, 2026, 09:12 AM'
    },
    {
      id: 'a-2',
      action: 'Updated billing email',
      category: 'Billing',
      user: 'gabriel@cerne.digital',
      ip: '189.6.44.12',
      date: 'July 15, 2026, 04:48 PM'
    },
    {
      id: 'a-3',
      action: 'Created credential “CI / CD Pipeline”',
      category: 'Security',
      user: 'rafael.umman@azion.com',
      ip: '201.17.88.3',
      date: 'July 14, 2026, 11:03 AM'
    },
    {
      id: 'a-4',
      action: 'Invited marina.costa@azion.com',
      category: 'Users',
      user: 'gabriel@cerne.digital',
      ip: '189.6.44.12',
      date: 'July 10, 2026, 02:20 PM'
    },
    {
      id: 'a-5',
      action: 'Deployed vue-3-teste',
      category: 'Deploy',
      user: 'lucas.pereira@azion.com',
      ip: '177.92.10.55',
      date: 'July 08, 2026, 06:41 PM'
    }
  ])

  const activityColumns = [
    { accessorKey: 'action', header: 'Event', principal: true, grow: 2 },
    { accessorKey: 'category', header: 'Category', enableSorting: true },
    { accessorKey: 'user', header: 'User' },
    { accessorKey: 'ip', header: 'IP Address' },
    { accessorKey: 'date', header: 'Date', enableSorting: true }
  ]

  const categorySeverity = (category) =>
    ({
      Auth: 'info',
      Billing: 'accent',
      Security: 'warning',
      Users: 'secondary',
      Deploy: 'success'
    })[category] ?? 'secondary'
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Activity History"
        description="Review recent account activity and audit events."
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
              placeholder="Search activity..."
              aria-label="Search activity"
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
                :data="activity"
                :columns="activityColumns"
                row-key="id"
                enable-sorting
                :border="false"
              >
                <template #cell-category="{ value }">
                  <Tag
                    :label="value"
                    :severity="categorySeverity(value)"
                    size="medium"
                  />
                </template>
              </Table>
            </template>
          </CardBox>
        </section>
      </section>
    </section>
  </div>
</template>
