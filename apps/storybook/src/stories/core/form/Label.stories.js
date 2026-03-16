import Label from '@aziontech/webkit/label';

export default {
  title: 'Core/Form/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text to display (required)'
    },
    isRequired: {
      control: 'boolean',
      description: 'Shows required indicator (*) next to the label'
    }
  }
};

export const Default = {
  args: {
    label: 'Field Label'
  }
};

export const Required = {
  args: {
    label: 'Required Field',
    isRequired: true
  }
};

export const Optional = {
  args: {
    label: 'Optional Field',
    isRequired: false
  }
};

export const LongLabel = {
  args: {
    label: 'This is a longer label that describes the field in more detail for the user',
    isRequired: true
  }
};
