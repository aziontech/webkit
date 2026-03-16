import FieldGroupCheckbox from '@aziontech/webkit/field-group-checkbox';

export default {
  title: 'Core/Form/FieldGroupCheckbox',
  component: FieldGroupCheckbox,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Group label displayed above the checkboxes'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all checkboxes in the group'
    },
    options: {
      control: 'object',
      description: 'Array of checkbox options'
    }
  }
};

const checkboxOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' }
];

export const Default = {
  args: {
    name: 'field-group-checkbox-default',
    label: 'Select Options',
    options: checkboxOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-group-checkbox-disabled',
    label: 'Disabled Checkbox Group',
    options: checkboxOptions,
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-group-checkbox-desc',
    label: 'Choose Your Preferences',
    description: 'Select all that apply',
    options: checkboxOptions
  }
};
