import { toSfc } from '../../_shared/story-source'
import {
  AUTH_HANDLER,
  components,
  IMAGE_OPTIMIZER,
  pageState,
  scriptLines,
  TEMPLATE
} from './_function-page'

const story = (record, view, description) => ({
  render: () => ({
    components,
    setup: () => pageState(record, view),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptLines(record, view), TEMPLATE) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Detail/FunctionEditor',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The function detail page: Code and Settings tabs, and on Code a toolbar whose SegmentedButton switches between the Code document and the Arguments document, with the runtime hint beside it. Arguments carries a field count with Add field and Remove form over a resizable split, the JSON schema on the left and the fields on the right as a card of rows that each expand into their Name, Type, Label, Description, Required, Default and per-type constraint settings, or an EmptyState when the form has none; Settings stacks the General, Runtime, Execution environment and Status sections over the unsaved-changes bar. The console embeds a Monaco editor for the code and the schema; this template stands each in with a flush `Textarea` in the same pane. The Functions detail page renders it. Built from `TabView`, `SegmentedButton`, `ResizablePanel` and its panes and handle, `Textarea`, `CardBox`, `Item`, `Tag`, `IconButton`, `Tooltip`, `InputText`, `Select`, `Switch`, `HelperText`, `EmptyState`, `Link`, `Hint`, `FieldRadioBlock` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Code = story(
  IMAGE_OPTIMIZER,
  { tab: 'code', document: 'code', expanded: [] },
  'The Code tab of image-optimizer on the Code document: the function source filling the pane under the JavaScript, running on request hint.'
)

export const Arguments = story(
  IMAGE_OPTIMIZER,
  { tab: 'code', document: 'arguments', expanded: ['field-1'] },
  'The Arguments document of image-optimizer: its form schema in the left pane and its two fields on the right, defaultFormat expanded into its settings and Choices and quality collapsed.'
)

export const NoArguments = story(
  AUTH_HANDLER,
  { tab: 'code', document: 'arguments', expanded: [] },
  'The Arguments document of auth-handler, a function with no form: the empty schema on the left and the This form has no fields empty state on the right.'
)

export const Settings = story(
  IMAGE_OPTIMIZER,
  { tab: 'settings', document: 'code', expanded: [] },
  'The Settings tab of image-optimizer: the General, Runtime, Execution environment and Status sections in the form column, the runtime locked; editing anything raises the unsaved-changes bar.'
)
