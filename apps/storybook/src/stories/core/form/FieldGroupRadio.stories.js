import FieldGroupRadio from '@aziontech/webkit/field-group-radio';

export default {
  title: 'Core/Form/FieldGroupRadio',
  component: FieldGroupRadio,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Group label displayed above the radio buttons'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all radio buttons in the group'
    },
    options: {
      control: 'object',
      description: 'Array of radio options'
    }
  }
};

const radioOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' }
];

export const Default = {
  args: {
    name: 'field-group-radio-default',
    label: 'Select One Option',
    options: radioOptions
  }
};

export const Disabled = {
  args: {
    name: 'field-group-radio-disabled',
    label: 'Disabled Radio Group',
    options: radioOptions,
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-group-radio-desc',
    label: 'Choose Your Plan',
    description: 'Select one plan from the options below',
    options: radioOptions
  }
};
