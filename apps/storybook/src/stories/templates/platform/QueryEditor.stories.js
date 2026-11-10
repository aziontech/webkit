import { toSfc } from '../../_shared/story-source'
import {
  declare,
  mergeScripts,
  pageScroll,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'
import {
  components as pageComponents,
  pageScript,
  pageState,
  RAN_HISTORY,
  SELECT_CUSTOMERS_SQL,
  SELECT_RESULT,
  SQL_MAIN,
  TABLES_STATE
} from './_sql-page'

const BREADCRUMB = [{ label: 'Databases', href: '/databases' }, { label: 'acme-store' }]

const TEMPLATE = shell({ withBreadcrumb: true, main: pageScroll(SQL_MAIN) })

const components = { ...SHELL_COMPONENTS, ...pageComponents }

const SHELL_SCRIPT = scriptLines({
  parts: ['Breadcrumb'],
  active: 'databases',
  declarations: ['', declare('breadcrumb', BREADCRUMB)],
  state: []
})

const story = (initial, description) => ({
  render: () => ({
    components,
    setup: () => ({
      ...shellState('databases'),
      breadcrumb: BREADCRUMB,
      ...pageState(initial)()
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(mergeScripts(SHELL_SCRIPT, pageScript(initial)), TEMPLATE) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Shell/QueryEditor',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The query editor page placed in the platform shell: the Databases breadcrumb, then the Tables and Editor tabs, each pairing a resizable, collapsible `Sidebar` (288px at rest) with a working pane. On Editor the panel holds the query history and the pane stacks the Run Query, Prettify and Templates toolbar, the editor, and the Results band over its paginator; on Tables the panel lists the tables and the pane holds the selected table with its Data and Definition switch. A database with no tables shows the Create Table empty state, and the Templates button opens the SQL Quick Templates drawer.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Tables = story(
  TABLES_STATE,
  'The Tables tab with customers selected: the tables list in the side panel, the column types and the primary-key glyph in the grid header, a NULL cell, and the record count in the pager footer.'
)

export const Schema = story(
  { ...TABLES_STATE, view: 'definition' },
  'The Definition view of customers: the Columns heading with Add column over a card holding the column name, its type as a Tag, and its constraints.'
)

export const EmptyDatabase = story(
  { ...TABLES_STATE, tables: [] },
  'A database with no tables yet: the side panel says so and the working pane shows the Create Table empty state.'
)

export const Query = story(
  {
    ...TABLES_STATE,
    tab: 'editor',
    sql: SELECT_CUSTOMERS_SQL,
    history: RAN_HISTORY,
    results: SELECT_RESULT
  },
  'The Editor tab after the Select All query ran: the query history in the side panel, the statement in the editor, and its three rows in the Results band, switchable to Json.'
)

export const Templates = story(
  { ...TABLES_STATE, tab: 'editor' },
  'The Editor tab before anything ran, with the Results band ready to execute; the Templates button opens the SQL Quick Templates drawer, and choosing a card loads its SQL into the editor.'
)
