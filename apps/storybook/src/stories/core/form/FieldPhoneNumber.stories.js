import FieldPhoneNumber from '@aziontech/webkit/field-phone-number';

export default {
  title: 'Core/Form/FieldPhoneNumber',
  component: FieldPhoneNumber,
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
    name: 'field-phone-default',
    label: 'Phone Number',
    placeholder: 'Enter phone number...'
  }
};

export const Disabled = {
  args: {
    name: 'field-phone-disabled',
    label: 'Disabled Phone Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-phone-desc',
    label: 'Phone Number',
    placeholder: 'Enter phone number...',
    description: 'Enter your phone number with country code'
  }
};
