import FieldSwitch from '@aziontech/webkit/field-switch';

export default {
  title: 'Core/Form/FieldSwitch',
  component: FieldSwitch,
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
    name: 'field-switch-default',
    label: 'Toggle Switch'
  }
};

export const Disabled = {
  args: {
    name: 'field-switch-disabled',
    label: 'Disabled Switch',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-switch-desc',
    label: 'Enable Feature',
    description: 'Toggle to enable or disable this feature'
  }
};
