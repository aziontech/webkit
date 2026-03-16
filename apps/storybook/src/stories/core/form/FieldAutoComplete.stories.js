import FieldAutoComplete from '@aziontech/webkit/field-auto-complete';

export default {
  title: 'Core/Form/FieldAutoComplete',
  component: FieldAutoComplete,
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
      description: 'Disables the autocomplete'
    }
  }
};

export const Default = {
  args: {
    name: 'field-autocomplete-default',
    label: 'Autocomplete Field',
    placeholder: 'Type to search...'
  }
};

export const Disabled = {
  args: {
    name: 'field-autocomplete-disabled',
    label: 'Disabled Autocomplete',
    placeholder: 'Cannot edit',
    disabled: true
  }
};

export const WithDescription = {
  args: {
    name: 'field-autocomplete-desc',
    label: 'Search',
    placeholder: 'Type to search...',
    description: 'Start typing to see suggestions'
  }
};
