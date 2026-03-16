import Label from '@aziontech/webkit/label';

export default {
  title: 'Core/Form/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text'
    },
    isRequired: {
      control: 'boolean',
      description: 'Shows required indicator'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the label styling'
    }
  }
};

export const Default = {
  args: {
    label: 'Form Label'
  }
};

export const Required = {
  args: {
    label: 'Required Field',
    required: true
  }
};

export const Disabled = {
  args: {
    label: 'Disabled Label',
    disabled: true
  }
};
