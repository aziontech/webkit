import FieldSwitch from '@aziontech/webkit/field-switch';

export default {
  title: 'Core/Form/FieldSwitch',
  component: FieldSwitch,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission (required)'
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the switch'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the switch'
    }
  }
};

export const Default = {
  args: {
    name: 'field-switch-default',
    label: 'Toggle Switch'
  }
};

export const WithDescription = {
  args: {
    name: 'field-switch-desc',
    label: 'Enable Feature',
    description: 'Toggle to enable or disable this feature'
  }
};

export const WithLongLabel = {
  args: {
    name: 'field-switch-long',
    label: 'Enable automatic updates and notifications for this account',
    description: 'When enabled, you will receive email notifications about updates'
  }
};
