import { Modal as BaseModal } from '@aziontech/webkit/site/base-modal'

export default {
  title: 'Components/Site/BaseModal',
  component: BaseModal,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      description: 'Defina o estilo de background da modal',
      options: ['outlined', 'default'],
      control: { type: 'radio' }
    },
    showHeader: {
      description: 'Mostrar/Esconder modal header',
      control: 'boolean'
    },
    disableVisibilityToggle: {
      description: 'Disable click to open modal',
      control: 'boolean'
    }
  }
}

const Template = (args) => ({
  components: { BaseModal },
  setup() {
    return { args }
  },
  template: `<BaseModal v-bind="args">
              <template #action>
                <div class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                  Click to open modal
                </div>
              </template>
              <template #header>
                <div class="text-lg font-semibold">Modal Header</div>
              </template>
              <template #content>
                <div class="p-4">Modal content goes here</div>
              </template>
              <template #footer>
                <div class="flex gap-2">
                  <button class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                  <button class="px-4 py-2 bg-blue-500 text-white rounded">Confirm</button>
                </div>
              </template>
            </BaseModal>`
})

export const Default = Template.bind({})
Default.args = {
  backgroundColor: 'default',
  showHeader: true,
  disableVisibilityToggle: false
}

export const Outlined = Template.bind({})
Outlined.args = {
  backgroundColor: 'outlined',
  showHeader: true,
  disableVisibilityToggle: false
}

export const NoHeader = Template.bind({})
NoHeader.args = {
  backgroundColor: 'default',
  showHeader: false,
  disableVisibilityToggle: false
}

export const DisabledToggle = Template.bind({})
DisabledToggle.args = {
  backgroundColor: 'default',
  showHeader: true,
  disableVisibilityToggle: true
}
