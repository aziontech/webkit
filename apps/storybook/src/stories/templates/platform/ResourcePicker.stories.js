import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import FieldText from '@aziontech/webkit/field-text'
import HelperText from '@aziontech/webkit/helper-text'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Skeleton from '@aziontech/webkit/skeleton'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLICATION_MODES,
  APPLICATION_OPTIONS,
  applicationBindingCard,
  declare,
  itemComponents,
  PICKER_SCRIPT,
  usePicker,
  WIRE_SUB_WIDTHS,
  WIRE_WIDTHS
} from './_create-markup'

const useBinding = (state) => () => ({
  applicationModes: APPLICATION_MODES,
  wireWidths: WIRE_WIDTHS,
  wireSubWidths: WIRE_SUB_WIDTHS,
  mode: ref(state.mode),
  name: ref(''),
  applicationPicker: usePicker(APPLICATION_OPTIONS, 'application', state)
})

const scriptFor = ({ mode, chosen, loading, message }) => [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import { computed, reactive, ref } from 'vue'",
  '',
  declare('applicationModes', APPLICATION_MODES),
  declare('applications', APPLICATION_OPTIONS),
  ...PICKER_SCRIPT,
  '',
  `const mode = ref('${mode}')`,
  "const name = ref('')",
  `const applicationPicker = usePicker(applications, 'application', ${declare('', { chosen, loading, message }).replace('const  = ', '')})`
]

const components = {
  ...itemComponents(Item),
  Button,
  CardBox,
  FieldText,
  HelperText,
  InputText,
  SegmentedButton,
  Skeleton
}

const TEMPLATE = `<div class="layout-column-form">
${indent(applicationBindingCard(), 1)}
</div>`

const meta = {
  title: 'Templates/Platform/Creation/ResourcePicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The card a create flow uses to bind one resource to another: a lead, a SegmentedButton choosing between an existing resource and a new one, then either a hint over a searchable list of the existing resources with a selected mark, paged five at a time with skeleton rows while the next page loads and a polite status line for screen readers, or a Name FieldText whose helper text carries the allowed characters and turns into the required message once Next is pressed empty. The SegmentedButton disappears and the card opens on New when nothing exists to bind. Create Workload binds its application with it on the Application step (see CreateWorkload); its Domain and deployment step reuses the same paged list to pick an existing deployment, and the firewall binding on application settings reuses the card behind its switch. Built from `CardBox`, `SegmentedButton`, `FieldText`, `InputText`, `HelperText`, `Item`, `Skeleton` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state, description) => ({
  render: () => ({
    components,
    setup: useBinding(state),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

export const Existing = story(
  { mode: 'existing', chosen: 'azion-site', loading: false, message: '' },
  'Existing application, opened from a link that names azion-site: the search over the first five of nineteen applications, azion-site selected with a check mark, and a text button that loads the next five.'
)

export const New = story(
  { mode: 'new', chosen: '', loading: false, message: '' },
  'New application: the list gives way to a Name field with the allowed characters as helper text. It only reads as required once Next is pressed with it empty.'
)

export const Loading = story(
  { mode: 'existing', chosen: 'azion-site', loading: true, message: '' },
  'Loading the next page: five skeleton rows with staggered wire widths follow the visible applications while the load button spins.'
)

export const Required = story(
  {
    mode: 'existing',
    chosen: '',
    loading: false,
    message: 'Select the application this workload serves, or create a new one.'
  },
  'Next pressed with no application selected: the required message sits under the search, above the list.'
)
