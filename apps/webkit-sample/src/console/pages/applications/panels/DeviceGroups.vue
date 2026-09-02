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
  // The measure is DATA (`.layout-column`, 1388px).
  //
  // Creation follows the console's second-level pattern: a Drawer of `Section` bands
  // committed by ONE scoped save (ResourceDrawer owns that shell), with FIELDS
  // SEPARATED — a real `<Label for>` over a full-width control (../../components/ui/
  // FieldStack.vue, the shape ../../components/AddVariableDrawer.vue set) and the band's
  // guidance said once in its `Section` hint. The regex is the field that settles it: a
  // User-Agent pattern is long, and a control capped at 256px on the right of a sentence
  // describing it showed a dozen characters of it at a time.
  //
  // This tab owns its own create because what a Device Group asks for — a name and a
  // User-Agent regex — is nothing like what the tabs beside it ask for. Validation runs
  // on submit only; `submitting` locks the whole scope.
  //
  // The "Add Device Group" button is IN THIS HEADING, not on the page's tab row it used
  // to ride. A tab is its own page, so its create action belongs where every
  // second-level list puts it — beside the heading that names the list.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import AuthorCell from '../../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import IdCell from '../../../components/list/IdCell.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { sleep } from '../../../lib/behavior/forms'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN } from '../../../lib/behavior/table-columns'
  import {
    addDeviceGroup,
    DEVICE_GROUP_NAME_PATTERN,
    DEVICE_GROUP_NAME_RULE,
    updateDeviceGroup,
    useDeviceGroups
  } from '../../../lib/data/device-groups'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  // Where `Documentation` goes. Taken from the registry rather than restated: these tabs are
  // parts of an application, so the module's own doc URL is the right destination
  // and lib/data/product-empty-states.js already holds it.
  const HELP = productFirstUse('applications').learnMore.href

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, enableSorting: true },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'userAgent', header: 'User-agent match', grow: 2 },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.
  const search = ref('')

  // What the controls row's Refresh button does, and the flag the table binds for
  // its skeleton rows — one flag over both causes, a scope switch and a manual
  // refresh (../../../lib/behavior/list-state.js). This panel narrows by search alone,
  // so it takes the refresh half on its own rather than through `useListFilters`.
  const { loading, refresh } = useListRefresh()

  // The table the controls row drives — Download CSV calls its `exportCsv()`
  // (../../../components/list/ExportButton.vue).
  const tableRef = ref(null)

  // Which columns are switched off, driven by the Columns button beside the search
  // (../../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  // The store, not a local ref: a device group is also referenced from the Cache
  // Settings tab (Adaptive Delivery varies the cache key by group), so one created
  // here has to be selectable there in the same session.
  const deviceGroups = useDeviceGroups()

  // ── Create and edit ───────────────────────────────────────────────────────
  // ONE drawer for both, the shape Rules Engine settled (../CreateRuleDrawer.vue):
  // a device group's anatomy is the same whether it is being written or corrected,
  // and a second read-only surface for it would be one more place the two fields
  // have to be kept in step with. `editing` is what tells the drawer which it is.
  //
  // THE ROW IS THE WAY IN. A group's record is its name and its regex — the whole
  // form — so clicking the row opens that form seeded with it, which is the
  // create-surface rule's answer for editing inside a resource (../../lib/surfaces.js).
  const createOpen = ref(false)
  const editing = ref(null)
  const form = reactive({ name: '', userAgent: '' })
  const errors = reactive({ name: '', userAgent: '' })
  const submitting = ref(false)

  const openCreate = () => {
    editing.value = null
    createOpen.value = true
  }

  // Seeded from a COPY of the row, never the record itself: the fields write into
  // `form` as they are typed, and pointing them at the stored object would rewrite the
  // row behind the drawer while the reader is still deciding — including if they leave.
  const openGroup = (event, row) => {
    editing.value = row
    form.name = row.name
    form.userAgent = row.userAgent
    errors.name = ''
    errors.userAgent = ''
    createOpen.value = true
  }

  // Opened from the page's tab row (ApplicationDetail).

  // Reset on close, so reopening never shows the last attempt's values or errors —
  // and never opens the create with the last edit's record still behind it.
  watch(createOpen, (open) => {
    if (open) return
    editing.value = null
    form.name = ''
    form.userAgent = ''
    errors.name = ''
    errors.userAgent = ''
  })

  const validate = () => {
    const name = form.name.trim()
    // The endpoint accepts lowercase alphanumerics ONLY, so the shape is checked here
    // rather than left for a 400 to explain — a rejected name comes back as `invalid`
    // (red: cannot be accepted), an empty one as `required` (amber: not answered yet).
    if (!name) errors.name = 'Name is required.'
    else if (!DEVICE_GROUP_NAME_PATTERN.test(name)) errors.name = DEVICE_GROUP_NAME_RULE
    else errors.name = ''

    errors.userAgent = form.userAgent.trim() ? '' : 'A regular expression is required.'
    return !errors.name && !errors.userAgent
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      const record = { name: form.name.trim(), userAgent: form.userAgent.trim() }
      if (editing.value) {
        updateDeviceGroup(editing.value.id, record)
        toast.success(`Device Group "${record.name}" saved.`)
      } else {
        addDeviceGroup(record)
        toast.success(`Device Group "${record.name}" created.`)
      }
      createOpen.value = false
    } catch (error) {
      toast.error(
        editing.value ? 'Could not save the device group.' : 'Could not create the device group.',
        {
          description: error?.message ?? 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => submit() }
        }
      )
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
      :documentation="HELP"
    >
      <template #actions>
        <HeadingAction
          label="Add Device Group"
          kind="outlined"
          icon="pi pi-plus"
          @click="openCreate"
        />
      </template>
    </PageHeading>

    <!-- The page's parent section. It holds one section here — the controls row
         over the table it narrows, at the GROUP step — and spaces whatever sits
         inside it at --layout-section-gap. -->
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
             right, above the card — the same row every list in the console opens with. -->
        <ControlsHeader>
          <!-- Search drives the table's global filter from outside the card, so the field is
               a plain InputText (`Table.Search` is context-aware and only works inside
               `<Table>`). One horizontal band: it grows into the row's slack and compresses
               rather than wrapping (see ui/ControlsHeader.vue). -->
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search device groups"
            aria-label="Search device groups"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <template #actions>
            <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                 than narrow it — fetch it again, take it away as a file, choose which
                 columns it shows. All glyphs, all `medium`, so the row shares one
                 32px height with the search field opposite. This panel narrows by
                 search alone, so there is no Filter button leading the row. -->
            <RefreshButton
              :loading="loading"
              @refresh="refresh"
            />
            <ExportButton
              :table="tableRef"
              filename="device-groups.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </template>
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <Table
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              :data="deviceGroups"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :loading="loading"
              @row-click="openGroup"
            >
              <!-- The principal column reads as the way in it is — the row opens the
                   group in the same drawer that creates one. -->
              <template #cell-name="{ value }">
                <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
              </template>

              <template #cell-id="{ value }">
                <IdCell
                  :value="value"
                  resource="device group"
                />
              </template>

              <!-- WHO changed the group and WHEN, in one column: the modifier's avatar
                   (name on its tooltip) over the relative time — the same cell every
                   console list ends on (ui/LastModifiedCell.vue), which is why there is
                   no separate author column. The column SORTS on the display string it
                   is given and RENDERS the instant, so the two cannot disagree. -->
              <!-- WHO and WHEN are two columns now, so each cell says one thing. -->
              <template #cell-author="{ row }">
                <AuthorCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                />
              </template>

              <template #cell-lastModified="{ row }">
                <LastModifiedCell :date="row.modifiedAt" />
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </section>

    <ResourceDrawer
      v-model:open="createOpen"
      :title="editing ? 'Edit Device Group' : 'Add Device Group'"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        hint="Names the group in the rules that reference it. A rule matches a device group by name, so renaming one later means revisiting every rule that uses it."
      >
        <FieldStack
          label="Name"
          :description="DEVICE_GROUP_NAME_RULE"
          :message="errors.name"
          :message-kind="form.name.trim() ? 'invalid' : 'required'"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              :disabled="submitting"
              class="w-full font-code"
              placeholder="mobiledevices"
              :required="!!errors.name && !form.name.trim()"
              :invalid="!!errors.name && !!form.name.trim()"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>
      </Section>

      <Section
        stacked
        :divided="false"
        title="Match to User-Agent"
        hint="Every request whose User-Agent header matches this expression belongs to the group. The match is on the header's full value, so anchor the pattern if you need one."
      >
        <FieldStack
          label="Regular expression"
          :message="errors.userAgent"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <Textarea
              :id="controlId"
              v-model="form.userAgent"
              :disabled="submitting"
              class="w-full font-code"
              placeholder="(Mobile|iP(hone|od)|BlackBerry|IEMobile)"
              :required="!!errors.userAgent"
              :aria-describedby="describedBy"
              @update:model-value="errors.userAgent = ''"
            />
          </template>
        </FieldStack>
      </Section>
    </ResourceDrawer>
  </div>
</template>
