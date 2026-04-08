// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Components---Global-Tokens?node-id=2053-7649
// source=packages/webkit/src/core/list-data-table/components/list-data-table/list-data-table.vue
// component=ListDataTable
const figma = require('figma')
const instance = figma.selectedInstance

const templateType = instance.getEnum('TemplateType', {
  Basic: 'basic',
  Empty: 'empty',
  ResourceExample: 'resource',
})

export default {
  example:
    templateType === 'empty'
      ? figma.code`
<ListDataTable
  :data="[]"
  :emptyBlock="{
    title: 'No items found',
    description: 'Create your first item to get started.',
    createButtonLabel: 'Create Item',
    createPagePath: '/create'
  }"
>
  <ListDataTable.Column field="name" header="Name" sortable />
  <ListDataTable.Column field="status" header="Status" />
</ListDataTable>
`
      : figma.code`
<ListDataTable :data="items" :totalRecords="totalRecords" paginator :rows="10">
  <template #header>
    <ListDataTable.Header>
      <ListDataTable.Search v-model="search" />
      <ListDataTable.Actions>
        <!-- ActionSlot -->
      </ListDataTable.Actions>
    </ListDataTable.Header>
  </template>
  <ListDataTable.Column field="name" header="Name" sortable />
  <ListDataTable.Column field="status" header="Status" />
  <ListDataTable.Column field="lastModified" header="Last Modified" />
</ListDataTable>
`,
  imports: ['import ListDataTable from "@aziontech/webkit/list-data-table"'],
  id: 'list-data-table',
  metadata: { nestable: false },
}
