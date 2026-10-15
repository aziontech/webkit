import { toSfc } from '../../_shared/story-source'
import {
  components,
  PAGE_TEMPLATE,
  pageScript,
  pageState,
  RAN_HISTORY,
  SELECT_RESULT,
  SELECT_USERS_SQL,
  TABLES_STATE
} from './_sql-page'

const pageStory = (initial, story) => ({
  render: () => ({
    components,
    setup: pageState(initial),
    template: PAGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story },
      source: { code: toSfc(pageScript(initial), PAGE_TEMPLATE) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Detail/SqlDatabase',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The SQL Database detail page under its Tables and Editor tabs, as the console renders it at /sql-database/:id. Each tab pairs a resizable, collapsible `Sidebar` (the tables list, or the query history) with a working pane: the selected table as a hand-built data grid with typed column headers, a Data and Definition switch, and a pager footer; or the SQL editor, its Results band and a `PaginatorRoot`. The SQL Quick Templates drawer opens from the editor toolbar. Built from `TabView`, `Sidebar`, `InputText`, `IconButton`, `Tooltip`, `Dropdown`, `SegmentedButton`, `Checkbox`, `TableRoot`, `Tag`, `CardBox`, `EmptyState`, `Message`, `Textarea`, `PaginatorRoot`, `Button`, `Drawer` and its parts with `PanelHeader` and `PanelContent`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Tables = pageStory(
  TABLES_STATE,
  'The Tables tab with users selected: the tables list in the side panel, the column types and the primary-key glyph in the grid header, a NULL cell, and the record count in the pager footer.'
)

export const Schema = pageStory(
  { ...TABLES_STATE, view: 'definition' },
  'The Definition view of users: the Columns heading with Add column over a card holding the column name, its type as a Tag, and its constraints.'
)

export const EmptyDatabase = pageStory(
  { ...TABLES_STATE, tables: [] },
  'A database with no tables yet: the side panel says so and the working pane shows the Create Table empty state.'
)

export const Query = pageStory(
  {
    ...TABLES_STATE,
    tab: 'editor',
    sql: SELECT_USERS_SQL,
    history: RAN_HISTORY,
    results: SELECT_RESULT
  },
  'The Editor tab after the Select All query ran: the query history in the side panel, the statement in the editor, and its three rows in the Results band, switchable to Json.'
)

export const Templates = pageStory(
  { ...TABLES_STATE, tab: 'editor' },
  'The Editor tab before anything ran, with the Results band ready to execute; the Templates button opens the SQL Quick Templates drawer, and choosing a card loads its SQL into the editor.'
)
