import FieldPhoneNumber from '@aziontech/webkit/field-phone-number';

export default {
  title: 'Core/Form/FieldPhoneNumber',
  component: FieldPhoneNumber,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of country options with labelFormat and value'
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading indicator for country dropdown'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the input'
    },
    description: {
      control: 'text',
      description: 'Helper text displayed below the input'
    },
    countryCodeName: {
      control: 'text',
      description: 'Field name for country code (vee-validate)'
    },
    mobileName: {
      control: 'text',
      description: 'Field name for mobile number (vee-validate)'
    }
  }
};

const countryOptions = [
  { labelFormat: 'US +1', value: '+1' },
  { labelFormat: 'BR +55', value: '+55' },
  { labelFormat: 'UK +44', value: '+44' },
  { labelFormat: 'DE +49', value: '+49' },
  { labelFormat: 'FR +33', value: '+33' }
];

export const Default = {
  args: {
    label: 'Phone Number',
    options: countryOptions
  }
};

export const Disabled = {
  args: {
    label: 'Disabled Phone Field',
    disabled: true,
    options: countryOptions
  }
};

export const WithDescription = {
  args: {
    label: 'Phone Number',
    description: 'Enter your phone number with country code',
    options: countryOptions
  }
};

export const Loading = {
  args: {
    label: 'Loading Phone Field',
    loading: true,
    options: []
  }
};

export const CustomFieldNames = {
  args: {
    label: 'Phone Number',
    countryCodeName: 'myCountryCode',
    mobileName: 'myMobileNumber',
    description: 'Using custom field names for validation',
    options: countryOptions
  }
};
