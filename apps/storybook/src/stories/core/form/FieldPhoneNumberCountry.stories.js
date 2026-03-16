import FieldPhoneNumberCountry from '@aziontech/webkit/field-phone-number-country';

export default {
  title: 'Core/Form/FieldPhoneNumberCountry',
  component: FieldPhoneNumberCountry,
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
    name: 'field-phone-country-default',
    label: 'Phone Number with Country',
    placeholder: 'Enter phone number...'
  }
};

export const Disabled = {
  args: {
    name: 'field-phone-country-disabled',
    label: 'Disabled Phone Field',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-phone-country-desc',
    label: 'Phone Number with Country Code',
    placeholder: 'Enter phone number...',
    description: 'Select country and enter your phone number'
  }
};
