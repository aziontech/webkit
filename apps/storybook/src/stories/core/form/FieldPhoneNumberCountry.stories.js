import FieldPhoneNumberCountry from '@aziontech/webkit/field-phone-number-country';

// Mock service function for Storybook
const mockListCountriesPhoneService = async () => [
  { labelFormat: 'US +1', value: '+1' },
  { labelFormat: 'BR +55', value: '+55' },
  { labelFormat: 'UK +44', value: '+44' },
  { labelFormat: 'DE +49', value: '+49' },
  { labelFormat: 'FR +33', value: '+33' }
];

export default {
  title: 'Core/Form/FieldPhoneNumberCountry',
  component: FieldPhoneNumberCountry,
  tags: ['autodocs'],
  argTypes: {
    listCountriesPhoneService: {
      control: false,
      description: 'Async function that returns list of countries with phone codes (required)'
    }
  }
};

export const Default = {
  args: {
    listCountriesPhoneService: mockListCountriesPhoneService
  }
};
