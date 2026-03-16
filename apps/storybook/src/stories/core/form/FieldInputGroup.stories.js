import FieldInputGroup from '@aziontech/webkit/field-input-group';

export default {
  title: 'Core/Form/FieldInputGroup',
  component: FieldInputGroup,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input group'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the input'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the input group'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input group'
    }
  }
};

export const Default = {
  args: {
    name: 'field-input-group-default',
    label: 'Input Group',
    placeholder: 'Enter value...'
  }
};

export const Disabled = {
  args: {
    name: 'field-input-group-disabled',
    label: 'Disabled Input Group',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-input-group-desc',
    label: 'Input Group with Description',
    placeholder: 'Enter value...',
    description: 'Add prefix or suffix to your input'
  }
};
