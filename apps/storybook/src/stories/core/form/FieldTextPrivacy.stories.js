import FieldTextPrivacy from '@aziontech/webkit/field-text-privacy';

export default {
  title: 'Core/Form/FieldTextPrivacy',
  component: FieldTextPrivacy,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name for form submission'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside the input'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the input'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    }
  }
};

export const Default = {
  args: {
    name: 'field-privacy-default',
    label: 'Privacy Field',
    placeholder: 'Enter sensitive data...'
  }
};

export const Disabled = {
  args: {
    name: 'field-privacy-disabled',
    label: 'Disabled Privacy Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-privacy-desc',
    label: 'Sensitive Information',
    placeholder: 'Enter sensitive data...',
    description: 'This field contains private information that will be masked'
  }
};
