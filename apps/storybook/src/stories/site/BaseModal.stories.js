import BaseModal from '@aziontech/webkit/site/base-modal'
import Button from '@aziontech/webkit/site/button'

export default {
  title: 'TODO -  Marketing to Webkit/BaseModal',
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
  components: { BaseModal, Button },
  setup() {
    return { args }
  },
  template: `<BaseModal v-bind="args">
              <template #action>
                <Button label="Click to open modal" type="primary" theme="light" />
              </template>
              <template #header>
                <div class="text-lg font-semibold">Modal Header</div>
              </template>
              <template #content>
                <div class="p-4">Modal content goes here</div>
              </template>
              <template #footer>
                <div class="flex gap-2">
                  <Button label="Cancel" type="secondary" theme="light" />
                  <Button label="Confirm" type="primary" theme="light" />
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
