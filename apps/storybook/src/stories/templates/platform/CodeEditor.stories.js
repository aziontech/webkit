import { toSfc } from '../../_shared/story-source'
import {
  AUTH_HANDLER,
  components as pageComponents,
  IMAGE_OPTIMIZER,
  pageState,
  scriptLines as pageScript,
  WORKSPACE_MAIN
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

const TEMPLATE = shell({ withBreadcrumb: true, main: pageScroll(WORKSPACE_MAIN) })

const components = { ...SHELL_COMPONENTS, ...pageComponents }

const breadcrumbOf = (record) => [{ label: 'Services', href: '/services' }, { label: record.name }]

const story = (record, view, description) => ({
  render: () => ({
    components,
    setup: () => ({
      ...shellState('services'),
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
              active: 'services',
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
          'The code editor page placed in the platform shell: the Services breadcrumb, then the Code and Settings tabs, an editor toolbar whose SegmentedButton switches between the Code document and the Arguments document, and under it either one editor filling the pane or the Arguments split, a ResizablePanel with the collapsible schema editor on the left and the form fields on the right. Both editors are a flush `Textarea` filling its pane, the place a product would embed a code editor. On Settings the tab holds the General, Runtime, Execution environment and Status sections, with the unsaved-changes bar.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'code editor',
        'code editor page',
        'function code editor',
        'editor page',
        'code and arguments editor',
        'split editor',
        'monaco editor',
        'editor de código',
        'página do editor',
        'editar código',
        'function editor',
        'edge function',
        'function detail',
        'function arguments',
        'json schema arguments',
        'function settings',
        'editor de função',
        'argumentos da função',
        'detalhe da função'
      ],
      skills: ['webkit-layout', 'webkit-navigation', 'webkit-form']
    }
  }
}

export default meta

export const Code = story(
  IMAGE_OPTIMIZER,
  { tab: 'code', document: 'code', expanded: [] },
  'The Code tab of image-optimizer on the Code document: the service source filling the pane under the JavaScript, running on request hint.'
)

export const Arguments = story(
  IMAGE_OPTIMIZER,
  { tab: 'code', document: 'arguments', expanded: ['field-1'] },
  'The Arguments document of image-optimizer: its form schema in the left pane and its two fields on the right, defaultFormat expanded into its settings and Choices and quality collapsed. The handle resizes the editor and collapses it past its minimum.'
)

export const NoArguments = story(
  AUTH_HANDLER,
  { tab: 'code', document: 'arguments', expanded: [] },
  'The Arguments document of auth-handler, a service with no form: the empty schema on the left and the This form has no fields empty state on the right.'
)

export const Settings = story(
  IMAGE_OPTIMIZER,
  { tab: 'settings', document: 'code', expanded: [] },
  'The Settings tab of image-optimizer: the General, Runtime, Execution environment and Status sections in the form column, the runtime locked; editing anything raises the unsaved-changes bar.'
)
