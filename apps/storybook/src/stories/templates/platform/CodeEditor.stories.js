import { toSfc } from '../../_shared/story-source'
import {
  AUTH_HANDLER,
  components as pageComponents,
  FUNCTION_MAIN,
  IMAGE_OPTIMIZER,
  pageState,
  scriptLines as pageScript
} from './_function-page'
import {
  declare,
  mergeScripts,
  pageScroll,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'

const TEMPLATE = shell({ withBreadcrumb: true, main: pageScroll(FUNCTION_MAIN) })

const components = { ...SHELL_COMPONENTS, ...pageComponents }

const breadcrumbOf = (record) => [
  { label: 'Functions', href: '/functions' },
  { label: record.name }
]

const story = (record, view, description) => ({
  render: () => ({
    components,
    setup: () => ({
      ...shellState('functions'),
      breadcrumb: breadcrumbOf(record),
      ...pageState(record, view)
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: {
        code: toSfc(
          mergeScripts(
            scriptLines({
              parts: ['Breadcrumb'],
              active: 'functions',
              declarations: ['', declare('breadcrumb', breadcrumbOf(record))],
              state: []
            }),
            pageScript(record, view)
          ),
          TEMPLATE
        )
      }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Shell/CodeEditor',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The code editor page as the console draws a function: the platform shell with the Functions breadcrumb, then the Code and Settings tabs, an editor toolbar whose SegmentedButton switches between the Code document and the Arguments document, and under it either one editor filling the pane or the Arguments split, a ResizablePanel with the collapsible schema editor on the left and the form fields on the right. The console embeds Monaco for both editors; this template stands each in with a flush `Textarea` in the same pane. The page content is the FunctionEditor template, placed in the shell.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SinglePane = story(
  IMAGE_OPTIMIZER,
  { tab: 'code', document: 'code', expanded: [] },
  'The Code document: one editor filling everything under the toolbar.'
)

export const SplitPane = story(
  IMAGE_OPTIMIZER,
  { tab: 'code', document: 'arguments', expanded: ['field-1'] },
  'The Arguments document: the schema editor and the fields side by side, the handle resizing the editor and collapsing it past its minimum.'
)

export const EmptySplit = story(
  AUTH_HANDLER,
  { tab: 'code', document: 'arguments', expanded: [] },
  'The Arguments document of a function with no form: the empty schema beside the empty state that adds the first field.'
)
