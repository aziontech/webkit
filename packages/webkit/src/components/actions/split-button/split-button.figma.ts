import { figma } from '@figma/code-connect'

import SplitButton from './split-button.vue'

figma.connect(
  SplitButton,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-957&m=dev',
  {
    props: {
      label: figma.string('Label')
    },
    example: (props) => /* html */ `
      <SplitButton
        label="${props.label}"
        icon="pi pi-check"
        :model="[
          { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
          { label: 'Delete', value: 'delete', icon: 'pi pi-trash' }
        ]"
        @click="onSave"
        @item-click="onAction"
      />
    `
  }
)
