// The column model of the shared deployment table, in its own module because TWO
// surfaces need it: ../../components/deployment/DeploymentsTable.vue renders it, and
// the pages above it (../../pages/deployments/Deployments.vue,
// ../../pages/workloads/WorkloadDetail.vue) hand the same array to the Columns button
// on their controls row, which sits OUTSIDE the table and therefore cannot inject it.
//
// One array, imported by both, so the panel can never offer a column the table does
// not render — the same reason the create routes and their fields come from one list
// (./create-resources.js).
import { FIT_COLUMN, TAG_COLUMN_WIDE } from '../behavior/table-columns'

export const DEPLOYMENT_COLUMNS = [
  {
    accessorKey: 'versionId',
    header: 'Version',
    enableSorting: true,
    principal: true,
    hideable: false
  },
  // FITTED, not a share. The cell carries the id and its copy button
  // (../../components/list/IdCell.vue), and this is the most crowded list in the
  // console — nine columns. One share left the longest id shape (`dep-1020655-1`)
  // 5px short and ended it in an ellipsis; a share big enough to fit it (`grow: 3`,
  // 208px) took 24px more than the id ever needs, and on this table that comes out of
  // the Version column, which is the row's identity. This was a hand-measured
  // `width: 184` until the table learned to measure a column itself; the number it
  // arrives at is the same one, and it stays right when the ids change shape.
  { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: FIT_COLUMN },
  { accessorKey: 'resourceName', header: 'Resource', enableSorting: true, grow: 2 },
  { accessorKey: 'resourceType', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN_WIDE },
  {
    accessorKey: 'environment',
    header: 'Environment',
    enableSorting: true,
    minWidth: TAG_COLUMN_WIDE
  },
  // WHO and WHEN are two columns, as the console lists them: this one names the
  // person who deployed, `date` says when. They used to be one cell whose avatar
  // carried the name on a tooltip — legible only to a pointer, and invisible to a
  // reader scanning the column for a person.
  { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
  { accessorKey: 'date', header: 'Deployed', enableSorting: true, minWidth: FIT_COLUMN },
  { id: 'actions', kind: 'action', hideable: false }
]
