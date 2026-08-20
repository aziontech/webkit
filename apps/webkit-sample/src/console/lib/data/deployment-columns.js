// The column model of the shared deployment table, in its own module because TWO
// surfaces need it: ../../components/deployment/DeploymentsTable.vue renders it, and
// the pages above it (../../pages/deployments/Deployments.vue,
// ../../pages/workloads/WorkloadDetail.vue) hand the same array to the Columns button
// on their controls row, which sits OUTSIDE the table and therefore cannot inject it.
//
// One array, imported by both, so the panel can never offer a column the table does
// not render — the same reason the create routes and their fields come from one list
// (./create-resources.js).
export const DEPLOYMENT_COLUMNS = [
  { accessorKey: 'versionId', header: 'Version', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'status', header: 'Status', enableSorting: true },
  { accessorKey: 'resourceName', header: 'Resource', enableSorting: true, grow: 2 },
  { accessorKey: 'resourceType', header: 'Type', enableSorting: true, grow: 2 },
  { accessorKey: 'environment', header: 'Environment', enableSorting: true, grow: 2 },
  // WHO and WHEN are two columns, as the console lists them: this one names the
  // person who deployed, `date` says when. They used to be one cell whose avatar
  // carried the name on a tooltip — legible only to a pointer, and invisible to a
  // reader scanning the column for a person.
  { accessorKey: 'author', header: 'Last Editor', enableSorting: true, grow: 2 },
  { accessorKey: 'date', header: 'Deployed', enableSorting: true, grow: 2 },
  { id: 'actions', kind: 'action', hideable: false }
]
