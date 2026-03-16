import FieldRadioBlock from '@aziontech/webkit/field-radio-block';

export default {
  title: 'Core/Form/FieldRadioBlock',
  component: FieldRadioBlock,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the radio button'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the radio button'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the radio button'
    }
  }
};

export const Default = {
  args: {
    name: 'field-radio-block-default',
    label: 'Select this option'
  }
};

export const Disabled = {
  args: {
    name: 'field-radio-block-disabled',
    label: 'Disabled radio option',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-radio-block-desc',
    label: 'Choose this option',
    description: 'This is an additional description for this radio option'
  }
};
