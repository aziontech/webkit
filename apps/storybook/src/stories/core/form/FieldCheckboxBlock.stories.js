import FieldCheckboxBlock from '@aziontech/webkit/field-checkbox-block';

export default {
  title: 'Core/Form/FieldCheckboxBlock',
  component: FieldCheckboxBlock,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the checkbox'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the checkbox'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox'
    }
  }
};

export const Default = {
  args: {
    name: 'field-checkbox-default',
    label: 'Accept terms and conditions'
  }
};

export const Disabled = {
  args: {
    name: 'field-checkbox-disabled',
    label: 'Disabled checkbox',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-checkbox-desc',
    label: 'Subscribe to newsletter',
    description: 'Receive monthly updates about our products'
  }
};
