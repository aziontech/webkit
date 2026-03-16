import FieldSwitchBlock from '@aziontech/webkit/field-switch-block';

export default {
  title: 'Core/Form/FieldSwitchBlock',
  component: FieldSwitchBlock,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the switch'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the switch'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the switch'
    }
  }
};

export const Default = {
  args: {
    name: 'field-switch-block-default',
    label: 'Toggle Switch Block'
  }
};

export const Disabled = {
  args: {
    name: 'field-switch-block-disabled',
    label: 'Disabled Switch Block',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-switch-block-desc',
    label: 'Enable Feature',
    description: 'Toggle to enable or disable this feature'
  }
};
