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
  SELECT_RESULT,
  SELECT_USERS_SQL,
  SQL_MAIN,
  TABLES_STATE
} from './_sql-page'

const BREADCRUMB = [{ label: 'SQL Database', href: '/sql-database' }, { label: 'store-sessions' }]

const TEMPLATE = shell({ withBreadcrumb: true, main: pageScroll(SQL_MAIN) })

const components = { ...SHELL_COMPONENTS, ...pageComponents }

const SHELL_SCRIPT = scriptLines({
  parts: ['Breadcrumb'],
  active: 'sql-database',
  declarations: ['', declare('breadcrumb', BREADCRUMB)],
  state: []
})

const story = (initial, description) => ({
  render: () => ({
    components,
    setup: () => ({
      ...shellState('sql-database'),
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
          'The query editor page as the console draws a SQL database: the platform shell with the SQL Database breadcrumb, then the Tables and Editor tabs, each pairing a resizable, collapsible `Sidebar` (288px at rest) with a working pane. On Editor the panel holds the query history and the pane stacks the Run Query, Prettify and Templates toolbar, the editor, and the Results band over its paginator; on Tables the panel lists the tables and the pane holds the selected table with its Data and Definition switch. The page content is the SqlDatabase template, placed in the shell.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Editor = story(
  {
    ...TABLES_STATE,
    tab: 'editor',
    sql: SELECT_USERS_SQL,
    history: RAN_HISTORY,
    results: SELECT_RESULT
  },
  'The Editor tab after a query ran: history in the side panel, the statement in the editor and its rows in the Results band.'
)

export const Browser = story(
  TABLES_STATE,
  'The Tables tab: the tables in the side panel, and the selected table as a data grid with its Data and Definition switch.'
)
